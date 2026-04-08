import { BaseButton } from "fable-ui";
import { X } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router";

import { Footer } from "../app/Footer.tsx";
import { Header } from "../app/Header.tsx";
import type { ShellNavItem } from "./shell-nav.ts";

const NAV_GROUPS = ["App", "Components", "Schema"] as const;

function NavList({
  items,
  onItemActivate,
}: {
  items: ShellNavItem[];
  onItemActivate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Site">
      {NAV_GROUPS.map((group) => {
        const groupItems = items.filter((i) => i.group === group);
        if (groupItems.length === 0) {
          return null;
        }
        return (
          <div key={group} className="mb-3 last:mb-0">
            <p className="mb-1.5 px-2 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
              {group}
            </p>
            <ul className="flex flex-col gap-0.5">
              {groupItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => onItemActivate?.()}
                    className={({ isActive }) =>
                      [
                        "block rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function MobileNavDrawer({
  open,
  onClose,
  items,
  titleId,
}: {
  open: boolean;
  onClose: () => void;
  items: ShellNavItem[];
  titleId: string;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => document.getElementById("mobile-nav-close")?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside
        id="mobile-nav-panel"
        className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-border bg-background shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-3">
          <p id={titleId} className="text-sm font-semibold text-foreground">
            Menu
          </p>
          <BaseButton
            id="mobile-nav-close"
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X className="size-4" aria-hidden />
          </BaseButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
          <NavList items={items} onItemActivate={onClose} />
        </div>
      </aside>
    </div>,
    document.body,
  );
}

export const Shell: React.FC<
  PropsWithChildren<{ navItems: ShellNavItem[] }>
> = ({ navItems, children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const titleId = useId();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh w-full flex-col md:flex-row md:items-stretch">
      <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-border bg-muted/20 md:flex md:min-h-dvh md:flex-col">
        <div className="p-3">
          <NavList items={navItems} />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header
          menuOpen={mobileNavOpen}
          onMenuOpen={() => setMobileNavOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-auto p-4">
          <div className="mx-auto h-full w-full max-w-7xl">{children}</div>
        </main>
        <Footer />
      </div>

      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        items={navItems}
        titleId={titleId}
      />
    </div>
  );
};
