import type { TComponentUnion } from "@/models/interfaces/component";

export function dateOnlyToISO(value: string) {
  return value ? new Date(`${value}T00:00:00`).toISOString() : value;
}

export function formDataToJson(formData: FormData, form: HTMLFormElement) {
  const json: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    const input = form.elements.namedItem(key) as HTMLInputElement | null;

    if (input?.type === "date" && typeof value === "string") {
      json[key] = dateOnlyToISO(value);
    } else {
      json[key] = value;
    }
  });

  return json;
}

export function buildGetUrl(base: string, data: Record<string, unknown>) {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (value != null) params.append(key, String(value));
  });

  return params.toString()
    ? base.includes("?")
      ? `${base}&${params}`
      : `${base}?${params}`
    : base;
}

export function validateRequired(form: HTMLFormElement, formData: FormData) {
  const nodes = Array.from(form.querySelectorAll<HTMLElement>("[required]"));

  const missing = nodes
    .map((node) => {
      const name = (node as HTMLInputElement).name || node.getAttribute("name");

      if (!name) {
        return null;
      }

      const value = formData.get(name);
      const isMissing = value == null || (typeof value === "string" && value.trim() === "");

      if (!isMissing) {
        return null;
      }

      return {
        node,
        label:
          node.getAttribute("data-fable-ui-label") ||
          (node as HTMLInputElement).placeholder ||
          node.getAttribute("aria-label") ||
          name,
      };
    })
    .filter(Boolean) as { node: HTMLElement; label: string }[];

  return missing;
}

/** Normalizes list/detail API payloads to a flat record for field prefill. */
export function unwrapRecordPayload(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    if ("data" in raw) {
      const inner = (raw as { data: unknown }).data;
      if (inner && typeof inner === "object" && !Array.isArray(inner)) {
        return inner as Record<string, unknown>;
      }
    }
    return raw as Record<string, unknown>;
  }
  return {};
}

export function hasNameField(field: unknown): field is { name: string } {
  return (
    typeof field === "object" &&
    field !== null &&
    "name" in field &&
    typeof (field as { name: unknown }).name === "string"
  );
}

/** Applies a detail payload value to a form field with the correct prop shape per component type. */
export function mergePrefillToField(field: TComponentUnion, value: unknown): TComponentUnion {
  if (!hasNameField(field) || value === undefined) {
    return field;
  }

  switch (field.type) {
    case "slider": {
      const n = typeof value === "number" ? value : Number(value);
      return Number.isNaN(n) ? field : { ...field, defaultValue: n };
    }
    case "checkbox": {
      const checked =
        typeof value === "boolean" ? value : value === "true" || value === true || value === 1;
      return { ...field, checked };
    }
    case "input":
    case "textarea":
    case "datepicker":
      return { ...field, defaultValue: String(value) };
    case "select":
      return {
        ...field,
        defaultValue: String(value),
      } as TComponentUnion;
    default:
      return field;
  }
}

/** Deep-merge API prefill values into a component tree (named inputs at any depth). */
export function mergePrefillIntoDescendants(
  nodes: TComponentUnion[] | undefined,
  data: Record<string, unknown>,
): TComponentUnion[] | undefined {
  if (!nodes) {
    return nodes;
  }
  return nodes.map((node) => mergePrefillIntoNode(node, data));
}

function mergePrefillIntoNode(
  node: TComponentUnion,
  data: Record<string, unknown>,
): TComponentUnion {
  if (hasNameField(node) && data[node.name] !== undefined) {
    return mergePrefillToField(node, data[node.name]);
  }
  if ("descendants" in node && Array.isArray(node.descendants)) {
    return {
      ...node,
      descendants: mergePrefillIntoDescendants(node.descendants, data),
    };
  }
  return node;
}
