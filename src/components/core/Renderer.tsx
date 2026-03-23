import type React from "react";
import { memo } from "react";
import type { IComponent } from "@/models/interfaces/component";
import { Component } from "./Component";

type RendererProps = {
  ui?: IComponent[];
};

const RendererInner: React.FC<RendererProps> = ({ ui }) => {
  if (!ui || ui.length === 0) {
    return null;
  }

  return (
    <>
      {ui.map((component) => (
        <Component key={component.id} {...component} />
      ))}
    </>
  );
};

export const Renderer = memo(RendererInner);
