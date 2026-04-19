export function safeParseJson(
  text: string,
): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}

/** Empty UI from the server becomes a starter object with `origins` first; otherwise reorder keys so `origins` is first when present. */
export function withOriginsFirst(value: unknown): unknown {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return value;
  const rec = value as Record<string, unknown>;
  if (Object.keys(rec).length === 0) return { origins: [] };
  if (!("origins" in rec)) return rec;
  const { origins, ...rest } = rec;
  return { origins, ...rest };
}
