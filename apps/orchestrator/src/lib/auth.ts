import { createHash, timingSafeEqual } from "node:crypto";
import type { Context, Next } from "hono";
import { findActiveAdminKeyByHash, touchAdminApiKey } from "@/db/adminApiKeysRepo";

export const ADMIN_AUTH_HEADER = "Authorization";

/** Env master key accepted as a valid credential (bootstrap/serverless deployments). */
export function masterAdminApiKey(): string | undefined {
  return process.env.SDUI_ADMIN_API_KEY?.trim() || undefined;
}

/** Dev-only escape hatch. Never enable in production. */
export function isAdminAuthDisabled(): boolean {
  return process.env.SDUI_ADMIN_AUTH_DISABLED === "true";
}

/** SHA-256 of a raw token. Only the hash is persisted/compared. */
export function hashAdminKey(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function extractBearerToken(headerValue: string | null | undefined): string | null {
  if (!headerValue) return null;
  const match = /^Bearer\s+(.+)$/i.exec(headerValue.trim());
  return match?.[1]?.trim() || null;
}

export function unauthorizedResponse(c: Context) {
  return c.json({ success: false, message: "Unauthorized" }, 401, {
    "WWW-Authenticate": "Bearer",
  });
}

/**
 * Protects admin endpoints. Accepts an active key from the `admin_api_keys` table,
 * the `SDUI_ADMIN_API_KEY` env master key, or (dev only) nothing when
 * `SDUI_ADMIN_AUTH_DISABLED=true`.
 */
export async function requireAdminAuth(c: Context, next: Next): Promise<Response | undefined> {
  if (isAdminAuthDisabled()) {
    await next();
    return;
  }

  const token = extractBearerToken(c.req.header(ADMIN_AUTH_HEADER));
  if (!token) {
    return unauthorizedResponse(c);
  }

  const master = masterAdminApiKey();
  if (master && safeEqual(token, master)) {
    await next();
    return;
  }

  const key = await findActiveAdminKeyByHash(hashAdminKey(token));
  if (!key) {
    return unauthorizedResponse(c);
  }

  void touchAdminApiKey(key.id).catch(() => {});

  await next();
}
