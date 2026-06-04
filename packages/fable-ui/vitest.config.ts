import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));
const libSrc = resolve(__dirname, "src");
const sharedSrc = resolve(workspaceRoot, "packages/shared/src");

function resolveLibFile(base: string, subPath: string): string | undefined {
  const candidates = [
    resolve(base, subPath),
    resolve(base, `${subPath}.ts`),
    resolve(base, `${subPath}.tsx`),
    resolve(base, `${subPath}/index.ts`),
  ];
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
      const base = normalized.includes("packages/shared") ? sharedSrc : libSrc;
      return resolveLibFile(base, id.slice(2)) ?? null;
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "fable-shared": resolve(sharedSrc, "index.ts"),
    },
  },
  plugins: [react(), fableUiLibAtAlias()],
  test: {
    environment: "jsdom",
    setupFiles: [resolve(libSrc, "__tests__/setup.ts")],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
