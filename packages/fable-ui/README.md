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
- `sonner` (toasts; used by layout actions)

The built-in components use **Tailwind CSS** utility classes. Your app should include Tailwind (or equivalent) so layouts and controls look correct.

## Quick start

Define pages as `{ route, ui }` where `ui` is an array of component nodes. Render with `Renderer`:

```tsx
import { Renderer, type IPage } from "fable-ui";

const page: IPage = {
  route: "/",
  ui: [
    /* component objects from your schema */
  ],
};

export function Page() {
  return <Renderer ui={page.ui} />;
}
```

Load schema from your API or static JSON the same way: map each entry to a route and pass `page.ui` into `Renderer`.

**Full built-in reference (props, actions, behavior):** [COMPONENTS.md](./COMPONENTS.md).

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
| `card`, `h_stack`, `v_stack` | `accordion`, `button`, `checkbox`, `datepicker`, `form`, `input`, `markdown`, `pagination`, `select`, `subtitle`, `table`, `title`, `textarea`, `slider` |

See **[COMPONENTS.md](./COMPONENTS.md)** for every field, action type, and behavioral note.

The **`markdown`** leaf renders GitHub Flavored Markdown from the `content` string (`remark-gfm` + HTML sanitization). Use for docs or rich copy inside layouts.

## Custom components

Use `componentRegistry` to register your own layout or leaf kinds (layout components receive recursive `descendants`; leaves render props only):

```tsx
import { componentRegistry } from "fable-ui";

componentRegistry.registerLeaf("my_widget", MyWidget);
```

## Exports

- **Main** (`fable-ui`): `Renderer`, `Component`, `Markdown`, primitives, `componentRegistry`, HTTP helpers (`http`, `executeAction`), dialog/debug providers, and TypeScript types (`IPage`, component unions, etc.).
- **`fable-ui/register`**: `registerDefaultComponents`.
- **`fable-ui/register-async`**: `registerDefaultComponentsAsync`.

## License

MIT
