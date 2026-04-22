export type TBranchComponent = "card" | "form" | "h_stack" | "v_stack";

export type TLeafComponent =
  | "accordion"
  | "button"
  | "checkbox"
  | "datepicker"
  | "image"
  | "input"
  | "markdown"
  | "pagination"
  | "select"
  | "subtitle"
  | "table"
  | "title"
  | "textarea"
  | "slider";

export type TComponent = TBranchComponent | TLeafComponent;
