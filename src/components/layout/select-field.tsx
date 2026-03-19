import type React from "react";
import { cn } from "../../lib/utils";
import type { SelectComponent } from "../../models/interfaces/component";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";

type SelectFieldProps = Omit<SelectComponent, "type">;

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  placeholder,
  options,
  required,
  ...rest
}) => {
  return (
    <NativeSelect
      name={name}
      required={required}
      defaultValue=""
      data-bdui-label={placeholder ?? name}
      className={cn("w-full")}
      {...(rest as React.SelectHTMLAttributes<HTMLSelectElement> & {
        size?: "sm" | "default";
      })}
    >
      <NativeSelectOption value="" disabled={required} hidden={required}>
        {placeholder ?? "Select..."}
      </NativeSelectOption>
      {options?.map((option) => (
        <NativeSelectOption key={option.value} value={option.value}>
          {option.label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
};
