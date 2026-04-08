import { componentRegistry } from "./component-registry";

let registered = false;

/**
 * Registers built-in layout and leaf components using dynamic `import()`.
 * Each component becomes a separate chunk in the app bundle, loaded when this
 * function runs (typically once at startup). Smaller than the sync variant for
 * initial parse when you defer calling this until after first paint.
 */
export async function registerDefaultComponentsAsync(): Promise<void> {
  if (registered) return;
  registered = true;

  const [
    { Accordion },
    { Button },
    { Card },
    { Checkbox },
    { Datepicker },
    { Form },
    { HorizontalStack },
    { Input },
    { Markdown },
    { Pagination },
    { Select },
    { Slider },
    { Subtitle },
    { Table },
    { Textarea },
    { Title },
    { VerticalStack },
  ] = await Promise.all([
    import("../components/layout/Accordion"),
    import("../components/layout/Button"),
    import("../components/layout/Card"),
    import("../components/layout/Checkbox"),
    import("../components/layout/Datepicker"),
    import("../components/layout/Form"),
    import("../components/layout/HorizontalStack"),
    import("../components/layout/Input"),
    import("../components/layout/Markdown"),
    import("../components/layout/Pagination"),
    import("../components/layout/Select"),
    import("../components/layout/Slider"),
    import("../components/layout/Subtitle"),
    import("../components/layout/Table"),
    import("../components/layout/Textarea"),
    import("../components/layout/Title"),
    import("../components/layout/VerticalStack"),
  ]);

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
    .registerLeaf("markdown", Markdown)
    .registerLeaf("pagination", Pagination)
    .registerLeaf("select", Select)
    .registerLeaf("subtitle", Subtitle)
    .registerLeaf("table", Table)
    .registerLeaf("title", Title)
    .registerLeaf("textarea", Textarea)
    .registerLeaf("slider", Slider);
}
