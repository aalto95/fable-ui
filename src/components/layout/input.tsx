import { BaseField } from "@/components/ui/field";
import { BaseInput } from "@/components/ui/input";
import { BaseLabel } from "@/components/ui/label";
import type { IInputComponent } from "@/models/interfaces/component";

type InputProps = Pick<
  IInputComponent,
  "id" | "name" | "label" | "required" | "defaultValue" | "hidden"
>;

export const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  required,
  defaultValue,
  hidden,
}) => {
  return (
    <BaseField id={id} hidden={hidden}>
      {label && <BaseLabel>{label}</BaseLabel>}
      <BaseInput
        name={name}
        required={required}
        defaultValue={defaultValue}
      ></BaseInput>
    </BaseField>
  );
};
