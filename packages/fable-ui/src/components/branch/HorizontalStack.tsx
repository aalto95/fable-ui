import type { PropsWithChildren } from "react";
import type { IHStackComponent } from "@/models/interfaces/component";

export type THorizontalStackProps = Exclude<IHStackComponent, "type">;

export const HorizontalStack: React.FC<PropsWithChildren<THorizontalStackProps>> = ({
  children,
}) => {
  return <div className="flex w-full flex-row gap-2">{children}</div>;
};
