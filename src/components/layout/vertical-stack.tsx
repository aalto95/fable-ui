import type { PropsWithChildren } from "react";
import type { IVStackComponent } from "@/models/interfaces/component";

type VerticalStackProps = IVStackComponent;

export const VerticalStack: React.FC<PropsWithChildren<VerticalStackProps>> = ({
  children,
}) => {
  return <div className="flex flex-col gap-2 w-full max-w-7xl">{children}</div>;
};
