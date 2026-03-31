import { Accordion } from "@/components/layout/Accordion";
import { Button } from "@/components/layout/Button";
import { Card } from "@/components/layout/Card";
import { Checkbox } from "@/components/layout/Checkbox";
import { Datepicker } from "@/components/layout/Datepicker";
import { Form } from "@/components/layout/Form";
import { HorizontalStack } from "@/components/layout/HorizontalStack";
import { Input } from "@/components/layout/Input";
import { Pagination } from "@/components/layout/Pagination";
import { Select } from "@/components/layout/Select";
import { Subtitle } from "@/components/layout/Subtitle";
import { Table } from "@/components/layout/Table";
import { Textarea } from "@/components/layout/Textarea";
import { Title } from "@/components/layout/Title";
import { VerticalStack } from "@/components/layout/VerticalStack";

import { componentRegistry } from "./component-registry";

let registered = false;

/**
 * Registers built-in layout and leaf components. Safe to call multiple times.
 */
export function registerDefaultComponents(): void {
  if (registered) return;
  registered = true;

  componentRegistry
    .registerLayout("card", Card)
    .registerLayout("h_stack", HorizontalStack)
    .registerLayout("v_stack", VerticalStack);

  componentRegistry
    .registerLeaf("accordion", Accordion)
    .registerLeaf("button", Button)
    .registerLeaf("checkbox", Checkbox)
    .registerLeaf("datepicker", Datepicker)
    .registerLeaf("form", Form)
    .registerLeaf("input", Input)
    .registerLeaf("pagination", Pagination)
    .registerLeaf("select", Select)
    .registerLeaf("subtitle", Subtitle)
    .registerLeaf("table", Table)
    .registerLeaf("title", Title)
    .registerLeaf("textarea", Textarea);
}

registerDefaultComponents();
