import { describe, expect, it } from "vitest";
import {
  getCachedLazyBuiltinBranch,
  getCachedLazyBuiltinLeaf,
  isBuiltinBranchType,
  isBuiltinLeafType,
  preloadBuiltinComponent,
} from "@/registry/builtin-lazy-loaders";

describe("isBuiltinBranchType", () => {
  it("returns true for valid branch types", () => {
    expect(isBuiltinBranchType("card")).toBe(true);
    expect(isBuiltinBranchType("form")).toBe(true);
    expect(isBuiltinBranchType("h_stack")).toBe(true);
    expect(isBuiltinBranchType("v_stack")).toBe(true);
  });

  it("returns false for leaf types", () => {
    expect(isBuiltinBranchType("button")).toBe(false);
    expect(isBuiltinBranchType("input")).toBe(false);
  });

  it("returns false for unknown types", () => {
    expect(isBuiltinBranchType("unknown")).toBe(false);
  });
});

describe("isBuiltinLeafType", () => {
  it("returns true for valid leaf types", () => {
    expect(isBuiltinLeafType("accordion")).toBe(true);
    expect(isBuiltinLeafType("button")).toBe(true);
    expect(isBuiltinLeafType("checkbox")).toBe(true);
    expect(isBuiltinLeafType("datepicker")).toBe(true);
    expect(isBuiltinLeafType("image")).toBe(true);
    expect(isBuiltinLeafType("input")).toBe(true);
    expect(isBuiltinLeafType("markdown")).toBe(true);
    expect(isBuiltinLeafType("pagination")).toBe(true);
    expect(isBuiltinLeafType("select")).toBe(true);
    expect(isBuiltinLeafType("slider")).toBe(true);
    expect(isBuiltinLeafType("subtitle")).toBe(true);
    expect(isBuiltinLeafType("table")).toBe(true);
    expect(isBuiltinLeafType("textarea")).toBe(true);
    expect(isBuiltinLeafType("title")).toBe(true);
  });

  it("returns false for branch types", () => {
    expect(isBuiltinLeafType("card")).toBe(false);
  });

  it("returns false for unknown types", () => {
    expect(isBuiltinLeafType("unknown")).toBe(false);
  });
});

describe("getCachedLazyBuiltinBranch", () => {
  it("returns a lazy component for a branch type", () => {
    const component = getCachedLazyBuiltinBranch("card");
    expect(component).toBeDefined();
    expect(component.$$typeof).toBe(Symbol.for("react.lazy"));
  });

  it("returns the same cached instance on second call", () => {
    const first = getCachedLazyBuiltinBranch("form");
    const second = getCachedLazyBuiltinBranch("form");
    expect(first).toBe(second);
  });
});

describe("getCachedLazyBuiltinLeaf", () => {
  it("returns a lazy component for a leaf type", () => {
    const component = getCachedLazyBuiltinLeaf("button");
    expect(component).toBeDefined();
    expect(component.$$typeof).toBe(Symbol.for("react.lazy"));
  });

  it("returns the same cached instance on second call", () => {
    const first = getCachedLazyBuiltinLeaf("input");
    const second = getCachedLazyBuiltinLeaf("input");
    expect(first).toBe(second);
  });
});

describe("preloadBuiltinComponent", () => {
  it("does not throw for branch types", () => {
    expect(() => preloadBuiltinComponent("card")).not.toThrow();
  });

  it("does not throw for leaf types", () => {
    expect(() => preloadBuiltinComponent("button")).not.toThrow();
  });

  it("does not throw for unknown types", () => {
    expect(() => preloadBuiltinComponent("unknown")).not.toThrow();
  });
});
