import { randomBytes } from "node:crypto";
import type { Context } from "hono";
import { insertAdminApiKey, listAdminApiKeys, revokeAdminApiKey } from "@/db/adminApiKeysRepo";
import { hashAdminKey } from "@/lib/auth";
import { valid } from "@/lib/validatedRequest";

export const ADMIN_API_KEY_PREFIX = "sdui_";

function generateAdminApiKey(): { key: string; keyHash: string; keyPrefix: string } {
  const secret = randomBytes(24).toString("base64url");
  const key = `${ADMIN_API_KEY_PREFIX}${secret}`;
  return {
    key,
    keyHash: hashAdminKey(key),
    keyPrefix: `${ADMIN_API_KEY_PREFIX}${secret.slice(0, 8)}`,
  };
}

export async function listApiKeys(c: Context) {
  return c.json({ keys: await listAdminApiKeys() }, 200);
}

/** Create a key. The raw token is returned exactly once and never persisted. */
export async function createApiKey(c: Context) {
  const body = valid<{ name: string }>(c, "json");
  const name = body.name?.trim() ?? "";
  if (!name) {
    return c.json({ success: false, message: "Name is required" }, 400);
  }
  const { key, keyHash, keyPrefix } = generateAdminApiKey();
  const info = await insertAdminApiKey({ name, keyHash, keyPrefix });
  return c.json({ ...info, key, message: "Store this key now; it will not be shown again" }, 201);
}

export async function revokeApiKey(c: Context) {
  const { id } = valid<{ id: string }>(c, "param");
  const revoked = await revokeAdminApiKey(id);
  if (!revoked) {
    return c.json({ success: false, message: "Key not found" }, 404);
  }
  return c.json({ success: true, message: "Key revoked" }, 200);
}
