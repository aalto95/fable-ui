import type { Context } from "hono";
import {
  clearOriginBinding,
  clearSchemaOverride,
  clearUiOverride,
  isSpecIdSyntax,
  listOriginBindings,
  listSpecs,
  normalizeSpecId,
  setOriginBinding,
  setSchemaOverride,
  setUiOverride,
} from "@/lib/uiSchemaStore";
import { serveSchemaDocument, serveUiDocument } from "@/lib/uiServe";
import { valid } from "@/lib/validatedRequest";
import { validateUiDocument } from "@/lib/validateUiDocument";

export async function getUiSpecs(c: Context) {
  return c.json({ specs: await listSpecs() }, 200);
}

function isValidOrigin(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function getUiOrigins(c: Context) {
  return c.json({ origins: await listOriginBindings() }, 200);
}

export async function putUiOrigin(c: Context) {
  const body = valid<{ origin: string; specId?: string | null }>(c, "json");
  const origin = body.origin?.trim() ?? "";
  if (!origin || !isValidOrigin(origin)) {
    return c.json({ success: false, message: "Invalid origin" }, 400);
  }

  const hasSpecId = body.specId !== undefined && body.specId !== null && body.specId.trim() !== "";
  let specId: string | null = null;
  if (hasSpecId) {
    const normalized = normalizeSpecId(body.specId as string);
    if (normalized == null) {
      return c.json({ success: false, message: "Invalid spec id" }, 400);
    }
    specId = normalized;
  }

  await setOriginBinding(origin, specId);
  return c.json(
    { success: true, message: specId ? "Origin linked to spec" : "Origin saved without spec link" },
    200,
  );
}

export async function deleteUiOrigin(c: Context) {
  const { origin } = valid<{ origin: string }>(c, "query");
  const raw = origin?.trim() ?? "";
  if (!raw || !isValidOrigin(raw)) {
    return c.json({ success: false, message: "Invalid origin" }, 400);
  }
  await clearOriginBinding(raw);
  return c.json({ success: true, message: "Origin removed" }, 200);
}

export function getUiSchema(c: Context) {
  return serveSchemaDocument(c);
}

export async function putUiSchema(c: Context) {
  const body = valid<unknown>(c, "json");
  await setSchemaOverride(body);
  return c.json({ success: true, message: "UI JSON Schema updated" }, 200);
}

export async function deleteUiSchema(c: Context) {
  await clearSchemaOverride();
  return c.json({ success: true, message: "UI JSON Schema reset to default (fable-ui)" }, 200);
}

export function getUiRoot(c: Context) {
  return serveUiDocument(c);
}

export async function getUiById(c: Context) {
  const { id: rawId } = valid<{ id: string }>(c, "param");
  if (!isSpecIdSyntax(rawId)) {
    return c.json({ success: false, message: "Invalid spec id" }, 400);
  }
  const specId = normalizeSpecId(rawId);
  if (specId === null) {
    return c.json({ success: false, message: "Invalid spec id" }, 400);
  }
  return serveUiDocument(c, { forceSpecId: specId });
}

export async function putUiById(c: Context) {
  const { id: rawId } = valid<{ id: string }>(c, "param");
  if (!isSpecIdSyntax(rawId)) {
    return c.json({ success: false, message: "Invalid spec id" }, 400);
  }
  const specId = normalizeSpecId(rawId);
  if (specId === null) {
    return c.json({ success: false, message: "Invalid spec id" }, 400);
  }
  const body = valid<Record<string, unknown>>(c, "json");
  if (!body || typeof body !== "object") {
    return c.json({ success: false, message: "Body must be a JSON object" }, 400);
  }
  const check = await validateUiDocument(body);
  if (!check.ok) {
    return c.json(
      {
        success: false,
        message: "Body does not match UI JSON Schema",
        errors: check.errors,
      },
      400,
    );
  }
  const doc = { ...body };
  delete doc.$schema;
  await setUiOverride(specId, doc);
  const idNorm = rawId.trim().toLowerCase();
  return c.json({ success: true, message: `UI spec updated (${idNorm})` }, 200);
}

export async function deleteUiById(c: Context) {
  const { id: rawId } = valid<{ id: string }>(c, "param");
  if (!isSpecIdSyntax(rawId)) {
    return c.json({ success: false, message: "Invalid spec id" }, 400);
  }
  const specId = normalizeSpecId(rawId);
  if (specId === null) {
    return c.json({ success: false, message: "Invalid spec id" }, 400);
  }
  await clearUiOverride(specId);
  const idNorm = rawId.trim().toLowerCase();
  return c.json({ success: true, message: `Spec removed (${idNorm})` }, 200);
}
