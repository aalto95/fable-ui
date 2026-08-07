import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";
import type { TBranchComponent, TLeafComponent } from "@/models/types/component";

/** Built-in components accept only optional, config-driven props. */
type AnyComponent = ComponentType<Record<string, never>>;

type BuiltinLoader = () => Promise<{ default: AnyComponent }>;

const BUILTIN_BRANCH_LOADERS = {
  card: () => import("@/components/branch/Card").then((m) => ({ default: m.Card })),
  form: () => import("@/components/branch/Form").then((m) => ({ default: m.Form })),
  h_stack: () =>
    import("@/components/branch/HorizontalStack").then((m) => ({
      default: m.HorizontalStack,
    })),
  v_stack: () =>
    import("@/components/branch/VerticalStack").then((m) => ({
      default: m.VerticalStack,
    })),
} as const satisfies Record<TBranchComponent, BuiltinLoader>;

const BUILTIN_LEAF_LOADERS = {
  accordion: () =>
    import("@/components/leaf/Accordion").then((m) => ({
      default: m.Accordion,
    })),
  button: () => import("@/components/leaf/Button").then((m) => ({ default: m.Button })),
  checkbox: () =>
    import("@/components/leaf/Checkbox").then((m) => ({
      default: m.Checkbox,
    })),
  datepicker: () =>
    import("@/components/leaf/Datepicker").then((m) => ({
      default: m.Datepicker,
    })),
  image: () => import("@/components/leaf/Image").then((m) => ({ default: m.Image })),
  input: () => import("@/components/leaf/Input").then((m) => ({ default: m.Input })),
  pagination: () =>
    import("@/components/leaf/Pagination").then((m) => ({
      default: m.Pagination,
    })),
  select: () => import("@/components/leaf/Select").then((m) => ({ default: m.Select })),
  slider: () => import("@/components/leaf/Slider").then((m) => ({ default: m.Slider })),
  subtitle: () =>
    import("@/components/leaf/Subtitle").then((m) => ({
      default: m.Subtitle,
    })),
  table: () => import("@/components/leaf/Table").then((m) => ({ default: m.Table })),
  textarea: () =>
    import("@/components/leaf/Textarea").then((m) => ({
      default: m.Textarea,
    })),
  title: () => import("@/components/leaf/Title").then((m) => ({ default: m.Title })),
  markdown: () =>
    import("@/components/leaf/Markdown").then((m) => ({
      default: m.Markdown,
    })),
} as const satisfies Record<TLeafComponent, BuiltinLoader>;

const branchLazyCache = new Map<TBranchComponent, LazyExoticComponent<AnyComponent>>();
const leafLazyCache = new Map<TLeafComponent, LazyExoticComponent<AnyComponent>>();

export function isBuiltinBranchType(type: string): type is TBranchComponent {
  return type in BUILTIN_BRANCH_LOADERS;
}

export function isBuiltinLeafType(type: string): type is TLeafComponent {
  return type in BUILTIN_LEAF_LOADERS;
}

export function getCachedLazyBuiltinBranch(
  type: TBranchComponent,
): LazyExoticComponent<AnyComponent> {
  let cached = branchLazyCache.get(type);
  if (!cached) {
    cached = lazy(BUILTIN_BRANCH_LOADERS[type]);
    branchLazyCache.set(type, cached);
  }
  return cached;
}

export function getCachedLazyBuiltinLeaf(type: TLeafComponent): LazyExoticComponent<AnyComponent> {
  let cached = leafLazyCache.get(type);
  if (!cached) {
    cached = lazy(BUILTIN_LEAF_LOADERS[type]);
    leafLazyCache.set(type, cached);
  }
  return cached;
}

/** Fire-and-forget fetch of a built-in chunk (e.g. on route hover or schema peek). */
export function preloadBuiltinComponent(type: string): void {
  if (isBuiltinBranchType(type)) {
    void BUILTIN_BRANCH_LOADERS[type]();
    return;
  }
  if (isBuiltinLeafType(type)) {
    void BUILTIN_LEAF_LOADERS[type]();
  }
}
