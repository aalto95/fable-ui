# fable-ui

Schema-driven React UI: render a tree of typed components from data (`IPage`), with a pluggable registry for custom kinds and optional built-in registration.

## Install

```bash
npm install fable-ui
```

### Peer dependencies

Install these in your app (versions should satisfy the ranges in `package.json`):

- `react` / `react-dom`
- `react-router`
- **Tailwind CSS v4** — build pipeline must process CSS (e.g. `@tailwindcss/vite` or PostCSS).

**Toasts** use [Sonner](https://github.com/emilkowalski/sonner), bundled with `fable-ui` — wrap your app in `SduiProvider` so layout `toast()` calls and the default `<Toaster />` work without installing Sonner separately. **`SduiProvider`** also includes **`DebugProvider`**: `useDebug()` toggles layout outlines; by default the flag is stored as `fableUi.debug.enabled` in `localStorage` (override with the `debug` prop if you need controlled state).

**Theming** re-exports [`next-themes`](https://github.com/pacocoursey/next-themes) (`ThemeProvider`, `useTheme`, etc.) so you can drive light/dark (e.g. `.dark` on `html`) without a separate dependency.

### Styles, font, and theme (shadcn-compatible)

Built-in components use **Tailwind** utilities and **CSS variables** in the same spirit as [shadcn/ui](https://ui.shadcn.com/) (Radix + CVA). There is no runtime `shadcn` npm package — the UI lives in `fable-ui`.

The package ships **`fable-ui/styles.css`**: **Geist Variable** ([`@fontsource-variable/geist`](https://www.npmjs.com/package/@fontsource-variable/geist)), **[tw-animate-css](https://github.com/Wombosvideo/tw-animate-css)** for motion utilities, `:root` / `.dark` tokens, `@theme inline` mappings, base styles, and a `@source` rule so Tailwind scans components inside `fable-ui`. Import it **after** Tailwind and add a `@source` for your own files:

```css
@import "tailwindcss";
@import "fable-ui/styles.css";
@source "./src/**/*.ts";
@source "./src/**/*.tsx";
```

You still need **Tailwind v4** in your dev/build tooling to compile `@theme`, `@apply`, and `@source`.

## Quick start

Define pages as `{ route, ui }` where `ui` is an array of component nodes. Render with `Renderer`:

```tsx
import { Renderer, SduiProvider, type IPage } from "fable-ui";

const page: IPage = {
  route: "/",
  ui: [
    /* component objects from your schema */
  ],
};

export function App() {
  return (
    <SduiProvider>
      <Renderer ui={page.ui} />
    </SduiProvider>
  );
}
```

Load schema from your API or static JSON the same way: map each entry to a route and pass `page.ui` into `Renderer`.

**Full built-in reference (props, actions, behavior):** [COMPONENTS.md](./COMPONENTS.md).

## JSON Schema

The npm package includes **[schema.json](./schema.json)** (draft 2020-12): it describes the top-level SDUI document (`ui`: array of pages with `route` and component trees) and every built-in `type`. Use it in editors for completion and validation, or in CI with a JSON Schema validator.

```json
{
  "$schema": "./node_modules/fable-ui/schema.json",
  "ui": []
}
```

The package export **`fable-ui/schema.json`** resolves to the same file (for bundlers and `import`/`fs` resolution).

## Registering built-ins

By default, built-in kinds are **lazy-loaded** on first use. To register all built-ins **synchronously** (e.g. to avoid Suspense fallbacks or to override a built-in before lazy resolution), call:

```ts
import { registerDefaultComponents } from "fable-ui/register";

registerDefaultComponents();
```

For async registration (dynamic `import()` of each module), use:

```ts
import { registerDefaultComponentsAsync } from "fable-ui/register-async";

await registerDefaultComponentsAsync();
```

### Built-in kinds (summary)

| Layout | Leaf |
| --- | --- |
| `card`, `form`, `h_stack`, `v_stack` | `accordion`, `button`, `checkbox`, `datepicker`, `input`, `markdown`, `pagination`, `select`, `subtitle`, `table`, `title`, `textarea`, `slider` |

See **[COMPONENTS.md](./COMPONENTS.md)** for every field, action type, and behavioral note.

The **`markdown`** leaf renders GitHub Flavored Markdown from the `content` string (`remark-gfm` + HTML sanitization). Use for docs or rich copy inside layouts.

## Custom components

Use `componentRegistry` to register your own layout or leaf kinds (layout components receive recursive `descendants`; leaves render props only):

```tsx
import { componentRegistry } from "fable-ui";

componentRegistry.registerLeaf("my_widget", MyWidget);
```

## Exports

- **Main** (`fable-ui`): `Renderer`, `SduiProvider` (dialog + toasts + debug context), `Component`, `Markdown`, primitives, `componentRegistry`, HTTP helpers (`http`, `executeAction`), optional `DebugProvider` for advanced use, dialog context, `ThemeProvider` / `useTheme` (from bundled `next-themes`), and TypeScript types (`IPage`, component unions, etc.).
- **`fable-ui/styles.css`**: default Geist font, animation helpers, design tokens, Tailwind theme wiring (see **Styles** above). Published with `src/` so Tailwind can scan built-in components.
- **`fable-ui/register`**: `registerDefaultComponents`.
- **`fable-ui/register-async`**: `registerDefaultComponentsAsync`.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
