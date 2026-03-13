import type { TComponent } from "../types/component";

export interface IComponent {
  id: string;
  type: TComponent;
  text?: string;
  descendants?: IComponent[];
  /**
   * Form-related configuration (used when type === "form").
   */
  method?: string;
  action?: string;
  /**
   * Input-related configuration (used when type === "input").
   */
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  /**
   * Card-related configuration (used when type === "card").
   */
  title?: string;
  description?: string;
  footerText?: string;
}
