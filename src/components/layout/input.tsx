import { BaseField } from "@/components/ui/field";
import { BaseInput } from "@/components/ui/input";
import { BaseLabel } from "@/components/ui/label";
import type { IInputComponent } from "@/models/interfaces/component";

type InputProps = Pick<
  IInputComponent,
  "name" | "placeholder" | "required" | "defaultValue"
>;

export const Input: React.FC<InputProps> = ({
  name,
  placeholder,
  required,
  defaultValue,
}) => {
  return (
    <BaseField>
      {placeholder && <BaseLabel>{placeholder}</BaseLabel>}
      <BaseInput
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
      ></BaseInput>
    </BaseField>
  );
};
