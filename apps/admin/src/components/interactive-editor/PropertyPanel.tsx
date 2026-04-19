import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  checkRowClass,
  emptyStateClass,
  formStackClass,
  inputClass,
  textareaClass,
} from "@/lib/fieldClasses";
import { cn } from "@/lib/utils";
import {
  ACTION_TYPES,
  BUTTON_SIZES,
  TABLE_HEAD_TYPES,
  VARIANTS,
} from "../../lib/componentDefaults";
import { getAt, type Path, pathKey, setAt } from "../../lib/paths";
import { isRecord } from "../../lib/uiDocumentGuards";
import { safeParseJson } from "../../lib/uiJson";
import { Field } from "./Field";
import { bool, num, str } from "./propertyValueUtils";

function PropCheckboxRow({
  path,
  idSuffix,
  disabled,
  checked,
  onCheckedChange,
  label,
}: {
  path: Path;
  idSuffix: string;
  disabled: boolean;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  label: ReactNode;
}) {
  const cid = `${pathKey(path)}-${idSuffix}`;
  return (
    <div className={checkRowClass}>
      <Checkbox
        id={cid}
        disabled={disabled}
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
      />
      <label className="cursor-pointer font-normal text-sm leading-none" htmlFor={cid}>
        {label}
      </label>
    </div>
  );
}

function PropSelect({
  disabled,
  value,
  onValueChange,
  options,
}: {
  disabled: boolean;
  value: string;
  onValueChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full min-w-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" className="min-w-[var(--radix-select-trigger-width)]">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PropertyPanel({
  doc,
  path,
  onChange,
  disabled,
}: {
  doc: unknown;
  path: Path | null;
  onChange: (next: unknown) => void;
  disabled: boolean;
}) {
  if (path === null) {
    return <p className={emptyStateClass}>Select a node in the tree.</p>;
  }

  const node = getAt(doc, path);
  if (path.length === 0) {
    return (
      <div className={formStackClass}>
        <p className="text-muted-foreground text-xs">
          Root document. Use the tree to edit pages and components.
        </p>
        <p className="text-muted-foreground text-xs">
          Origin mappings are now managed separately via the origin bindings controls.
        </p>
      </div>
    );
  }

  if (path[0] === "origins" && path.length === 1) {
    const list = Array.isArray(node) ? node : [];
    return (
      <div className={formStackClass}>
        <p className="text-muted-foreground text-xs">CORS origins list</p>
        {list.map((entry, i) => (
          <Field key={`${pathKey(["origins", i])}-${String(entry)}`} label={`[${i}]`}>
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(list[i])}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                onChange(setAt(doc, ["origins"], next));
              }}
            />
          </Field>
        ))}
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => {
            onChange(setAt(doc, ["origins"], [...list, "https://"]));
          }}
        >
          Add origin
        </Button>
      </div>
    );
  }

  if (path[0] === "origins" && path.length === 2 && typeof path[1] === "number") {
    const i = path[1];
    const list = getAt(doc, ["origins"]);
    const arr = Array.isArray(list) ? list : [];
    return (
      <div className={formStackClass}>
        <Field label="URL">
          <input
            className={inputClass}
            type="text"
            disabled={disabled}
            value={str(arr[i])}
            onChange={(e) => {
              const next = [...arr];
              next[i] = e.target.value;
              onChange(setAt(doc, ["origins"], next));
            }}
          />
        </Field>
      </div>
    );
  }

  if (!isRecord(node)) {
    return <p className={emptyStateClass}>Nothing to edit here.</p>;
  }

  const patch = (partial: Record<string, unknown>) => {
    onChange(setAt(doc, path, { ...node, ...partial }));
  };

  if (
    path.length >= 2 &&
    path[path.length - 2] === "items" &&
    typeof path[path.length - 1] === "number"
  ) {
    return (
      <div className={formStackClass}>
        <Field label="name">
          <input
            className={inputClass}
            type="text"
            disabled={disabled}
            value={str(node.name)}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </Field>
        <Field label="title">
          <input
            className={inputClass}
            type="text"
            disabled={disabled}
            value={str(node.title)}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <Field label="text">
          <textarea
            className={textareaClass}
            disabled={disabled}
            rows={4}
            value={str(node.text)}
            onChange={(e) => patch({ text: e.target.value })}
          />
        </Field>
      </div>
    );
  }

  if (
    path.length >= 2 &&
    path[path.length - 2] === "heads" &&
    typeof path[path.length - 1] === "number"
  ) {
    return (
      <div className={formStackClass}>
        <Field label="name">
          <input
            className={inputClass}
            type="text"
            disabled={disabled}
            value={str(node.name)}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </Field>
        <Field label="label">
          <input
            className={inputClass}
            type="text"
            disabled={disabled}
            value={str(node.label)}
            onChange={(e) => patch({ label: e.target.value })}
          />
        </Field>
        <Field label="column type">
          <PropSelect
            disabled={disabled}
            value={str(node.type) || "string"}
            onValueChange={(v) => patch({ type: v })}
            options={TABLE_HEAD_TYPES.map((x) => ({ value: x, label: x }))}
          />
        </Field>
      </div>
    );
  }

  if ("route" in node && Array.isArray(node.ui)) {
    return (
      <div className={formStackClass}>
        <Field label="route">
          <input
            className={inputClass}
            type="text"
            disabled={disabled}
            value={str(node.route)}
            onChange={(e) => patch({ route: e.target.value })}
          />
        </Field>
        <Field label="name">
          <input
            className={inputClass}
            type="text"
            disabled={disabled}
            value={str(node.name)}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </Field>
      </div>
    );
  }

  const t = node.type;
  if (typeof t !== "string") {
    if ("label" in node && "type" in node && typeof (node as { type: unknown }).type === "string") {
      const a = node as Record<string, unknown>;
      return (
        <div className={formStackClass}>
          <Field label="type">
            <PropSelect
              disabled={disabled}
              value={str(a.type)}
              onValueChange={(v) => patch({ type: v })}
              options={ACTION_TYPES.map((x) => ({ value: x, label: x }))}
            />
          </Field>
          <Field label="label">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(a.label)}
              onChange={(e) => patch({ label: e.target.value })}
            />
          </Field>
          <Field label="path">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(a.path)}
              onChange={(e) => patch({ path: e.target.value })}
            />
          </Field>
          <Field label="variant">
            <PropSelect
              disabled={disabled}
              value={str(a.variant) || "default"}
              onValueChange={(v) => patch({ variant: v })}
              options={VARIANTS.map((x) => ({ value: x, label: x }))}
            />
          </Field>
        </div>
      );
    }
    return <p className={emptyStateClass}>Unsupported node shape.</p>;
  }

  switch (t) {
    case "title":
    case "subtitle":
      return (
        <div className={formStackClass}>
          <Field label="text">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.text)}
              onChange={(e) => patch({ text: e.target.value })}
            />
          </Field>
          <PropCheckboxRow
            path={path}
            idSuffix="hidden"
            disabled={disabled}
            checked={bool(node.hidden)}
            onCheckedChange={(next) => patch({ hidden: next })}
            label="hidden"
          />
        </div>
      );
    case "markdown":
      return (
        <div className={formStackClass}>
          <Field label="content (GFM)">
            <textarea
              className={textareaClass}
              disabled={disabled}
              rows={12}
              value={str(node.content)}
              onChange={(e) => patch({ content: e.target.value })}
              placeholder={"# Heading\n\n**bold**, lists, fenced code, links"}
            />
          </Field>
          <Field label="className (optional)">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.className)}
              onChange={(e) => patch({ className: e.target.value })}
            />
          </Field>
          <PropCheckboxRow
            path={path}
            idSuffix="hidden-md"
            disabled={disabled}
            checked={bool(node.hidden)}
            onCheckedChange={(next) => patch({ hidden: next })}
            label="hidden"
          />
          <p className="text-muted-foreground text-xs leading-snug">
            Rendered with sanitization (no raw HTML). See fable-ui schema for details.
          </p>
        </div>
      );
    case "button":
      return (
        <div className={formStackClass}>
          <Field label="text">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.text)}
              onChange={(e) => patch({ text: e.target.value })}
            />
          </Field>
          <Field label="variant">
            <PropSelect
              disabled={disabled}
              value={str(node.variant) || "default"}
              onValueChange={(v) => patch({ variant: v })}
              options={VARIANTS.map((x) => ({ value: x, label: x }))}
            />
          </Field>
          <Field label="size">
            <PropSelect
              disabled={disabled}
              value={str(node.size) || "default"}
              onValueChange={(v) => patch({ size: v })}
              options={BUTTON_SIZES.map((x) => ({ value: x, label: x }))}
            />
          </Field>
          <PropCheckboxRow
            path={path}
            idSuffix="expand"
            disabled={disabled}
            checked={bool(node.expand)}
            onCheckedChange={(next) => patch({ expand: next })}
            label="expand"
          />
        </div>
      );
    case "input":
    case "textarea":
      return (
        <div className={formStackClass}>
          <Field label="name">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.name)}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </Field>
          <Field label="label">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.label)}
              onChange={(e) => patch({ label: e.target.value })}
            />
          </Field>
          <Field label="defaultValue">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.defaultValue)}
              onChange={(e) => patch({ defaultValue: e.target.value })}
            />
          </Field>
          <PropCheckboxRow
            path={path}
            idSuffix="required"
            disabled={disabled}
            checked={bool(node.required)}
            onCheckedChange={(next) => patch({ required: next })}
            label="required"
          />
          <PropCheckboxRow
            path={path}
            idSuffix="hidden"
            disabled={disabled}
            checked={bool(node.hidden)}
            onCheckedChange={(next) => patch({ hidden: next })}
            label="hidden"
          />
        </div>
      );
    case "datepicker":
      return (
        <div className={formStackClass}>
          <Field label="name">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.name)}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </Field>
          <Field label="label">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.label)}
              onChange={(e) => patch({ label: e.target.value })}
            />
          </Field>
          <Field label="defaultValue">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.defaultValue)}
              onChange={(e) => patch({ defaultValue: e.target.value })}
            />
          </Field>
          <PropCheckboxRow
            path={path}
            idSuffix="required"
            disabled={disabled}
            checked={bool(node.required)}
            onCheckedChange={(next) => patch({ required: next })}
            label="required"
          />
          <PropCheckboxRow
            path={path}
            idSuffix="hidden"
            disabled={disabled}
            checked={bool(node.hidden)}
            onCheckedChange={(next) => patch({ hidden: next })}
            label="hidden"
          />
        </div>
      );
    case "select":
      return (
        <div className={formStackClass}>
          <Field label="name">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.name)}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </Field>
          <Field label="label">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.label)}
              onChange={(e) => patch({ label: e.target.value })}
            />
          </Field>
          <Field label="options (JSON)">
            <textarea
              className={textareaClass}
              disabled={disabled}
              rows={5}
              value={JSON.stringify(Array.isArray(node.options) ? node.options : [], null, 2)}
              onChange={(e) => {
                const p = safeParseJson(e.target.value);
                if (p.ok && Array.isArray(p.value)) patch({ options: p.value });
              }}
            />
          </Field>
          <PropCheckboxRow
            path={path}
            idSuffix="required"
            disabled={disabled}
            checked={bool(node.required)}
            onCheckedChange={(next) => patch({ required: next })}
            label="required"
          />
          <PropCheckboxRow
            path={path}
            idSuffix="hidden"
            disabled={disabled}
            checked={bool(node.hidden)}
            onCheckedChange={(next) => patch({ hidden: next })}
            label="hidden"
          />
        </div>
      );
    case "checkbox":
      return (
        <div className={formStackClass}>
          <Field label="name">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.name)}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </Field>
          <Field label="label">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.label)}
              onChange={(e) => patch({ label: e.target.value })}
            />
          </Field>
          <PropCheckboxRow
            path={path}
            idSuffix="required"
            disabled={disabled}
            checked={bool(node.required)}
            onCheckedChange={(next) => patch({ required: next })}
            label="required"
          />
          <PropCheckboxRow
            path={path}
            idSuffix="checked"
            disabled={disabled}
            checked={bool(node.checked)}
            onCheckedChange={(next) => patch({ checked: next })}
            label="checked"
          />
        </div>
      );
    case "table":
      return (
        <div className={formStackClass}>
          <Field label="dataSource">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.dataSource)}
              onChange={(e) => patch({ dataSource: e.target.value })}
            />
          </Field>
          <Field label="pageParam">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.pageParam)}
              onChange={(e) => patch({ pageParam: e.target.value })}
            />
          </Field>
          <Field label="limitParam">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.limitParam)}
              onChange={(e) => patch({ limitParam: e.target.value })}
            />
          </Field>
          <Field label="defaultLimit">
            <input
              className={inputClass}
              type="number"
              disabled={disabled}
              value={num(node.defaultLimit) || ""}
              onChange={(e) => patch({ defaultLimit: Number(e.target.value) })}
            />
          </Field>
          <Field label="data (JSON, optional)">
            <textarea
              className={textareaClass}
              disabled={disabled}
              rows={4}
              value={JSON.stringify(node.data ?? [], null, 2)}
              onChange={(e) => {
                const p = safeParseJson(e.target.value);
                if (p.ok) patch({ data: p.value });
              }}
            />
          </Field>
        </div>
      );
    case "accordion":
      return (
        <div className={cn(formStackClass, "text-muted-foreground text-xs")}>
          Edit accordion items in the tree (items → …) or paste JSON here.
          <textarea
            className={textareaClass}
            disabled={disabled}
            rows={6}
            value={JSON.stringify(node.items ?? [], null, 2)}
            onChange={(e) => {
              const p = safeParseJson(e.target.value);
              if (p.ok && Array.isArray(p.value)) patch({ items: p.value });
            }}
          />
        </div>
      );
    case "pagination":
      return (
        <div className={formStackClass}>
          <Field label="pages">
            <input
              className={inputClass}
              type="number"
              disabled={disabled}
              value={num(node.pages) || 1}
              onChange={(e) => patch({ pages: Number(e.target.value) })}
            />
          </Field>
          <Field label="pageParam">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.pageParam)}
              onChange={(e) => patch({ pageParam: e.target.value })}
            />
          </Field>
          <Field label="limitParam">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.limitParam)}
              onChange={(e) => patch({ limitParam: e.target.value })}
            />
          </Field>
          <Field label="defaultLimit">
            <input
              className={inputClass}
              type="number"
              disabled={disabled}
              value={num(node.defaultLimit) || ""}
              onChange={(e) => patch({ defaultLimit: Number(e.target.value) })}
            />
          </Field>
        </div>
      );
    case "slider":
      return (
        <div className={formStackClass}>
          <Field label="name">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.name)}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </Field>
          <Field label="label">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.label)}
              onChange={(e) => patch({ label: e.target.value })}
            />
          </Field>
          <Field label="min">
            <input
              className={inputClass}
              type="number"
              disabled={disabled}
              value={num(node.min)}
              onChange={(e) => patch({ min: Number(e.target.value) })}
            />
          </Field>
          <Field label="max">
            <input
              className={inputClass}
              type="number"
              disabled={disabled}
              value={num(node.max)}
              onChange={(e) => patch({ max: Number(e.target.value) })}
            />
          </Field>
          <Field label="step">
            <input
              className={inputClass}
              type="number"
              disabled={disabled}
              value={num(node.step) || ""}
              onChange={(e) => patch({ step: Number(e.target.value) })}
            />
          </Field>
          <Field label="defaultValue">
            <input
              className={inputClass}
              type="number"
              disabled={disabled}
              value={num(node.defaultValue)}
              onChange={(e) => patch({ defaultValue: Number(e.target.value) })}
            />
          </Field>
          <Field label="valueSuffix">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.valueSuffix)}
              onChange={(e) => patch({ valueSuffix: e.target.value })}
            />
          </Field>
        </div>
      );
    case "h_stack":
    case "v_stack":
      return (
        <p className={cn(emptyStateClass, "text-xs")}>
          Layout container — add children via toolbar.
        </p>
      );
    case "form":
      return (
        <div className={formStackClass}>
          <Field label="title">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.title)}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </Field>
          <Field label="dataSource">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.dataSource)}
              onChange={(e) => patch({ dataSource: e.target.value })}
            />
          </Field>
        </div>
      );
    case "card":
      return (
        <div className={formStackClass}>
          <Field label="title">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.title)}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </Field>
          <Field label="description">
            <textarea
              className={textareaClass}
              disabled={disabled}
              rows={3}
              value={str(node.description)}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </Field>
          <Field label="footerText">
            <input
              className={inputClass}
              type="text"
              disabled={disabled}
              value={str(node.footerText)}
              onChange={(e) => patch({ footerText: e.target.value })}
            />
          </Field>
        </div>
      );
    default:
      return (
        <div className={cn(formStackClass, "text-muted-foreground text-xs")}>
          Raw JSON for this node:
          <textarea
            className={textareaClass}
            disabled={disabled}
            rows={10}
            value={JSON.stringify(node, null, 2)}
            onChange={(e) => {
              const p = safeParseJson(e.target.value);
              if (p.ok && isRecord(p.value)) onChange(setAt(doc, path, p.value));
            }}
          />
        </div>
      );
  }
}
