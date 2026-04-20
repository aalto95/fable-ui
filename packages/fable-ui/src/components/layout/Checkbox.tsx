import { BaseCheckbox, BaseField, BaseLabel } from "@fable-ui/shared";
import type { ICheckboxComponent } from "@/models/interfaces/component";

export type TCheckboxProps = Exclude<ICheckboxComponent, "type">;

export const Checkbox: React.FC<TCheckboxProps> = ({ name, label, required, checked }) => {
  return (
    <BaseField orientation="horizontal">
      <BaseCheckbox id={name} name={name} required={required} defaultChecked={checked} />
      {label && (
        <BaseLabel htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </BaseLabel>
      )}
    </BaseField>
  );
};
