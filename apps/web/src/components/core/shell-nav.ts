import type { IPage } from "fable-ui";

import {
  SHOWCASE_SLUGS,
  showcaseSlugLabel,
} from "../../showcase/showcase-demos";

export type ShellNavItem = {
  to: string;
  label: string;
  group: string;
};

function normalizeRoute(route: string): string {
  if (route === "" || route === "/") {
    return "/";
  }
  return route.startsWith("/") ? route : `/${route}`;
}

function routeLabel(route: string): string {
  const path = normalizeRoute(route);
  if (path === "/") {
    return "Home";
  }
  const seg = path.split("/").filter(Boolean);
  const last = seg[seg.length - 1];
  if (!last) {
    return path;
  }
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function buildShellNavItems(pages: IPage[] | undefined): ShellNavItem[] {
  const seen = new Set<string>();
  const items: ShellNavItem[] = [];

  const push = (to: string, label: string, group: string) => {
    const key = to;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    items.push({ to, label, group });
  };

  push("/", "Home", "App");
  push("/docs", "Docs", "App");

  for (const slug of SHOWCASE_SLUGS) {
    push(`/showcase/${slug}`, showcaseSlugLabel(slug), "Components");
  }

  for (const p of pages ?? []) {
    const to = normalizeRoute(p.route);
    push(to, routeLabel(p.route), "Schema");
  }

  return items;
}
