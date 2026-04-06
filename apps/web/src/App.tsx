import {
  DebugProvider,
  type DialogConfig,
  DialogProvider,
  http,
  type IPage,
  Renderer,
} from "@sdui/renderer";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Dialog } from "./components/app/Dialog.tsx";
import { NotFound } from "./components/app/NotFound.tsx";
import { Toaster } from "./components/app/Sonner.tsx";
import { Shell } from "./components/core/Shell.tsx";

type Schema = {
  $schema: string;
  ui: IPage[];
};

export const App: React.FC = () => {
  const [pages, setPages] = useState<IPage[]>();
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>(null);
  const [debugEnabled, setDebugEnabled] = useState<boolean>(() => {
    const raw = localStorage.getItem("sdui.debug.enabled");
    return raw === "true";
  });

  useEffect(() => {
    const schemaPath =
      import.meta.env.UI_SCHEMA_PATH ?? "http://localhost:3000/ui";
    http
      .get<Schema>(schemaPath)
      .then((uiSchema) => {
        setPages(uiSchema.ui);
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
        <Shell>
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
        </Shell>
        <Toaster />
        <Dialog />
      </DialogProvider>
    </DebugProvider>
  );
};
