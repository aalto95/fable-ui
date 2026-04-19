import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import { bundledUiSchemaPath } from "@/lib/bundledUiSchemaPath";
import { getSchemaOverride } from "@/lib/uiSchemaStore";

async function getUiJsonSchema(): Promise<object> {
  const override = await getSchemaOverride();
  if (override !== null && typeof override === "object") {
    return structuredClone(override) as object;
  }
  const raw = readFileSync(bundledUiSchemaPath(), "utf8");
  return JSON.parse(raw) as object;
}

/** Validate a UI document against the active SDUI JSON Schema (fable-ui schema or `PUT /ui` override). */
export async function validateUiDocument(
  data: unknown,
): Promise<{ ok: true } | { ok: false; errors: string[] }> {
  try {
    const schema = await getUiJsonSchema();
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (valid) return { ok: true };
    const errors = (validate.errors ?? []).map((e) => {
      const at = e.instancePath || "/";
      return `${at} ${e.message ?? "invalid"}`.trim();
    });
    return {
      ok: false,
      errors: errors.length > 0 ? errors : ["Document does not match UI schema"],
    };
  } catch (err) {
    return {
      ok: false,
      errors: [err instanceof Error ? err.message : "Schema validation failed"],
    };
  }
}
