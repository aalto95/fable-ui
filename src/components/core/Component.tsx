import { memo } from "react";
import { useDebug } from "@/contexts/debug";
import type { TComponentUnion } from "@/models/interfaces/component";
import type {
  TLayoutComponent,
  TLeafComponent,
} from "@/models/types/component";
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
  button: {
    border: "border-orange-500",
    bg: "bg-orange-500",
    text: "text-black",
  },
};

const DEFAULT_DEBUG = {
  border: "border-pink-500",
  bg: "bg-pink-500",
  text: "text-white",
};

function isLayout(type: string): type is TLayoutComponent {
  return componentRegistry.hasLayout(type);
}

function isLeaf(type: string): type is TLeafComponent {
  return componentRegistry.hasLeaf(type);
}

export const Component: React.FC<Props> = memo((props) => {
  const { enabled } = useDebug();
  const { type, ...rest } = props;

  const debug = DEBUG_COLORS[type] ?? DEFAULT_DEBUG;

  if (isLayout(type)) {
    const Comp = componentRegistry.getLayout(type)!;

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

  if (isLeaf(type)) {
    const Comp = componentRegistry.getLeaf(type)!;
    const node = <Comp {...rest} />;

    return (
      <DebugOutline enabled={enabled} label={type} palette={debug}>
        {node}
      </DebugOutline>
    );
  }

  return null;
});
