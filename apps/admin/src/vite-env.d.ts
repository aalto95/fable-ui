/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the SDUI orchestrator API (from `.env.development` / `.env.production`). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
