import type { TComponent } from "../types/component";

export interface BaseComponent<T extends TComponent = TComponent> {
  id: string;
  type: T;
}

export interface HStackComponent extends BaseComponent<"h_stack"> {
  descendants?: ComponentUnion[];
}

export interface VStackComponent extends BaseComponent<"v_stack"> {
  descendants?: ComponentUnion[];
}

export interface ButtonComponent extends BaseComponent<"button"> {
  text?: string;
  expand?: boolean;
}

export interface InputComponent extends BaseComponent<"input"> {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface Textarea extends BaseComponent<"textarea"> {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface DatePickerComponent extends BaseComponent<"datepicker"> {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectComponent extends BaseComponent<"select"> {
  name?: string;
  placeholder?: string;
  options?: SelectOption[];
  required?: boolean;
}

export interface CheckboxComponent extends BaseComponent<"checkbox"> {
  name?: string;
  label?: string;
  required?: boolean;
}

export interface FormComponent extends BaseComponent<"form"> {
  method?: string;
  action?: string;
  descendants?: ComponentUnion[];
}

export interface CardComponent extends BaseComponent<"card"> {
  title?: string;
  description?: string;
  footerText?: string;
  descendants?: ComponentUnion[];
}

export type ComponentsWithDescendants =
  | HStackComponent
  | VStackComponent
  | FormComponent
  | CardComponent;

export type ComponentsWithoutDescendants =
  | ButtonComponent
  | InputComponent
  | Textarea
  | SelectComponent
  | DatePickerComponent
  | CheckboxComponent;

export type ComponentUnion =
  | ComponentsWithoutDescendants
  | ComponentsWithDescendants;

// Backwards-compatible alias used across the app code.
export type IComponent = ComponentUnion;
