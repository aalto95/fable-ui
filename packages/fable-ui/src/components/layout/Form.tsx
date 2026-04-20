import { Spinner } from "@fable-ui/shared";
import type { SubmitEventHandler } from "react";
import { useCallback, useRef } from "react";
import { useParams } from "react-router";
import { Component } from "@/components/core/Component";
import { FormActionsProvider } from "@/contexts/form-actions";
import { useFormPrefill } from "@/hooks/use-form-prefill";
import type { IFormComponent } from "@/models/interfaces/component";

export type TFormProps = React.FormHTMLAttributes<HTMLFormElement> &
  Exclude<IFormComponent, "type">;

export const Form: React.FC<TFormProps> = ({
  dataSource,
  onSubmit,
  descendants,
  title,
  ...rest
}) => {
  const { id } = useParams();
  const formRef = useRef<HTMLFormElement>(null);

  const { innerDescendants, isLoading } = useFormPrefill({
    dataSource,
    id,
    descendants,
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
        className="flex w-full flex-1 flex-col gap-2"
        {...rest}
        onSubmit={handleSubmit}
        ref={formRef}
      >
        {title && <h2 className="font-bold">{title}</h2>}

        {innerDescendants?.map((child, i) => (
          <Component key={i} {...child} />
        ))}
      </form>
    </FormActionsProvider>
  );
};
