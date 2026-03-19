import type React from "react";
import { cn } from "../../lib/utils";
import type { SelectComponent } from "../../models/interfaces/component";

type SelectFieldProps = Omit<SelectComponent, "type">;

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  placeholder,
  options,
  required,
  ...rest
}) => {
  return (
    <select
      name={name}
      required={required}
      defaultValue=""
      data-bdui-label={placeholder ?? name}
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        "text-foreground",
      )}
      {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
    >
      <option value="" disabled={required} hidden={required}>
        {placeholder ?? "Select..."}
      </option>
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
