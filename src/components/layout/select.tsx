import { BaseField } from "@/components/ui/field";
import { BaseLabel } from "@/components/ui/label";
import { BaseSelect, BaseSelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ISelectComponent } from "@/models/interfaces/component";

type SelectFieldProps = Pick<
  ISelectComponent,
  "name" | "placeholder" | "options" | "required"
>;

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  placeholder,
  options,
  required,
  ...rest
}) => {
  return (
    <BaseField>
      <BaseLabel>{placeholder}</BaseLabel>
      <BaseSelect
        name={name}
        required={required}
        data-bdui-label={placeholder ?? name}
        className={cn("w-full")}
        {...(rest as React.SelectHTMLAttributes<HTMLSelectElement> & {
          size?: "sm" | "default";
        })}
      >
        <BaseSelectOption></BaseSelectOption>
        {options?.map((option) => (
          <BaseSelectOption key={option.value} value={option.value}>
            {option.label}
          </BaseSelectOption>
        ))}
      </BaseSelect>
    </BaseField>
  );
};
