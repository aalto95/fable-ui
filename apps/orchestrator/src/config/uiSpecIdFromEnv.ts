import { normalizeOrigin, vercelRendererOrigin } from "@/config/originUtils";

/** Vite dev and typical local admin ports. */
const LOCAL_VITE_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
]);

/**
 * Raw env value for which UI spec `GET /ui` should load when `Origin` matches a known profile.
 * Falls back to `SDUI_DEFAULT_UI_SPEC_ID`. Invalid UUIDs are ignored downstream.
 */
export function uiSpecIdFromEnvForOrigin(originHeader: string | null): string | undefined {
  const fallback = process.env.SDUI_DEFAULT_UI_SPEC_ID?.trim();
  if (!originHeader?.trim()) {
    return fallback || undefined;
  }

  const origin = normalizeOrigin(originHeader);

  if (LOCAL_VITE_ORIGINS.has(origin)) {
    return process.env.SDUI_UI_SPEC_ID_LOCAL?.trim() || fallback || undefined;
  }

  if (origin === vercelRendererOrigin()) {
    return process.env.SDUI_UI_SPEC_ID_VERCEL?.trim() || fallback || undefined;
  }

  return fallback || undefined;
}
