import { ThemeProvider, type ThemeProviderProps } from "fable-ui";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { App } from "./App.tsx";

const root = document.getElementById("root");

if (root) {
  // next-themes@0.4.6: PropsWithChildren + React 19 JSX types disagree (TS2322).
  const themeProps = {
    attribute: "class" as const,
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: true,
    children: (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    ),
  } as ThemeProviderProps;

  createRoot(root).render(<ThemeProvider {...themeProps} />);
}
