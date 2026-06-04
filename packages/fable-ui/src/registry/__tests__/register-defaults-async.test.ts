import { describe, expect, it } from "vitest";
import { componentRegistry } from "@/registry/component-registry";
import { registerDefaultComponentsAsync } from "@/registry/register-defaults-async";

describe("registerDefaultComponentsAsync", () => {
  it("registers all built-in branch components", async () => {
    await registerDefaultComponentsAsync();
    expect(componentRegistry.hasBranch("card")).toBe(true);
    expect(componentRegistry.hasBranch("form")).toBe(true);
    expect(componentRegistry.hasBranch("h_stack")).toBe(true);
    expect(componentRegistry.hasBranch("v_stack")).toBe(true);
  });

  it("registers all built-in leaf components", async () => {
    await registerDefaultComponentsAsync();
    expect(componentRegistry.hasLeaf("accordion")).toBe(true);
    expect(componentRegistry.hasLeaf("button")).toBe(true);
    expect(componentRegistry.hasLeaf("checkbox")).toBe(true);
    expect(componentRegistry.hasLeaf("datepicker")).toBe(true);
    expect(componentRegistry.hasLeaf("image")).toBe(true);
    expect(componentRegistry.hasLeaf("input")).toBe(true);
    expect(componentRegistry.hasLeaf("markdown")).toBe(true);
    expect(componentRegistry.hasLeaf("pagination")).toBe(true);
    expect(componentRegistry.hasLeaf("select")).toBe(true);
    expect(componentRegistry.hasLeaf("slider")).toBe(true);
    expect(componentRegistry.hasLeaf("subtitle")).toBe(true);
    expect(componentRegistry.hasLeaf("table")).toBe(true);
    expect(componentRegistry.hasLeaf("textarea")).toBe(true);
    expect(componentRegistry.hasLeaf("title")).toBe(true);
  });

  it("returns a promise", () => {
    const result = registerDefaultComponentsAsync();
    expect(result).toBeInstanceOf(Promise);
  });
});
