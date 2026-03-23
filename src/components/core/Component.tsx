import { memo, type PropsWithChildren } from "react";
import { COMPONENTS_MAP } from "@/consts/components-map";
import { useDebug } from "@/contexts/debug";

import type {
  ICardComponent,
  TComponentsWithDescendants,
  TComponentUnion,
} from "@/models/interfaces/component";

type ComponentProps = PropsWithChildren<TComponentUnion>;

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

function getDebugLayoutClass(): string {
  return "w-full";
}

export const Component: React.FC<ComponentProps> = (props) => {
  const { enabled: debugEnabled } = useDebug();
  const { type, children, ...rest } = props;
  const MyComponent = COMPONENTS_MAP[type];

  if (!MyComponent) {
    console.warn(`Unsupported component type: "${type}"`);
    return null;
  }

  const debug = DEBUG_COLORS[type] ?? {
    border: "border-pink-500",
    bg: "bg-pink-500",
    text: "text-white",
  };

  const wrap = (node: React.ReactNode) => {
    if (!debugEnabled) return node;

    return (
      <div
        className={[
          "relative rounded-md border-2 border-dashed p-2",
          debug.border,
          getDebugLayoutClass(),
        ].join(" ")}
      >
        <div
          className={[
            "pointer-events-none absolute left-0 top-0 -translate-y-1/2 translate-x-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wide shadow",
            debug.bg,
            debug.text,
          ].join(" ")}
        >
          {type}
        </div>
        {node}
      </div>
    );
  };

  const ComponentWithDescendants = () => {
    const { descendants } = rest as ICardComponent;
    const hasDescendants = Array.isArray(descendants) && descendants.length > 0;

    return wrap(
      <MyComponent {...rest}>
        {hasDescendants &&
          descendants.map((child) => <Component key={child.id} {...child} />)}
      </MyComponent>,
    );
  };

  const ComponentWithoutDescendants = () => {
    return wrap(<MyComponent {...rest}></MyComponent>);
  };

  switch (type) {
    case "h_stack": {
      return ComponentWithDescendants();
    }
    case "v_stack": {
      return ComponentWithDescendants();
    }
    case "form": {
      return ComponentWithDescendants();
    }
    case "card": {
      return ComponentWithDescendants();
    }
    default: {
      return ComponentWithoutDescendants();
    }
  }
};
