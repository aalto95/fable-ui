import type React from "react";

import { Button } from "../ui/button";

interface UI {
  type: string;
  children: {
    type: string;
    text: string;
  }[];
}

export const Renderer: React.FC<{ ui: UI }> = ({ ui }) => {
  if (ui.children) {
    return ui.children.map((child) => {
      if (child.type === "button") {
        return <Button key={child.text}>{child.text}</Button>;
      }
      return `${child.type} not supported`;
    });
  }
};
