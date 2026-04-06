import { registerDefaultComponents } from "@sdui/renderer";
import { ThemeProvider } from "next-themes";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { App } from "./App.tsx";

registerDefaultComponents();

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>,
  );
}
