import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import * as uiHandlers from "@/handlers/ui";
import {
  ErrorResponse,
  JsonObject,
  SchemaOverrideSuccess,
  UiOriginsResponse,
  UiOriginUpsertRequest,
  UiOverrideSuccess,
  UiSpecsResponse,
} from "@/openapi/schemas";

const uiQuery = z.object({
  api: z.string().optional(),
  apiBase: z.string().optional(),
});

const getUiSpecsRoute = createRoute({
  method: "get",
  path: "/specs",
  tags: ["SDUI"],
  summary: "List stored UI specs",
  description:
    "Returns every spec id that currently has a document in memory (after `PUT /ui/{id}`). Use with `GET|PUT|DELETE /ui/{id}`.",
  operationId: "getUiSpecs",
  responses: {
    200: {
      description: "Unified spec list",
      content: { "application/json": { schema: UiSpecsResponse } },
    },
  },
});

const getUiOriginsRoute = createRoute({
  method: "get",
  path: "/origins",
  tags: ["Admin", "SDUI"],
  summary: "List origin bindings",
  description:
    "Returns separately managed origins and the spec id each origin resolves to (if linked).",
  operationId: "getUiOrigins",
  responses: {
    200: {
      description: "Origin bindings",
      content: { "application/json": { schema: UiOriginsResponse } },
    },
  },
});

const putUiOriginRoute = createRoute({
  method: "put",
  path: "/origins",
  tags: ["Admin", "SDUI"],
  summary: "Create/update origin binding",
  description: "Creates an origin entry and optionally links it to a UI spec id.",
  operationId: "putUiOrigin",
  request: {
    body: {
      content: { "application/json": { schema: UiOriginUpsertRequest } },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Updated",
      content: { "application/json": { schema: UiOverrideSuccess } },
    },
    400: {
      description: "Invalid origin or spec id",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});

const deleteUiOriginRoute = createRoute({
  method: "delete",
  path: "/origins",
  tags: ["Admin", "SDUI"],
  summary: "Remove origin binding",
  operationId: "deleteUiOrigin",
  request: {
    query: z.object({
      origin: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Removed",
      content: { "application/json": { schema: UiOverrideSuccess } },
    },
    400: {
      description: "Invalid origin",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});

const getUiSchemaRoute = createRoute({
  method: "get",
  path: "/schema",
  tags: ["SDUI"],
  summary: "UI JSON Schema",
  description:
    "Returns `ETag` (SHA-256 of body). Send `If-None-Match` with the previous ETag to receive `304 Not Modified` when the schema is unchanged.",
  operationId: "getUiSchema",
  responses: {
    200: {
      description: "JSON Schema for UI documents",
      content: { "application/json": { schema: JsonObject } },
    },
    304: {
      description: "Not modified",
    },
  },
});

const putUiSchemaRoute = createRoute({
  method: "put",
  path: "/schema",
  tags: ["Admin", "SDUI"],
  summary: "Override UI JSON Schema",
  operationId: "putUiSchemaOverride",
  request: {
    body: {
      content: { "application/json": { schema: JsonObject } },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Updated",
      content: { "application/json": { schema: SchemaOverrideSuccess } },
    },
  },
});

const deleteUiSchemaRoute = createRoute({
  method: "delete",
  path: "/schema",
  tags: ["Admin", "SDUI"],
  summary: "Reset UI JSON Schema to default (fable-ui package)",
  operationId: "deleteUiSchemaOverride",
  responses: {
    200: {
      description: "Reset",
      content: { "application/json": { schema: SchemaOverrideSuccess } },
    },
  },
});

const getUiRootRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["SDUI"],
  summary: "Resolved UI document (by Origin)",
  description:
    "Resolves a spec id from `Origin` and env, then origin bindings (`/ui/origins`). Query: `api` / `apiBase`. Supports `ETag` / `If-None-Match` for `304`.",
  operationId: "getUiDocument",
  request: { query: uiQuery },
  responses: {
    200: {
      description: "UI JSON document",
      content: { "application/json": { schema: JsonObject } },
    },
    304: {
      description: "Not modified",
    },
  },
});

const getUiByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["SDUI"],
  summary: "Resolved UI document by spec id",
  description:
    "Returns the SDUI spec for the given id. Supports `ETag` / `If-None-Match` for `304`.",
  operationId: "getUiDocumentById",
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
    query: uiQuery,
  },
  responses: {
    200: {
      description: "UI JSON document",
      content: { "application/json": { schema: JsonObject } },
    },
    304: {
      description: "Not modified",
    },
    400: {
      description: "Invalid id format",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});

const putUiByIdRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Admin", "SDUI"],
  summary: "Save UI spec document",
  operationId: "putUiOverride",
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
    body: {
      content: { "application/json": { schema: JsonObject } },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Updated",
      content: { "application/json": { schema: UiOverrideSuccess } },
    },
    400: {
      description: "Invalid body, id, or schema validation failed",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});

const deleteUiByIdRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Admin", "SDUI"],
  summary: "Reset or remove UI spec",
  operationId: "deleteUiOverride",
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
  },
  responses: {
    200: {
      description: "Removed",
      content: { "application/json": { schema: UiOverrideSuccess } },
    },
    400: {
      description: "Invalid id format",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});

const uiRoutes = new OpenAPIHono();

uiRoutes.openapi(getUiSpecsRoute, uiHandlers.getUiSpecs);
uiRoutes.openapi(getUiOriginsRoute, uiHandlers.getUiOrigins);
uiRoutes.openapi(putUiOriginRoute, uiHandlers.putUiOrigin);
uiRoutes.openapi(deleteUiOriginRoute, uiHandlers.deleteUiOrigin);
uiRoutes.openapi(getUiSchemaRoute, uiHandlers.getUiSchema);
uiRoutes.openapi(putUiSchemaRoute, uiHandlers.putUiSchema);
uiRoutes.openapi(deleteUiSchemaRoute, uiHandlers.deleteUiSchema);
uiRoutes.openapi(getUiRootRoute, uiHandlers.getUiRoot);
uiRoutes.openapi(getUiByIdRoute, uiHandlers.getUiById);
uiRoutes.openapi(putUiByIdRoute, uiHandlers.putUiById);
uiRoutes.openapi(deleteUiByIdRoute, uiHandlers.deleteUiById);

export { uiRoutes };
