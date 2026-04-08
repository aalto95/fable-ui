import {
  DebugProvider,
  type DialogConfig,
  DialogProvider,
  type IPage,
  Renderer,
} from "fable-ui";
import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router";
import { Dialog } from "./components/app/Dialog.tsx";
import { NotFound } from "./components/app/NotFound.tsx";
import { Toaster } from "./components/app/Sonner.tsx";
import { Shell } from "./components/core/Shell.tsx";
import { buildShellNavItems } from "./components/core/shell-nav";
import { DocsPage } from "./docs/DocsPage.tsx";
import { HomePage } from "./home/HomePage.tsx";
import { UI_SCHEMA_PAGES } from "./schema/ui-schema";
import { ShowcaseDemoPage } from "./showcase/ShowcaseDemoPage.tsx";

function isRootSchemaPage(route: string): boolean {
  const r = route.startsWith("/") ? route : `/${route}`;
  return r === "/";
}

export const App: React.FC = () => {
  const pages: IPage[] = UI_SCHEMA_PAGES;
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>(null);
  const [debugEnabled, setDebugEnabled] = useState<boolean>(() => {
    const raw = localStorage.getItem("fableUi.debug.enabled");
    return raw === "true";
  });

  useEffect(() => {
    localStorage.setItem("fableUi.debug.enabled", String(debugEnabled));
  }, [debugEnabled]);

  const navItems = useMemo(() => buildShellNavItems(pages), [pages]);

  return (
    <DebugProvider enabled={debugEnabled} setEnabled={setDebugEnabled}>
      <DialogProvider config={dialogConfig} setConfig={setDialogConfig}>
        <Shell navItems={navItems}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/showcase/:kind" element={<ShowcaseDemoPage />} />
            {pages
              .filter((page) => !isRootSchemaPage(page.route))
              .map((page) => (
                <Route
                  key={page.route}
                  path={page.route}
                  element={<Renderer ui={page.ui} />}
                />
              ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Shell>
        <Toaster />
        <Dialog />
      </DialogProvider>
    </DebugProvider>
  );
};
