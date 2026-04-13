import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Sonner toaster themed for fable-ui CSS variables. Defaults to `theme="system"` (no theme provider required).
 */
export const SduiToaster: React.FC<ToasterProps> = ({
  toastOptions,
  theme = "system",
  className,
  icons,
  style,
  ...rest
}) => {
  return (
    <Sonner
      theme={theme}
      className={className ?? "toaster group"}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
        ...icons,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          ...style,
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: "cn-toast",
          ...toastOptions?.classNames,
        },
      }}
      {...rest}
    />
  );
};
