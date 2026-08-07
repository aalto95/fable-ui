import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_VERCEL_RENDERER,
  normalizeOrigin,
  vercelRendererOrigin,
} from "@/config/originUtils";

afterEach(() => {
  delete process.env.SDUI_VERCEL_RENDERER_ORIGIN;
});

describe("normalizeOrigin", () => {
  it("trims whitespace and trailing slashes", () => {
    expect(normalizeOrigin("  https://example.com/  ")).toBe("https://example.com");
  });

  it("leaves an already-normal origin unchanged", () => {
    expect(normalizeOrigin("https://example.com")).toBe("https://example.com");
  });
});

describe("vercelRendererOrigin", () => {
  it("returns the default renderer origin when env is unset", () => {
    expect(vercelRendererOrigin()).toBe(DEFAULT_VERCEL_RENDERER);
  });

  it("returns the env override when set", () => {
    process.env.SDUI_VERCEL_RENDERER_ORIGIN = "https://renderer.example.com";
    expect(vercelRendererOrigin()).toBe("https://renderer.example.com");
  });
});
