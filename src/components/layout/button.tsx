import { BaseButton } from "@/components/ui/button";
import type { IButtonComponent } from "@/models/interfaces/component";

export type ButtonProps = Pick<IButtonComponent, "id" | "text" | "expand">;

export const Button: React.FC<ButtonProps> = ({ id, text, expand }) => {
  return (
    <BaseButton id={id} className={expand ? "w-full" : "w-fit"}>
      {text}
    </BaseButton>
  );
};
