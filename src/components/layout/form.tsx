import { useRef } from "react";
import { useParams } from "react-router";

import { Component } from "@/components/core/Component";
import { Spinner } from "@/components/ui/spinner";
import { useFormPrefill } from "@/hooks/use-form-prefill";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { IFormComponent } from "@/models/interfaces/component";

export type TFormProps = React.FormHTMLAttributes<HTMLFormElement> &
  Exclude<IFormComponent, "type">;

export const Form: React.FC<TFormProps> = ({
  path,
  method = "GET",
  onSubmit,
  fields,
  title,
  submitActions,
  ...rest
}) => {
  const { id } = useParams();
  const formRef = useRef<HTMLFormElement>(null);

  const { innerFields, isLoading } = useFormPrefill({
    path,
    id,
    fields,
    formRef,
  });

  const handleSubmit = useFormSubmit({
    method,
    path,
    onSubmit,
    submitActions,
  });

  if (isLoading) return <Spinner />;

  return (
    <form
      id={id}
      action={path}
      method={method}
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 flex-1 w-full"
      {...rest}
      ref={formRef}
    >
      {title && <h2 className="font-bold">{title}</h2>}

      {innerFields?.map((field, i) => (
        <Component key={i} {...field} />
      ))}
    </form>
  );
};
