import { createContext, useContext } from "react";

export type DialogConfig = {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  isPending?: boolean;
  hideCancel?: boolean;
  onConfirm?: () => void | Promise<void>;
} | null;

export type DialogContextValue = {
  config: DialogConfig;
  setConfig: (config: DialogConfig) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export const DialogProvider: React.FC<React.PropsWithChildren<DialogContextValue>> = ({
  children,
  config,
  setConfig,
}) => {
  return <DialogContext.Provider value={{ config, setConfig }}>{children}</DialogContext.Provider>;
};

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within DialogProvider");
  }
  return ctx;
}
