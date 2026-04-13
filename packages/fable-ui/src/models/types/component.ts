export type TLayoutComponent = "card" | "form" | "h_stack" | "v_stack";

export type TLeafComponent =
  | "accordion"
  | "button"
  | "checkbox"
  | "datepicker"
  | "input"
  | "markdown"
  | "pagination"
  | "select"
  | "subtitle"
  | "table"
  | "title"
  | "textarea"
  | "slider";

export type TComponent = TLayoutComponent | TLeafComponent;
