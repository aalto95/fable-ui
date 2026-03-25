import type { PropsWithChildren } from "react";
import type { IHStackComponent } from "@/models/interfaces/component";

type HorizontalStackProps = IHStackComponent;

export const HorizontalStack: React.FC<
  PropsWithChildren<HorizontalStackProps>
> = ({ children }) => {
  return <div className="flex flex-row gap-2 w-full max-w-7xl">{children}</div>;
};
