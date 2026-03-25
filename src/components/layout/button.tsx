import { BaseButton } from "@/components/ui/button";
import type { IButtonComponent } from "@/models/interfaces/component";

export type ButtonProps = Pick<IButtonComponent, "text" | "expand">;

export const Button: React.FC<ButtonProps> = ({ text, expand }) => {
  return (
    <BaseButton className={expand ? "w-full" : "w-fit"}>{text}</BaseButton>
  );
};
