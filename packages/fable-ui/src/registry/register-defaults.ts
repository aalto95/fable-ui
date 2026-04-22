import { Card } from "@/components/branch/Card";
import { Form } from "@/components/branch/Form";
import { HorizontalStack } from "@/components/branch/HorizontalStack";
import { VerticalStack } from "@/components/branch/VerticalStack";
import { Accordion } from "@/components/leaf/Accordion";
import { Button } from "@/components/leaf/Button";
import { Checkbox } from "@/components/leaf/Checkbox";
import { Datepicker } from "@/components/leaf/Datepicker";
import { Image } from "@/components/leaf/Image";
import { Input } from "@/components/leaf/Input";
import { Markdown } from "@/components/leaf/Markdown";
import { Pagination } from "@/components/leaf/Pagination";
import { Select } from "@/components/leaf/Select";
import { Slider } from "@/components/leaf/Slider";
import { Subtitle } from "@/components/leaf/Subtitle";
import { Table } from "@/components/leaf/Table";
import { Textarea } from "@/components/leaf/Textarea";
import { Title } from "@/components/leaf/Title";
import { componentRegistry } from "./component-registry";

let registered = false;

/**
 * Registers built-in branch and leaf components synchronously on the registry.
 * Safe to call multiple times.
 *
 * By default, built-ins are **not** required: `Component` lazy-loads each
 * built-in kind on first use. Use this when you want synchronous rendering
 * (no `Suspense` fallback) or to replace a built-in via the registry before
 * the lazy path runs.
 */
export function registerDefaultComponents(): void {
  if (registered) return;
  registered = true;

  componentRegistry
    .registerBranch("card", Card)
    .registerBranch("form", Form)
    .registerBranch("h_stack", HorizontalStack)
    .registerBranch("v_stack", VerticalStack);

  componentRegistry
    .registerLeaf("accordion", Accordion)
    .registerLeaf("button", Button)
    .registerLeaf("checkbox", Checkbox)
    .registerLeaf("datepicker", Datepicker)
    .registerLeaf("image", Image)
    .registerLeaf("input", Input)
    .registerLeaf("markdown", Markdown)
    .registerLeaf("pagination", Pagination)
    .registerLeaf("select", Select)
    .registerLeaf("subtitle", Subtitle)
    .registerLeaf("table", Table)
    .registerLeaf("title", Title)
    .registerLeaf("textarea", Textarea)
    .registerLeaf("slider", Slider);
}
