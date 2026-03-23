import * as React from "react";
import type { DatePickerComponent } from "../../models/interfaces/component";
import { BaseInput } from "../ui/input";
import { BaseField } from "../ui/field";
type DatePickerProps = Omit<DatePickerComponent, "type">;

function formatDate(date: string | undefined) {
  if (!date) {
    return "";
  }
  return date.substring(0, 10);
}

export const Datepicker: React.FC<DatePickerProps> = ({
  name,
  placeholder,
  defaultValue,
  required,
}) => {
  const [value, setValue] = React.useState(formatDate(defaultValue));

  return (
    <BaseField>
      <BaseInput
        type="date"
        name={name}
        required={required}
        value={value}
        placeholder={placeholder ?? "Select date"}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </BaseField>
  );
};
