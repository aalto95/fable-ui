import { describe, expect, it } from "vitest";
import { ComponentRegistry } from "@/registry/component-registry";

describe("ComponentRegistry", () => {
  it("registers and retrieves branch components", () => {
    const registry = new ComponentRegistry();
    const component = () => null;

    registry.registerBranch("card", component);
    expect(registry.getBranch("card")).toBe(component);
    expect(registry.hasBranch("card")).toBe(true);
  });

  it("registers and retrieves leaf components", () => {
    const registry = new ComponentRegistry();
    const component = () => null;

    registry.registerLeaf("button", component);
    expect(registry.getLeaf("button")).toBe(component);
    expect(registry.hasLeaf("button")).toBe(true);
  });

  it("returns undefined for unknown branches", () => {
    const registry = new ComponentRegistry();
    expect(registry.getBranch("unknown")).toBeUndefined();
    expect(registry.hasBranch("unknown")).toBe(false);
  });

  it("returns undefined for unknown leaves", () => {
    const registry = new ComponentRegistry();
    expect(registry.getLeaf("unknown")).toBeUndefined();
    expect(registry.hasLeaf("unknown")).toBe(false);
  });

  it("supports fluent chaining", () => {
    const registry = new ComponentRegistry();
    registry
      .registerBranch("card", () => null)
      .registerBranch("form", () => null)
      .registerLeaf("button", () => null)
      .registerLeaf("input", () => null);

    expect(registry.hasBranch("card")).toBe(true);
    expect(registry.hasBranch("form")).toBe(true);
    expect(registry.hasLeaf("button")).toBe(true);
    expect(registry.hasLeaf("input")).toBe(true);
  });

  it("overwrites existing registrations", () => {
    const registry = new ComponentRegistry();
    const oldComponent = () => null;
    const newComponent = () => null;

    registry.registerLeaf("button", oldComponent);
    registry.registerLeaf("button", newComponent);

    expect(registry.getLeaf("button")).toBe(newComponent);
  });

  it("maintains separate branch and leaf namespaces", () => {
    const registry = new ComponentRegistry();
    const branchComponent = () => null;
    const leafComponent = () => null;

    registry.registerBranch("button", branchComponent);
    registry.registerLeaf("button", leafComponent);

    expect(registry.getBranch("button")).toBe(branchComponent);
    expect(registry.getLeaf("button")).toBe(leafComponent);
  });
});
