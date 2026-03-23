import type { SubmitEventHandler } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog } from "@/components/singleton/dialog";
import type { IFormComponent } from "@/models/interfaces/component";

type FormProps = React.FormHTMLAttributes<HTMLFormElement> &
  Pick<IFormComponent, "id" | "action" | "method" | "title">;

export const Form: React.FC<FormProps> = ({
  id,
  action,
  method = "GET",
  onSubmit,
  children,
  title,
  ...rest
}) => {
  const submitAfterConfirmRef = useRef<null | (() => Promise<void>)>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

    submitAfterConfirmRef.current = async () => {
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
        init.headers = { "Content-Type": "application/json" };
        init.body = JSON.stringify(jsonBody);
      }

      try {
        const response = await fetch(requestUrl, init);
        if (!response.ok) {
          let bodyText: string | undefined;
          try {
            bodyText = await response.text();
          } catch {
            bodyText = undefined;
          }

          toast(
            bodyText?.trim()
              ? bodyText
              : `Form not submitted (status ${response.status})`,
          );
        } else {
          toast("Form submitted successfully");
          formElement.reset();
        }
      } catch (error) {
        toast(`Form submission failed: ${String(error)}`);
      }

      onSubmit?.(event);
    };

    setDialogOpen(true);
  };

  return (
    <>
      <form
        id={id}
        action={action}
        method={method}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 flex-1"
        {...rest}
      >
        {title && <h2 className="font-bold">{title}</h2>}
        {children}
      </form>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) submitAfterConfirmRef.current = null;
          setDialogOpen(open);
        }}
        onConfirm={async () => {
          setDialogOpen(false);
          const submit = submitAfterConfirmRef.current;
          submitAfterConfirmRef.current = null;
          await submit?.();
        }}
      />
    </>
  );
};
