import { describe, expect, it } from "vitest";
import { defaultEmptySpec, isSpecIdSyntax, normalizeSpecId } from "@/lib/uiSchemaStore";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("isSpecIdSyntax", () => {
  it("accepts valid UUID v4 ids", () => {
    expect(isSpecIdSyntax(VALID_UUID)).toBe(true);
  });

  it("rejects malformed ids", () => {
    expect(isSpecIdSyntax("")).toBe(false);
    expect(isSpecIdSyntax("123")).toBe(false);
    expect(isSpecIdSyntax("not-a-uuid")).toBe(false);
    expect(isSpecIdSyntax("550e8400-e29b-41d4-a716-44665544000Z")).toBe(false);
  });
});

describe("normalizeSpecId", () => {
  it("lowercases and trims valid ids", () => {
    expect(normalizeSpecId(` ${VALID_UUID.toUpperCase()} `)).toBe(VALID_UUID);
  });

  it("returns null for invalid ids", () => {
    expect(normalizeSpecId("nope")).toBeNull();
  });
});

describe("defaultEmptySpec", () => {
  it("returns a minimal SDUI document", () => {
    expect(defaultEmptySpec()).toEqual({
      ui: [{ route: "/", name: "Home", ui: [{ type: "title", text: "New UI document" }] }],
    });
  });

  it("returns a fresh copy on each call", () => {
    const a = defaultEmptySpec();
    const b = defaultEmptySpec();
    expect(a).not.toBe(b);
    (a.ui as unknown[])[0] = { route: "/mutated" };
    expect((b.ui as unknown[])[0]).not.toEqual({ route: "/mutated" });
  });
});
