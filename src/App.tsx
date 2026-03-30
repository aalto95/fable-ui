import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Footer } from "@/components/core/Footer";
import { Header } from "@/components/core/Header";
import { Renderer } from "@/components/core/Renderer";
import { Dialog } from "@/components/singleton/dialog";
import { NotFound } from "@/components/singleton/not-found";
import { Toaster } from "@/components/singleton/sonner";
import { DebugProvider } from "@/contexts/debug";
import { type DialogConfig, DialogProvider } from "@/contexts/dialog";
import type { IPage } from "@/models/interfaces/page";

export const App: React.FC = () => {
  const [pages, setPages] = useState<IPage[]>();
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    title: "This is a Server-Driven UI Renderer",
    description:
      "It serves as a showcase of modern SDUI systems where Frontend serves as a rendering engine while Server is sending JSON-schema which defines the structure of UI, actions, side effects, routing and whatever you want it to do.",
    confirmText: "Confirm",
    hideCancel: true,
    onConfirm: () => {
      setDialogConfig(null);
    },
  });
  const [debugEnabled, setDebugEnabled] = useState<boolean>(() => {
    const raw = localStorage.getItem("sdui.debug.enabled");
    return raw === "true";
  });

  useEffect(() => {
    fetch("/ui.json")
      .then((resp) => resp.json())
      .then((uiSchema: IPage[]) => {
        setPages(uiSchema);
      })
      .catch((error) => {
        console.error("Failed to load UI schema:", error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("sdui.debug.enabled", String(debugEnabled));
  }, [debugEnabled]);

  return (
    <DebugProvider enabled={debugEnabled} setEnabled={setDebugEnabled}>
      <DialogProvider config={dialogConfig} setConfig={setDialogConfig}>
        <div className="flex flex-col w-full items-center min-h-screen">
          <Header />
          <main className="p-4 flex-1 flex flex-col items-center w-full max-w-7xl">
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
          <Dialog />
        </div>
      </DialogProvider>
    </DebugProvider>
  );
};
