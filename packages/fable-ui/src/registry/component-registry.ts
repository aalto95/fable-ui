import type { ElementType } from "react";

export type RegisteredComponent = ElementType;

/**
 * Pluggable registry for Fable UI component kinds. Branch components receive
 * recursive `descendants` as `children` (except the built-in `form` branch, which
 * renders `descendants` internally for prefill). Leaf components render props only.
 */
export class ComponentRegistry {
  readonly branches = new Map<string, RegisteredComponent>();
  readonly leaves = new Map<string, RegisteredComponent>();

  registerBranch(name: string, component: RegisteredComponent): this {
    this.branches.set(name, component);
    return this;
  }

  registerLeaf(name: string, component: RegisteredComponent): this {
    this.leaves.set(name, component);
    return this;
  }

  getBranch(name: string): RegisteredComponent | undefined {
    return this.branches.get(name);
  }

  getLeaf(name: string): RegisteredComponent | undefined {
    return this.leaves.get(name);
  }

  hasBranch(name: string): boolean {
    return this.branches.has(name);
  }

  hasLeaf(name: string): boolean {
    return this.leaves.has(name);
  }
}

export const componentRegistry = new ComponentRegistry();
