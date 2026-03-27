import { BaseButton } from "@/components/ui/button";
import type { IButtonComponent } from "@/models/interfaces/component";

export type TButtonProps = Exclude<IButtonComponent, "type">;

export const Button: React.FC<TButtonProps> = ({ text, expand }) => {
  return (
    <BaseButton className={expand ? "w-full" : "w-fit"}>{text}</BaseButton>
  );
};
