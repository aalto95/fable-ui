import type { SubmitEventHandler } from "react";
import type React from "react";
import { toast } from "sonner";

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  action?: string;
  method?: string;
};

export const Form: React.FC<FormProps> = ({
  action,
  method = "GET",
  onSubmit,
  children,
  ...rest
}) => {
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const targetAction = action ?? formElement.action;
    const targetMethod = (method ?? formElement.method ?? "GET").toUpperCase();

    // Convert FormData to plain object
    const jsonBody: Record<string, any> = {};
    formData.forEach((value, key) => {
      // If multiple fields have the same name, you could handle arrays here
      jsonBody[key] = value;
    });

    const requiredNodes = Array.from(
      formElement.querySelectorAll<HTMLElement>(
        "[data-bdui-required='true'], [required]",
      ),
    );

    const missingRequired = requiredNodes
      .map((node) => {
        const nameAttr =
          (node as HTMLInputElement).name ??
          node.getAttribute("name") ??
          node.getAttribute("data-name") ??
          undefined;

        if (!nameAttr) return null;

        const value = formData.get(nameAttr);
        const isMissing =
          value === null ||
          (typeof value === "string" && value.trim().length === 0);

        if (!isMissing) return null;

        const label =
          node.getAttribute("data-bdui-label") ??
          (node as HTMLInputElement).placeholder ??
          node.getAttribute("aria-label") ??
          nameAttr;

        return { name: nameAttr, label, node };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (missingRequired.length > 0) {
      toast(
        `Please fill required fields: ${missingRequired
          .map((x) => x.label)
          .join(", ")}`,
      );

      const first = missingRequired[0]?.node as HTMLElement | undefined;
      first?.focus?.();
      return;
    }

    let requestUrl = targetAction;
    const init: RequestInit = {
      method: targetMethod,
      headers: {},
    };

    if (targetMethod === "GET") {
      const params = new URLSearchParams(
        jsonBody as Record<string, string>,
      ).toString();
      if (params) {
        requestUrl = targetAction.includes("?")
          ? `${targetAction}&${params}`
          : `${targetAction}?${params}`;
      }
    } else {
      // Send JSON for non-GET methods
      init.headers = { "Content-Type": "application/json" };
      init.body = JSON.stringify(jsonBody);
    }

    try {
      const response = await fetch(requestUrl, init);
      if (!response.ok) {
        toast("Form not submitted");
      } else {
        toast("Form submitted successfully");
        formElement.reset();
      }
    } catch (error) {
      toast("Form submission failed:" + error);
    }

    onSubmit?.(event);
  };

  return (
    <form
      action={action}
      method={method}
      onSubmit={handleSubmit}
      {...rest}
      className="flex flex-col gap-2"
    >
      {children}
    </form>
  );
};
