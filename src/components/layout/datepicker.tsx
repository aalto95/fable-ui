import { BaseField } from "@/components/ui/field";
import { BaseInput } from "@/components/ui/input";
import { BaseLabel } from "@/components/ui/label";
import type { IDatepickerComponent } from "@/models/interfaces/component";

type DatePickerProps = Pick<
  IDatepickerComponent,
  "id" | "name" | "label" | "defaultValue" | "required" | "hidden"
>;

function formatDate(date: string | undefined) {
  if (!date) {
    return "";
  }
  return date.substring(0, 10);
}

export const Datepicker: React.FC<DatePickerProps> = ({
  id,
  name,
  label,
  defaultValue,
  required,
  hidden,
}) => {
  return (
    <BaseField id={id} hidden={hidden}>
      {label ?? <BaseLabel>{label}</BaseLabel>}
      <BaseInput
        type="date"
        name={name}
        required={required}
        defaultValue={formatDate(defaultValue)}
      />
    </BaseField>
  );
};
