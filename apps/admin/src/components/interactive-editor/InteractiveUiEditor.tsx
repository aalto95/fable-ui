import {
  ChevronsDownUp,
  ChevronsUpDown,
  GripVertical,
  ListTree,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { type DragEvent, useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ComponentType, defaultComponent, defaultPage } from "../../lib/componentDefaults";
import {
  collectExpandablePathKeys,
  countStructurePages,
  getParentListPath,
  insertionTargetFor,
} from "../../lib/interactiveEditor/treeModel";
import {
  deleteAt,
  getAt,
  insertAt,
  moveSibling,
  type Path,
  pathAfterSiblingMove,
  pathKey,
  setAt,
} from "../../lib/paths";
import { isRecord, isUiDoc } from "../../lib/uiDocumentGuards";
import { safeParseJson, withOriginsFirst } from "../../lib/uiJson";
import { insertableComponentTypesFor, structuredInsertButtonLabel } from "../../lib/uiSchema";
import { PropertyPanel } from "./PropertyPanel";
import { PATH_MIME, TreeRoot } from "./UiTree";

const ADD_COMPONENT_SENTINEL = "__add_component__";

function AddComponentTypeSelect({
  disabled,
  options,
  onAdd,
}: {
  disabled: boolean;
  options: readonly ComponentType[];
  onAdd: (type: ComponentType) => void;
}) {
  const [value, setValue] = useState(ADD_COMPONENT_SENTINEL);
  return (
    <>
      <label
        className="inline-flex cursor-pointer items-center gap-1 font-medium text-foreground text-sm"
        htmlFor="sdui-add-component"
      >
        <Plus className="size-3.5" strokeWidth={2} aria-hidden />
        Node
      </label>
      <Select
        value={value}
        onValueChange={(v) => {
          if (v === ADD_COMPONENT_SENTINEL) {
            setValue(v);
            return;
          }
          onAdd(v as ComponentType);
          setValue(ADD_COMPONENT_SENTINEL);
        }}
        disabled={disabled}
      >
        <SelectTrigger id="sdui-add-component" size="sm" className="min-w-[11rem]">
          <SelectValue placeholder="component…" />
        </SelectTrigger>
        <SelectContent position="popper" className="min-w-[var(--radix-select-trigger-width)]">
          <SelectItem value={ADD_COMPONENT_SENTINEL}>component…</SelectItem>
          {options.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

type Props = {
  uiJson: string;
  onUiJsonChange: (next: string) => void;
  disabled?: boolean;
};

export default function InteractiveUiEditor({ uiJson, onUiJsonChange, disabled = false }: Props) {
  const parsed = useMemo(() => safeParseJson(uiJson), [uiJson]);
  const doc = parsed.ok ? parsed.value : null;
  const valid = doc !== null && isUiDoc(doc);

  const [selectedPath, setSelectedPath] = useState<Path | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set([pathKey([]), pathKey(["ui"])]),
  );
  const dragPathRef = useRef<Path | null>(null);
  const [dragSourcePath, setDragSourcePath] = useState<Path | null>(null);
  const [dropHighlight, setDropHighlight] = useState<{
    pathKey: string;
    place: "before" | "after";
  } | null>(null);
  const toggle = useCallback((path: Path) => {
    const k = pathKey(path);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }, []);

  const revealAndSelectPath = useCallback((p: Path) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      for (let len = 0; len < p.length; len++) {
        next.add(pathKey(p.slice(0, len)));
      }
      return next;
    });
    setSelectedPath(p);
  }, []);

  const applyDoc = useCallback(
    (next: unknown) => {
      onUiJsonChange(JSON.stringify(withOriginsFirst(next), null, 2));
    },
    [onUiJsonChange],
  );

  const handleAdd = useCallback(
    (type?: ComponentType) => {
      if (!doc || !valid) return;
      const target = insertionTargetFor(selectedPath, doc);
      if (!target) return;
      const { parentPath } = target;
      const parent = getAt(doc, parentPath);
      const insertIndex = Array.isArray(parent) ? parent.length : 0;
      const parentKey = parentPath[parentPath.length - 1];
      let item: Record<string, unknown>;
      if (parentKey === "ui" && parentPath.length === 1) {
        item = defaultPage();
      } else if (parentKey === "actions") {
        const grandparent = getAt(doc, parentPath.slice(0, -1));
        item =
          isRecord(grandparent) && grandparent.type === "table"
            ? { type: "HTTP_GET", label: "Row action", path: "/" }
            : { type: "HTTP_GET", label: "Action", path: "/" };
      } else if (parentKey === "heads") {
        item = { name: "col", label: "Column", type: "string" };
      } else if (parentKey === "items") {
        item = { name: "item", title: "Section", text: "Body" };
      } else {
        if (!type) return;
        item = defaultComponent(type);
      }
      const nextDoc = insertAt(doc, parentPath, insertIndex, item);
      applyDoc(nextDoc);
      revealAndSelectPath([...parentPath, insertIndex]);
    },
    [applyDoc, doc, revealAndSelectPath, selectedPath, valid],
  );

  const handleAddPage = useCallback(() => {
    if (!doc || !valid) return;
    const pages = getAt(doc, ["ui"]);
    const insertIndex = Array.isArray(pages) ? pages.length : 0;
    applyDoc(insertAt(doc, ["ui"], insertIndex, defaultPage()));
    revealAndSelectPath(["ui", insertIndex]);
  }, [applyDoc, doc, revealAndSelectPath, valid]);

  const handleAddTableColumn = useCallback(() => {
    if (!doc || !valid || selectedPath === null) return;
    const node = getAt(doc, selectedPath);
    if (!isRecord(node) || node.type !== "table") return;
    const headsPath: Path = [...selectedPath, "heads"];
    const heads = getAt(doc, headsPath);
    if (!Array.isArray(heads)) return;
    const insertIndex = heads.length;
    const item: Record<string, unknown> = { name: "col", label: "Column", type: "string" };
    applyDoc(insertAt(doc, headsPath, insertIndex, item));
    revealAndSelectPath([...headsPath, insertIndex]);
  }, [applyDoc, doc, revealAndSelectPath, selectedPath, valid]);

  const handleDelete = useCallback(() => {
    if (!doc || !valid || selectedPath === null || selectedPath.length === 0) return;
    applyDoc(deleteAt(doc, selectedPath));
    setSelectedPath(null);
  }, [applyDoc, doc, selectedPath, valid]);

  const handleDragStartPath = useCallback((path: Path) => {
    dragPathRef.current = path;
    setDragSourcePath(path);
  }, []);

  const handleDragEnd = useCallback(() => {
    dragPathRef.current = null;
    setDragSourcePath(null);
    setDropHighlight(null);
  }, []);

  const handleDragOverRow = useCallback((path: Path, place: "before" | "after") => {
    setDropHighlight({ pathKey: pathKey(path), place });
  }, []);

  const handleDropOnRow = useCallback(
    (targetPath: Path, place: "before" | "after", e: DragEvent) => {
      e.preventDefault();
      if (!doc || !valid) return;
      let fromPath = dragPathRef.current;
      if (!fromPath) {
        const raw = e.dataTransfer.getData(PATH_MIME) || e.dataTransfer.getData("text/plain");
        if (!raw) {
          handleDragEnd();
          return;
        }
        try {
          fromPath = JSON.parse(raw) as Path;
        } catch {
          handleDragEnd();
          return;
        }
      }
      if (pathKey(fromPath) === pathKey(targetPath)) {
        handleDragEnd();
        return;
      }
      const nextDoc = moveSibling(doc, fromPath, targetPath, place);
      if (!nextDoc) {
        handleDragEnd();
        return;
      }
      applyDoc(nextDoc);
      const np = pathAfterSiblingMove(fromPath, targetPath, place);
      if (np && selectedPath !== null && pathKey(selectedPath) === pathKey(fromPath)) {
        setSelectedPath(np);
      }
      handleDragEnd();
    },
    [applyDoc, doc, handleDragEnd, selectedPath, valid],
  );

  const handleMove = useCallback(
    (delta: number) => {
      if (!doc || !valid || selectedPath === null) return;
      const pl = getParentListPath(selectedPath);
      if (!pl) return;
      const { parentPath, index } = pl;
      const arr = getAt(doc, parentPath);
      if (!Array.isArray(arr)) return;
      const j = index + delta;
      if (j < 0 || j >= arr.length) return;
      const nextArr = [...arr];
      const tmp = nextArr[index];
      nextArr[index] = nextArr[j];
      nextArr[j] = tmp;
      applyDoc(setAt(doc, parentPath, nextArr));
      setSelectedPath([...parentPath, j]);
    },
    [applyDoc, doc, selectedPath, valid],
  );

  const expandAll = useCallback(() => {
    if (!doc || !isUiDoc(doc)) return;
    setExpanded(new Set(collectExpandablePathKeys(doc)));
  }, [doc]);

  const collapseStructure = useCallback(() => {
    setExpanded(new Set([pathKey([])]));
  }, []);

  if (!parsed.ok) {
    return (
      <div className="rounded-lg border border-destructive/45 bg-destructive/5 p-4 text-foreground">
        <p className="text-sm">Invalid JSON — fix the JSON panel to use the interactive editor.</p>
        <pre className="mt-3 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
          {parsed.error}
        </pre>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="rounded-lg border border-destructive/45 bg-destructive/5 p-4 text-foreground text-sm">
        <p>
          Document must include a <code>ui</code> array.
        </p>
      </div>
    );
  }

  const addable = insertionTargetFor(selectedPath, doc);
  const insertableTypes = addable ? insertableComponentTypesFor(addable.parentPath) : [];
  const structuredAddLabel = addable ? structuredInsertButtonLabel(addable.parentPath) : null;
  const selectedNode = selectedPath === null ? null : getAt(doc, selectedPath);
  const selectedIsTable = isRecord(selectedNode) && selectedNode.type === "table";
  const canReorder = getParentListPath(selectedPath);
  const parentList = canReorder ? (getAt(doc, canReorder.parentPath) as unknown[]) : null;

  const pageCount = countStructurePages(doc);

  return (
    <div className="rounded-xl border border-border/80 bg-gradient-to-b from-muted/40 to-muted/25 p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="me-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
            Insert
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="gap-1.5"
            onClick={handleAddPage}
          >
            <Plus className="size-3.5" strokeWidth={2} aria-hidden />
            Page
          </Button>
          {addable && insertableTypes.length > 0 && (
            <span className="inline-flex items-center gap-2">
              <AddComponentTypeSelect
                key={pathKey(selectedPath ?? [])}
                disabled={disabled}
                options={insertableTypes}
                onAdd={(t) => handleAdd(t)}
              />
            </span>
          )}
          {addable && insertableTypes.length === 0 && structuredAddLabel !== null && (
            <Button type="button" variant="outline" disabled={disabled} onClick={() => handleAdd()}>
              {structuredAddLabel}
            </Button>
          )}
          {selectedIsTable && (
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={handleAddTableColumn}
            >
              Add column
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-border/60 sm:border-s sm:ps-3">
          <span className="me-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
            Selection
          </span>
          <Button
            type="button"
            variant="destructive"
            disabled={disabled || selectedPath === null || selectedPath.length === 0}
            onClick={handleDelete}
          >
            Delete node
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={disabled || !canReorder || !parentList || canReorder.index <= 0}
            onClick={() => handleMove(-1)}
          >
            Move up
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={
              disabled || !canReorder || !parentList || canReorder.index >= parentList.length - 1
            }
            onClick={() => handleMove(1)}
          >
            Move down
          </Button>
        </div>
      </div>
      <p className="mb-4 flex items-start gap-2 rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-muted-foreground text-xs leading-snug">
        <GripVertical className="mt-0.5 size-3.5 shrink-0 opacity-70" strokeWidth={2} aria-hidden />
        <span>
          <span className="font-medium text-foreground/90">Reorder:</span> drag the grip beside a
          row to move it among <em className="text-foreground/80 not-italic">siblings</em> only.
          Drop lines show where it will land.
        </span>
      </p>

      <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
        <section
          className="flex max-h-[min(520px,70vh)] min-h-[240px] flex-col overflow-hidden rounded-lg border border-border/70 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          aria-label="Document structure"
        >
          <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-border/60 border-b bg-muted/35 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ListTree className="size-4" strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm leading-tight">Structure</h3>
                <p className="truncate text-[11px] text-muted-foreground leading-snug">
                  {pageCount === 0
                    ? "No pages yet — add a page above"
                    : `${pageCount} page${pageCount === 1 ? "" : "s"} · click to inspect · expand to navigate`}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-muted-foreground text-xs"
                disabled={disabled}
                onClick={expandAll}
                title="Expand every branch"
              >
                <ChevronsUpDown className="size-3.5" aria-hidden />
                Expand all
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-muted-foreground text-xs"
                disabled={disabled}
                onClick={collapseStructure}
                title="Collapse to document only"
              >
                <ChevronsDownUp className="size-3.5" aria-hidden />
                Collapse
              </Button>
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-auto p-2.5">
            <TreeRoot
              doc={doc}
              selectedPath={selectedPath}
              onSelect={setSelectedPath}
              expanded={expanded}
              onToggle={toggle}
              disabled={disabled}
              dragSourcePath={dragSourcePath}
              dropHighlight={dropHighlight}
              onDragStartPath={handleDragStartPath}
              onDragEnd={handleDragEnd}
              onDragOverRow={handleDragOverRow}
              onDropOnRow={handleDropOnRow}
            />
          </div>
        </section>

        <section
          className="flex max-h-[min(520px,70vh)] min-h-[240px] flex-col overflow-hidden rounded-lg border border-border/70 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          aria-label="Node properties"
        >
          <header className="shrink-0 border-border/60 border-b bg-muted/35 px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <SlidersHorizontal className="size-4" strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm leading-tight">Properties</h3>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Edit the selected node — synced with JSON
                </p>
              </div>
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-auto p-2.5">
            <PropertyPanel doc={doc} path={selectedPath} onChange={applyDoc} disabled={disabled} />
          </div>
        </section>
      </div>
    </div>
  );
}
