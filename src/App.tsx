import type React from "react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Renderer } from "./components/core/Renderer";
import type { Page } from "./models/interfaces/page";
import { Header } from "./components/core/Header";
import { Footer } from "./components/core/Footer";
import { Toaster } from "./components/singleton/sonner";
import { DebugProvider } from "./contexts/debug";

export const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>();
  const [debugEnabled, setDebugEnabled] = useState<boolean>(() => {
    const raw = localStorage.getItem("bdui.debug.enabled");
    return raw === "true";
  });

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

  useEffect(() => {
    localStorage.setItem("bdui.debug.enabled", String(debugEnabled));
  }, [debugEnabled]);

  return (
    <DebugProvider enabled={debugEnabled} setEnabled={setDebugEnabled}>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="p-4 flex-1">
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
        <Toaster />
      </div>
    </DebugProvider>
  );
};
