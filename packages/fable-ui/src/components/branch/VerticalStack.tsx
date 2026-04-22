import type { PropsWithChildren } from "react";
import type { IVStackComponent } from "@/models/interfaces/component";

export type TVerticalStackProps = Exclude<IVStackComponent, "type">;

export const VerticalStack: React.FC<PropsWithChildren<TVerticalStackProps>> = ({ children }) => {
  return <div className="flex w-full flex-col gap-2">{children}</div>;
};
