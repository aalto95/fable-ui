import type React from "react";
import type { PropsWithChildren } from "react";

export const VerticalStack: React.FC<PropsWithChildren> = (props) => {
  return <div className="flex flex-col gap-4">{props.children}</div>;
};
