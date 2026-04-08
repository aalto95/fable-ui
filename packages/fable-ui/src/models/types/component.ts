export type TLayoutComponent = "card" | "h_stack" | "v_stack";

export type TLeafComponent =
  | "accordion"
  | "button"
  | "checkbox"
  | "datepicker"
  | "form"
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
