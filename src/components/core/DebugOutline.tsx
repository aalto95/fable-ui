import { cn } from "@/lib/utils";

export type DebugPalette = {
  border: string;
  bg: string;
  text: string;
};

type DebugOutlineProps = {
  enabled: boolean;
  label: string;
  palette: DebugPalette;
  children: React.ReactNode;
};

export function DebugOutline({
  enabled,
  label,
  palette,
  children,
}: DebugOutlineProps) {
  return (
    <div
      className={cn(
        enabled
          ? "relative rounded-md border-2 border-dashed p-2 w-full max-w-7xl"
          : "contents",
        enabled && palette.border,
      )}
    >
      {enabled && (
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 -translate-y-1/2 translate-x-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wide shadow",
            palette.bg,
            palette.text,
          )}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
