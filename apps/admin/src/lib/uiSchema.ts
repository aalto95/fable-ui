/** `fable-ui/schema.json` — single source of truth for the interactive editor graph. */
import uiSchemaJson from "fable-ui/schema.json";
import type { Path } from "./paths";

type Defs = Record<
  string,
  {
    type?: string;
    const?: string;
    enum?: string[];
    oneOf?: { $ref?: string }[];
    properties?: Record<string, { const?: string; enum?: string[]; type?: string; $ref?: string }>;
  }
>;

const schema = uiSchemaJson as {
  $id?: string;
  $defs?: Defs;
};

function getDefs(): Defs {
  const d = schema.$defs;
  if (!d || typeof d !== "object") throw new Error("fable-ui schema: missing $defs");
  return d;
}

function extractComponentUnionTypes(): string[] {
  const defs = getDefs();
  const union = defs.componentUnion;
  if (!union?.oneOf?.length) throw new Error("fable-ui schema: missing $defs.componentUnion.oneOf");

  const types: string[] = [];
  for (const entry of union.oneOf) {
    const ref = entry.$ref;
    if (!ref?.startsWith("#/$defs/")) continue;
    const name = ref.slice("#/$defs/".length);
    const def = defs[name];
    const c = def?.properties?.type?.const;
    if (typeof c === "string") types.push(c);
  }
  if (types.length === 0)
    throw new Error("fable-ui schema: could not resolve component union types");
  return types;
}

function stringEnumDef(defName: string): readonly string[] {
  const def = getDefs()[defName];
  const e = def?.enum;
  if (!Array.isArray(e) || !e.every((x) => typeof x === "string")) {
    throw new Error(`fable-ui schema: $defs.${defName} must have a string enum`);
  }
  return e;
}

function nestedStringEnum(defName: string, ...path: string[]): readonly string[] {
  let cur: unknown = getDefs()[defName];
  for (const p of path) {
    if (cur && typeof cur === "object" && p in cur) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      throw new Error(`fable-ui schema: missing $defs.${defName}.${path.join(".")}`);
    }
  }
  if (!Array.isArray(cur) || !cur.every((x) => typeof x === "string")) {
    throw new Error(`fable-ui schema: expected string[] at $defs.${defName}.${path.join(".")}`);
  }
  return cur;
}

/** Discriminated component `type` values from `$defs.componentUnion` (matches orchestrator). */
export const COMPONENT_TYPES = extractComponentUnionTypes() as unknown as readonly [
  string,
  ...string[],
];

export type ComponentType = (typeof COMPONENT_TYPES)[number];

export function isComponentType(value: string): value is ComponentType {
  return (COMPONENT_TYPES as readonly string[]).includes(value);
}

export const VARIANTS = stringEnumDef("variant");
export const ACTION_TYPES = stringEnumDef("actionType");
export const TABLE_HEAD_TYPES = stringEnumDef("tableHeadType");
export const BUTTON_SIZES = nestedStringEnum("buttonComponent", "properties", "size", "enum");

export const UI_SCHEMA_ID = schema.$id ?? "";

/**
 * Label for a single-purpose add control when the insertion list is not `componentUnion`
 * (e.g. table columns, accordion sections, actions). Root page list uses the separate "+ Page" control.
 */
export function structuredInsertButtonLabel(parentPath: Path): string | null {
  const last = parentPath[parentPath.length - 1];
  if (last === "heads") return "Add column";
  if (last === "items") return "Add section";
  if (last === "actions") return "Add action";
  return null;
}

/**
 * Arrays that use `$defs/componentUnion` accept these `type` values.
 * Root `ui` is an array of **pages** (`$ref: page`), not components.
 * Other lists (`heads`, `items`, `actions`) use different item shapes.
 */
export function insertableComponentTypesFor(parentPath: Path): ComponentType[] {
  const last = parentPath[parentPath.length - 1];
  if (last === "heads" || last === "items" || last === "actions") {
    return [];
  }
  if (parentPath.length === 1 && parentPath[0] === "ui") {
    return [];
  }
  if (last === "ui" || last === "descendants" || last === "fields") {
    return [...COMPONENT_TYPES];
  }
  return [];
}
