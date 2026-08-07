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

export const AdminApiKeyInfo = z
  .object({
    id: z.uuid(),
    name: z.string(),
    keyPrefix: z.string(),
    createdAt: z.string(),
    lastUsedAt: z.string().nullable(),
    revokedAt: z.string().nullable(),
  })
  .openapi("AdminApiKeyInfo");

export const AdminApiKeyCreateRequest = z
  .object({
    name: z.string().min(1).max(100),
  })
  .openapi("AdminApiKeyCreateRequest");

export const AdminApiKeyCreatedResponse = AdminApiKeyInfo.extend({
  key: z.string(),
}).openapi("AdminApiKeyCreatedResponse");

export const AdminApiKeysResponse = z
  .object({
    keys: z.array(AdminApiKeyInfo),
  })
  .openapi("AdminApiKeysResponse");

export const AdminApiKeyParams = z.object({
  id: z.uuid().openapi({ param: { name: "id", in: "path" } }),
});
