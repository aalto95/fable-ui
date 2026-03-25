import type { TComponent } from "@/models/types/component";

export interface IBaseComponent<T extends TComponent = TComponent> {
  id: string;
  type: T;
}

export interface IAction {
  type: "HTTP_GET" | "GO_TO" | "HIDE";
  label: string;
  path: string;
}

export interface IButtonComponent extends IBaseComponent<"button"> {
  text?: string;
  expand?: boolean;
}

export interface IInputComponent extends IBaseComponent<"input"> {
  name?: string;
  label?: string;
  defaultValue?: string;
  required?: boolean;
  hidden?: boolean;
}

export interface ITextareaComponent extends IBaseComponent<"textarea"> {
  name?: string;
  label?: string;
  defaultValue?: string;
  required?: boolean;
  hidden?: boolean;
}

export interface IDatepickerComponent extends IBaseComponent<"datepicker"> {
  name?: string;
  label?: string;
  defaultValue?: string;
  required?: boolean;
  hidden?: boolean;
}

export interface ISelectOption {
  label: string;
  value: string;
}

export interface ISelectComponent extends IBaseComponent<"select"> {
  name?: string;
  label?: string;
  options?: ISelectOption[];
  required?: boolean;
  hidden?: boolean;
}

export interface ICheckboxComponent extends IBaseComponent<"checkbox"> {
  name?: string;
  label?: string;
  required?: boolean;
  checked?: boolean;
  actions?: IAction[];
}

export interface ITableComponent extends IBaseComponent<"table"> {
  fields?: { name: string; label: string }[];
  data?: any[];
  dataSource?: string;
  actions?: IAction[];
}

export interface IAccordionComponent extends IBaseComponent<"accordion"> {
  items?: {
    name: string;
    title: string;
    text: string;
  }[];
}

export interface IPaginationComponent extends IBaseComponent<"accordion"> {
  pages: number;
}

export interface IHStackComponent extends IBaseComponent<"h_stack"> {
  descendants?: TComponentUnion[];
}

export interface IVStackComponent extends IBaseComponent<"v_stack"> {
  descendants?: TComponentUnion[];
}

export interface IFormComponent extends IBaseComponent<"form"> {
  title?: string;
  method?: string;
  path?: string;
  fields?: TComponentUnion[];
  submitActions?: IAction[];
}

export interface ICardComponent extends IBaseComponent<"card"> {
  title?: string;
  description?: string;
  footerText?: string;
  descendants?: TComponentUnion[];
}

export type TComponentsWithDescendants =
  | IHStackComponent
  | IVStackComponent
  | IFormComponent
  | ICardComponent;

export type TComponentsWithoutDescendants =
  | IButtonComponent
  | IInputComponent
  | ITextareaComponent
  | ISelectComponent
  | IDatepickerComponent
  | ICheckboxComponent
  | ITableComponent
  | IAccordionComponent
  | IPaginationComponent;

export type TComponentUnion =
  | TComponentsWithoutDescendants
  | TComponentsWithDescendants;
