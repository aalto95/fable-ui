import type React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { SelectComponent } from "../../models/interfaces/component";

type SelectFieldProps = Omit<SelectComponent, "type">;

export const SelectField: React.FC<SelectFieldProps> = ({
  placeholder,
  options,
  ...rest
}) => {
  return (
    <Select {...rest}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
