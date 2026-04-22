import { useEffect, useState } from "react";
import type { ToasterProps } from "sonner";
import { DebugProvider } from "@/contexts/debug";
import { type DialogConfig, DialogProvider } from "@/contexts/dialog";
import { SduiDialog } from "./SduiDialog";
import { SduiToaster } from "./SduiToaster";

function readDebugFromStorage(): boolean {
  try {
    if (typeof localStorage === "undefined") return false;
    return localStorage.getItem("fableUi.debug.enabled") === "true";
  } catch {
    return false;
  }
}

export type SduiProviderProps = {
  children: React.ReactNode;
  /** Props for the bundled Sonner `<Toaster />` (e.g. `position`, `closeButton`). */
  toasterProps?: ToasterProps;
  /**
   * Controlled debug outlines (`useDebug` in tree). When omitted, toggling is stored under
   * `fableUi.debug.enabled` in localStorage.
   */
  debug?: {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
  };
};

/**
 * Wraps schema-driven UI with dialog context, debug outlines, a default confirm dialog shell, and Sonner toasts.
 * Use with `Renderer`; branch actions that call `toast()` or `useDialog()` work without extra wiring.
 */
export const SduiProvider: React.FC<SduiProviderProps> = ({
  children,
  toasterProps,
  debug: debugControlled,
}) => {
  const [internalDebug, setInternalDebug] = useState(readDebugFromStorage);
  useEffect(() => {
    if (debugControlled) return;
    localStorage.setItem("fableUi.debug.enabled", String(internalDebug));
  }, [debugControlled, internalDebug]);

  const debugEnabled = debugControlled?.enabled ?? internalDebug;
  const setDebugEnabled = debugControlled?.setEnabled ?? setInternalDebug;

  const [dialogConfig, setDialogConfig] = useState<DialogConfig>(null);
  return (
    <DialogProvider config={dialogConfig} setConfig={setDialogConfig}>
      <DebugProvider enabled={debugEnabled} setEnabled={setDebugEnabled}>
        {children}
        <SduiDialog />
        <SduiToaster {...toasterProps} />
      </DebugProvider>
    </DialogProvider>
  );
};
