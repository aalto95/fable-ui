import type React from "react";
import { cn } from "../../lib/utils";
import type { SelectComponent } from "../../models/interfaces/component";
import { BaseSelect, BaseSelectOption } from "../ui/select";

type SelectFieldProps = Omit<SelectComponent, "type">;

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  placeholder,
  options,
  required,
  ...rest
}) => {
  return (
    <BaseSelect
      name={name}
      required={required}
      defaultValue=""
      data-bdui-label={placeholder ?? name}
      className={cn("w-full")}
      {...(rest as React.SelectHTMLAttributes<HTMLSelectElement> & {
        size?: "sm" | "default";
      })}
    >
      <BaseSelectOption value="" disabled={required} hidden={required}>
        {placeholder ?? "Select..."}
      </BaseSelectOption>
      {options?.map((option) => (
        <BaseSelectOption key={option.value} value={option.value}>
          {option.label}
        </BaseSelectOption>
      ))}
    </BaseSelect>
  );
};
