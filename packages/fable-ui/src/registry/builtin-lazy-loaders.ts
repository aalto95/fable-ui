import type { ComponentType } from "react";
import { type LazyExoticComponent, lazy } from "react";
import type { TLayoutComponent, TLeafComponent } from "@/models/types/component";

type BuiltinLoader = () => Promise<{ default: ComponentType<any> }>;

const BUILTIN_LAYOUT_LOADERS = {
  card: () => import("@/components/layout/Card").then((m) => ({ default: m.Card })),
  form: () => import("@/components/layout/Form").then((m) => ({ default: m.Form })),
  h_stack: () =>
    import("@/components/layout/HorizontalStack").then((m) => ({
      default: m.HorizontalStack,
    })),
  v_stack: () =>
    import("@/components/layout/VerticalStack").then((m) => ({
      default: m.VerticalStack,
    })),
} as const satisfies Record<TLayoutComponent, BuiltinLoader>;

const BUILTIN_LEAF_LOADERS = {
  accordion: () =>
    import("@/components/layout/Accordion").then((m) => ({
      default: m.Accordion,
    })),
  button: () => import("@/components/layout/Button").then((m) => ({ default: m.Button })),
  checkbox: () =>
    import("@/components/layout/Checkbox").then((m) => ({
      default: m.Checkbox,
    })),
  datepicker: () =>
    import("@/components/layout/Datepicker").then((m) => ({
      default: m.Datepicker,
    })),
  image: () => import("@/components/layout/Image").then((m) => ({ default: m.Image })),
  input: () => import("@/components/layout/Input").then((m) => ({ default: m.Input })),
  pagination: () =>
    import("@/components/layout/Pagination").then((m) => ({
      default: m.Pagination,
    })),
  select: () => import("@/components/layout/Select").then((m) => ({ default: m.Select })),
  slider: () => import("@/components/layout/Slider").then((m) => ({ default: m.Slider })),
  subtitle: () =>
    import("@/components/layout/Subtitle").then((m) => ({
      default: m.Subtitle,
    })),
  table: () => import("@/components/layout/Table").then((m) => ({ default: m.Table })),
  textarea: () =>
    import("@/components/layout/Textarea").then((m) => ({
      default: m.Textarea,
    })),
  title: () => import("@/components/layout/Title").then((m) => ({ default: m.Title })),
  markdown: () =>
    import("@/components/layout/Markdown").then((m) => ({
      default: m.Markdown,
    })),
} as const satisfies Record<TLeafComponent, BuiltinLoader>;

const layoutLazyCache = new Map<TLayoutComponent, LazyExoticComponent<ComponentType<any>>>();
const leafLazyCache = new Map<TLeafComponent, LazyExoticComponent<ComponentType<any>>>();

export function isBuiltinLayoutType(type: string): type is TLayoutComponent {
  return type in BUILTIN_LAYOUT_LOADERS;
}

export function isBuiltinLeafType(type: string): type is TLeafComponent {
  return type in BUILTIN_LEAF_LOADERS;
}

export function getCachedLazyBuiltinLayout(
  type: TLayoutComponent,
): LazyExoticComponent<ComponentType<any>> {
  let cached = layoutLazyCache.get(type);
  if (!cached) {
    cached = lazy(BUILTIN_LAYOUT_LOADERS[type]);
    layoutLazyCache.set(type, cached);
  }
  return cached;
}

export function getCachedLazyBuiltinLeaf(
  type: TLeafComponent,
): LazyExoticComponent<ComponentType<any>> {
  let cached = leafLazyCache.get(type);
  if (!cached) {
    cached = lazy(BUILTIN_LEAF_LOADERS[type]);
    leafLazyCache.set(type, cached);
  }
  return cached;
}

/** Fire-and-forget fetch of a built-in chunk (e.g. on route hover or schema peek). */
export function preloadBuiltinComponent(type: string): void {
  if (isBuiltinLayoutType(type)) {
    void BUILTIN_LAYOUT_LOADERS[type]();
    return;
  }
  if (isBuiltinLeafType(type)) {
    void BUILTIN_LEAF_LOADERS[type]();
  }
}
