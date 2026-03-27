export type TLayoutComponent = "card" | "h_stack" | "v_stack";

export type TLeafComponent =
  | "accordion"
  | "button"
  | "checkbox"
  | "datepicker"
  | "form"
  | "input"
  | "pagination"
  | "select"
  | "table"
  | "textarea";

export type TComponent = TLayoutComponent & TLeafComponent;
