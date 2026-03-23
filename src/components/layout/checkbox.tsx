import type { CheckboxComponent } from "../../models/interfaces/component";
import { BaseCheckbox } from "../ui/checkbox";
import { BaseField } from "../ui/field";
import { BaseLabel } from "../ui/label";

type CheckboxProps = Omit<CheckboxComponent, "type">;

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  required,
}) => {
  return (
    <BaseField orientation="horizontal">
      <BaseCheckbox id={name} name={name} required={required} />
      <BaseLabel htmlFor={name}>{label}</BaseLabel>
    </BaseField>
  );
};
