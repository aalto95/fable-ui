import { type IPage, Renderer, SduiProvider, useTheme } from "fable-ui";
import { useMemo } from "react";
import { Route, Routes } from "react-router";
import { NotFound } from "./components/app/NotFound.tsx";
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
  const { resolvedTheme } = useTheme();
  const toasterTheme =
    resolvedTheme === "dark" ? "dark" : resolvedTheme === "light" ? "light" : "system";
  const navItems = useMemo(() => buildShellNavItems(pages), [pages]);

  return (
    <SduiProvider toasterProps={{ theme: toasterTheme }}>
      <Shell navItems={navItems}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/showcase/:kind" element={<ShowcaseDemoPage />} />
          {pages
            .filter((page) => !isRootSchemaPage(page.route))
            .map((page) => (
              <Route key={page.route} path={page.route} element={<Renderer ui={page.ui} />} />
            ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
    </SduiProvider>
  );
};
