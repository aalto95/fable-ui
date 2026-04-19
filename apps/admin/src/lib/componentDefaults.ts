import type { ComponentType } from "./uiSchema";

export {
  ACTION_TYPES,
  BUTTON_SIZES,
  COMPONENT_TYPES,
  TABLE_HEAD_TYPES,
  VARIANTS,
} from "./uiSchema";
export type { ComponentType };

/** Minimal valid-ish defaults aligned with `fable-ui/schema.json` (and orchestrator when in sync). */
export function defaultComponent(type: ComponentType): Record<string, unknown> {
  switch (type) {
    case "button":
      return { type: "button", text: "Button", actions: [] };
    case "input":
      return { type: "input", name: "field", label: "Label" };
    case "textarea":
      return { type: "textarea", name: "notes", label: "Notes" };
    case "datepicker":
      return { type: "datepicker", name: "date", label: "Date" };
    case "select":
      return {
        type: "select",
        name: "choice",
        label: "Choose",
        options: [{ label: "A", value: "a" }],
      };
    case "checkbox":
      return { type: "checkbox", name: "agree", label: "Agree" };
    case "title":
      return { type: "title", text: "Title" };
    case "subtitle":
      return { type: "subtitle", text: "Subtitle" };
    case "markdown":
      return {
        type: "markdown",
        content: "# Title\n\n**Bold** and *italic* — GFM supported.",
      };
    case "table":
      return {
        type: "table",
        heads: [{ name: "id", label: "ID", type: "string" }],
        dataSource: "/api/example",
        actions: [],
      };
    case "accordion":
      return {
        type: "accordion",
        items: [{ name: "a1", title: "Section", text: "Content" }],
      };
    case "pagination":
      return { type: "pagination", pages: 1, pageParam: "page", limitParam: "limit" };
    case "slider":
      return { type: "slider", name: "amount", label: "Amount", min: 0, max: 100, defaultValue: 0 };
    case "h_stack":
      return { type: "h_stack", descendants: [] };
    case "v_stack":
      return { type: "v_stack", descendants: [] };
    case "form":
      return { type: "form", title: "Form", dataSource: "/api/example", descendants: [] };
    case "card":
      return { type: "card", title: "Card", descendants: [] };
    default:
      return { type };
  }
}

export function defaultPage(): Record<string, unknown> {
  return {
    route: "/",
    name: "Home",
    ui: [{ type: "title", text: "New page" }],
  };
}
