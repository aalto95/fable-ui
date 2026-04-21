import "./env";
import { Hono } from "hono";
import { createApp } from "@/app";
import { ensureOrchestratorReadyOnce } from "@/bootstrap";

const api = createApp();
const app = new Hono();

app.use("*", async (c, next) => {
  try {
    await ensureOrchestratorReadyOnce();
  } catch (e) {
    console.error("Postgres: startup failed", e);
    return c.json({ success: false, message: "Database unavailable" }, 503);
  }
  await next();
});

app.route("/", api);

export default app;
