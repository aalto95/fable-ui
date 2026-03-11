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
        return el.type;
      })}
    </>
  );
};
