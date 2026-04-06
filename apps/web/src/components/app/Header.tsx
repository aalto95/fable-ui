import { BaseButton, useDebug } from "@sdui/renderer";
import { useTheme } from "next-themes";
import { Link } from "react-router";

export const Header: React.FC = () => {
  const { enabled, setEnabled } = useDebug();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="w-full border-b border-border px-4 py-3 sm:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">SDUI Renderer</h1>
        <nav className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link to="/">Home</Link>
          <Link to="/showcase">Showcase</Link>
          <BaseButton
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            Theme: {isDark ? "Dark" : "Light"}
          </BaseButton>
          <BaseButton
            type="button"
            variant={enabled ? "default" : "outline"}
            size="sm"
            onClick={() => setEnabled(!enabled)}
          >
            Debug: {enabled ? "On" : "Off"}
          </BaseButton>
        </nav>
      </div>
    </header>
  );
};
