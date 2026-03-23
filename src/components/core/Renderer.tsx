import { memo } from "react";
import type { IPage } from "@/models/interfaces/page";
import { Component } from "./Component";

type RendererProps = Pick<IPage, "ui">;

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
