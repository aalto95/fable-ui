import { BaseButton } from "@fable-ui/shared";
import { useFormActionsContext } from "@/contexts/form-actions";
import { useFormButtonActions } from "@/hooks/use-form-button-actions";
import type { IButtonComponent } from "@/models/interfaces/component";

export type TButtonProps = Exclude<IButtonComponent, "type">;

export const Button: React.FC<TButtonProps> = ({ text, variant, size, expand, actions }) => {
  const handleActions = useFormButtonActions(actions);
  const formActions = useFormActionsContext();
  const disabledByHttp = Boolean(formActions?.isHttpActionPending && actions?.length);

  return (
    <BaseButton
      type={actions?.length ? "button" : "submit"}
      variant={variant}
      size={size}
      className={expand ? "w-full" : "w-fit"}
      disabled={disabledByHttp}
      aria-busy={disabledByHttp || undefined}
      onClick={actions?.length ? handleActions : undefined}
    >
      {text}
    </BaseButton>
  );
};
