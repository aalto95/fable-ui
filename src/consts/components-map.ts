import {
  Accordion,
  Button,
  Card,
  Checkbox,
  Datepicker,
  Form,
  HorizontalStack,
  Input,
  Pagination,
  Select,
  Table,
  Textarea,
  VerticalStack,
} from "@/components/layout";
import type {
  TLayoutComponent,
  TLeafComponent,
} from "@/models/types/component";

export const LAYOUT_COMPONENTS: Record<TLayoutComponent, React.ElementType> = {
  card: Card,
  h_stack: HorizontalStack,
  v_stack: VerticalStack,
};

export const LEAF_COMPONENTS: Record<TLeafComponent, React.ElementType> = {
  accordion: Accordion,
  button: Button,
  checkbox: Checkbox,
  datepicker: Datepicker,
  form: Form,
  input: Input,
  pagination: Pagination,
  select: Select,
  table: Table,
  textarea: Textarea,
};

export const COMPONENTS_MAP = { ...LAYOUT_COMPONENTS, ...LEAF_COMPONENTS };
