import type { SubmitEventHandler } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { Component } from "@/components/core/Component";
import { Dialog } from "@/components/singleton/dialog";
import type { IFormComponent } from "@/models/interfaces/component";

type FormProps = React.FormHTMLAttributes<HTMLFormElement> &
  Pick<
    IFormComponent,
    "path" | "method" | "fields" | "title" | "submitActions"
  >;

/* -------------------- utils -------------------- */

function dateOnlyToISO(value: string) {
  return value ? new Date(value + "T00:00:00").toISOString() : value;
}

function formDataToJson(formData: FormData, form: HTMLFormElement) {
  const json: Record<string, any> = {};

  formData.forEach((value, key) => {
    const input = form.elements.namedItem(key) as HTMLInputElement | null;

    if (input?.type === "date" && typeof value === "string") {
      json[key] = dateOnlyToISO(value);
    } else {
      json[key] = value;
    }
  });

  return json;
}

function buildGetUrl(base: string, data: Record<string, any>) {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (value != null) params.append(key, String(value));
  });

  return params.toString()
    ? base.includes("?")
      ? `${base}&${params}`
      : `${base}?${params}`
    : base;
}

function validateRequired(form: HTMLFormElement, formData: FormData) {
  const nodes = Array.from(
    form.querySelectorAll<HTMLElement>(
      "[data-bdui-required='true'], [required]",
    ),
  );

  const missing = nodes
    .map((node) => {
      const name =
        (node as HTMLInputElement).name ||
        node.getAttribute("name") ||
        node.getAttribute("data-name");

      if (!name) return null;

      const value = formData.get(name);
      const isMissing =
        value == null || (typeof value === "string" && value.trim() === "");

      if (!isMissing) return null;

      return {
        node,
        label:
          node.getAttribute("data-bdui-label") ||
          (node as HTMLInputElement).placeholder ||
          node.getAttribute("aria-label") ||
          name,
      };
    })
    .filter(Boolean) as { node: HTMLElement; label: string }[];

  return missing;
}

function hasNameField(field: unknown): field is { name: string } {
  return (
    typeof field === "object" &&
    field !== null &&
    "name" in field &&
    typeof (field as any).name === "string"
  );
}

/* -------------------- component -------------------- */

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [innerFields, setInnerFields] = useState(fields);

  const submitRef = useRef<null | (() => Promise<void>)>(null);

  /* -------- submit handler -------- */

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
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
          if (a.type === "GO_TO") navigate("/");
        });
      } catch (e) {
        toast(`Failed: ${String(e)}`);
      }

      onSubmit?.(event);
    };

    setDialogOpen(true);
  };

  /* -------- load defaults -------- */

  useEffect(() => {
    if (!path || !id || !fields) return;

    fetch(`${path}/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setInnerFields((prev) =>
          prev?.map((f) =>
            hasNameField(f) && data[f.name] !== undefined
              ? { ...f, defaultValue: data[f.name] }
              : f,
          ),
        );
      });
  }, [path, id]);

  /* -------- render -------- */

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
          <Component key={field.id} {...field} />
        ))}
      </form>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) submitRef.current = null;
          setDialogOpen(open);
        }}
        onConfirm={async () => {
          setDialogOpen(false);
          await submitRef.current?.();
          submitRef.current = null;
        }}
      />
    </>
  );
};
