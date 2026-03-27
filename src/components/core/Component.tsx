import {
  Accordion,
  Button,
  Card,
  Checkbox,
  Datepicker,
  Form,
  HorizontalStack,
  Input,
  Pagination,
  Select,
  type TAccordionProps,
  Table,
  type TButtonProps,
  type TCardProps,
  type TCheckboxProps,
  type TDatepickerProps,
  Textarea,
  type TFormProps,
  type THorizontalStackProps,
  type TInputProps,
  type TPaginationProps,
  type TSelectProps,
  type TTableProps,
  type TTextareaProps,
  type TVerticalStackProps,
  VerticalStack,
} from "@/components/layout";
import { useDebug } from "@/contexts/debug";
import type { TComponentUnion } from "@/models/interfaces/component";

type ComponentProps = TComponentUnion;

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
  return "w-full max-w-7xl";
}

export const Component: React.FC<ComponentProps> = (props) => {
  const { enabled: debugEnabled } = useDebug();
  const { type, ...rest } = props;

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

  const DynamicComponent = () => {
    const descendants = rest as TComponentUnion[];

    if (descendants?.length) {
      switch (type) {
        case "card":
          return wrap(
            <Card {...(rest as TCardProps)}>
              {descendants.map((child, i) => (
                <Component key={i} {...child} />
              ))}
            </Card>,
          );
        case "h_stack":
          return wrap(
            <HorizontalStack {...(rest as THorizontalStackProps)}>
              {descendants.map((child, i) => (
                <Component key={i} {...child} />
              ))}
            </HorizontalStack>,
          );
        case "v_stack":
          return wrap(
            <VerticalStack {...(rest as TVerticalStackProps)}>
              {descendants.map((child, i) => (
                <Component key={i} {...child} />
              ))}
            </VerticalStack>,
          );
      }
    } else {
      switch (type) {
        case "accordion":
          return wrap(<Accordion {...(rest as TAccordionProps)} />);
        case "button":
          return wrap(<Button {...(rest as TButtonProps)} />);
        case "checkbox":
          return wrap(<Checkbox {...(rest as TCheckboxProps)} />);
        case "datepicker":
          return wrap(<Datepicker {...(rest as TDatepickerProps)} />);
        case "form":
          return wrap(<Form {...(rest as TFormProps)} />);
        case "input":
          return wrap(<Input {...(rest as TInputProps)} />);
        case "pagination":
          return wrap(<Pagination {...(rest as TPaginationProps)} />);
        case "select":
          return wrap(<Select {...(rest as TSelectProps)} />);
        case "table":
          return wrap(<Table {...(rest as TTableProps)} />);
        case "textarea":
          return wrap(<Textarea {...(rest as TTextareaProps)} />);
      }
    }
  };

  return DynamicComponent();
};
