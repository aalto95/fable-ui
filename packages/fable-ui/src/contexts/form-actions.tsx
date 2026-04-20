import { createContext, useContext } from "react";

export type FormActionsContextValue = {
  formRef: React.RefObject<HTMLFormElement | null>;
};

const FormActionsContext = createContext<FormActionsContextValue | null>(null);

export const FormActionsProvider: React.FC<React.PropsWithChildren<FormActionsContextValue>> = ({
  formRef,
  children,
}) => {
  return <FormActionsContext.Provider value={{ formRef }}>{children}</FormActionsContext.Provider>;
};

export function useFormActionsContext(): FormActionsContextValue | null {
  return useContext(FormActionsContext);
}
