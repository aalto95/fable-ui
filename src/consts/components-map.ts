import { Accordion } from "@/components/layout/accordion";
import { Button } from "@/components/layout/button";
import { Card } from "@/components/layout/card";
import { Checkbox } from "@/components/layout/checkbox";
import { Datepicker } from "@/components/layout/datepicker";
import { Form } from "@/components/layout/form";
import { HorizontalStack } from "@/components/layout/horizontal-stack";
import { Input } from "@/components/layout/input";
import { Pagination } from "@/components/layout/pagination";
import { SelectField } from "@/components/layout/select";
import { Table } from "@/components/layout/table";
import { Textarea } from "@/components/layout/textarea";
import { VerticalStack } from "@/components/layout/vertical-stack";

export const COMPONENTS_MAP = {
  button: Button,
  card: Card,
  checkbox: Checkbox,
  datepicker: Datepicker,
  form: Form,
  h_stack: HorizontalStack,
  input: Input,
  select: SelectField,
  textarea: Textarea,
  v_stack: VerticalStack,
  table: Table,
  accordion: Accordion,
  pagination: Pagination,
};
