# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **`form`** is a **layout** built-in (with **`descendants`**) instead of a leaf with **`fields`**. API prefill now merges into named inputs nested inside **`v_stack`**, **`h_stack`**, **`card`**, etc.

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
