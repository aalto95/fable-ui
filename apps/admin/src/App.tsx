import { json } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";
import InteractiveUiEditor from "./components/InteractiveUiEditor";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

const SPEC_SELECT_PENDING = "__sdui_spec_pending__";
const SPEC_SELECT_ERROR = "__sdui_spec_error__";
const SPEC_SELECT_NONE = "__sdui_spec_none__";
const ORIGIN_LINK_NONE = "__sdui_origin_link_none__";

function safeParseJson(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}

type UiSpecsResponse = {
  specs: { id: string }[];
};

type UiOriginsResponse = {
  origins: { origin: string; specId: string | null }[];
};

function isUiSpecsResponse(value: unknown): value is UiSpecsResponse {
  if (value === null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.specs)) return false;
  return v.specs.every(
    (row) =>
      row !== null && typeof row === "object" && typeof (row as { id?: unknown }).id === "string",
  );
}

function isUiOriginsResponse(value: unknown): value is UiOriginsResponse {
  if (value === null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.origins)) return false;
  return v.origins.every(
    (row) =>
      row !== null &&
      typeof row === "object" &&
      typeof (row as { origin?: unknown }).origin === "string" &&
      (((row as { specId?: unknown }).specId ?? null) === null ||
        typeof (row as { specId?: unknown }).specId === "string"),
  );
}

const jsonContentType: HeadersInit = { "Content-Type": "application/json" };

export default function App() {
  const [specId, setSpecId] = useState("");
  const [uiJson, setUiJson] = useState("");
  const [uiStatus, setUiStatus] = useState("");
  const [specsLoadState, setSpecsLoadState] = useState<"pending" | "ok" | "error">("pending");
  const [storedSpecs, setStoredSpecs] = useState<{ id: string }[]>([]);
  const [originBindings, setOriginBindings] = useState<{ origin: string; specId: string | null }[]>(
    [],
  );
  const [newOrigin, setNewOrigin] = useState("");
  const [specsError, setSpecsError] = useState<string | null>(null);

  const reloadSpecs = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ui/specs`);
      const text = await res.text();

      if (!res.ok) {
        setSpecsError(`HTTP ${res.status}\n${text}`);
        setSpecsLoadState("error");
        return false;
      }

      const parsed = safeParseJson(text);

      if (!parsed.ok) {
        setSpecsError(parsed.error);
        setSpecsLoadState("error");
        return false;
      }

      if (!isUiSpecsResponse(parsed.value)) {
        setSpecsError("Invalid response: expected { specs: [{ id: string }, ...] }");
        setSpecsLoadState("error");
        return false;
      }

      const { specs } = parsed.value;
      setStoredSpecs(specs);
      setSpecId((prev) => prev || specs[0]?.id || "");

      setSpecsLoadState("ok");
      return true;
    } catch (e) {
      console.log(e);
      setSpecsError(e instanceof Error ? e.message : String(e));
      setSpecsLoadState("error");
      return false;
    }
  }, []);

  const reloadOrigins = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ui/origins`);
      const text = await res.text();
      if (!res.ok) {
        setUiStatus(`HTTP ${res.status}\n${text}`);
        return false;
      }
      const parsed = safeParseJson(text);
      if (!parsed.ok || !isUiOriginsResponse(parsed.value)) {
        setUiStatus("Invalid origin bindings payload.");
        return false;
      }
      setOriginBindings(parsed.value.origins);
      return true;
    } catch (e) {
      setUiStatus(e instanceof Error ? e.message : String(e));
      return false;
    }
  }, []);

  useEffect(() => {
    void reloadSpecs();
  }, [reloadSpecs]);

  useEffect(() => {
    void reloadOrigins();
  }, [reloadOrigins]);

  const loadUi = useCallback(async () => {
    setUiStatus("Loading...");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/ui/${encodeURIComponent(specId)}`);
    const text = await res.text();
    if (!res.ok) {
      setUiStatus(`HTTP ${res.status}\n${text}`);
      return;
    }
    const parsed = safeParseJson(text);
    setUiJson(parsed.ok ? JSON.stringify(parsed.value, null, 2) : text);
    setUiStatus("Loaded.");
  }, [specId]);

  const saveUi = useCallback(async () => {
    setUiStatus("Saving...");
    const parsed = safeParseJson(uiJson);
    if (!parsed.ok) {
      setUiStatus(`Invalid JSON: ${parsed.error}`);
      return;
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/ui/${encodeURIComponent(specId)}`, {
      method: "PUT",
      headers: jsonContentType,
      body: JSON.stringify(parsed.value),
    });
    const text = await res.text();
    setUiStatus(`${res.ok ? "Saved.\n" : `HTTP ${res.status}\n`}${text}`);
    if (res.ok) await reloadSpecs();
  }, [specId, uiJson, reloadSpecs]);

  const deleteUi = useCallback(async () => {
    setUiStatus("Clearing override...");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/ui/${encodeURIComponent(specId)}`, {
      method: "DELETE",
    });
    const text = await res.text();
    setUiStatus(`${res.ok ? "Cleared.\n" : `HTTP ${res.status}\n`}${text}`);
    if (res.ok) {
      await reloadSpecs();
      await loadUi();
    }
  }, [loadUi, reloadSpecs, specId]);

  const saveOriginBinding = useCallback(
    async (origin: string, linkedSpecId: string | null) => {
      const value = origin.trim();
      if (!value) {
        setUiStatus("Origin is required.");
        return;
      }
      setUiStatus("Saving origin binding...");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ui/origins`, {
        method: "PUT",
        headers: jsonContentType,
        body: JSON.stringify({
          origin: value,
          specId: linkedSpecId,
        }),
      });
      const text = await res.text();
      setUiStatus(`${res.ok ? "Origin saved.\n" : `HTTP ${res.status}\n`}${text}`);
      if (res.ok) {
        setNewOrigin("");
        await reloadOrigins();
      }
    },
    [reloadOrigins],
  );

  const removeOriginBinding = useCallback(
    async (origin: string) => {
      setUiStatus("Removing origin...");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/ui/origins?origin=${encodeURIComponent(origin)}`,
        { method: "DELETE" },
      );
      const text = await res.text();
      setUiStatus(`${res.ok ? "Origin removed.\n" : `HTTP ${res.status}\n`}${text}`);
      if (res.ok) {
        await reloadOrigins();
      }
    },
    [reloadOrigins],
  );

  const formatUi = useCallback(() => {
    const parsed = safeParseJson(uiJson);
    if (!parsed.ok) {
      setUiStatus(`Invalid JSON: ${parsed.error}`);
      return;
    }
    setUiJson(JSON.stringify(parsed.value, null, 2));
    setUiStatus("Formatted.");
  }, [uiJson]);

  const createNewUi = useCallback(() => {
    setSpecId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (specsLoadState !== "ok" || !specId) return;
    void loadUi().catch(() => {
      setUiStatus("Load UI failed.");
    });
  }, [loadUi, specId, specsLoadState]);

  const idInSpecList = storedSpecs.some((s) => s.id === specId);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4">
      <header className="border-border/80 border-b pt-6 pb-6">
        <h1 className="font-semibold text-2xl text-foreground tracking-tight">SDUI Admin Editor</h1>
        <p className="mt-1.5 max-w-2xl text-muted-foreground text-sm leading-relaxed">
          Edit server-driven UI specs and preview structure in one place.
        </p>
      </header>

      <section className="space-y-6 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[340px] flex-1">
            <label
              className="mb-2 block font-medium text-foreground text-sm leading-none"
              htmlFor="specId"
            >
              UI spec id
            </label>
            {specsLoadState === "pending" && (
              <Select disabled value={SPEC_SELECT_PENDING}>
                <SelectTrigger id="specId" className="w-full min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SPEC_SELECT_PENDING}>Loading spec ids…</SelectItem>
                </SelectContent>
              </Select>
            )}
            {specsLoadState === "error" && (
              <Select disabled value={SPEC_SELECT_ERROR}>
                <SelectTrigger id="specId" className="w-full min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SPEC_SELECT_ERROR}>Failed to load spec ids</SelectItem>
                </SelectContent>
              </Select>
            )}
            {specsLoadState === "ok" && (
              <Select
                value={specId || SPEC_SELECT_NONE}
                onValueChange={(v) => setSpecId(v === SPEC_SELECT_NONE ? "" : v)}
              >
                <SelectTrigger id="specId" className="w-full min-w-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="min-w-[var(--radix-select-trigger-width)]"
                >
                  <SelectItem value={SPEC_SELECT_NONE}>— Select spec —</SelectItem>
                  {specId && !idInSpecList && (
                    <SelectItem value={specId}>New id — save to keep: {specId}</SelectItem>
                  )}
                  {storedSpecs.map(({ id }) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {specsLoadState === "error" && specsError && (
          <div
            className="whitespace-pre-wrap rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 font-mono text-destructive text-xs"
            role="alert"
          >
            {specsError}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            disabled={specsLoadState !== "ok"}
            onClick={createNewUi}
            title="Pick a new random id and load the server placeholder until you save"
          >
            New UI document
          </Button>
          <Button
            type="button"
            disabled={specsLoadState !== "ok" || !specId}
            onClick={() => void saveUi()}
          >
            Save / Override
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={specsLoadState !== "ok" || !specId}
            onClick={() => void deleteUi()}
          >
            Clear Override
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={specsLoadState !== "ok" || !specId}
            onClick={formatUi}
          >
            Format
          </Button>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Edits are validated server-side against the orchestrator schema.
        </p>

        <div className="space-y-3 rounded-lg border border-border p-3">
          <h2 className="font-semibold text-foreground text-sm tracking-tight">Origin bindings</h2>
          <p className="text-muted-foreground text-xs">
            Create origins as separate records, then link each one to a UI spec id.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="min-w-[280px] flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://example.com"
              value={newOrigin}
              onChange={(e) => setNewOrigin(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={specsLoadState !== "ok" || !specId}
              onClick={() => void saveOriginBinding(newOrigin, specId || null)}
            >
              Add + link selected spec
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void saveOriginBinding(newOrigin, null)}
            >
              Add unlinked
            </Button>
          </div>
          {originBindings.map((row) => (
            <div
              key={row.origin}
              className="flex flex-wrap items-center gap-2 rounded-md border border-border/70 px-3 py-2"
            >
              <code className="min-w-[260px] flex-1 truncate text-xs">{row.origin}</code>
              <div className="min-w-[280px] flex-1">
                <Select
                  value={row.specId ?? ORIGIN_LINK_NONE}
                  onValueChange={(v) =>
                    void saveOriginBinding(row.origin, v === ORIGIN_LINK_NONE ? null : v)
                  }
                >
                  <SelectTrigger className="w-full min-w-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="min-w-[var(--radix-select-trigger-width)]"
                  >
                    <SelectItem value={ORIGIN_LINK_NONE}>Unlinked</SelectItem>
                    {storedSpecs.map(({ id }) => (
                      <SelectItem key={`${row.origin}-${id}`} value={id}>
                        {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void removeOriginBinding(row.origin)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {uiStatus ? (
          <div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 px-3 py-2.5 font-mono text-muted-foreground text-xs">
            {uiStatus}
          </div>
        ) : null}

        <div className="space-y-2 border-border border-t pt-6">
          <h2 className="font-semibold text-base text-foreground tracking-tight">Interactive UI</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Browse the structure, edit properties, and add components. Changes sync with the JSON.
          </p>
        </div>
        <InteractiveUiEditor
          uiJson={uiJson}
          onUiJsonChange={setUiJson}
          disabled={specsLoadState !== "ok" || !specId}
        />

        <div className="space-y-2 border-border border-t pt-6">
          <h2 className="font-semibold text-base text-foreground tracking-tight">JSON</h2>
          <p className="text-muted-foreground text-sm">
            Raw document — kept in sync with the editor.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-border shadow-sm [&_.cm-editor]:text-xs [&_.cm-editor]:leading-snug">
          <CodeMirror
            value={uiJson}
            height="420px"
            extensions={[json()]}
            onChange={setUiJson}
            basicSetup={{ lineNumbers: true, tabSize: 2 }}
          />
        </div>
      </section>
    </div>
  );
}
