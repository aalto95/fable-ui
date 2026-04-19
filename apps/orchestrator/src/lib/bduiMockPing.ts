const INTERVAL_MS = 60_000;

function url(): string | null {
  const raw = process.env.BDUI_MOCK_PING_URL;
  if (raw === "0" || raw === "false" || raw === "") return null;
  if (raw !== undefined) return raw;
  return null;
}

async function pingOnce(target: string): Promise<void> {
  const res = await fetch(target, { signal: AbortSignal.timeout(30_000) });
  void res.body?.cancel();
}

/** Optional periodic GET to keep a cold host awake (e.g. free tier). Set BDUI_MOCK_PING_URL (or false to disable). */
export function startBduiMockPing(): void {
  const target = url();
  if (!target) return;

  const run = () => {
    pingOnce(target).catch((err) => {
      console.warn("BDUI mock ping failed:", err);
    });
  };

  run();
  setInterval(run, INTERVAL_MS);
}
