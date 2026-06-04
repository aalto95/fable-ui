import { describe, expect, it } from "vitest";
import { componentRegistry } from "@/registry/component-registry";
import { registerDefaultComponents } from "@/registry/register-defaults";

describe("registerDefaultComponents", () => {
  it("registers all built-in branch components", () => {
    registerDefaultComponents();
    expect(componentRegistry.hasBranch("card")).toBe(true);
    expect(componentRegistry.hasBranch("form")).toBe(true);
    expect(componentRegistry.hasBranch("h_stack")).toBe(true);
    expect(componentRegistry.hasBranch("v_stack")).toBe(true);
  });

  it("registers all built-in leaf components", () => {
    registerDefaultComponents();
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

  it("is idempotent when called twice", () => {
    const initial = componentRegistry.getBranch("card");
    registerDefaultComponents();
    const after = componentRegistry.getBranch("card");
    expect(after).toBe(initial);
  });
});
