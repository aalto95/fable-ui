import { BaseButton } from "@/components/ui/button";
import { useFormButtonActions } from "@/hooks/use-form-button-actions";
import type { IButtonComponent } from "@/models/interfaces/component";

export type TButtonProps = Exclude<IButtonComponent, "type">;

export const Button: React.FC<TButtonProps> = ({ text, variant, size, expand, actions }) => {
  const handleActions = useFormButtonActions(actions);

  return (
    <BaseButton
      type={actions?.length ? "button" : "submit"}
      variant={variant}
      size={size}
      className={expand ? "w-full" : "w-fit"}
      onClick={actions?.length ? handleActions : undefined}
    >
      {text}
    </BaseButton>
  );
};
