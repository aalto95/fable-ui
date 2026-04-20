import { BaseField } from "@/components/ui/field";
import { BaseInput } from "@/components/ui/input";
import { BaseLabel } from "@/components/ui/label";
import type { IInputComponent } from "@/models/interfaces/component";

export type TInputProps = Exclude<IInputComponent, "type">;

export const Input: React.FC<TInputProps> = ({ name, label, required, defaultValue, hidden }) => {
  return (
    <BaseField hidden={hidden}>
      {label && (
        <BaseLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </BaseLabel>
      )}
      <BaseInput name={name} required={required} defaultValue={defaultValue}></BaseInput>
    </BaseField>
  );
};
