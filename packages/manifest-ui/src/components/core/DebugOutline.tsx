import { cn } from "@/lib/utils";

export type DebugPalette = {
  /** Tailwind outline color, e.g. `outline-fuchsia-500` (outline does not change layout). */
  outline: string;
  bg: string;
  text: string;
};

type DebugOutlineProps = {
  enabled: boolean;
  label: string;
  palette: DebugPalette;
  children: React.ReactNode;
  /**
   * When the child uses `flex-1` to share space in a row/column (e.g. Card, Form),
   * the wrapper must participate in the same flex contract or the child stops
   * growing on the parent main axis.
   */
  flexPassthrough?: boolean;
};

export function DebugOutline({
  enabled,
  label,
  palette,
  children,
  flexPassthrough = false,
}: DebugOutlineProps) {
  if (!enabled) {
    return children;
  }

  return (
    <div
      className={cn(
        "group/manifest-ui-debug relative z-0 box-border flex min-h-0 max-w-full flex-col self-stretch rounded-md p-1.5 outline outline-2 -outline-offset-1 outline-dashed group-hover/manifest-ui-debug:z-[100]",
        flexPassthrough && "min-w-0 flex-1",
        palette.outline,
      )}
    >
      <div
        className={cn(
          "pointer-events-auto mb-1 shrink-0 cursor-default self-start rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide shadow",
          palette.bg,
          palette.text,
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "flex min-h-0 w-full min-w-0 flex-col",
          flexPassthrough && "flex-1",
        )}
      >
        {children}
      </div>
    </div>
  );
}
