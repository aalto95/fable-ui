import { useCallback } from "react";
import type { MouseEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { type DialogConfig, useDialog } from "@/contexts/dialog";
import { useFormActionsContext } from "@/contexts/form-actions";
import { validateRequired } from "@/lib/form-utils";
import { executeAction } from "@/lib/http-actions";
import type { IAction } from "@/models/interfaces/component";

function isNavigationOnly(actions: IAction[]): boolean {
  return actions.every((a) => a.type === "GO_TO" || a.type === "HIDE");
}

function requiresForm(actions: IAction[]): boolean {
  return actions.some(
    (a) =>
      a.type === "HTTP_GET" ||
      a.type === "HTTP_POST" ||
      a.type === "HTTP_PUT" ||
      a.type === "HTTP_PATCH",
  );
}

function requiresFieldValidation(actions: IAction[]): boolean {
  return actions.some(
    (a) =>
      a.type === "HTTP_GET" ||
      a.type === "HTTP_POST" ||
      a.type === "HTTP_PUT" ||
      a.type === "HTTP_PATCH",
  );
}

export function useFormButtonActions(actions?: IAction[]) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setConfig } = useDialog();
  const ctx = useFormActionsContext();

  return useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!actions?.length) return;

      event.preventDefault();
      event.stopPropagation();

      const form = ctx?.formRef.current ?? undefined;

      const runActions = async () => {
        for (const action of actions) {
          await executeAction(action, {
            form,
            id,
            navigate: (to) => navigate(to),
          });
        }
        if (!isNavigationOnly(actions)) {
          toast.success("Done");
        }
      };

      if (isNavigationOnly(actions)) {
        void runActions().catch((e) => {
          toast.error(String(e));
        });
        return;
      }

      if (requiresForm(actions) && !form) {
        toast("Form context missing");
        return;
      }

      if (requiresFieldValidation(actions) && form) {
        const formData = new FormData(form);
        const missing = validateRequired(form, formData);
        if (missing.length) {
          toast(`Fill required: ${missing.map((m) => m.label).join(", ")}`);
          missing[0].node?.focus();
          return;
        }
      }

      const configTexts: Partial<Exclude<DialogConfig, null>> = {
        title: "Confirm action",
        description: "An HTTP request will be performed.",
        cancelText: "No",
        confirmText: "Yes",
      };

      setConfig({
        ...configTexts,
        onConfirm: async () => {
          setConfig({
            ...configTexts,
            isPending: true,
          });
          try {
            await runActions();
          } catch (e) {
            toast.error(String(e));
          } finally {
            setConfig(null);
          }
        },
      });
    },
    [actions, ctx, id, navigate, setConfig],
  );
}
