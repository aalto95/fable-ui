import type React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router";
import { Renderer } from "./components/core/Renderer";
import { Button } from "./components/ui/button";

interface Page {
  route: string;
  ui: {
    type: string;
    children: {
      type: string;
      text: string;
    }[];
  };
}

type Pages = Page[];

export const App: React.FC = () => {
  const [pages, setPages] = useState<Pages>();

  fetch("./ui.json").then((resp) => {
    resp.json().then((jsonSchema: Pages) => {
      setPages(jsonSchema);
    });
  });

  return (
    <Routes>
      {pages?.map((page) => {
        return (
          <Route
            key={page.route}
            path={page.route}
            element={<Renderer ui={page.ui} />}
          />
        );
      })}
    </Routes>
  );
};
