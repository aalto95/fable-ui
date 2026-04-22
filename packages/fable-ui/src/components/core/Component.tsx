import { Spinner } from "fable-shared";
import { memo, Suspense } from "react";
import { useDebug } from "@/contexts/debug";
import type { TComponentUnion } from "@/models/interfaces/component";
import type { TBranchComponent, TLeafComponent } from "@/models/types/component";
import {
  getCachedLazyBuiltinBranch,
  getCachedLazyBuiltinLeaf,
  isBuiltinBranchType,
  isBuiltinLeafType,
} from "@/registry/builtin-lazy-loaders";
import { componentRegistry } from "@/registry/component-registry";
import { DebugOutline } from "./DebugOutline";

type Props = TComponentUnion;

const DEBUG_COLORS: Record<string, { outline: string; bg: string; text: string }> = {
  h_stack: {
    outline: "outline-fuchsia-500",
    bg: "bg-fuchsia-500",
    text: "text-white",
  },
  v_stack: {
    outline: "outline-sky-500",
    bg: "bg-sky-500",
    text: "text-white",
  },
  card: {
    outline: "outline-emerald-500",
    bg: "bg-emerald-500",
    text: "text-white",
  },
  form: {
    outline: "outline-amber-500",
    bg: "bg-amber-500",
    text: "text-black",
  },
  input: {
    outline: "outline-rose-500",
    bg: "bg-rose-500",
    text: "text-white",
  },
  textarea: {
    outline: "outline-indigo-500",
    bg: "bg-indigo-500",
    text: "text-white",
  },
  select: {
    outline: "outline-lime-500",
    bg: "bg-lime-500",
    text: "text-black",
  },
  subtitle: {
    outline: "outline-zinc-500",
    bg: "bg-zinc-500",
    text: "text-white",
  },
  button: {
    outline: "outline-orange-500",
    bg: "bg-orange-500",
    text: "text-black",
  },
  title: {
    outline: "outline-violet-500",
    bg: "bg-violet-500",
    text: "text-white",
  },
  table: {
    outline: "outline-cyan-600",
    bg: "bg-cyan-600",
    text: "text-white",
  },
  accordion: {
    outline: "outline-teal-500",
    bg: "bg-teal-500",
    text: "text-white",
  },
  pagination: {
    outline: "outline-stone-500",
    bg: "bg-stone-500",
    text: "text-white",
  },
  checkbox: {
    outline: "outline-red-400",
    bg: "bg-red-400",
    text: "text-white",
  },
  datepicker: {
    outline: "outline-blue-400",
    bg: "bg-blue-400",
    text: "text-white",
  },
  slider: {
    outline: "outline-yellow-500",
    bg: "bg-yellow-500",
    text: "text-black",
  },
  markdown: {
    outline: "outline-slate-500",
    bg: "bg-slate-500",
    text: "text-white",
  },
  image: {
    outline: "outline-pink-400",
    bg: "bg-pink-400",
    text: "text-white",
  },
};

const DEFAULT_DEBUG = {
  outline: "outline-pink-500",
  bg: "bg-pink-500",
  text: "text-white",
};

/** Root uses `flex-1` and must stay the flex item that grows/shrinks in `h_stack` / `v_stack`. */
const DEBUG_FLEX_PASSTHROUGH_TYPES = new Set(["card", "form"]);

function flexPassthroughForType(type: string): boolean {
  return DEBUG_FLEX_PASSTHROUGH_TYPES.has(type);
}

function LazyFallback() {
  return (
    <div className="flex min-h-[1.5rem] items-center justify-center py-1">
      <Spinner className="size-4 text-muted-foreground" />
    </div>
  );
}

export const Component: React.FC<Props> = memo((props) => {
  const { enabled } = useDebug();
  const { type, ...rest } = props;

  const debug = DEBUG_COLORS[type] ?? DEFAULT_DEBUG;

  if (componentRegistry.hasBranch(type)) {
    const Comp = componentRegistry.getBranch(type);
    if (!Comp) {
      throw new Error(`Branch component ${type} not found`);
    }
    const children =
      type !== "form" && "descendants" in rest && Array.isArray(rest.descendants)
        ? rest.descendants.map((child, i) => <Component key={i} {...child} />)
        : null;
    const node = <Comp {...rest}>{children}</Comp>;
    return (
      <DebugOutline
        enabled={enabled}
        flexPassthrough={flexPassthroughForType(type)}
        label={type}
        palette={debug}
      >
        {node}
      </DebugOutline>
    );
  }

  if (isBuiltinBranchType(type)) {
    const LazyComp = getCachedLazyBuiltinBranch(type as TBranchComponent);
    const children =
      type !== "form" && "descendants" in rest && Array.isArray(rest.descendants)
        ? rest.descendants.map((child, i) => <Component key={i} {...child} />)
        : null;
    const node = (
      <Suspense fallback={<LazyFallback />}>
        <LazyComp {...rest}>{children}</LazyComp>
      </Suspense>
    );
    return (
      <DebugOutline
        enabled={enabled}
        flexPassthrough={flexPassthroughForType(type)}
        label={type}
        palette={debug}
      >
        {node}
      </DebugOutline>
    );
  }

  if (componentRegistry.hasLeaf(type)) {
    const Comp = componentRegistry.getLeaf(type);
    if (!Comp) {
      throw new Error(`Leaf component ${type} not found`);
    }
    const node = <Comp {...rest} />;
    return (
      <DebugOutline
        enabled={enabled}
        flexPassthrough={flexPassthroughForType(type)}
        label={type}
        palette={debug}
      >
        {node}
      </DebugOutline>
    );
  }

  if (isBuiltinLeafType(type)) {
    const LazyComp = getCachedLazyBuiltinLeaf(type as TLeafComponent);
    const node = (
      <Suspense fallback={<LazyFallback />}>
        <LazyComp {...rest} />
      </Suspense>
    );
    return (
      <DebugOutline
        enabled={enabled}
        flexPassthrough={flexPassthroughForType(type)}
        label={type}
        palette={debug}
      >
        {node}
      </DebugOutline>
    );
  }

  return null;
});
