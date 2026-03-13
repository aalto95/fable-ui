import type React from "react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Renderer } from "./components/core/Renderer";
import type { Page } from "./models/interfaces/page";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";

export const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>();

  useEffect(() => {
    fetch("./ui.json")
      .then((resp) => resp.json())
      .then((uiSchema: Page[]) => {
        setPages(uiSchema);
      })
      .catch((error) => {
        console.error("Failed to load UI schema:", error);
      });
  }, []);

  return (
    <div className="flex flex-col h-screen">
    <Header />
    <main className="h-full p-4">
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
    </main>
    <Footer />
    </div>
  );
};
