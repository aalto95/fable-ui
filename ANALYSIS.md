# fable-ui Project Analysis

**Rating: 8.3 / 10**

---

## What's strong

- **Architecture** — Schema-driven rendering with pluggable registry is cleanly separated (Renderer → Component → Registry → branch/leaf). `React.lazy()` default strategy gives free code-splitting.
- **Tech choices** — React 19, TypeScript 6, Vite 8, Tailwind 4, pnpm + Turborepo, Radix primitives, CVA. Modern, deliberate, consistent.
- **Monorepo hygiene** — Centralised `catalog:` versions, shared `biome.json`, proper `tsconfig.build.json` separation, clean dependency graphs.
- **Published library** — `fable-ui` on npm with subpath exports, ESM-only, dts generation.
- **Documentation** — AGENTS.md, READMEs for root/lib/orchestrator, JSON schema export, OpenAPI docs.
- **Orchestrator** — Hono + Postgres with ETag caching, AJV validation, origin bindings, migration scripts, OpenAPI generated from Zod.
- **Tests green** — `pnpm lint`, `pnpm test`, and `pnpm build` all pass. 219 tests across `fable-ui` (129), `fable-shared` (24), and the orchestrator (66, added route-level + unit coverage).
- **Admin auth** — API-key bearer auth on all mutating endpoints (SHA-256 hashed `admin_api_keys` table, env master key for bootstrap, dev-only opt-out), covered by tests and documented.

---

## What drags it down

| Issue | Severity |
|-------|----------|
| Checks are advisory, not blocking — Vercel handles build/deploy on push, `.github/workflows/lint-and-test.yml` runs lint/tests on push + PRs, and a pre-commit hook (husky + lint-staged) runs lint/tests before commits. Branch protection is not yet enabled, so a direct push to `main` still deploys even if checks fail. | **Medium** |
| No error boundaries — A bad component spec crashes the whole page. | **Medium** |
| No a11y audit — Radix handles some, but no explicit testing or linting. | **Medium** |
| No i18n — All labels/strings are hardcoded in component interfaces. | **Low-Medium** |
| No component docs / Storybook — No isolated dev environment for consumers. | **Medium** |

---

## Enhancement roadmap

### Short-term (P1)

1. **Enable branch protection** — Require the `lint-and-test` check on `main` so a direct push that breaks lint/tests doesn't reach production (currently Vercel deploys any push). Deploys are otherwise covered: Vercel builds, `.github/workflows/lint-and-test.yml` runs lint/tests on push + PRs, and a pre-commit hook (husky + lint-staged) guards every commit.
2. **Add error boundaries** — Wrap `Component`/`Renderer` so a single bad spec fails that node instead of the whole page.

### Medium-term (P2)

3. **Storybook** — Add to `fable-ui` or `shared` for visual regression and consumer DX.
4. **a11y** — Add `eslint-plugin-jsx-a11y`, run Lighthouse audit on demo pages, add focus-trap to dialogs.
5. **i18n groundwork** — `I18nProvider` context with keyed strings in component interfaces.

### Long-term (P3)

6. **Fine-grained AuthZ** — Role-based permissions (read-only vs. admin keys) and per-origin access control for the orchestrator.
7. **Performance testing** — Benchmark Renderer with large UI trees (1000+ nodes), identify bottlenecks.
8. **Plugins/extensions** — Allow third-party registry packages via npm (discoverable by convention).
