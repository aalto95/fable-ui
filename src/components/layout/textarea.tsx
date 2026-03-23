import { BaseField } from "@/components/ui/field";
import { BaseLabel } from "@/components/ui/label";
import { BaseTextarea } from "@/components/ui/textarea";
import type { ITextareaComponent } from "@/models/interfaces/component";

type TextareaProps = Pick<
  ITextareaComponent,
  "name" | "label" | "defaultValue" | "required" | "hidden"
>;

export const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  defaultValue,
  required,
  hidden,
}) => {
  return (
    <BaseField id={name} hidden={hidden}>
      {label && <BaseLabel>{label}</BaseLabel>}
      <BaseTextarea
        name={name}
        defaultValue={defaultValue}
        required={required}
      />
    </BaseField>
  );
};
