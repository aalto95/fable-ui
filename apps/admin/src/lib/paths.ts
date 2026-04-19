export type Path = (string | number)[];

export function getAt(root: unknown, path: Path): unknown {
  let cur: unknown = root;
  for (const seg of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = Array.isArray(cur) ? cur[seg as number] : (cur as Record<string, unknown>)[seg as string];
  }
  return cur;
}

export function setAt(root: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const arr = [...root];
    const i = head as number;
    arr[i] = rest.length === 0 ? value : setAt(arr[i], rest, value);
    return arr;
  }
  if (root !== null && typeof root === "object") {
    const rec = { ...(root as Record<string, unknown>) };
    if (rest.length === 0) {
      rec[head as string] = value;
    } else {
      rec[head as string] = setAt(rec[head as string], rest, value);
    }
    return rec;
  }
  throw new Error("Cannot set path");
}

export function deleteAt(root: unknown, path: Path): unknown {
  if (path.length === 0) return root;
  const [head, ...rest] = path;
  if (rest.length === 0) {
    if (Array.isArray(root)) {
      const arr = [...(root as unknown[])];
      arr.splice(head as number, 1);
      return arr;
    }
    const rec = { ...(root as Record<string, unknown>) };
    delete rec[head as string];
    return rec;
  }
  if (Array.isArray(root)) {
    const arr = [...(root as unknown[])];
    arr[head as number] = deleteAt(arr[head as number], rest);
    return arr;
  }
  const rec = { ...(root as Record<string, unknown>) };
  rec[head as string] = deleteAt(rec[head as string], rest);
  return rec;
}

/** Insert into an array at `parentPath`. */
export function insertAt(root: unknown, parentPath: Path, index: number, item: unknown): unknown {
  const parent = getAt(root, parentPath);
  if (!Array.isArray(parent)) throw new Error("Parent is not an array");
  const next = [...parent];
  next.splice(index, 0, item);
  return setAt(root, parentPath, next);
}

export function pathKey(path: Path): string {
  return JSON.stringify(path);
}

/** Parent path + numeric index for array slots (e.g. `['ui', 0]` → parent `['ui']`, index `0`). */
export function getParentAndIndex(path: Path): { parentPath: Path; index: number } | null {
  if (path.length < 2) return null;
  const last = path[path.length - 1];
  if (typeof last !== "number") return null;
  return { parentPath: path.slice(0, -1), index: last };
}

/**
 * Reorder within one array parent. `targetPath` is a sibling; insert the dragged node
 * before or after that row.
 */
export function moveSibling(
  doc: unknown,
  fromPath: Path,
  targetPath: Path,
  place: "before" | "after",
): unknown | null {
  const fromPI = getParentAndIndex(fromPath);
  const toPI = getParentAndIndex(targetPath);
  if (!fromPI || !toPI) return null;
  if (pathKey(fromPI.parentPath) !== pathKey(toPI.parentPath)) return null;
  if (pathKey(fromPath) === pathKey(targetPath)) return null;

  const from = fromPI.index;
  const target = toPI.index;

  let to = place === "before" ? target : target + 1;
  if (from < to) to--;

  const arr = getAt(doc, fromPI.parentPath);
  if (!Array.isArray(arr)) return null;
  if (from < 0 || from >= arr.length) return null;
  if (to < 0 || to > arr.length - 1) return null;

  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return setAt(doc, fromPI.parentPath, next);
}

/** Path of the moved node after `moveSibling` succeeds (same `fromPath` / `targetPath` / `place`). */
export function pathAfterSiblingMove(
  fromPath: Path,
  targetPath: Path,
  place: "before" | "after",
): Path | null {
  const fromPI = getParentAndIndex(fromPath);
  const toPI = getParentAndIndex(targetPath);
  if (!fromPI || !toPI) return null;
  if (pathKey(fromPI.parentPath) !== pathKey(toPI.parentPath)) return null;

  const from = fromPI.index;
  const target = toPI.index;
  let to = place === "before" ? target : target + 1;
  if (from < to) to--;
  return [...fromPI.parentPath, to];
}
