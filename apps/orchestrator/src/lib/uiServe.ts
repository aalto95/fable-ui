import type { Context } from "hono";
import { uiSpecOptionsForOrigin } from "@/config/uiOriginProfiles";
import { bundledUiSchemaPath } from "@/lib/bundledUiSchemaPath";
import {
  ifNoneMatchSatisfied,
  loadUiSchemaJsonText,
  strongEtagFromBody,
} from "@/lib/uiSchemaCaching";
import type { UiSpecBuildOptions } from "@/lib/uiSpecBuilder";
import { buildUiSpec } from "@/lib/uiSpecBuilder";

export function uiSpecOptionsFromRequest(
  c: Context,
  extra?: { forceSpecId?: string | null },
): UiSpecBuildOptions {
  const url = new URL(c.req.url);
  const fromOrigin = uiSpecOptionsForOrigin(c.req.header("origin") ?? null);
  const qApi = url.searchParams.get("apiBase") ?? url.searchParams.get("api");

  return {
    apiBaseUrl: qApi?.trim() || fromOrigin.apiBaseUrl,
    requestOrigin: c.req.header("origin") ?? null,
    forceSpecId: extra?.forceSpecId ?? null,
  };
}

function revalidatedJsonHeaders(etag: string): Record<string, string> {
  return {
    ETag: etag,
    "Cache-Control": "private, max-age=0, must-revalidate",
    Vary: "Origin",
  };
}

export async function serveUiDocument(
  c: Context,
  extra?: { forceSpecId?: string | null },
): Promise<Response> {
  const spec = await buildUiSpec(uiSpecOptionsFromRequest(c, extra));
  const body = JSON.stringify(spec);
  const etag = strongEtagFromBody(body);
  const headers = revalidatedJsonHeaders(etag);

  if (ifNoneMatchSatisfied(c.req.header("if-none-match") ?? null, etag)) {
    return c.body(null, 304, headers);
  }

  return c.body(body, 200, {
    ...headers,
    "Content-Type": "application/json",
  });
}

export async function serveSchemaDocument(c: Context): Promise<Response> {
  const body = await loadUiSchemaJsonText(bundledUiSchemaPath());
  const etag = strongEtagFromBody(body);
  const headers = revalidatedJsonHeaders(etag);

  if (ifNoneMatchSatisfied(c.req.header("if-none-match") ?? null, etag)) {
    return c.body(null, 304, headers);
  }

  return c.body(body, 200, {
    ...headers,
    "Content-Type": "application/json",
  });
}
