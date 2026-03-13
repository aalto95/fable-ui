import { VerticalStack } from "../components/layout/vertical-stack";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Form } from "../components/layout/form";
import { CardLayout } from "../components/layout/card-layout";
import { SelectField } from "../components/layout/select-field";
import { HorizontalStack } from "../components/layout/horizontal-stack";

export const COMPONENTS_MAP = {
  h_stack: HorizontalStack,
  v_stack: VerticalStack,
  button: Button,
  input: Input,
  form: Form,
  card: CardLayout,
  select: SelectField,
};
