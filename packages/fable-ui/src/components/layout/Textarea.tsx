import { BaseField, BaseLabel, BaseTextarea } from "@fable-ui/shared";
import type { ITextareaComponent } from "@/models/interfaces/component";

export type TTextareaProps = Exclude<ITextareaComponent, "type">;

export const Textarea: React.FC<TTextareaProps> = ({
  name,
  label,
  defaultValue,
  required,
  hidden,
}) => {
  return (
    <BaseField hidden={hidden}>
      {label && (
        <BaseLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </BaseLabel>
      )}
      <BaseTextarea name={name} defaultValue={defaultValue} required={required} />
    </BaseField>
  );
};
