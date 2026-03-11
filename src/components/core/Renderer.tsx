import type React from "react";
import { useState } from "react";
import { Button } from "../ui/button";

interface Schema {
  ui: {
    type: string;
    children: {
      type: string;
      text: string;
    }[];
  }[];
}

export const Renderer: React.FC = () => {
  const [schema, setSchema] = useState<Schema>();

  fetch("./ui-schema.json").then((resp) => {
    resp.json().then((jsonSchema) => {
      setSchema(jsonSchema);
    });
  });

  return (
    <>
      {schema?.ui.map((el) => {
        if (el.children) {
          return el.children.map((child) => {
            if (child.type === "button") {
              return <Button key={child.text}>{child.text}</Button>;
            }
            return `${child.type} not supported`;
          });
        }
        return el.type;
      })}
      <Button>Hello</Button>
    </>
  );
};
