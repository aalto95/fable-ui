import type React from "react";
import { memo } from "react";
import { COMPONENTS_MAP } from "../../consts/components-map";
import type {
  CardComponent,
  ComponentsWithDescendants,
  FormComponent,
  HStackComponent,
  IComponent,
  VStackComponent,
} from "../../models/interfaces/component";

type ComponentProps = IComponent & {
  children?: React.ReactNode;
};

const ComponentInner: React.FC<ComponentProps> = (props) => {
  const { type, children, ...rest } = props;
  const MyComponent = COMPONENTS_MAP[type];

  if (!MyComponent) {
    console.warn(`Unsupported component type: "${type}"`);
    return null;
  }

  switch (type) {
    case "h_stack": {
      const { descendants } = rest as HStackComponent;
      const hasDescendants =
        Array.isArray(descendants) && descendants.length > 0;

      return (
        <MyComponent {...rest}>
          {hasDescendants &&
            descendants!.map((child) => (
              <Component key={child.id} {...child} />
            ))}
        </MyComponent>
      );
    }
    case "v_stack": {
      const { descendants } = rest as VStackComponent;
      const hasDescendants =
        Array.isArray(descendants) && descendants.length > 0;

      return (
        <MyComponent {...rest}>
          {hasDescendants &&
            descendants!.map((child) => (
              <Component key={child.id} {...child} />
            ))}
        </MyComponent>
      );
    }
    case "form": {
      const { descendants } = rest as FormComponent;
      const hasDescendants =
        Array.isArray(descendants) && descendants.length > 0;

      return (
        <MyComponent {...rest}>
          {hasDescendants &&
            descendants!.map((child) => (
              <Component key={child.id} {...child} />
            ))}
        </MyComponent>
      );
    }
    case "card": {
      const { descendants } = rest as CardComponent;
      const hasDescendants =
        Array.isArray(descendants) && descendants.length > 0;

      return (
        <MyComponent {...rest}>
          {hasDescendants &&
            descendants!.map((child) => (
              <Component key={child.id} {...child} />
            ))}
        </MyComponent>
      );
    }
    case "button": {
      const { text } = rest as Extract<IComponent, { type: "button" }>;
      return <MyComponent {...rest}>{children ?? text}</MyComponent>;
    }
    default: {
      return <MyComponent {...rest}>{children}</MyComponent>;
    }
  }
};

const arePropsEqual = (prev: ComponentProps, next: ComponentProps): boolean => {
  if (prev.id !== next.id || prev.type !== next.type) {
    return false;
  }

  const prevDesc =
    (prev as ComponentsWithDescendants).descendants ??
    [];
  const nextDesc =
    (next as ComponentsWithDescendants).descendants ??
    [];

  if (prevDesc === nextDesc) {
    return true;
  }

  if (prevDesc.length !== nextDesc.length) {
    return false;
  }

  // Shallow compare descendants by id and type.
  for (let i = 0; i < prevDesc.length; i++) {
    const a = prevDesc[i];
    const b = nextDesc[i];

    if (a.id !== b.id || a.type !== b.type) {
      return false;
    }
  }

  return true;
};

export const Component = memo(ComponentInner, arePropsEqual);
