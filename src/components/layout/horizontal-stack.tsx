import type { PropsWithChildren } from "react";
import type { IHStackComponent } from "@/models/interfaces/component";

type HorizontalStackProps = Pick<IHStackComponent, "id">;

export const HorizontalStack: React.FC<
  PropsWithChildren<HorizontalStackProps>
> = ({ id, children }) => {
  return (
    <div id={id} className="flex flex-row gap-2 w-full">
      {children}
    </div>
  );
};
