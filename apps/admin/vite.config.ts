import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const requireFromAdmin = createRequire(import.meta.url);
const reactRoot = path.dirname(requireFromAdmin.resolve("react/package.json"));
const reactDomRoot = path.dirname(requireFromAdmin.resolve("react-dom/package.json"));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom", "react-router"],
    alias: {
      "@": path.resolve(rootDir, "src"),
      react: reactRoot,
      "react-dom": reactDomRoot,
    },
  },
  server: {
    port: 5174,
  },
});
