# SDUI Orchestrator

HTTP API for **server-driven UI** documents, a **JSON Schema** for UI payloads, and a **todo** CRUD API. Built with [Bun](https://bun.sh), [Hono](https://hono.dev), and [OpenAPIHono](https://hono.dev/examples/zod-openapi) (`@hono/zod-openapi`). UI specs and schema overrides are stored in **PostgreSQL**.

## Requirements

- [Bun](https://bun.sh) `>= 1.1.0`
- PostgreSQL and a `DATABASE_URL` connection string

## Quick start

```bash
cp .env.example .env
# Set DATABASE_URL in .env

bun install
bun run dev
```

The server listens on `PORT` (default **3000**). On startup it pings Postgres and runs SQL migrations.

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `bun run dev`  | Watch mode (`bun --watch src/server.ts`) |
| `bun run start`| Production-style run                 |
| `bun run lint` | Biome check                          |
| `bun run format` | Biome format (write)             |

## Environment

See `.env.example` for the full list. Highlights:

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `DATABASE_URL` | Yes | PostgreSQL URL (todos, UI specs, schema override) |
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
| Todos | `GET` / `POST /api/todo`, `GET` / `PUT` / `DELETE /api/todo/:id` |
| SDUI | `GET /ui`, `GET /ui/specs`, `GET` / `PUT` / `DELETE /ui/schema`, `GET` / `PUT` / `DELETE /ui/:id` |
| Docs | `GET /openapi.json` (generated spec), `GET /docs` (Swagger UI) |

OpenAPI is generated from Zod route definitions (`createRoute` + `OpenAPIHono`).

## Project layout

```
src/
  app.ts           # OpenAPIHono, middleware (CORS, logger), doc + Swagger
  server.ts        # Postgres check, migrations, Bun.serve
  config/          # CORS, origins, env-based UI spec ids
  db/              # Postgres client, migrations, repos
  handlers/        # Route handlers (todo, ui)
  lib/             # UI build/serve, schema cache, validation, etc.
  openapi/         # Shared Zod schemas for OpenAPI
  routes/          # createRoute + mount (todo, ui)
```

Path alias: `@/*` → `src/*` (see `tsconfig.json`).

## Docker

A `Dockerfile` is included. Build and run with your own `DATABASE_URL` (e.g. via `-e` or orchestrator secrets):

```bash
docker build -t sdui-orchestrator .
docker run --rm -p 3000:3000 -e DATABASE_URL=postgresql://... sdui-orchestrator
```

Ensure production installs include runtime dependencies your image expects (match `package.json` `dependencies` / lockfile with how you run `bun install` in the image).

## License

Private package (`"private": true` in `package.json`). Add a license file if you open-source the repo.
