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
      const isMissing =
        value == null || (typeof value === "string" && value.trim() === "");

      if (!isMissing) {
        return null;
      }

      return {
        node,
        label:
          node.getAttribute("data-sdui-label") ||
          (node as HTMLInputElement).placeholder ||
          node.getAttribute("aria-label") ||
          name,
      };
    })
    .filter(Boolean) as { node: HTMLElement; label: string }[];

  return missing;
}

export function hasNameField(field: unknown): field is { name: string } {
  return (
    typeof field === "object" &&
    field !== null &&
    "name" in field &&
    typeof (field as { name: unknown }).name === "string"
  );
}
