import { useCallback, useEffect, useState } from "react";
import { jsonContentType, orchestratorBaseUrl } from "../lib/orchestratorClient";
import { safeParseJson, withOriginsFirst } from "../lib/uiJson";
import { isUiSpecsResponse } from "../types/uiSpecs";

export function useSduiAdmin() {
  const [specId, setSpecId] = useState("");
  const [uiJson, setUiJson] = useState("");
  const [uiStatus, setUiStatus] = useState("");
  const [specsLoadState, setSpecsLoadState] = useState<"pending" | "ok" | "error">("pending");
  const [storedSpecs, setStoredSpecs] = useState<{ id: string }[]>([]);
  const [specsError, setSpecsError] = useState<string | null>(null);

  const base = orchestratorBaseUrl();

  const reloadSpecs = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${base}/ui/specs`);
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
  }, [base]);

  useEffect(() => {
    void reloadSpecs();
  }, [reloadSpecs]);

  const loadUi = useCallback(async () => {
    setUiStatus("Loading...");
    const res = await fetch(`${base}/ui/${encodeURIComponent(specId)}`);
    const text = await res.text();
    if (!res.ok) {
      setUiStatus(`HTTP ${res.status}\n${text}`);
      return;
    }
    const parsed = safeParseJson(text);
    setUiJson(parsed.ok ? JSON.stringify(withOriginsFirst(parsed.value), null, 2) : text);
    setUiStatus("Loaded.");
  }, [base, specId]);

  const saveUi = useCallback(async () => {
    setUiStatus("Saving...");
    const parsed = safeParseJson(uiJson);
    if (!parsed.ok) {
      setUiStatus(`Invalid JSON: ${parsed.error}`);
      return;
    }
    const res = await fetch(`${base}/ui/${encodeURIComponent(specId)}`, {
      method: "PUT",
      headers: jsonContentType,
      body: JSON.stringify(parsed.value),
    });
    const text = await res.text();
    setUiStatus(`${res.ok ? "Saved.\n" : `HTTP ${res.status}\n`}${text}`);
    if (res.ok) await reloadSpecs();
  }, [base, specId, uiJson, reloadSpecs]);

  const deleteUi = useCallback(async () => {
    setUiStatus("Clearing override...");
    const res = await fetch(`${base}/ui/${encodeURIComponent(specId)}`, {
      method: "DELETE",
    });
    const text = await res.text();
    setUiStatus(`${res.ok ? "Cleared.\n" : `HTTP ${res.status}\n`}${text}`);
    if (res.ok) {
      await reloadSpecs();
      await loadUi();
    }
  }, [base, loadUi, reloadSpecs, specId]);

  const formatUi = useCallback(() => {
    const parsed = safeParseJson(uiJson);
    if (!parsed.ok) {
      setUiStatus(`Invalid JSON: ${parsed.error}`);
      return;
    }
    setUiJson(JSON.stringify(withOriginsFirst(parsed.value), null, 2));
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

  return {
    specId,
    setSpecId,
    uiJson,
    setUiJson,
    uiStatus,
    specsLoadState,
    storedSpecs,
    specsError,
    idInSpecList,
    reloadSpecs,
    loadUi,
    saveUi,
    deleteUi,
    formatUi,
    createNewUi,
  };
}
