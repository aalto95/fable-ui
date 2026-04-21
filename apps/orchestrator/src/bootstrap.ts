import { runMigrations } from "@/db/migrate";
import { isPostgresConfigured, pingPostgres } from "@/db/postgres";

let readyPromise: Promise<void> | null = null;

/** Connect and apply migrations (Node server startup). */
export async function ensureOrchestratorReady(): Promise<void> {
  if (!isPostgresConfigured()) {
    throw new Error("DATABASE_URL is required (PostgreSQL).");
  }
  await pingPostgres();
  await runMigrations();
}

/**
 * Single-flight readiness for serverless (Vercel): run migrations once per warm instance.
 */
export function ensureOrchestratorReadyOnce(): Promise<void> {
  if (!readyPromise) {
    readyPromise = ensureOrchestratorReady().catch((e) => {
      readyPromise = null;
      throw e;
    });
  }
  return readyPromise;
}
