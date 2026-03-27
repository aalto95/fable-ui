import type { PropsWithChildren } from "react";
import type { IHStackComponent } from "@/models/interfaces/component";

export type THorizontalStackProps = Exclude<IHStackComponent, "type">;

export const HorizontalStack: React.FC<
  PropsWithChildren<THorizontalStackProps>
> = ({ children }) => {
  return <div className="flex flex-row gap-2 w-full max-w-7xl">{children}</div>;
};
