import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));
const libSrc = resolve(workspaceRoot, "packages/fable-ui/src");

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

export default defineConfig({
  envPrefix: ["VITE_", "UI_"],
  plugins: [fableUiLibAtAlias(), react(), tailwindcss()],
  resolve: {
    alias: {
      "fable-ui/register-async": resolve(
        workspaceRoot,
        "packages/fable-ui/src/register-async.ts",
      ),
      "fable-ui/register": resolve(
        workspaceRoot,
        "packages/fable-ui/src/register.ts",
      ),
      "fable-ui": resolve(
        workspaceRoot,
        "packages/fable-ui/src/index.ts",
      ),
    },
  },
});
