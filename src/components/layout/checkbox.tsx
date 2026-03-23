import { BaseCheckbox } from "@/components/ui/checkbox";
import { BaseField } from "@/components/ui/field";
import { BaseLabel } from "@/components/ui/label";
import type { ICheckboxComponent } from "@/models/interfaces/component";

type CheckboxProps = Pick<
  ICheckboxComponent,
  "id" | "name" | "label" | "required" | "checked" | "actions"
>;

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  label,
  required,
  checked,
  actions,
}) => {
  const playActions = () => {
    actions?.forEach((action) => {
      const [id, event] = action.split("/");
      const element = document.getElementById(id);

      if (id) {
        switch (event) {
          case "toggle":
            element?.toggleAttribute("hidden");
            break;
          default:
            break;
        }
      }
    });
  };

  return (
    <BaseField orientation="horizontal" id={id}>
      <BaseCheckbox
        id={name}
        name={name}
        required={required}
        defaultChecked={checked}
        onClick={playActions}
      />
      <BaseLabel htmlFor={name}>{label}</BaseLabel>
    </BaseField>
  );
};
