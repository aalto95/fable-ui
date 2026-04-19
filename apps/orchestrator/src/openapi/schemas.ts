import { z } from "@hono/zod-openapi";

/** Arbitrary JSON object (OpenAPI `additionalProperties`). */
export const JsonObject = z.record(z.string(), z.unknown()).openapi({
  description: "JSON object",
});

export const HealthResponse = z
  .object({
    ok: z.boolean(),
    service: z.string(),
    postgres: z.string(),
  })
  .openapi("HealthResponse");

export const ErrorResponse = z
  .object({
    success: z.boolean().optional(),
    message: z.string().optional(),
    errors: z.array(z.unknown()).optional(),
  })
  .openapi("ErrorResponse");

export const UiOverrideSuccess = z
  .object({
    success: z.boolean(),
    message: z.string(),
  })
  .openapi("UiOverrideSuccess");

export const SchemaOverrideSuccess = z
  .object({
    success: z.boolean(),
    message: z.string(),
  })
  .openapi("SchemaOverrideSuccess");

export const UiSpecsResponse = z
  .object({
    specs: z.array(
      z.object({
        id: z.uuid(),
      }),
    ),
  })
  .openapi("UiSpecsResponse");

export const UiOriginBinding = z
  .object({
    origin: z.string().url(),
    specId: z.uuid().nullable(),
  })
  .openapi("UiOriginBinding");

export const UiOriginsResponse = z
  .object({
    origins: z.array(UiOriginBinding),
  })
  .openapi("UiOriginsResponse");

export const UiOriginUpsertRequest = z
  .object({
    origin: z.string().url(),
    specId: z.uuid().nullable().optional(),
  })
  .openapi("UiOriginUpsertRequest");
