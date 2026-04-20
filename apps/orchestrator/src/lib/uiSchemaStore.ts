import { normalizeOrigin } from "@/config/originUtils";
import { uiSpecIdFromEnvForOrigin } from "@/config/uiSpecIdFromEnv";
import * as schemaRepo from "@/db/schemaRepo";
import * as uiOriginsRepo from "@/db/uiOriginsRepo";
import * as uiSpecsRepo from "@/db/uiSpecsRepo";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isSpecIdSyntax(raw: string): boolean {
  return UUID_RE.test(raw.trim().toLowerCase());
}

/** Normalized id if syntax is valid, else `null`. */
export function normalizeSpecId(raw: string): string | null {
  const s = raw.trim().toLowerCase();
  if (!UUID_RE.test(s)) return null;
  return s;
}

/** Minimal SDUI document when no spec exists yet or `GET /ui` cannot resolve an id. */
export function defaultEmptySpec(): Record<string, unknown> {
  return {
    ui: [
      {
        route: "/",
        name: "Home",
        ui: [{ type: "title", text: "New UI document" }],
      },
    ],
  };
}

export type SpecSummary = {
  id: string;
};

export type OriginBinding = {
  origin: string;
  specId: string | null;
};

/** All specs currently stored (`PUT /ui/{id}` creates or updates). */
export async function listSpecs(): Promise<SpecSummary[]> {
  const ids = await uiSpecsRepo.listUiSpecIds();
  return ids.sort().map((id) => ({ id }));
}

async function resolveImplicitSpecId(origin: string | null): Promise<string | null> {
  const raw = uiSpecIdFromEnvForOrigin(origin);
  if (raw) {
    const id = normalizeSpecId(raw);
    if (id != null) return id;
  }
  if (origin?.trim()) {
    const fromBinding = await uiOriginsRepo.findSpecIdForOrigin(normalizeOrigin(origin));
    if (fromBinding != null) return fromBinding;
    const fromDoc = await uiSpecsRepo.findSpecIdForOrigin(normalizeOrigin(origin));
    if (fromDoc != null) return fromDoc;
  }
  return null;
}

export type UiSpecSourceOptions = {
  /** Browser `Origin` — used with env (`SDUI_UI_SPEC_ID_*`) and origin bindings for `GET /ui`. */
  origin: string | null;
  /** When set (`GET /ui/{id}`), load this spec id from the store (or empty default if missing). */
  forceSpecId: string | null;
};

/** Fresh copy for mutation (e.g. API path rewrites). */
export async function getUiSpecSource(
  options: UiSpecSourceOptions,
): Promise<Record<string, unknown>> {
  if (options.forceSpecId != null) {
    const normalized = normalizeSpecId(options.forceSpecId);
    if (normalized == null) {
      return structuredClone(defaultEmptySpec());
    }
    const stored = await uiSpecsRepo.getUiSpec(normalized);
    if (stored != null) {
      return structuredClone(stored) as Record<string, unknown>;
    }
    return structuredClone(defaultEmptySpec());
  }

  const specId = await resolveImplicitSpecId(options.origin);
  if (specId == null) {
    return structuredClone(defaultEmptySpec());
  }
  return getUiSpecSource({ ...options, forceSpecId: specId });
}

export async function setUiOverride(specId: string, doc: Record<string, unknown>): Promise<void> {
  await uiSpecsRepo.setUiSpec(specId, doc);
}

export async function clearUiOverride(specId: string): Promise<void> {
  await uiSpecsRepo.resetUiSpec(specId);
}

export async function getSchemaOverride(): Promise<unknown | null> {
  return schemaRepo.getSchemaOverride();
}

export async function setSchemaOverride(doc: unknown): Promise<void> {
  await schemaRepo.setSchemaOverride(doc);
}

export async function clearSchemaOverride(): Promise<void> {
  await schemaRepo.clearSchemaOverride();
}

export async function listOriginBindings(): Promise<OriginBinding[]> {
  return uiOriginsRepo.listUiOriginBindings();
}

export async function setOriginBinding(origin: string, specId: string | null): Promise<void> {
  await uiOriginsRepo.setUiOriginBinding(origin, specId);
}

export async function clearOriginBinding(origin: string): Promise<void> {
  await uiOriginsRepo.clearUiOriginBinding(origin);
}
