import postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;

let _sql: Sql | null = null;

/**
 * Resolves a Postgres connection string from env (Supabase-friendly).
 * Order: `DATABASE_URL` → non-pooling URL → pool URLs from Supabase CLI / dashboard exports.
 */
export function resolveDatabaseUrl(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
  ];
  for (const c of candidates) {
    const t = c?.trim();
    if (t) return t;
  }
  return undefined;
}

function isTransactionPoolerUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.port === "6543" ||
      u.searchParams.get("pgbouncer") === "true" ||
      u.hostname.includes("pooler.supabase.com")
    );
  } catch {
    return false;
  }
}

/** True when a Postgres URL can be resolved (direct SQL / migrations). */
export function isPostgresConfigured(): boolean {
  return Boolean(resolveDatabaseUrl());
}

/**
 * Shared connection pool (postgres.js). Throws if no connection URL — call
 * `isPostgresConfigured()` first or only use when you know migrations / feature flags require DB.
 */
export function getSql(): Sql {
  const url = resolveDatabaseUrl();
  if (!url) {
    throw new Error(
      "No Postgres URL: set DATABASE_URL or POSTGRES_URL / POSTGRES_URL_NON_POOLING (Supabase)",
    );
  }
  if (!_sql) {
    _sql = postgres(url, {
      max: Number(process.env.PG_POOL_MAX ?? 10),
      idle_timeout: Number(process.env.PG_IDLE_TIMEOUT_SEC ?? 20),
      connect_timeout: Number(process.env.PG_CONNECT_TIMEOUT_SEC ?? 10),
      // Supabase transaction pooler (PgBouncer) does not support prepared statements the same way.
      ...(isTransactionPoolerUrl(url) ? { prepare: false as const } : {}),
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
