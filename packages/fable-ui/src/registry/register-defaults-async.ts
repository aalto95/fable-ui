import { componentRegistry } from "./component-registry";

let registered = false;

/**
 * Registers built-in branch and leaf components using dynamic `import()`.
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
    { Image },
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
    import("../components/leaf/Accordion"),
    import("../components/leaf/Button"),
    import("../components/branch/Card"),
    import("../components/leaf/Checkbox"),
    import("../components/leaf/Datepicker"),
    import("../components/branch/Form"),
    import("../components/branch/HorizontalStack"),
    import("../components/leaf/Image"),
    import("../components/leaf/Input"),
    import("../components/leaf/Markdown"),
    import("../components/leaf/Pagination"),
    import("../components/leaf/Select"),
    import("../components/leaf/Slider"),
    import("../components/leaf/Subtitle"),
    import("../components/leaf/Table"),
    import("../components/leaf/Textarea"),
    import("../components/leaf/Title"),
    import("../components/branch/VerticalStack"),
  ]);

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
