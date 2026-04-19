import { normalizeOrigin } from "@/config/originUtils";
import * as uiOriginsRepo from "@/db/uiOriginsRepo";
import * as uiSpecsRepo from "@/db/uiSpecsRepo";

const DEFAULT_ALLOWED_ORIGINS = new Set([
  "https://sdui-admin-tau.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
]);

/**
 * Requests without `Origin` (curl, server-to-server, same-tab navigation) are allowed.
 * Any other `Origin` must be in persisted origin bindings.
 * Legacy fallback: existing specs that still carry top-level `origins` remain allowed.
 */
export async function isOriginAllowed(origin: string | null): Promise<boolean> {
  if (!origin) return true;
  const n = normalizeOrigin(origin);
  if (DEFAULT_ALLOWED_ORIGINS.has(n)) return true;
  const fromBindings = await uiOriginsRepo.collectAllUiOrigins();
  if (fromBindings.includes(n)) return true;
  const legacy = await uiSpecsRepo.collectOriginsFromAllUiSpecs();
  return legacy.includes(n);
}
