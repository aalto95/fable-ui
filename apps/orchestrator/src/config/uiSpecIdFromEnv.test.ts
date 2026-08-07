import { afterEach, describe, expect, it } from "vitest";
import { uiSpecIdFromEnvForOrigin } from "@/config/uiSpecIdFromEnv";

afterEach(() => {
  delete process.env.SDUI_DEFAULT_UI_SPEC_ID;
  delete process.env.SDUI_UI_SPEC_ID_LOCAL;
  delete process.env.SDUI_UI_SPEC_ID_VERCEL;
  delete process.env.SDUI_VERCEL_RENDERER_ORIGIN;
});

describe("uiSpecIdFromEnvForOrigin", () => {
  it("returns the fallback when no Origin header is sent", () => {
    process.env.SDUI_DEFAULT_UI_SPEC_ID = "fallback";
    expect(uiSpecIdFromEnvForOrigin(null)).toBe("fallback");
  });

  it("returns undefined when no env is configured", () => {
    expect(uiSpecIdFromEnvForOrigin("https://unknown.example.com")).toBeUndefined();
  });

  it("resolves local Vite origins to the local spec id", () => {
    process.env.SDUI_DEFAULT_UI_SPEC_ID = "fallback";
    process.env.SDUI_UI_SPEC_ID_LOCAL = "local-spec";
    expect(uiSpecIdFromEnvForOrigin("http://localhost:5173/")).toBe("local-spec");
    expect(uiSpecIdFromEnvForOrigin("http://127.0.0.1:5174")).toBe("local-spec");
  });

  it("resolves the Vercel renderer origin to the vercel spec id", () => {
    process.env.SDUI_DEFAULT_UI_SPEC_ID = "fallback";
    process.env.SDUI_UI_SPEC_ID_VERCEL = "vercel-spec";
    expect(uiSpecIdFromEnvForOrigin("https://fable-ui.vercel.app")).toBe("vercel-spec");
  });

  it("falls back to the default spec id for unknown origins", () => {
    process.env.SDUI_DEFAULT_UI_SPEC_ID = "fallback";
    expect(uiSpecIdFromEnvForOrigin("https://unknown.example.com")).toBe("fallback");
  });
});
