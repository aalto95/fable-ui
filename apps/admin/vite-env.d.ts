/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Path or absolute URL to the SDUI schema JSON (from `.env.development` / `.env.production`). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
