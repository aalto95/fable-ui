import { BaseCheckbox } from "@/components/ui/checkbox";
import { BaseField } from "@/components/ui/field";
import { BaseLabel } from "@/components/ui/label";
import type { ICheckboxComponent } from "@/models/interfaces/component";

type CheckboxProps = Pick<
  ICheckboxComponent,
  "id" | "name" | "label" | "required" | "checked"
>;

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  label,
  required,
  checked,
}) => {
  return (
    <BaseField id={id} orientation="horizontal">
      <BaseCheckbox
        id={name}
        name={name}
        required={required}
        defaultChecked={checked}
      />
      <BaseLabel htmlFor={name}>{label}</BaseLabel>
    </BaseField>
  );
};
