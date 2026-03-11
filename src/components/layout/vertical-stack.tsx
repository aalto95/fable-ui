import type React from "react";
import type { PropsWithChildren } from "react";

export const VerticalStack: React.FC<PropsWithChildren> = (props) => {
  return <div>{props.children}</div>;
};
