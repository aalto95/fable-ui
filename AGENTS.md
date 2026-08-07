# AGENTS.md — fable-ui monorepo

## Project overview

Schema-driven React UI rendering system. A published npm package (`fable-ui`) that renders pages/forms from JSON documents via a pluggable component registry, plus a shared primitive library (`fable-shared`), a Node.js orchestrator API (Hono + Postgres), an admin editor, a demo website, and a mock API.

## Tech stack

- **Runtime:** Node >=20.10, pnpm 10
- **Monorepo:** Turborepo + pnpm workspaces with `catalog:` protocol for shared versions
- **Framework:** React 19, TypeScript 6, Vite 8
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite`), `tw-animate-css`, `tailwind-merge`/`clsx`/CVA, Radix UI, `next-themes`
- **Linting/formatting:** Biome 2 (organize imports on save, 2-space indent, 100 width)
- **Testing:** Vitest 3. `fable-ui` and `fable-shared` use `jsdom` + React Testing Library (`*.test.tsx`); `orchestrator` runs in `node` env with Hono route tests (`app.request()`). DB-backed code is tested by mocking the `@/db/*` repos. Run `pnpm test`.
- **Auth:** API-key bearer tokens protect all mutating admin endpoints (`PUT/DELETE /ui/:id`, `/ui/schema`, `/ui/origins`, `/admin/api-keys`). Credentials: DB-backed `admin_api_keys` table (SHA-256 hashed) or `SDUI_ADMIN_API_KEY` env master key. Create keys via `pnpm admin:create-key --name <name>` (orchestrator). Read-only SDUI routes are public. Dev-only opt-out: `SDUI_ADMIN_AUTH_DISABLED=true`.

## Code conventions

- **Imports:** Use `import type` for type-only imports. Use path aliases (`@/` in packages/apps where configured).
- **React:** Functional components with explicit `interface` props (e.g., `interface FooProps { ... }`). Avoid default exports.
- **CSS:** Tailwind utility classes with `cn()` from `fable-shared` (wraps `tailwind-merge` + `clsx`). Use `useSortedClasses` Biome rule.
- **Types:** Define component schemas in `packages/fable-ui/src/models/interfaces/component.ts`. Union types in `models/types/`. Zod for API validation in orchestrator. No `any` (Biome error).
- **Monorepo management:** `pnpm add <pkg> --filter <workspace>` to add deps. Use `catalog:` versions from `pnpm-workspace.yaml` for shared deps.
- **Use `catalog:` in dependencies** for any package listed in `pnpm-workspace.yaml`'s `catalog:` section (React, Radix, Tailwind, Vite, TypeScript, etc.).
- **No empty interfaces** — use `type` or `Record<string, never>` if no props.
- **`use client` directive** not used (no RSC/Next.js — all Vite SPAs).
- **Avoid default exports** in source code. Prefer named exports.

## Architecture

```
packages/
  fable-ui/     — Core Renderer, Component registry, built-in branch/leaf components, HTTP helpers, types
  shared/       — Base UI primitives (Button, Dialog, Input, etc.) via Radix + CVA
apps/
  web/          — Demo site (Vite SPA): shell layout, Home/Docs/Showcase pages, Renderer consumers
  admin/        — SDUI Admin Editor: JSON editor (CodeMirror), interactive tree editor, orchestrator client
  orchestrator/ — Hono API server: UI spec CRUD, origin bindings, schema validation (AJV), Postgres, OpenAPI docs
```

### Key design

- **Renderer** (`packages/fable-ui/src/components/core/Renderer.tsx`) — accepts `IPage[]` or `TComponentUnion[]`, walks the tree, delegates to `Component` which dispatches to registered branch or leaf renderers.
- **ComponentRegistry** (`packages/fable-ui/src/registry/`) — pluggable map of `type -> React.ComponentType`. Built-in components registered via `registerDefaultComponents()` (sync) or `registerDefaultComponentsAsync()` (lazy).
- **Branch components** — containers with children: `card`, `form`, `h_stack`, `v_stack`.
- **Leaf components** — terminal: `accordion`, `button`, `checkbox`, `datepicker`, `image`, `input`, `markdown`, `pagination`, `select`, `slider`, `subtitle`, `table`, `textarea`, `title`.
- **Orchestrator** — serves UI documents with ETag support, validates against JSON Schema (AJV), stores in Postgres. Endpoints at `/ui`, `/ui/schema`, `/ui/origins`.

## Workflows

- **Pre-commit hook** — husky + lint-staged: Biome `--write` on staged files, then `pnpm test`. Runs before every commit; bypass with `git commit --no-verify`.
- **CI** — Vercel builds/deploys on push; `.github/workflows/lint-and-test.yml` runs lint + tests on push to `main` and PRs.
- `pnpm web:dev` — start demo app
- `pnpm admin:dev` — start admin editor
- `pnpm orchestrator:dev` — start API server
- `pnpm lint` — Biome check all
- `pnpm format` — Biome format all
- `pnpm build` — Turbo build all
- `pnpm fable-ui:build` — build library only
- `pnpm shared:build` — build shared primitives only
