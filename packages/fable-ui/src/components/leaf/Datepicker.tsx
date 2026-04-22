import { BaseField, BaseInput, BaseLabel } from "fable-shared";
import type { IDatepickerComponent } from "@/models/interfaces/component";

export type TDatepickerProps = Exclude<IDatepickerComponent, "type">;

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

export const Datepicker: React.FC<TDatepickerProps> = ({
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
      <BaseInput
        type="date"
        name={name}
        required={required}
        defaultValue={toLocalISODateOnly(defaultValue)}
      />
    </BaseField>
  );
};
