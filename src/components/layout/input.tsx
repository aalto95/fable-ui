import { BaseField } from "@/components/ui/field";
import { BaseInput } from "@/components/ui/input";
import { BaseLabel } from "@/components/ui/label";
import type { IInputComponent } from "@/models/interfaces/component";

type InputProps = Pick<
  IInputComponent,
  "name" | "label" | "required" | "defaultValue"
>;

export const Input: React.FC<InputProps> = ({
  name,
  label,
  required,
  defaultValue,
}) => {
  return (
    <BaseField>
      {label && <BaseLabel>{label}</BaseLabel>}
      <BaseInput
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
      ></BaseInput>
    </BaseField>
  );
};
