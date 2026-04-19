import type { Context } from "hono";

/** Typed access after `@hono/zod-openapi` registers `zValidator` (OpenAPI routes only). */
export function valid<T>(
  c: Context,
  target: "query" | "param" | "json" | "header" | "cookie" | "form",
): T {
  return (c.req as { valid: (t: typeof target) => T }).valid(target);
}
