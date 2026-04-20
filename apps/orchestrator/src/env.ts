import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Orchestrator package root (`apps/orchestrator`), stable regardless of `process.cwd()`. */
const packageRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

function loadEnvFile(name: string, override: boolean) {
  const path = resolve(packageRoot, name);
  if (existsSync(path)) {
    config({ path, override });
  }
}

loadEnvFile(".env", false);
loadEnvFile(".env.local", true);
if (process.env.NODE_ENV !== "production") {
  loadEnvFile(".env.development", true);
}
