export type UiSpecsResponse = {
  specs: { id: string }[];
};

export function isUiSpecsResponse(value: unknown): value is UiSpecsResponse {
  if (value === null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.specs)) return false;
  return v.specs.every(
    (row) =>
      row !== null && typeof row === "object" && typeof (row as { id?: unknown }).id === "string",
  );
}
