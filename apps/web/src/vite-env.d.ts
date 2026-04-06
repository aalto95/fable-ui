/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Path or absolute URL to the SDUI schema JSON (from `.env.development` / `.env.production`). */
  readonly UI_SCHEMA_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
