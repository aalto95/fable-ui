import "./env";
import { serve } from "@hono/node-server";
import { createApp } from "@/app";
import { ensureOrchestratorReady } from "@/bootstrap";
import { closePostgres, isPostgresConfigured } from "@/db/postgres";
import { startBduiMockPing } from "@/lib/bduiMockPing";

const PORT = Number(process.env.PORT) || 3000;

async function main() {
  if (!isPostgresConfigured()) {
    console.error("DATABASE_URL is required (PostgreSQL).");
    process.exit(1);
  }

  try {
    await ensureOrchestratorReady();
    console.log("Postgres: connection ok");
    console.log("Postgres: migrations applied");
  } catch (e) {
    console.error("Postgres: startup failed", e);
    process.exit(1);
  }

  const app = createApp();

  const server = serve(
    {
      fetch: app.fetch,
      port: PORT,
    },
    (info) => {
      console.log(`Server running on http://localhost:${info.port} (SDUI; docs at /docs)`);
    },
  );

  startBduiMockPing();

  const shutdown = async () => {
    await closePostgres();
    server.close((err) => {
      if (err) console.error(err);
      process.exit(err ? 1 : 0);
    });
  };
  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
