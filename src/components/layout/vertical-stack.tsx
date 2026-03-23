import type { PropsWithChildren } from "react";

export const VerticalStack: React.FC<PropsWithChildren> = (props) => {
  return <div className="flex flex-col gap-2 w-full">{props.children}</div>;
};
