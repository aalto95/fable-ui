/** Default production renderer (override with SDUI_VERCEL_RENDERER_ORIGIN). */
export const DEFAULT_VERCEL_RENDERER = "https://fable-ui.vercel.app";

export function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, "");
}

export function vercelRendererOrigin(): string {
  return (process.env.SDUI_VERCEL_RENDERER_ORIGIN ?? DEFAULT_VERCEL_RENDERER).trim();
}
