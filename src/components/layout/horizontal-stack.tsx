import type { PropsWithChildren } from "react";

export const HorizontalStack: React.FC<PropsWithChildren> = (props) => {
  return <div className="flex flex-row gap-2 w-full">{props.children}</div>;
};
