import type { TComponent } from "@/models/types/component";

export interface IBaseComponent<T extends TComponent = TComponent> {
  id: string;
  type: T;
}

export interface IButtonComponent extends IBaseComponent<"button"> {
  text?: string;
  expand?: boolean;
}

export interface IInputComponent extends IBaseComponent<"input"> {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface ITextareaComponent extends IBaseComponent<"textarea"> {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface IDatepickerComponent extends IBaseComponent<"datepicker"> {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface ISelectOption {
  label: string;
  value: string;
}

export interface ISelectComponent extends IBaseComponent<"select"> {
  name?: string;
  placeholder?: string;
  options?: ISelectOption[];
  required?: boolean;
}

export interface ICheckboxComponent extends IBaseComponent<"checkbox"> {
  name?: string;
  label?: string;
  required?: boolean;
  checked?: boolean;
}

export interface IHStackComponent extends IBaseComponent<"h_stack"> {
  descendants?: TComponentUnion[];
}

export interface IVStackComponent extends IBaseComponent<"v_stack"> {
  descendants?: TComponentUnion[];
}

export interface IFormComponent extends IBaseComponent<"form"> {
  method?: string;
  action?: string;
  descendants?: TComponentUnion[];
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
  | ICheckboxComponent;

export type TComponentUnion =
  | TComponentsWithoutDescendants
  | TComponentsWithDescendants;
