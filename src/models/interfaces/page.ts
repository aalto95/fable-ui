import type { IComponent } from "./component";

export interface Page {
  route: string;
  ui: IComponent[];
}
