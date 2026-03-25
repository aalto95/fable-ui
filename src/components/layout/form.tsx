import type { SubmitEventHandler } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Dialog } from "@/components/singleton/dialog";
import type { IFormComponent } from "@/models/interfaces/component";
import { Component } from "../core/Component";

type FormProps = React.FormHTMLAttributes<HTMLFormElement> &
  Pick<
    IFormComponent,
    "path" | "method" | "fields" | "title" | "submitActions"
  >;

export const Form: React.FC<FormProps> = ({
  path,
  method = "GET",
  onSubmit,
  fields,
  title,
  submitActions,
  ...rest
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const submitAfterConfirmRef = useRef<null | (() => Promise<void>)>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [innerFields, setInnerFields] = useState(fields);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const targetAction = path ?? formElement.action;
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
        const response = await fetch(
          id ? `${requestUrl}/${id}` : requestUrl,
          init,
        );

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

  function addDefaultValues(fields: any[], data: any) {
    return fields.map((field) => {
      // Check if the field has a 'name' property and if that name exists in the data object
      if (field.name && Object.hasOwn(data, field.name)) {
        return {
          ...field,
          defaultValue: data[field.name],
        };
      }
      return field;
    });
  }

  useEffect(() => {
    if (path && id && innerFields) {
      fetch(`${path}/${id}`)
        .then((res) => res.json())
        .then((res) => {
          setInnerFields(addDefaultValues(innerFields, res));
        });
    }
  }, []);

  return (
    <>
      <form
        id={id}
        action={path}
        method={method}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 flex-1 w-full"
        {...rest}
      >
        {title && <h2 className="font-bold">{title}</h2>}
        {innerFields?.map((field) => (
          <Component key={field.id} {...field}></Component>
        ))}
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
          submitActions?.forEach((action) => {
            if (action.type === "GO_TO") {
              navigate("/");
            }
          });
        }}
      />
    </>
  );
};
