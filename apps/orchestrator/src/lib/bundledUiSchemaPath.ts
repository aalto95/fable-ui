import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** Absolute path to `schema.json` shipped with the `fable-ui` package (same artifact as sdui-admin). */
export function bundledUiSchemaPath(): string {
  return require.resolve("fable-ui/schema.json");
}
