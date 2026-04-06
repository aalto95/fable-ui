import type { TComponentUnion } from "./component";

export interface IPage {
  route: string;
  ui: TComponentUnion[];
}
