import type { CheckboxComponent } from "../../models/interfaces/component";
import { BaseCheckbox } from "../ui/checkbox";
import { Field } from "../ui/field";
import { Label } from "../ui/label";

type CheckboxProps = Omit<CheckboxComponent, "type">;

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  required,
}) => {
  return (
    <Field orientation="horizontal">
      <BaseCheckbox id={name} name={name} required={required} />
      <Label htmlFor={name}>{label}</Label>
    </Field>
  );
};
