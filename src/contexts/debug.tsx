import type React from "react";
import { createContext, useContext } from "react";

export type DebugContextValue = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

const DebugContext = createContext<DebugContextValue | null>(null);

export const DebugProvider: React.FC<
  React.PropsWithChildren<DebugContextValue>
> = ({ enabled, setEnabled, children }) => {
  return (
    <DebugContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </DebugContext.Provider>
  );
};

export function useDebug(): DebugContextValue {
  const ctx = useContext(DebugContext);
  if (!ctx) {
    throw new Error("useDebug must be used within DebugProvider");
  }
  return ctx;
}

