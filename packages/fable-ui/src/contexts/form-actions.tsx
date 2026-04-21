import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type FormActionsContextValue = {
  formRef: React.RefObject<HTMLFormElement | null>;
  isHttpActionPending: boolean;
  beginHttpAction: () => void;
  endHttpAction: () => void;
};

const FormActionsContext = createContext<FormActionsContextValue | null>(null);

export const FormActionsProvider: React.FC<
  React.PropsWithChildren<{ formRef: React.RefObject<HTMLFormElement | null> }>
> = ({ formRef, children }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const beginHttpAction = useCallback(() => {
    setPendingCount((c) => c + 1);
  }, []);
  const endHttpAction = useCallback(() => {
    setPendingCount((c) => Math.max(0, c - 1));
  }, []);

  const value = useMemo(
    () => ({
      formRef,
      isHttpActionPending: pendingCount > 0,
      beginHttpAction,
      endHttpAction,
    }),
    [formRef, pendingCount, beginHttpAction, endHttpAction],
  );

  return <FormActionsContext.Provider value={value}>{children}</FormActionsContext.Provider>;
};

export function useFormActionsContext(): FormActionsContextValue | null {
  return useContext(FormActionsContext);
}
