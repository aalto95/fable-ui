import type React from "react";
import type { PropsWithChildren } from "react";
import { COMPONENTS_MAP } from "../../consts/components-map";
import type { IComponent } from "../../models/interfaces/component";

export const Component: React.FC<PropsWithChildren<IComponent>> = (
  component,
) => {
  const MyComponent = COMPONENTS_MAP[component.type];

  return (
    <MyComponent>
      {component?.descendants?.map((child) => {
        switch (child.type) {
          case "v_stack":
            console.warn(`${child.type} is rendered`);
            return (
              <Component
                key={child.id}
                id={child.id}
                type={child.type}
                descendants={child.descendants}
              />
            );
          case "button":
            console.warn(`${child.type} is rendered`);
            return (
              <Component key={child.id} id={child.id} type={child.type}>
                {child.text}
              </Component>
            );
          default:
            console.warn(`${child.type} is not yet supported.`);
            return null;
        }
      })}
    </MyComponent>
  );
};
