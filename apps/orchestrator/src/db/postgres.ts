import postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;

let _sql: Sql | null = null;

/** True when `DATABASE_URL` is non-empty (Postgres is intended to be used). */
export function isPostgresConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * Shared connection pool (postgres.js). Throws if `DATABASE_URL` is unset — call
 * `isPostgresConfigured()` first or only use when you know migrations / feature flags require DB.
 */
export function getSql(): Sql {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!_sql) {
    _sql = postgres(url, {
      max: Number(process.env.PG_POOL_MAX ?? 10),
      idle_timeout: Number(process.env.PG_IDLE_TIMEOUT_SEC ?? 20),
      connect_timeout: Number(process.env.PG_CONNECT_TIMEOUT_SEC ?? 10),
    });
  }
  return _sql;
}

/** Verify connectivity when `DATABASE_URL` is set. No-op otherwise. */
export async function pingPostgres(): Promise<void> {
  if (!isPostgresConfigured()) return;
  await getSql()`select 1`;
}

/** Close the pool (graceful shutdown). Safe to call multiple times. */
export async function closePostgres(): Promise<void> {
  if (!_sql) return;
  const s = _sql;
  _sql = null;
  await s.end({ timeout: 5 });
}
