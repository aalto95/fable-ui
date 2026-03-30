import { Accordion } from "@/components/layout/accordion";
import { Button } from "@/components/layout/button";
import { Card } from "@/components/layout/card";
import { Checkbox } from "@/components/layout/checkbox";
import { Datepicker } from "@/components/layout/datepicker";
import { Form } from "@/components/layout/form";
import { HorizontalStack } from "@/components/layout/horizontal-stack";
import { Input } from "@/components/layout/input";
import { Pagination } from "@/components/layout/pagination";
import { Select } from "@/components/layout/select";
import { Table } from "@/components/layout/table";
import { Textarea } from "@/components/layout/textarea";
import { VerticalStack } from "@/components/layout/vertical-stack";

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
    .registerLeaf("table", Table)
    .registerLeaf("textarea", Textarea);
}

registerDefaultComponents();
