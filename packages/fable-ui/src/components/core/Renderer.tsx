import { memo } from "react";
import type { TComponentUnion } from "@/models/interfaces/component";
import type { IPage } from "@/models/interfaces/page";
import { Component } from "./Component";

type RendererProps = {
  ui?: IPage["ui"] | TComponentUnion;
};

const RendererInner: React.FC<RendererProps> = ({ ui }) => {
  if (!ui) {
    return null;
  }

  const components = Array.isArray(ui) ? ui : [ui];
  if (components.length === 0) {
    return null;
  }

  return (
    <>
      {components.map((component, i) => (
        <Component key={i} {...component} />
      ))}
    </>
  );
};

export const Renderer = memo(RendererInner);
