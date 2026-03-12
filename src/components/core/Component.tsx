import type React from "react";
import { COMPONENTS_MAP } from "../../consts/components-map";
import type { IComponent } from "../../models/interfaces/component";

export const Component: React.FC<IComponent> = (component) => {
  const MyComponent = COMPONENTS_MAP[component.type];

  return (
    <MyComponent>
      {component.children?.map((child) => {
        return <Component key={child.id} {...child}></Component>;
      })}
    </MyComponent>
  );
};
