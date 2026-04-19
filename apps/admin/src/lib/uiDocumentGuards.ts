export function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function isUiDoc(v: unknown): v is { ui: unknown[] } {
  return isRecord(v) && Array.isArray(v.ui);
}
