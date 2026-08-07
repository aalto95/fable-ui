# fable-ui

Monorepo for **fable-ui**, a schema-driven React library that renders pages and forms from structured definitions, with a pluggable component registry and lazy-loaded built-ins.

## Packages & Apps

| Package | Description |
| --- | --- |
| [`fable-ui`](packages/fable-ui) | Publishable library: `Renderer`, `Component`, registry, branch/leaf components, HTTP helpers, and types. **Docs:** [README](packages/fable-ui/README.md) · [Component reference](packages/fable-ui/COMPONENTS.md) · [JSON Schema](packages/fable-ui/schema.json) |
| [`fable-shared`](packages/shared) | Shared base UI primitives (Button, Dialog, Input, Select, etc.) built on Radix UI + CVA. |
| [`fable-ui-web`](apps/web) | Demo website — Vite + React SPA consuming `fable-ui`. |
| [`fable-ui-admin`](apps/admin) | SDUI Admin Editor — JSON editor (CodeMirror), interactive tree editor, orchestrator client. |
| [`fable-ui-orchestrator`](apps/orchestrator) | Hono API server — UI spec CRUD, origin bindings, JSON Schema validation (AJV), Postgres, OpenAPI docs. |

## Requirements

- [Node.js](https://nodejs.org/) >=20.10
- [pnpm](https://pnpm.io/) 10

## Scripts (repository root)

| Command | Purpose |
| --- | --- |
| `pnpm web:dev` | Start the demo web app in development mode. |
| `pnpm admin:dev` | Start the admin editor in development mode. |
| `pnpm orchestrator:dev` | Start the orchestrator API server. |
| `pnpm build` | Build all packages and apps (via Turborepo). |
| `pnpm lint` | Run Biome checks across all workspaces. |
| `pnpm format` | Format all files with Biome. |
| `pnpm fable-ui:build` | Build only the `fable-ui` library. |
| `pnpm shared:build` | Build only the `fable-shared` library. |
| `pnpm fable-ui:publish` | Publish `fable-ui` to npm (after build and versioning). |

A **pre-commit hook** (husky + lint-staged) runs Biome on staged files and the full test suite before every commit. Bypass with `git commit --no-verify` (don't, unless you know why).

## Using the library

Install from npm or depend on the workspace package:

```json
{
  "dependencies": {
    "fable-ui": "workspace:*"
  }
}
```

Peer dependencies: React 19, React DOM, React Router 7, Tailwind CSS 4 (see `packages/fable-ui/package.json`).

## License

MIT
