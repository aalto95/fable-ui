import { randomUUID } from "node:crypto";
import { getSql } from "@/db/postgres";

export type AdminApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export type AdminApiKeySecret = AdminApiKey & {
  key: string;
};

type Row = {
  id: string;
  name: string;
  key_prefix: string;
  created_at: Date;
  last_used_at: Date | null;
  revoked_at: Date | null;
};

/** Active key with the given SHA-256 hash, or `null` when missing/revoked. */
export async function findActiveAdminKeyByHash(
  keyHash: string,
): Promise<{ id: string; name: string; keyPrefix: string } | null> {
  const sql = getSql();
  const rows = await sql<{ id: string; name: string; key_prefix: string }[]>`
    select id, name, key_prefix
    from admin_api_keys
    where key_hash = ${keyHash} and revoked_at is null
    limit 1
  `;
  const row = rows[0];
  return row ? { id: row.id, name: row.name, keyPrefix: row.key_prefix } : null;
}

/** Record that the key was used (best-effort; failures are ignored). */
export async function touchAdminApiKey(id: string): Promise<void> {
  const sql = getSql();
  await sql`
    update admin_api_keys set last_used_at = now() where id = ${id}::uuid
  `;
}

/** Metadata for all keys (never the raw token — it is not stored). */
export async function listAdminApiKeys(): Promise<AdminApiKey[]> {
  const sql = getSql();
  const rows = await sql<Row[]>`
    select id, name, key_prefix, created_at, last_used_at, revoked_at
    from admin_api_keys
    order by created_at desc
  `;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    keyPrefix: r.key_prefix,
    createdAt: r.created_at.toISOString(),
    lastUsedAt: r.last_used_at ? r.last_used_at.toISOString() : null,
    revokedAt: r.revoked_at ? r.revoked_at.toISOString() : null,
  }));
}

/** Insert a key. Only the hash and a short display prefix are persisted. */
export async function insertAdminApiKey(options: {
  name: string;
  keyHash: string;
  keyPrefix: string;
}): Promise<AdminApiKey> {
  const sql = getSql();
  const id = randomUUID();
  const rows = await sql<Row[]>`
    insert into admin_api_keys (id, name, key_hash, key_prefix)
    values (${id}::uuid, ${options.name}, ${options.keyHash}, ${options.keyPrefix})
    returning id, name, key_prefix, created_at, last_used_at, revoked_at
  `;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    keyPrefix: r.key_prefix,
    createdAt: r.created_at.toISOString(),
    lastUsedAt: null,
    revokedAt: null,
  };
}

export async function revokeAdminApiKey(id: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    update admin_api_keys set revoked_at = now() where id = ${id}::uuid
    returning id
  `;
  return rows.length > 0;
}
