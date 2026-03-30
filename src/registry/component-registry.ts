import type { ElementType } from "react";

export type RegisteredComponent = ElementType;

/**
 * Pluggable registry for SDUI component kinds. Layout components receive
 * recursive `descendants`; leaf components render props only.
 */
export class ComponentRegistry {
  readonly layouts = new Map<string, RegisteredComponent>();
  readonly leaves = new Map<string, RegisteredComponent>();

  registerLayout(name: string, component: RegisteredComponent): this {
    this.layouts.set(name, component);
    return this;
  }

  registerLeaf(name: string, component: RegisteredComponent): this {
    this.leaves.set(name, component);
    return this;
  }

  getLayout(name: string): RegisteredComponent | undefined {
    return this.layouts.get(name);
  }

  getLeaf(name: string): RegisteredComponent | undefined {
    return this.leaves.get(name);
  }

  hasLayout(name: string): boolean {
    return this.layouts.has(name);
  }

  hasLeaf(name: string): boolean {
    return this.leaves.has(name);
  }
}

export const componentRegistry = new ComponentRegistry();
