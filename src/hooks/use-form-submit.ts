import type { SubmitEventHandler } from "react";
import { useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import type { DialogConfig } from "@/contexts/dialog";
import { useDialog } from "@/contexts/dialog";
import {
  buildGetUrl,
  formDataToJson,
  validateRequired,
} from "@/lib/form-utils";
import type { IAction } from "@/models/interfaces/component";

type UseFormSubmitArgs = {
  enabled?: boolean;
  method?: string;
  path?: string;
  onSubmit?: SubmitEventHandler<HTMLFormElement>;
  submitActions?: IAction[];
};

export function useFormSubmit({
  enabled = true,
  method = "GET",
  path,
  onSubmit,
  submitActions,
}: UseFormSubmitArgs) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setConfig } = useDialog();
  const submitRef = useRef<null | (() => Promise<void>)>(null);

  const handleSubmit = useCallback<SubmitEventHandler<HTMLFormElement>>(
    (event) => {
      if (!enabled) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      const form = event.currentTarget;
      const formData = new FormData(form);

      const missing = validateRequired(form, formData);

      if (missing.length) {
        toast(`Fill required: ${missing.map((m) => m.label).join(", ")}`);
        missing[0].node?.focus();
        return;
      }

      const json = formDataToJson(formData, form);

      const targetMethod = method.toUpperCase();
      const baseUrl = path ?? form.action;

      submitRef.current = async () => {
        let url = baseUrl;
        const init: RequestInit = { method: targetMethod };

        if (targetMethod === "GET") {
          url = buildGetUrl(baseUrl, json);
        } else {
          init.headers = { "Content-Type": "application/json" };
          init.body = JSON.stringify(json);
        }

        try {
          const res = await fetch(id ? `${url}/${id}` : url, init);

          if (!res.ok) {
            const text = await res.text().catch(() => "");
            toast(text || `Error ${res.status}`);
            return;
          }

          toast("Success");
          form.reset();

          submitActions?.forEach((a) => {
            if (a.type === "GO_TO") navigate(a.path);
          });
        } catch (e) {
          toast(`Failed: ${String(e)}`);
        }

        onSubmit?.(event);
      };

      const configTexts: Partial<Exclude<DialogConfig, null>> = {
        title: "Save this form?",
        description: "An HTTP query will be performed.",
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
          await submitRef.current?.();
          submitRef.current = null;
          setConfig(null);
        },
      });
    },
    [enabled, method, path, onSubmit, submitActions, navigate, id, setConfig],
  );

  return handleSubmit;
}
