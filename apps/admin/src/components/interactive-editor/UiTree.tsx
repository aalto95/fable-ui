import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { type DragEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { childPaths, nodeLabel } from "../../lib/interactiveEditor/treeModel";
import { getAt, type Path, pathKey } from "../../lib/paths";
import { isRecord } from "../../lib/uiDocumentGuards";
import { cn } from "../../lib/utils";

function nodeIsHidden(node: unknown): boolean {
  return isRecord(node) && node.hidden === true;
}

const PATH_MIME = "application/x-sdui-path";

const dropBeforeClass = "shadow-[inset_0_2px_0_0_var(--primary)]";
const dropAfterClass = "shadow-[inset_0_-2px_0_0_var(--primary)]";

function canDragPath(path: Path): boolean {
  if (path.length < 2) return false;
  return typeof path[path.length - 1] === "number";
}

function TreeRow({
  path,
  node,
  depth,
  selectedPath,
  onSelect,
  expanded,
  onToggle,
  disabled,
  dragSourcePath,
  dropHighlight,
  onDragStartPath,
  onDragEnd,
  onDragOverRow,
  onDropOnRow,
}: {
  path: Path;
  node: unknown;
  depth: number;
  selectedPath: Path | null;
  onSelect: (p: Path) => void;
  expanded: Set<string>;
  onToggle: (p: Path) => void;
  disabled: boolean;
  dragSourcePath: Path | null;
  dropHighlight: { pathKey: string; place: "before" | "after" } | null;
  onDragStartPath: (path: Path) => void;
  onDragEnd: () => void;
  onDragOverRow: (path: Path, place: "before" | "after") => void;
  onDropOnRow: (path: Path, place: "before" | "after", e: DragEvent) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const pk = pathKey(path);
  const kids = childPaths(path, node);
  const isOpen = expanded.has(pk);
  const selected = selectedPath !== null && pathKey(selectedPath) === pk;
  const label = nodeLabel(path, node);
  const draggable = !disabled && canDragPath(path);
  const isDragSource =
    dragSourcePath !== null && pathKey(dragSourcePath) === pk;
  const hl =
    dropHighlight?.pathKey === pk
      ? dropHighlight.place === "before"
        ? dropBeforeClass
        : dropAfterClass
      : "";
  const hidden = nodeIsHidden(node);

  const handleDragOver = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const el = rowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const place = e.clientY < rect.top + rect.height / 2 ? "before" : "after";
    onDragOverRow(path, place);
  };

  const handleDrop = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    const el = rowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const place = e.clientY < rect.top + rect.height / 2 ? "before" : "after";
    onDropOnRow(path, place, e);
  };

  return (
    <div className="text-sm">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: HTML5 drag-and-drop drop target */}
      <div
        ref={rowRef}
        className={cn(
          "flex min-h-8 items-center gap-1 rounded-md border border-transparent transition-colors",
          selected &&
            "border-primary/20 bg-primary/[0.09] shadow-[inset_3px_0_0_0_var(--primary)]",
          !selected && "hover:border-border/80 hover:bg-muted/45",
          hl,
          hidden && "text-muted-foreground",
          isDragSource ? "opacity-65" : hidden ? "opacity-[0.48]" : undefined,
        )}
        style={{ paddingLeft: 6 + depth * 12 }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {kids.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="h-auto min-h-0 w-[22px] shrink-0 p-0.5 text-muted-foreground text-xs"
            disabled={disabled}
            aria-expanded={isOpen}
            onClick={() => onToggle(path)}
          >
            {isOpen ? (
              <ChevronDown className="size-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <ChevronRight className="size-3.5" strokeWidth={2} aria-hidden />
            )}
          </Button>
        ) : (
          <span className="inline-block w-[22px] shrink-0" />
        )}
        {draggable ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="w-5 shrink-0 cursor-grab p-0.5 text-center text-muted-foreground text-xs active:cursor-grabbing"
            draggable
            title="Drag to reorder among siblings"
            aria-label="Drag to reorder"
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStartPath(path);
              e.dataTransfer.setData(PATH_MIME, pk);
              e.dataTransfer.setData("text/plain", pk);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => {
              onDragEnd();
            }}
          >
            <GripVertical className="size-3.5" strokeWidth={2} aria-hidden />
          </Button>
        ) : (
          <span className="inline-block w-5 shrink-0" aria-hidden />
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto min-h-0 flex-1 justify-start rounded px-1.5 py-1 text-left font-normal text-[13px] hover:bg-transparent"
          disabled={disabled}
          aria-current={selected ? "true" : undefined}
          onClick={() => onSelect(path)}
        >
          {label}
        </Button>
      </div>
      {isOpen &&
        kids.map(({ subPath }) => {
          const child = getAt(node, subPath.slice(path.length));
          const fullPath = subPath;
          return (
            <TreeRow
              key={pathKey(fullPath)}
              path={fullPath}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
              disabled={disabled}
              dragSourcePath={dragSourcePath}
              dropHighlight={dropHighlight}
              onDragStartPath={onDragStartPath}
              onDragEnd={onDragEnd}
              onDragOverRow={onDragOverRow}
              onDropOnRow={onDropOnRow}
            />
          );
        })}
    </div>
  );
}

export function TreeRoot({
  doc,
  selectedPath,
  onSelect,
  expanded,
  onToggle,
  disabled,
  dragSourcePath,
  dropHighlight,
  onDragStartPath,
  onDragEnd,
  onDragOverRow,
  onDropOnRow,
}: {
  doc: unknown;
  selectedPath: Path | null;
  onSelect: (p: Path) => void;
  expanded: Set<string>;
  onToggle: (p: Path) => void;
  disabled: boolean;
  dragSourcePath: Path | null;
  dropHighlight: { pathKey: string; place: "before" | "after" } | null;
  onDragStartPath: (path: Path) => void;
  onDragEnd: () => void;
  onDragOverRow: (path: Path, place: "before" | "after") => void;
  onDropOnRow: (path: Path, place: "before" | "after", e: DragEvent) => void;
}) {
  const pk = pathKey([]);
  const kids = childPaths([], doc);
  const isOpen = expanded.has(pk);

  return (
    <div className="text-sm">
      <div
        className={cn(
          "flex min-h-8 items-center gap-1 rounded-md border border-transparent transition-colors",
          selectedPath !== null &&
            pathKey(selectedPath) === pk &&
            "border-primary/20 bg-primary/[0.09] shadow-[inset_3px_0_0_0_var(--primary)]",
          (selectedPath === null || pathKey(selectedPath) !== pk) &&
            "hover:border-border/80 hover:bg-muted/45",
        )}
        style={{ paddingLeft: 6 }}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="h-auto min-h-0 w-[22px] shrink-0 p-0.5 text-muted-foreground text-xs"
          disabled={disabled}
          onClick={() => onToggle([])}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <ChevronDown className="size-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <ChevronRight className="size-3.5" strokeWidth={2} aria-hidden />
          )}
        </Button>
        <span className="inline-block w-5 shrink-0" aria-hidden />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto min-h-0 flex-1 justify-start rounded px-1.5 py-1 text-left font-medium text-[13px] text-foreground/90 hover:bg-transparent"
          disabled={disabled}
          aria-current={
            selectedPath !== null && pathKey(selectedPath) === pk
              ? "true"
              : undefined
          }
          onClick={() => onSelect([])}
        >
          Document
        </Button>
      </div>
      {isOpen &&
        kids.map(({ subPath }) => {
          const child = getAt(doc, subPath);
          return (
            <TreeRow
              key={pathKey(subPath)}
              path={subPath}
              node={child}
              depth={1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
              disabled={disabled}
              dragSourcePath={dragSourcePath}
              dropHighlight={dropHighlight}
              onDragStartPath={onDragStartPath}
              onDragEnd={onDragEnd}
              onDragOverRow={onDragOverRow}
              onDropOnRow={onDropOnRow}
            />
          );
        })}
    </div>
  );
}

export { PATH_MIME };
