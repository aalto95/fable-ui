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
| No CI — No GitHub Actions, no automated lint/tests/build on push/PR. | **High** |
| No error boundaries — A bad component spec crashes the whole page. | **Medium** |
| Admin app has two competing fetch paths — `App.tsx` inlines its own fetch logic while the `useSduiAdmin` hook / `orchestratorClient` helpers sit unused. | **Medium** |
| Empty placeholders — `mock-api/` and `react-template/` have no source. | **Low-Medium** |
| No a11y audit — Radix handles some, but no explicit testing or linting. | **Medium** |
| No i18n — All labels/strings are hardcoded in component interfaces. | **Low-Medium** |
| No component docs / Storybook — No isolated dev environment for consumers. | **Medium** |
| `any` in lazy-loaders — Acknowledged but still a maintenance risk. | **Low** |
| Repeated model interfaces — `IInput`/`ITextarea`/`IDatepicker`/`ISelect`/`ISlider` share identical fields. | **Low-Medium** |

---

## Enhancement roadmap

### Short-term (P1)

1. **Add CI** — GitHub Actions running `pnpm lint && pnpm test && pnpm build` on push/PR. Currently nothing runs automatically.
2. **Add error boundaries** — Wrap `Component`/`Renderer` so a single bad spec fails that node instead of the whole page.
3. **Deduplicate admin fetch logic** — Delete or wire up `useSduiAdmin` (currently dead code) so `App.tsx` and the hook don't drift.

### Medium-term (P2)

4. **Model refactoring** — Extract a shared `IFieldComponent` base from `IInputComponent`, `ITextareaComponent`, `IDatepickerComponent`, `ISelectComponent`, `ISliderComponent`.
5. **Storybook** — Add to `fable-ui` or `shared` for visual regression and consumer DX.
6. **a11y** — Add `eslint-plugin-jsx-a11y`, run Lighthouse audit on demo pages, add focus-trap to dialogs.
7. **i18n groundwork** — `I18nProvider` context with keyed strings in component interfaces.
8. **Delete or ship** — Either implement `mock-api` and `react-template`, or remove them from the workspace.

### Long-term (P3)

9. **Fine-grained AuthZ** — Role-based permissions (read-only vs. admin keys) and per-origin access control for the orchestrator.
10. **Performance testing** — Benchmark Renderer with large UI trees (1000+ nodes), identify bottlenecks.
11. **Plugins/extensions** — Allow third-party registry packages via npm (discoverable by convention).
