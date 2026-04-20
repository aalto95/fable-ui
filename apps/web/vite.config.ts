import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig, loadEnv } from "vite";

const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));
const webAppRoot = fileURLToPath(new URL(".", import.meta.url));
const libSrc = resolve(workspaceRoot, "packages/fable-ui/src");

/** Single React instance — required when `fable-ui` is linked from source (avoid invalid hook calls). */
const requireFromWeb = createRequire(import.meta.url);
const reactRoot = dirname(requireFromWeb.resolve("react/package.json"));
const reactDomRoot = dirname(requireFromWeb.resolve("react-dom/package.json"));

function resolveLibFile(subPath: string): string | undefined {
  const base = resolve(libSrc, subPath);
  const candidates = [`${base}.ts`, `${base}.tsx`, base];
  for (const file of candidates) {
    if (existsSync(file)) {
      return file;
    }
  }
  return undefined;
}

function fableUiLibAtAlias(): Plugin {
  return {
    name: "fable-ui-lib-at-alias",
    enforce: "pre",
    resolveId(id, importer) {
      if (!id.startsWith("@/") || !importer) {
        return null;
      }
      const normalized = importer.replace(/\\/g, "/");
      if (!normalized.includes("/packages/fable-ui/")) {
        return null;
      }
      return resolveLibFile(id.slice(2)) ?? null;
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, webAppRoot, "");
  const siteUrl =
    (env.VITE_SITE_URL ?? "").replace(/\/$/, "") || "http://localhost:5173";

  return {
    envPrefix: ["VITE_", "UI_"],
    plugins: [
      fableUiLibAtAlias(),
      react(),
      tailwindcss(),
      {
        name: "html-meta-site-url",
        transformIndexHtml(html) {
          return html.replaceAll("%SITE_URL%", siteUrl);
        },
      },
    ],
    resolve: {
      dedupe: ["react", "react-dom", "react-router"],
      alias: {
        react: reactRoot,
        "react-dom": reactDomRoot,
        "fable-ui/styles.css": resolve(
          workspaceRoot,
          "packages/fable-ui/src/styles/fable-ui.css",
        ),
        "fable-ui/register-async": resolve(
          workspaceRoot,
          "packages/fable-ui/src/register-async.ts",
        ),
        "fable-ui/register": resolve(
          workspaceRoot,
          "packages/fable-ui/src/register.ts",
        ),
        "fable-ui": resolve(workspaceRoot, "packages/fable-ui/src/index.ts"),
      },
    },
  };
});
