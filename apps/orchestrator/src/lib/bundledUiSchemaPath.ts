import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

/** Absolute path to `schema.json` shipped with the `fable-ui` package (same artifact as sdui-admin). */
export function bundledUiSchemaPath(): string {
  return path.join(path.dirname(require.resolve("fable-ui/package.json")), "schema.json");
}
