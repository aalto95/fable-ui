import { normalizeOrigin, vercelRendererOrigin } from "@/config/originUtils";
import type { UiSpecBuildOptions } from "@/lib/uiSpecBuilder";

/** Vite dev (matches CORS defaults). */
const LOCAL_ORIGINS = new Set(["http://localhost:5173", "http://127.0.0.1:5173"]);

/**
 * Build options for `GET /ui` from the browser `Origin` (API base URLs for path rewrites).
 * Spec id resolution uses env mapping plus stored origin bindings — see OpenAPI `GET /ui`.
 */
export function uiSpecOptionsForOrigin(
  originHeader: string | null,
): Pick<UiSpecBuildOptions, "apiBaseUrl"> {
  if (!originHeader) {
    return {
      apiBaseUrl:
        process.env.SDUI_API_BASE_URL?.trim() ||
        process.env.ORCHESTRATOR_PUBLIC_URL?.trim() ||
        process.env.PUBLIC_ORCHESTRATOR_URL?.trim() ||
        undefined,
    };
  }

  const origin = normalizeOrigin(originHeader);

  if (LOCAL_ORIGINS.has(origin)) {
    return {
      apiBaseUrl:
        process.env.SDUI_API_BASE_URL_LOCAL?.trim() ||
        process.env.SDUI_API_BASE_URL?.trim() ||
        undefined,
    };
  }

  if (origin === vercelRendererOrigin()) {
    return {
      apiBaseUrl:
        process.env.SDUI_API_BASE_URL_VERCEL?.trim() ||
        process.env.SDUI_API_BASE_URL?.trim() ||
        process.env.ORCHESTRATOR_PUBLIC_URL?.trim() ||
        process.env.PUBLIC_ORCHESTRATOR_URL?.trim() ||
        undefined,
    };
  }

  return {
    apiBaseUrl:
      process.env.SDUI_API_BASE_URL?.trim() ||
      process.env.ORCHESTRATOR_PUBLIC_URL?.trim() ||
      process.env.PUBLIC_ORCHESTRATOR_URL?.trim() ||
      undefined,
  };
}
