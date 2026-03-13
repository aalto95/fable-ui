import type React from "react";
import type { PropsWithChildren } from "react";

export const HorizontalStack: React.FC<PropsWithChildren> = (props) => {
  return <div className="flex flex-row gap-4">{props.children}</div>;
};
