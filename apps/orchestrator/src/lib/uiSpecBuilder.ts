import type { UiSpecSourceOptions } from "@/lib/uiSchemaStore";
import { getUiSpecSource } from "@/lib/uiSchemaStore";

export type UiSpecBuildOptions = {
  /**
   * Public base URL for orchestrator API calls (no trailing slash).
   * Examples: `https://orchestrator.example.com`, `http://localhost:3000`.
   * Omit or empty string to keep relative `/api/...` URLs (same origin as the renderer).
   */
  apiBaseUrl?: string;
  /** Browser `Origin` — selects spec for `GET /ui` via env + origin bindings; also used for API rewrites. */
  requestOrigin?: string | null;
  /** From `GET /ui/{id}` — load this spec id directly. */
  forceSpecId?: string | null;
};

/** Join base URL with an API path like `/api/todo`. */
function resolveApiUrl(apiBaseUrl: string, apiPath: string): string {
  const trimmed = apiBaseUrl.trim().replace(/\/+$/, "");
  if (!trimmed) return apiPath;
  const path = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  return `${trimmed}${path}`;
}

/** Relative `/api/...` or absolute URL whose pathname starts with `/api`. */
function rewriteApiFieldValue(value: string, apiBaseUrl: string): string {
  const base = apiBaseUrl.trim().replace(/\/+$/, "");
  if (!base) return value;

  if (value.startsWith("/api")) {
    return resolveApiUrl(base, value);
  }

  try {
    const u = new URL(value);
    if (u.pathname.startsWith("/api")) {
      return `${base}${u.pathname}${u.search}`;
    }
  } catch {
    // not an absolute URL
  }

  return value;
}

function isApiLikeField(key: string): boolean {
  return key === "dataSource" || key === "path";
}

/**
 * Rewrite `dataSource` and HTTP-related `path` fields that target the orchestrator API
 * (`/api/...` or full URLs with path `/api/...`). Navigation routes (`/todo`, `/`) unchanged.
 */
export function rewriteOrchestratorApiPaths(root: unknown, apiBaseUrl: string): void {
  const base = apiBaseUrl.trim();
  if (!base) return;

  const visit = (node: unknown): void => {
    if (node === null || node === undefined) return;
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (typeof node !== "object") return;

    const record = node as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      const val = record[key];
      if (isApiLikeField(key) && typeof val === "string") {
        const next = rewriteApiFieldValue(val, base);
        if (next !== val) record[key] = next;
      } else {
        visit(val);
      }
    }
  };

  visit(root);
}

/**
 * Build SDUI document from stored specs (`requestOrigin` / env / origin bindings, or `forceSpecId`).
 */
export async function buildUiSpec(
  options: UiSpecBuildOptions = {},
): Promise<Record<string, unknown>> {
  const sourceOpts: UiSpecSourceOptions = {
    origin: options.requestOrigin ?? null,
    forceSpecId: options.forceSpecId ?? null,
  };
  const doc = await getUiSpecSource(sourceOpts);
  delete doc.$schema;

  if (options.apiBaseUrl?.trim()) {
    rewriteOrchestratorApiPaths(doc, options.apiBaseUrl);
  }

  return doc;
}
