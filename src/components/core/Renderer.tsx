import type React from "react";
import type { IComponent } from "../../models/interfaces/component";
import { Component } from "./Component";

export const Renderer: React.FC<{ ui: IComponent[] }> = ({ ui }) => {
  return ui.map((component) => {
    return (
      <Component
        key={component.id}
        id={component.id}
        type={component.type}
        descendants={component.descendants}
      ></Component>
    );
  });
};
