import { createHash } from "node:crypto";
import { getSchemaOverride } from "@/lib/uiSchemaStore";

/** Strong ETag (quoted opaque token) from exact UTF-8 body bytes. */
export function strongEtagFromBody(body: string): string {
  const h = createHash("sha256").update(body, "utf8").digest("base64url");
  return `"${h}"`;
}

/** @deprecated Use {@link strongEtagFromBody} */
export const schemaDocumentEtag = strongEtagFromBody;

/**
 * Same bytes the client would receive from `GET /ui/schema` (override row or fable-ui default).
 */
export async function loadUiSchemaJsonText(bundledSchemaPath: string): Promise<string> {
  const override = await getSchemaOverride();
  if (override !== null) {
    return JSON.stringify(override);
  }
  return await Bun.file(bundledSchemaPath).text();
}

/**
 * True when the client already has this representation (RFC 7232 `If-None-Match`).
 */
export function ifNoneMatchSatisfied(ifNoneMatch: string | null, etag: string): boolean {
  if (ifNoneMatch == null || ifNoneMatch.trim() === "") return false;
  const raw = ifNoneMatch.trim();
  if (raw === "*") return true;
  for (const part of raw.split(",")) {
    let token = part.trim();
    if (token.startsWith("W/")) {
      token = token.slice(2).trim();
    }
    if (token === etag) return true;
  }
  return false;
}
