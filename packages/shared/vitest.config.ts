import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [resolve(__dirname, "./src/__tests__/setup.ts")],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
