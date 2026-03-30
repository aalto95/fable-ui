import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Expose `UI_*` to the client for SDUI config (e.g. UI_SCHEMA_PATH) alongside Vite's default `VITE_*`.
  envPrefix: ["VITE_", "UI_"],
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
});
