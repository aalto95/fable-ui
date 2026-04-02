import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Dialog } from "@/components/app/Dialog";
import { NotFound } from "@/components/app/NotFound";
import { Toaster } from "@/components/app/Sonner";
import { Renderer } from "@/components/core/Renderer";
import { Shell } from "@/components/core/Shell";
import { DebugProvider } from "@/contexts/debug";
import { type DialogConfig, DialogProvider } from "@/contexts/dialog";
import { http } from "@/lib/http-client";
import type { IPage } from "@/models/interfaces/page";

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
