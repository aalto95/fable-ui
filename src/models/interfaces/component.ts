import type { TComponent } from "@/models/types/component";

export interface IBaseComponent<T extends TComponent> {
  type: T;
}

export type IActionType =
  | "HTTP_GET"
  | "HTTP_POST"
  | "HTTP_PUT"
  | "HTTP_PATCH"
  | "HTTP_DELETE"
  | "GO_TO"
  | "GO_BACK"
  | "HIDE";

export interface IAction {
  type: IActionType;
  label: string;
  path?: string;
  dialogConfig?: {
    title?: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
    hideCancel?: boolean;
  };
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
}

export interface IButtonComponent extends IBaseComponent<"button"> {
  text?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  expand?: boolean;
  actions?: IAction[];
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
}

export interface ITitleComponent extends IBaseComponent<"title"> {
  text?: string;
  hidden?: boolean;
}

export interface ISubtitleComponent extends IBaseComponent<"subtitle"> {
  text?: string;
  hidden?: boolean;
}

export interface ITableComponent extends IBaseComponent<"table"> {
  heads?: { name: string; label: string; type: "string" | "date" }[];
  data?: any[];
  dataSource?: string;
  pageParam?: string;
  limitParam?: string;
  defaultLimit?: number;
  actions?: IAction[];
}

export interface IAccordionComponent extends IBaseComponent<"accordion"> {
  items?: {
    name: string;
    title: string;
    text: string;
  }[];
}

export interface IPaginationComponent extends IBaseComponent<"pagination"> {
  pages: number;
  pageParam?: string;
  limitParam?: string;
  defaultLimit?: number;
}

export interface ISliderComponent extends IBaseComponent<"slider"> {
  name?: string;
  label?: string;
  required?: boolean;
  valueSuffix?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface IHStackComponent extends IBaseComponent<"h_stack"> {
  descendants?: TComponentUnion[];
}

export interface IVStackComponent extends IBaseComponent<"v_stack"> {
  descendants?: TComponentUnion[];
}

export interface IFormComponent extends IBaseComponent<"form"> {
  title?: string;
  /** Base URL for GET prefill (`GET ${dataSource}/:id`). HTTP submit is configured on button `actions`. */
  dataSource?: string;
  fields?: TComponentUnion[];
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
  | ICardComponent;

export type TComponentsWithoutDescendants =
  | IButtonComponent
  | IInputComponent
  | ITextareaComponent
  | ITitleComponent
  | ISubtitleComponent
  | ISelectComponent
  | IDatepickerComponent
  | ICheckboxComponent
  | ITableComponent
  | IAccordionComponent
  | IPaginationComponent
  | ISliderComponent
  | IFormComponent;

export type TComponentUnion =
  | TComponentsWithoutDescendants
  | TComponentsWithDescendants;
