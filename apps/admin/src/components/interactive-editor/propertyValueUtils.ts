export function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function num(v: unknown): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : 0;
}

export function bool(v: unknown): boolean {
  return v === true;
}
