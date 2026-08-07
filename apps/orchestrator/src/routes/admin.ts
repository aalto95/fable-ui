import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import * as adminHandlers from "@/handlers/admin";
import { requireAdminAuth } from "@/lib/auth";
import {
  AdminApiKeyCreatedResponse,
  AdminApiKeyCreateRequest,
  AdminApiKeyParams,
  AdminApiKeysResponse,
  ErrorResponse,
  UiOverrideSuccess,
} from "@/openapi/schemas";

const listApiKeysRoute = createRoute({
  method: "get",
  path: "/api-keys",
  tags: ["Admin Auth"],
  summary: "List admin API keys",
  description: "Returns key metadata (never the raw token). Requires admin auth.",
  operationId: "listAdminApiKeys",
  security: [{ bearerAuth: [] }],
  middleware: [requireAdminAuth],
  responses: {
    200: {
      description: "Key metadata",
      content: { "application/json": { schema: AdminApiKeysResponse } },
    },
    401: {
      description: "Missing or invalid bearer token",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});

const createApiKeyRoute = createRoute({
  method: "post",
  path: "/api-keys",
  tags: ["Admin Auth"],
  summary: "Create an admin API key",
  description: "Returns the raw token once. Only its hash is stored.",
  operationId: "createAdminApiKey",
  security: [{ bearerAuth: [] }],
  middleware: [requireAdminAuth],
  request: {
    body: {
      content: { "application/json": { schema: AdminApiKeyCreateRequest } },
      required: true,
    },
  },
  responses: {
    201: {
      description: "Created (token shown once)",
      content: { "application/json": { schema: AdminApiKeyCreatedResponse } },
    },
    400: {
      description: "Invalid name",
      content: { "application/json": { schema: ErrorResponse } },
    },
    401: {
      description: "Missing or invalid bearer token",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});

const revokeApiKeyRoute = createRoute({
  method: "delete",
  path: "/api-keys/{id}",
  tags: ["Admin Auth"],
  summary: "Revoke an admin API key",
  operationId: "revokeAdminApiKey",
  security: [{ bearerAuth: [] }],
  middleware: [requireAdminAuth],
  request: {
    params: AdminApiKeyParams,
  },
  responses: {
    200: {
      description: "Revoked",
      content: { "application/json": { schema: UiOverrideSuccess } },
    },
    404: {
      description: "Key not found",
      content: { "application/json": { schema: ErrorResponse } },
    },
    401: {
      description: "Missing or invalid bearer token",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});

const adminPingRoute = createRoute({
  method: "get",
  path: "/ping",
  tags: ["Admin Auth"],
  summary: "Auth check",
  operationId: "adminPing",
  security: [{ bearerAuth: [] }],
  middleware: [requireAdminAuth],
  responses: {
    200: { description: "OK" },
  },
});

const adminRoutes = new OpenAPIHono();

adminRoutes.openapi(listApiKeysRoute, adminHandlers.listApiKeys);
adminRoutes.openapi(createApiKeyRoute, adminHandlers.createApiKey);
adminRoutes.openapi(revokeApiKeyRoute, adminHandlers.revokeApiKey);
adminRoutes.openapi(adminPingRoute, (c) => c.json({ ok: true }, 200));

export { adminRoutes };
