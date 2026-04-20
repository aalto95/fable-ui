import { BaseButton, useDebug, useTheme } from "fable-ui";
import { Menu } from "lucide-react";
import { Link } from "react-router";

export type HeaderProps = {
  /** When set, shows a hamburger on small screens that opens the nav drawer. */
  onMenuOpen?: () => void;
  /** Whether the mobile nav drawer is open (for `aria-expanded`). */
  menuOpen?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ onMenuOpen, menuOpen = false }) => {
  const { enabled, setEnabled } = useDebug();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="w-full shrink-0 border-border border-b px-4 py-3 sm:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {onMenuOpen ? (
            <BaseButton
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 md:hidden"
              onClick={onMenuOpen}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? "mobile-nav-panel" : undefined}
            >
              <Menu className="size-4" aria-hidden />
            </BaseButton>
          ) : null}
          <Link to="/" className="min-w-0 truncate hover:opacity-90">
            <h1 className="font-bold text-xl sm:text-2xl">Fable UI</h1>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
        </div>
      </div>
    </header>
  );
};
