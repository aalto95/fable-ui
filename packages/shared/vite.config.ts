import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL("./package.json", import.meta.url)), "utf-8"),
) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const srcRoot = resolve(__dirname, "src");

const external = new Set<string>([
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]);

function isExternal(id: string): boolean {
  if (id.startsWith(".") || id.startsWith("/") || id.startsWith("\0")) {
    return false;
  }
  if (external.has(id)) {
    return true;
  }
  if (id.startsWith("react/")) {
    return true;
  }
  const pkgName = id.startsWith("@") ? id.split("/").slice(0, 2).join("/") : id.split("/")[0];
  return external.has(pkgName ?? "");
}

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    dts({
      include: ["src"],
      rollupTypes: false,
      tsconfigPath: "./tsconfig.build.json",
      outDir: "dist",
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: isExternal,
      output: {
        dir: resolve(__dirname, "dist"),
        format: "es",
        preserveModules: true,
        preserveModulesRoot: srcRoot,
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
  },
});
