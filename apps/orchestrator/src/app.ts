import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { ZodError } from "zod";
import { isOriginAllowed } from "@/config/cors";
import { HealthResponse } from "@/openapi/schemas";
import { uiRoutes } from "@/routes/ui";

const swaggerDocsHandler = swaggerUI({
  url: "/openapi.json",
  title: "SDUI Orchestrator API",
  deepLinking: true,
});

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["Health"],
  summary: "Health check",
  operationId: "getHealth",
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: HealthResponse } },
    },
  },
});

export function createApp() {
  const app = new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        const err = result.error as ZodError;
        return c.json(
          {
            success: false,
            message: err.issues.map((i) => i.message).join("; ") || "Validation error",
          },
          400,
        );
      }
    },
  });

  app.use("*", logger());
  app.use("*", async (c, next) => {
    const origin = c.req.header("Origin");
    if (origin && !(await isOriginAllowed(origin))) {
      return c.json({ success: false, message: "CORS error: Origin not allowed" }, 403);
    }
    await next();
  });
  app.use(
    "*",
    cors({
      origin: (origin: string) => origin,
      credentials: true,
      allowMethods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.onError((err, c) => {
    console.error("Error:", err);
    if (err instanceof Error && err.name === "ValidationError") {
      return c.json({ success: false, message: err.message }, 400);
    }
    if (err instanceof Error) {
      return c.json({ success: false, message: err.message || "Internal server error" }, 500);
    }
    return c.json({ success: false, message: "Internal server error" }, 500);
  });

  app.openapi(healthRoute, (c) =>
    c.json(
      {
        ok: true,
        service: "sdui-orchestrator",
        postgres: "connected",
      },
      200,
    ),
  );

  // Vercel and browsers often hit `/` first; without this the root returns 404.
  app.get("/", (c) => c.redirect("/docs"));

  app.route("/ui", uiRoutes);

  app.get("/docs", async (c) => {
    const out = await swaggerDocsHandler(c, async () => {});
    if (!(out instanceof Response)) {
      return c.text("Internal Server Error", 500);
    }
    const headers = new Headers(out.headers);
    headers.set("Cache-Control", "no-store");
    return new Response(out.body, { status: out.status, headers });
  });

  app.doc("/openapi.json", {
    openapi: "3.0.3",
    info: {
      title: "SDUI Orchestrator API",
      version: "1.0.0",
      description:
        "Server-driven UI bundle, JSON Schema, and health check. " +
        "Admin endpoints (`PUT|DELETE /ui/{id}`, `/ui` mutations) mutate stored UI/schema state.",
    },
    servers: [{ url: "/", description: "Current host" }],
    tags: [
      { name: "Health", description: "Liveness" },
      { name: "SDUI", description: "UI document and JSON Schema" },
      { name: "Admin", description: "UI/schema overrides" },
    ],
  });

  app.notFound((c) => c.json({ success: false, message: "Not found" }, 404));

  return app;
}
