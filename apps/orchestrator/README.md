# SDUI Orchestrator

HTTP API for **server-driven UI** documents, a **JSON Schema** for UI payloads, and related admin routes. Built with [Node.js](https://nodejs.org/), [Hono](https://hono.dev), and [OpenAPIHono](https://hono.dev/examples/zod-openapi) (`@hono/zod-openapi`). UI specs and schema overrides are stored in **PostgreSQL**.

## Requirements

- [Node.js](https://nodejs.org/) `>= 20.10` (LTS recommended)
- PostgreSQL and a `DATABASE_URL` connection string

## Quick start

From the **monorepo root** (recommended):

```bash
cp apps/orchestrator/.env.example apps/orchestrator/.env
# Set DATABASE_URL in apps/orchestrator/.env

# Or use apps/orchestrator/.env.development (loaded automatically when NODE_ENV is not production)

pnpm install
pnpm orchestrator:dev
```

Env files are loaded from `apps/orchestrator/` in order: `.env`, then `.env.local`, then (non-production only) `.env.development`. Shell-exported variables still win unless overridden by a later file with `override`.

Or from `apps/orchestrator` after a root `pnpm install`:

```bash
pnpm dev
```

The server listens on `PORT` (default **3000**). On startup it pings Postgres and runs SQL migrations.

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Watch mode (`tsx watch src/server.ts`) |
| `pnpm start` | Production-style run (`tsx src/server.ts`) |
| `pnpm lint` | Biome check |
| `pnpm format` | Biome format (write) |

## Environment

See `.env.example` for the full list. Highlights:

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `DATABASE_URL` | Yes | PostgreSQL URL (UI specs, schema override) |
| `PORT` | No | Listen port (default `3000`) |
| `PG_POOL_MAX` | No | Pool size (default `10`) |
| `PG_IDLE_TIMEOUT_SEC` | No | Idle timeout seconds (default `20`) |
| `PG_CONNECT_TIMEOUT_SEC` | No | Connect timeout seconds (default `10`) |
| `BDUI_MOCK_PING_URL` | No | Optional periodic GET (e.g. keep a free tier warm); `0` / `false` / empty disables |

**SDUI / CORS-related** (optional): `SDUI_DEFAULT_UI_SPEC_ID`, `SDUI_UI_SPEC_ID_LOCAL`, `SDUI_UI_SPEC_ID_VERCEL`, `SDUI_API_BASE_URL`, `ORCHESTRATOR_PUBLIC_URL`, `PUBLIC_ORCHESTRATOR_URL`, `VERCEL_RENDERER_ORIGIN`, etc. — see `src/config/uiOriginProfiles.ts`, `src/config/uiSpecIdFromEnv.ts`, and OpenAPI descriptions.

## API overview

| Area | Paths |
| ---- | ----- |
| Health | `GET /health` |
| SDUI | `GET /ui`, `GET /ui/specs`, `GET` / `PUT` / `DELETE /ui/schema`, `GET` / `PUT` / `DELETE /ui/:id` |
| Docs | `GET /openapi.json` (generated spec), `GET /docs` (Swagger UI) |

OpenAPI is generated from Zod route definitions (`createRoute` + `OpenAPIHono`).

## Project branch

```
src/
  app.ts           # OpenAPIHono, middleware (CORS, logger), doc + Swagger
  server.ts        # Postgres check, migrations, @hono/node-server
  config/          # CORS, origins, env-based UI spec ids
  db/              # Postgres client, migrations, repos
  handlers/        # Route handlers
  lib/             # UI build/serve, schema cache, validation, etc.
  openapi/         # Shared Zod schemas for OpenAPI
  routes/          # createRoute + mount (ui)
```

Path alias: `@/*` → `src/*` (see `tsconfig.json`). Runtime uses [tsx](https://github.com/privatenumber/tsx) so paths resolve without a separate build step.

## Docker

Build from the **repository root** so the workspace lockfile and `packages/fable-ui` resolve:

```bash
docker build -f apps/orchestrator/Dockerfile -t sdui-orchestrator .
docker run --rm -p 3000:3000 -e DATABASE_URL=postgresql://... sdui-orchestrator
```

## License

Private package (`"private": true` in `package.json`). Add a license file if you open-source the repo.
