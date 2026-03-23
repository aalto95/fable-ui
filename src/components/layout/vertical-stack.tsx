import type { PropsWithChildren } from "react";
import type { IVStackComponent } from "@/models/interfaces/component";

type VerticalStackProps = Pick<IVStackComponent, "id">;

export const VerticalStack: React.FC<PropsWithChildren<VerticalStackProps>> = ({
  id,
  children,
}) => {
  return (
    <div id={id} className="flex flex-col gap-2 w-full">
      {children}
    </div>
  );
};
