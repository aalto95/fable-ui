import type { PropsWithChildren } from "react";
import type { IVStackComponent } from "@/models/interfaces/component";

export type TVerticalStackProps = Exclude<IVStackComponent, "type">;

export const VerticalStack: React.FC<
  PropsWithChildren<TVerticalStackProps>
> = ({ children }) => {
  return <div className="flex flex-col gap-2 w-full">{children}</div>;
};
