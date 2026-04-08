# fable-ui

Monorepo for **fable-ui**, a schema-driven React library that renders pages and forms from structured definitions, with a pluggable component registry and lazy-loaded built-ins.

## Packages

| Package | Description |
| --- | --- |
| [`fable-ui`](packages/fable-ui) | Publishable library: `Renderer`, `Component`, registry, layout components, HTTP helpers, and types for pages and components. **Docs:** [README](packages/fable-ui/README.md) · **[Component reference](packages/fable-ui/COMPONENTS.md)** (built-in kinds, props, actions). |
| [`fable-ui-web`](apps/web) | Example Vite + React app that consumes the workspace package. |

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/)

## Scripts (repository root)

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the example app (`fable-ui-web`) in development mode. |
| `pnpm build` | Build the library and the web app. |
| `pnpm lint` | Run Biome checks. |
| `pnpm format` | Format with Biome. |
| `pnpm preview` | Preview the built web app. |
| `pnpm publish:fable-ui` | Publish the `fable-ui` package to npm (after `build` and versioning as needed). |

## Using the library

Install from npm (when published) or depend on the workspace package as in `fable-ui-web`:

```json
{
  "dependencies": {
    "fable-ui": "workspace:*"
  }
}
```

Peer dependencies: React 19, React DOM, React Router 7, and Sonner (see `packages/fable-ui/package.json`).

## License

MIT (see package metadata in `packages/fable-ui`).
