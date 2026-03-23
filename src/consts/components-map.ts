import { VerticalStack } from "@/components/layout/vertical-stack";
import { BaseButton } from "@/components/ui/button";
import { BaseInput } from "@/components/ui/input";
import { Form } from "@/components/layout/form";
import { Card } from "@/components/layout/card";
import { SelectField } from "@/components/layout/select";
import { HorizontalStack } from "@/components/layout/horizontal-stack";
import { BaseTextarea } from "@/components/ui/textarea";
import { Datepicker } from "@/components/layout/datepicker";
import { Checkbox } from "@/components/layout/checkbox";

export const COMPONENTS_MAP = {
  card: Card,
  checkbox: Checkbox,
  datepicker: Datepicker,
  form: Form,
  h_stack: HorizontalStack,
  select: SelectField,
  v_stack: VerticalStack,
  button: BaseButton,
  input: BaseInput,
  textarea: BaseTextarea,
};
