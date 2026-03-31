import type { SubmitEventHandler } from "react";
import { useCallback, useRef } from "react";
import { useParams } from "react-router";
import { Component } from "@/components/core/Component";
import { Spinner } from "@/components/ui/spinner";
import { FormActionsProvider } from "@/contexts/form-actions";
import { useFormPrefill } from "@/hooks/use-form-prefill";
import type { IFormComponent } from "@/models/interfaces/component";

export type TFormProps = React.FormHTMLAttributes<HTMLFormElement> &
  Exclude<IFormComponent, "type">;

export const Form: React.FC<TFormProps> = ({
  dataSource,
  onSubmit,
  fields,
  title,
  ...rest
}) => {
  const { id } = useParams();
  const formRef = useRef<HTMLFormElement>(null);

  const { innerFields, isLoading } = useFormPrefill({
    dataSource,
    id,
    fields,
    formRef,
  });

  const handleSubmit = useCallback<SubmitEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      onSubmit?.(event);
    },
    [onSubmit],
  );

  if (isLoading) return <Spinner />;

  return (
    <FormActionsProvider formRef={formRef}>
      <form
        id={id}
        className="flex flex-col gap-2 flex-1 w-full"
        {...rest}
        onSubmit={handleSubmit}
        ref={formRef}
      >
        {title && <h2 className="font-bold">{title}</h2>}

        {innerFields?.map((field, i) => (
          <Component key={i} {...field} />
        ))}
      </form>
    </FormActionsProvider>
  );
};
