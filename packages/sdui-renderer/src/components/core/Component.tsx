import { memo, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useDebug } from "@/contexts/debug";
import type { TComponentUnion } from "@/models/interfaces/component";
import type {
  TLayoutComponent,
  TLeafComponent,
} from "@/models/types/component";
import {
  getCachedLazyBuiltinLayout,
  getCachedLazyBuiltinLeaf,
  isBuiltinLayoutType,
  isBuiltinLeafType,
} from "@/registry/builtin-lazy-loaders";
import { componentRegistry } from "@/registry/component-registry";
import { DebugOutline } from "./DebugOutline";

type Props = TComponentUnion;

const DEBUG_COLORS: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  h_stack: {
    border: "border-fuchsia-500",
    bg: "bg-fuchsia-500",
    text: "text-white",
  },
  v_stack: { border: "border-sky-500", bg: "bg-sky-500", text: "text-white" },
  card: {
    border: "border-emerald-500",
    bg: "bg-emerald-500",
    text: "text-white",
  },
  form: { border: "border-amber-500", bg: "bg-amber-500", text: "text-black" },
  input: { border: "border-rose-500", bg: "bg-rose-500", text: "text-white" },
  textarea: {
    border: "border-indigo-500",
    bg: "bg-indigo-500",
    text: "text-white",
  },
  select: { border: "border-lime-500", bg: "bg-lime-500", text: "text-black" },
  subtitle: {
    border: "border-zinc-500",
    bg: "bg-zinc-500",
    text: "text-white",
  },
  button: {
    border: "border-orange-500",
    bg: "bg-orange-500",
    text: "text-black",
  },
  title: {
    border: "border-violet-500",
    bg: "bg-violet-500",
    text: "text-white",
  },
  table: {
    border: "border-cyan-600",
    bg: "bg-cyan-600",
    text: "text-white",
  },
  accordion: {
    border: "border-teal-500",
    bg: "bg-teal-500",
    text: "text-white",
  },
  pagination: {
    border: "border-stone-500",
    bg: "bg-stone-500",
    text: "text-white",
  },
  checkbox: {
    border: "border-red-400",
    bg: "bg-red-400",
    text: "text-white",
  },
  datepicker: {
    border: "border-blue-400",
    bg: "bg-blue-400",
    text: "text-white",
  },
  slider: {
    border: "border-yellow-500",
    bg: "bg-yellow-500",
    text: "text-black",
  },
};

const DEFAULT_DEBUG = {
  border: "border-pink-500",
  bg: "bg-pink-500",
  text: "text-white",
};

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

  if (componentRegistry.hasLayout(type)) {
    const Comp = componentRegistry.getLayout(type);
    if (!Comp) {
      throw new Error(`Layout component ${type} not found`);
    }
    const children =
      "descendants" in rest && Array.isArray(rest.descendants)
        ? rest.descendants.map((child, i) => <Component key={i} {...child} />)
        : null;
    const node = <Comp {...rest}>{children}</Comp>;
    return (
      <DebugOutline enabled={enabled} label={type} palette={debug}>
        {node}
      </DebugOutline>
    );
  }

  if (isBuiltinLayoutType(type)) {
    const LazyComp = getCachedLazyBuiltinLayout(type as TLayoutComponent);
    const children =
      "descendants" in rest && Array.isArray(rest.descendants)
        ? rest.descendants.map((child, i) => <Component key={i} {...child} />)
        : null;
    const node = (
      <Suspense fallback={<LazyFallback />}>
        <LazyComp {...rest}>{children}</LazyComp>
      </Suspense>
    );
    return (
      <DebugOutline enabled={enabled} label={type} palette={debug}>
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
      <DebugOutline enabled={enabled} label={type} palette={debug}>
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
      <DebugOutline enabled={enabled} label={type} palette={debug}>
        {node}
      </DebugOutline>
    );
  }

  return null;
});
