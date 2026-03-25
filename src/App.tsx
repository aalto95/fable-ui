import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Footer } from "@/components/core/Footer";
import { Header } from "@/components/core/Header";
import { Renderer } from "@/components/core/Renderer";
import { NotFound } from "@/components/singleton/not-found";
import { Toaster } from "@/components/singleton/sonner";
import { DebugProvider } from "@/contexts/debug";
import type { IPage } from "@/models/interfaces/page";

export const App: React.FC = () => {
  const [pages, setPages] = useState<IPage[]>();
  const [debugEnabled, setDebugEnabled] = useState<boolean>(() => {
    const raw = localStorage.getItem("bdui.debug.enabled");
    return raw === "true";
  });

  useEffect(() => {
    fetch("./ui.json")
      .then((resp) => resp.json())
      .then((uiSchema: IPage[]) => {
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
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="p-4 flex-1 flex flex-col items-center">
          {pages?.length && (
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </main>
        <Footer />
        <Toaster />
      </div>
    </DebugProvider>
  );
};
