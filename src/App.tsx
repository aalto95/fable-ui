import type React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router";
import { Renderer } from "./components/core/Renderer";
import type { Page } from "./models/interfaces/page";

export const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>();

  fetch("./ui.json").then((resp) => {
    resp.json().then((uiSchema: Page[]) => {
      setPages(uiSchema);
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
