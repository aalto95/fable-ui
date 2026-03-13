import type React from "react";
import { memo } from "react";
import { COMPONENTS_MAP } from "../../consts/components-map";
import type { IComponent } from "../../models/interfaces/component";

type ComponentProps = IComponent & {
  children?: React.ReactNode;
};

const ComponentInner: React.FC<ComponentProps> = ({
  type,
  text,
  descendants,
  children,
  ...rest
}) => {
  const MyComponent = COMPONENTS_MAP[type];

  if (!MyComponent) {
    console.warn(`Unsupported component type: "${type}"`);
    return null;
  }

  // Void-like components (e.g. "input") must not receive children,
  // but can receive additional props such as "name", "placeholder", etc.
  if (type === "input") {
    return <MyComponent {...rest} />;
  }

  const hasDescendants = Array.isArray(descendants) && descendants.length > 0;

  const content = hasDescendants
    ? descendants!.map((child) => (
        <Component key={child.id} {...child} />
      ))
    : children ?? text;

  return (
    <MyComponent {...rest}>
      {content}
    </MyComponent>
  );
};

const arePropsEqual = (prev: ComponentProps, next: ComponentProps): boolean => {
  if (prev.id !== next.id || prev.type !== next.type || prev.text !== next.text) {
    return false;
  }

  const prevDesc = prev.descendants ?? [];
  const nextDesc = next.descendants ?? [];

  if (prevDesc === nextDesc) {
    return true;
  }

  if (prevDesc.length !== nextDesc.length) {
    return false;
  }

  for (let i = 0; i < prevDesc.length; i++) {
    const a = prevDesc[i];
    const b = nextDesc[i];

    if (a.id !== b.id || a.type !== b.type || a.text !== b.text) {
      return false;
    }
  }

  return true;
};

export const Component = memo(ComponentInner, arePropsEqual);
