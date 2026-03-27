import { BaseCheckbox } from "@/components/ui/checkbox";
import { BaseField } from "@/components/ui/field";
import { BaseLabel } from "@/components/ui/label";
import type { ICheckboxComponent } from "@/models/interfaces/component";

export type TCheckboxProps = Exclude<ICheckboxComponent, "type">;

export const Checkbox: React.FC<TCheckboxProps> = ({
  name,
  label,
  required,
  checked,
}) => {
  return (
    <BaseField orientation="horizontal">
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
