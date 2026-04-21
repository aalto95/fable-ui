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

/** True if `a` is a prefix of `b` (same segments for `a.length`). */
export function pathPrefix(a: Path, b: Path): boolean {
  if (a.length > b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/**
 * After removing `deletedPath`, adjust a path to an array that may have shifted indices.
 * Returns `null` if `parent` pointed inside the deleted subtree.
 */
export function mapPathAfterDelete(parent: Path, deletedPath: Path): Path | null {
  const delPI = getParentAndIndex(deletedPath);
  if (!delPI) return parent;
  if (pathPrefix(deletedPath, parent) && parent.length > deletedPath.length) return null;
  const out = [...parent];
  const pp = delPI.parentPath;
  if (out.length <= pp.length) return out;
  let same = true;
  for (let i = 0; i < pp.length; i++) {
    if (out[i] !== pp[i]) {
      same = false;
      break;
    }
  }
  if (!same) return out;
  const idx = pp.length;
  if (typeof out[idx] === "number" && typeof delPI.index === "number" && out[idx] > delPI.index) {
    out[idx] = out[idx] - 1;
  }
  return out;
}

/**
 * Move a node into another container’s child list (reparent). `containerPath` is the row
 * you drop onto (e.g. a `v_stack`); the item is appended unless `insertIndex` is set.
 */
export function moveInto(
  doc: unknown,
  fromPath: Path,
  parentInsert: Path,
  insertIndex?: number,
): { doc: unknown; nextPath: Path } | null {
  const fromPI = getParentAndIndex(fromPath);
  if (!fromPI) return null;
  const item = getAt(doc, fromPath);
  if (item === undefined) return null;

  if (pathPrefix(fromPath, parentInsert) && parentInsert.length > fromPath.length) return null;

  if (pathKey(fromPI.parentPath) === pathKey(parentInsert)) {
    const arr = getAt(doc, parentInsert);
    if (!Array.isArray(arr)) return null;
    const from = fromPI.index;
    let to = insertIndex ?? arr.length;
    if (to > arr.length) to = arr.length;
    if (to < 0) to = 0;
    const next = [...arr];
    const [el] = next.splice(from, 1);
    let adjustedTo = to;
    if (from < to) adjustedTo--;
    if (adjustedTo < 0) adjustedTo = 0;
    if (adjustedTo > next.length) adjustedTo = next.length;
    next.splice(adjustedTo, 0, el);
    return { doc: setAt(doc, parentInsert, next), nextPath: [...parentInsert, adjustedTo] };
  }

  const doc2 = deleteAt(doc, fromPath);
  const adjustedParent = mapPathAfterDelete(parentInsert, fromPath);
  if (adjustedParent === null) return null;
  const arr2 = getAt(doc2, adjustedParent);
  const len = Array.isArray(arr2) ? arr2.length : 0;
  let idx = insertIndex ?? len;
  if (idx < 0) idx = 0;
  if (idx > len) idx = len;
  const nextDoc = insertAt(doc2, adjustedParent, idx, item);
  return { doc: nextDoc, nextPath: [...adjustedParent, idx] };
}
