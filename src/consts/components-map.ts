import { VerticalStack } from "../components/layout/vertical-stack";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Form } from "../components/layout/form";
import { Card } from "../components/layout/card";
import { SelectField } from "../components/layout/select";
import { HorizontalStack } from "../components/layout/horizontal-stack";
import { Textarea } from "../components/ui/textarea";
import { Datepicker } from "../components/layout/datepicker";
import { Checkbox } from "../components/layout/checkbox";

export const COMPONENTS_MAP = {
  h_stack: HorizontalStack,
  v_stack: VerticalStack,
  button: Button,
  input: Input,
  textarea: Textarea,
  datepicker: Datepicker,
  form: Form,
  card: Card,
  select: SelectField,
  checkbox: Checkbox,
};
