# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.5] - 2026-04-21

### Changed

- Version bump to **`1.3.5`** for the next npm release.

## [1.3.4] - 2026-04-21

### Added

- **`image` (leaf)** — Built-in **`image`** node: responsive **`<img>`** from **`src`**, optional **`alt`**, wrapper / **`imgClassName`**, **`loading`**, **`width`** / **`height`**, **`hidden`**. Documented in **`COMPONENTS.md`** and **`schema.json`**.
- **`button` (schema)** — While an HTTP-backed action runs inside **`Form`**, **`button`** nodes with **`actions`** are disabled and exposed as busy (**`aria-busy`**) via **`FormActionsProvider`** pending state, so users cannot trigger duplicate requests.

## [1.2.0] - 2026-04-13

### Added

- **`SduiProvider`** — Single wrapper for schema-driven UI: owns dialog state, **`SduiDialog`** (default confirm UI on **`useDialog()`**), **`SduiToaster`** (Sonner + Lucide icons, theme-friendly defaults), and **`DebugProvider`** (layout outlines via **`useDebug()`**). Optional **`toasterProps`**, optional controlled **`debug`**, default debug persistence under **`fableUi.debug.enabled`** in `localStorage`.
- **`fable-ui/styles.css`** — Default styling entry: **Geist Variable** (`@fontsource-variable/geist`), **tw-animate-css**, shadcn-style **`:root` / `.dark`** tokens, **`@theme inline`**, base layer, and **`@source`** for built-in components. Import after **`@import "tailwindcss"`** in the app.
- **Re-exports** — **`ThemeProvider`**, **`useTheme`**, and related types from **`next-themes`** (bundled dependency).
- **Dependencies (bundled, no longer app peers):** **`sonner`**, **`next-themes`**, **`@fontsource-variable/geist`**, **`tw-animate-css`**.

### Changed

- **`form`** is a **layout** built-in (with **`descendants`**) instead of a leaf with **`fields`**. API prefill merges into named inputs nested inside **`v_stack`**, **`h_stack`**, **`card`**, etc.
- **Peer dependencies:** **`tailwindcss` ^4** is required when using **`fable-ui/styles.css`** (or any CSS using **`@theme`**, **`@apply`**, **`@source`**). **`sonner`** is no longer a peer (provided transitively).
- **Package contents** — **`src/`** is published so Tailwind can scan component sources; **`sideEffects`** includes **`**/*.css`** for correct bundling of styles.
- **`DebugProvider`** is still exported for advanced use; **`useDebug`** works when nested under **`SduiProvider`**.

### Documentation

- **`README.md`** — Install peers, styles import, **`SduiProvider`**, theming, and export list updated.

## [1.1.0] - 2026-04-08

### Added

- **`markdown` leaf** — Renders GitHub Flavored Markdown (`content`) with `remark-gfm` and `rehype-sanitize`. Optional `className` on the wrapper.
- **`COMPONENTS.md`** — Reference for built-in kinds, props, and actions (shipped in the npm package).
- **`schema.json`** — JSON Schema (draft 2020-12) for SDUI documents (`ui` page list and component trees). Published with the package.
- **Export** `fable-ui/schema.json` — Resolves to the bundled schema for editors, validators, and tooling.

### Changed

- Documentation updates in `README.md` for the new features and schema usage.

## [1.0.0] - 2026-04-06

### Added

- Initial release of **`fable-ui`**: schema-driven `Renderer`, `Component`, pluggable `componentRegistry`, lazy-loaded built-ins, HTTP/action helpers, dialog and debug providers, and TypeScript types for pages and UI nodes.
- Entry points: `fable-ui`, `fable-ui/register`, `fable-ui/register-async`.
- Package metadata: README, keywords, and npm configuration.

### Changed

- Package renamed from **`manifest-ui`** to **`fable-ui`**.

<!-- Release comparison links can be added here once the repository URL is fixed. -->
