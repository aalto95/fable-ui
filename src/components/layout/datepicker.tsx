import { BaseField } from "@/components/ui/field";
import { BaseInput } from "@/components/ui/input";
import { BaseLabel } from "@/components/ui/label";
import type { IDatepickerComponent } from "@/models/interfaces/component";

type DatePickerProps = Pick<
  IDatepickerComponent,
  "id" | "name" | "label" | "defaultValue" | "required" | "hidden"
>;

function toLocalISODateOnly(value?: string | Date) {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
      {label && <BaseLabel>{label}</BaseLabel>}
      <BaseInput
        type="date"
        name={name}
        required={required}
        defaultValue={toLocalISODateOnly(defaultValue)}
      />
    </BaseField>
  );
};
