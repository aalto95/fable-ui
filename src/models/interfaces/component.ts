import type { TComponent } from "../types/component";

export interface BaseComponent<T extends TComponent = TComponent> {
  id: string;
  type: T;
}

export interface VStackComponent extends BaseComponent<"v_stack"> {
  descendants?: ComponentUnion[];
}

export interface ButtonComponent extends BaseComponent<"button"> {
  text?: string;
}

export interface InputComponent extends BaseComponent<"input"> {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
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

export type ComponentsWithDescendants = VStackComponent | FormComponent | CardComponent;

export type ComponentsWithoutDescendants = ButtonComponent | InputComponent;

export type ComponentUnion = ComponentsWithoutDescendants | ComponentsWithDescendants;

// Backwards-compatible alias used across the app code.
export type IComponent = ComponentUnion;

