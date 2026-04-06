import { BaseField } from "@/components/ui/field";
import { BaseLabel } from "@/components/ui/label";
import { BaseSelect, BaseSelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ISelectComponent } from "@/models/interfaces/component";

export type TSelectProps = Exclude<ISelectComponent, "type">;

export const Select: React.FC<TSelectProps> = ({
  name,
  label,
  options,
  required,
  hidden,
  ...rest
}) => {
  return (
    <BaseField hidden={hidden}>
      {label && (
        <BaseLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </BaseLabel>
      )}
      <BaseSelect
        name={name}
        required={required}
        data-manifest-ui-label={label ?? name}
        className={cn("w-full")}
        {...(rest as React.SelectHTMLAttributes<HTMLSelectElement> & {
          size?: "sm" | "default";
        })}
      >
        <BaseSelectOption></BaseSelectOption>
        {options?.map((option, i) => (
          <BaseSelectOption key={i} value={option.value}>
            {option.label}
          </BaseSelectOption>
        ))}
      </BaseSelect>
    </BaseField>
  );
};
