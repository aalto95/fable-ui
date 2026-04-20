import { getAt, getParentAndIndex, type Path, pathKey } from "../paths";
import { isRecord } from "../uiDocumentGuards";

/** Every path that has children in the structure tree (for “expand all”). */
export function collectExpandablePathKeys(doc: unknown): string[] {
  const out = new Set<string>();
  function visit(path: Path) {
    const node = path.length === 0 ? doc : getAt(doc, path);
    const kids = childPaths(path, node);
    if (kids.length === 0) return;
    out.add(pathKey(path));
    for (const { subPath } of kids) {
      visit(subPath);
    }
  }
  visit([]);
  return [...out];
}

export function countStructurePages(doc: unknown): number {
  if (!isRecord(doc)) return 0;
  const ui = doc.ui;
  return Array.isArray(ui) ? ui.length : 0;
}

export function nodeLabel(path: Path, node: unknown): string {
  if (path.length === 0) return "Document";
  if (path.length >= 2 && path[path.length - 2] === "items" && isRecord(node)) {
    return `accordion: ${typeof node.title === "string" ? node.title : "…"}`;
  }
  if (path.length >= 2 && path[path.length - 2] === "heads" && isRecord(node)) {
    return `column: ${typeof node.label === "string" ? node.label : "…"}`;
  }
  const last = path[path.length - 1];
  if (last === "origins") return "origins";
  if (typeof last === "number" && path[path.length - 2] === "origins") {
    return `origin[${last}]`;
  }
  if (!isRecord(node)) return "…";
  if ("route" in node && Array.isArray(getAt(node, ["ui"]))) {
    const route = typeof node.route === "string" ? node.route : "?";
    return `Page ${route}`;
  }
  const t = node.type;
  if (typeof t === "string") {
    if (t === "button")
      return `button: ${typeof node.text === "string" ? node.text : "…"}`;
    if (t === "markdown") {
      const c = typeof node.content === "string" ? node.content : "";
      const line = c.split("\n")[0]?.trim() ?? "";
      const max = 48;
      const preview = line.length > max ? `${line.slice(0, max)}…` : line;
      return preview ? `markdown: ${preview}` : "markdown";
    }
    if (t === "title" || t === "subtitle")
      return `${t}: ${typeof node.text === "string" ? node.text : "…"}`;
    if ("name" in node && typeof node.name === "string")
      return `${t}: ${node.name}`;
    return t;
  }
  if ("label" in node && "type" in node) {
    const a = node as { type?: unknown; label?: unknown };
    return `action: ${typeof a.label === "string" ? a.label : "…"}`;
  }
  if (
    "name" in node &&
    "label" in node &&
    !("type" in node && node.type === "button")
  ) {
    const h = node as { name?: unknown; label?: unknown };
    return `head: ${typeof h.label === "string" ? h.label : "…"}`;
  }
  return "node";
}

export function childPaths(
  path: Path,
  node: unknown,
): { subPath: Path; label: string }[] {
  if (path.length === 1 && path[0] === "origins" && Array.isArray(node)) {
    return node.map((_, i) => ({
      subPath: ["origins", i],
      label: `origin ${i}`,
    }));
  }

  if (path.length === 0 && isRecord(node)) {
    const out: { subPath: Path; label: string }[] = [];
    if (Array.isArray(node.ui)) {
      const pages = node.ui;
      for (let i = 0; i < pages.length; i++) {
        out.push({ subPath: ["ui", i], label: `page ${i}` });
      }
    }
    return out;
  }

  if (!isRecord(node)) return [];
  const out: { subPath: Path; label: string }[] = [];

  const t = node.type;
  if (t === "h_stack" || t === "v_stack" || t === "card") {
    const d = node.descendants;
    if (Array.isArray(d)) {
      for (let i = 0; i < d.length; i++) {
        out.push({ subPath: [...path, "descendants", i], label: `child ${i}` });
      }
    }
  } else if (t === "form") {
    const d = Array.isArray(node.descendants) ? node.descendants : node.fields;
    if (Array.isArray(d)) {
      const key = Array.isArray(node.descendants) ? "descendants" : "fields";
      for (let i = 0; i < d.length; i++) {
        out.push({ subPath: [...path, key, i], label: `child ${i}` });
      }
    }
  } else if (t === "accordion") {
    const items = node.items;
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        out.push({ subPath: [...path, "items", i], label: `item ${i}` });
      }
    }
  } else if (t === "button") {
    const actions = node.actions;
    if (Array.isArray(actions)) {
      for (let i = 0; i < actions.length; i++) {
        out.push({ subPath: [...path, "actions", i], label: `action ${i}` });
      }
    }
  } else if (t === "table") {
    const heads = node.heads;
    const actions = node.actions;
    if (Array.isArray(heads)) {
      for (let i = 0; i < heads.length; i++) {
        out.push({ subPath: [...path, "heads", i], label: `column ${i}` });
      }
    }
    if (Array.isArray(actions)) {
      for (let i = 0; i < actions.length; i++) {
        out.push({ subPath: [...path, "actions", i], label: `action ${i}` });
      }
    }
  }

  if ("route" in node && Array.isArray(node.ui)) {
    const blocks = node.ui;
    for (let i = 0; i < blocks.length; i++) {
      out.push({ subPath: [...path, "ui", i], label: `block ${i}` });
    }
  }

  return out;
}

export function getParentListPath(
  path: Path | null,
): { parentPath: Path; index: number } | null {
  if (path === null) return null;
  return getParentAndIndex(path);
}

export function insertionTargetFor(
  path: Path | null,
  doc: unknown,
): { parentPath: Path } | null {
  if (path === null) return null;
  const node = getAt(doc, path);
  if (path.length === 0) {
    return null;
  }
  if (path[0] === "origins") return null;
  if (isRecord(node) && "route" in node && Array.isArray(node.ui)) {
    return { parentPath: [...path, "ui"] };
  }
  if (!isRecord(node)) return null;
  const t = node.type;
  if (t === "h_stack" || t === "v_stack" || t === "card") {
    return { parentPath: [...path, "descendants"] };
  }
  if (t === "form") {
    if (Array.isArray(node.descendants)) {
      return { parentPath: [...path, "descendants"] };
    }
    if (Array.isArray(node.fields)) {
      return { parentPath: [...path, "fields"] };
    }
    return { parentPath: [...path, "descendants"] };
  }
  if (t === "accordion") {
    return { parentPath: [...path, "items"] };
  }
  if (t === "button") {
    return {
      parentPath: [...path, "actions"],
    };
  }
  if (t === "table") {
    return {
      parentPath: [...path, "actions"],
    };
  }
  const pl = getParentListPath(path);
  if (!pl) return null;
  const parent = getAt(doc, pl.parentPath);
  if (!Array.isArray(parent)) return null;
  const parentKey = pl.parentPath[pl.parentPath.length - 1];
  if (parentKey === "ui") {
    return { parentPath: pl.parentPath };
  }
  if (parentKey === "descendants") {
    return { parentPath: pl.parentPath };
  }
  if (parentKey === "fields") {
    return { parentPath: pl.parentPath };
  }
  if (parentKey === "actions") {
    return { parentPath: pl.parentPath };
  }
  if (parentKey === "heads") {
    return { parentPath: pl.parentPath };
  }
  if (parentKey === "items") {
    return { parentPath: pl.parentPath };
  }
  return null;
}
