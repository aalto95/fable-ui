import type { TComponent } from "../types/component";

export interface IComponent {
  id: string;
  type: TComponent;
  text?: string;
  descendants?: IComponent[];
}
