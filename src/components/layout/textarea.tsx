import { BaseField } from "@/components/ui/field";
import { BaseLabel } from "@/components/ui/label";
import { BaseTextarea } from "@/components/ui/textarea";
import type { ITextareaComponent } from "@/models/interfaces/component";

type TextareaProps = Pick<
  ITextareaComponent,
  "name" | "placeholder" | "defaultValue" | "required"
>;

export const Textarea: React.FC<TextareaProps> = ({
  name,
  placeholder,
  defaultValue,
  required,
}) => {
  return (
    <BaseField>
      {placeholder && <BaseLabel>{placeholder}</BaseLabel>}
      <BaseTextarea
        name={name}
        defaultValue={defaultValue}
        required={required}
      />
    </BaseField>
  );
};
