# fable-ui Project Analysis

**Rating: 7.5 / 10**

---

## What's strong

- **Architecture** — Schema-driven rendering with pluggable registry is cleanly separated (Renderer → Component → Registry → branch/leaf). `React.lazy()` default strategy gives free code-splitting.
- **Tech choices** — React 19, TypeScript 6, Vite 8, Tailwind 4, pnpm + Turborepo, Radix primitives, CVA. Modern, deliberate, consistent.
- **Monorepo hygiene** — Centralised `catalog:` versions, shared `biome.json`, proper `tsconfig.build.json` separation, clean dependency graphs.
- **Published library** — `fable-ui` on npm with subpath exports, ESM-only, dts generation.
- **Documentation** — AGENTS.md, READMEs for root/lib/orchestrator, JSON schema export, OpenAPI docs.
- **Orchestrator** — Hono + Postgres with ETag caching, AJV validation, origin bindings, migration scripts.
- **Tests exist** — Vitest + testing-library for most fable-ui and shared components.

---

## What drags it down

| Issue | Severity |
|-------|----------|
| Build broken — `fable-ui-web` fails (`tsc -b`). `@/` path aliases in `fable-shared` source aren't resolvable when consumed via workspace. | **Critical** |
| No CI — No GitHub Actions, no automated lint/tests/build on push/PR. | **High** |
| Orchestrator untested — Zero tests for the API server. | **High** |
| Empty placeholders — `mock-api/` and `react-template/` have no source. | **Low-Medium** |
| `any` in lazy-loaders — Acknowledged but still a maintenance risk. | **Low** |
| No error boundaries — A bad component spec crashes the whole page. | **Medium** |
| No a11y audit — Radix handles some, but no explicit testing or linting. | **Medium** |
| No i18n — All labels/strings are hardcoded in component interfaces. | **Low-Medium** |
| No component docs / Storybook — No isolated dev environment for consumers. | **Medium** |

---

## Enhancement roadmap

### Immediate (P0)

1. **Fix the build** — The `@/` alias issue in `fable-shared` blocks the demo site. Options: switch shared to relative imports, add the `fableUiLibAtAlias()` Vite plugin for shared too, or remove `tsc -b` from web build (use `vite build` only).

### Short-term (P1)

2. **Add CI** — GitHub Actions running `pnpm lint && pnpm build` on push/PR.
3. **Test the orchestrator** — Hono has good testing utilities. Add route-level tests for CRUD endpoints.
4. **Add error boundaries** — Wrap `Component` and `Renderer` with React error boundaries.

### Medium-term (P2)

5. **Model refactoring** — `IInputComponent`, `ITextareaComponent`, `IDatepickerComponent`, `ISelectComponent`, `ISliderComponent` share the same fields. Extract a shared `IFieldComponent` base.
6. **Storybook** — Add to `fable-ui` or `shared` for visual regression and consumer DX.
7. **a11y** — Add `eslint-plugin-jsx-a11y`, run Lighthouse audit on demo pages, add focus-trap to dialogs.
8. **i18n groundwork** — `I18nProvider` context with keyed strings in component interfaces.
9. **Delete or ship** — Either implement `mock-api` and `react-template`, or remove them from the workspace.

### Long-term (P3)

10. **Auth/AuthZ** — Essential for production orchestrator deployments.
11. **Performance testing** — Benchmark Renderer with large UI trees (1000+ nodes), identify bottlenecks.
12. **Plugins/extensions** — Allow third-party registry packages via npm (discoverable by convention).
