# Component reference

This document describes every **built-in** schema component kind: what it renders, which fields it accepts, and how it interacts with routing, HTTP, and forms. Shapes match the TypeScript types in `src/models/interfaces/component.ts`.

For setup (install, `Renderer`, registry), see [README.md](./README.md).

---

## How nodes work

- Each UI node is a JSON object with a required **`type`** string (`TComponent`).
- **Layouts** nest other nodes via **`descendants`**: `card`, `form`, `h_stack`, `v_stack`. (The **`form`** layout renders its tree internally so prefill can update nested field props.)
- **Leaves** have no `descendants`; they render controls or content only.
- The **`Component`** resolver loads a React implementation either from **`componentRegistry`** (your registrations) or from **lazy built-ins** (code-split chunks) when the kind matches a known built-in name.

Optional **`hidden: true`** (where supported) skips rendering that node.

---

## Actions (`IAction`)

Used on **button** and in **table** row actions. Each action has **`type`**, **`label`**, and optional fields.

| `type` | Purpose | `path` / notes |
| --- | --- | --- |
| `GO_TO` | Client navigation | **`path`** — React Router path (e.g. `/docs`). |
| `GO_BACK` | History back | No `path`. |
| `HIDE` | No-op (close dialog flows, etc.) | — |
| `HTTP_GET` | GET with query from form | **`path`** — base URL; form fields become query params. |
| `HTTP_POST` | POST JSON body from form | **`path`**; **`path/:id`** when `id` from route exists. |
| `HTTP_PUT` | PUT | **`path`**; requires route **`id`**. |
| `HTTP_PATCH` | PATCH | **`path`**; requires route **`id`**. |
| `HTTP_DELETE` | DELETE | **`path`**; requires route **`id`**. |

Optional **`dialogConfig`** on an action can drive a confirmation dialog (title, description, button labels).  
Optional **`variant`** can style the triggering control.

Buttons with **`actions`** use client-side handlers (navigation, HTTP, etc.); submit-style behavior is integrated with **`Form`** when the button lives inside a form.

---

## Layouts

### `card`

**Purpose:** Card container with optional header (title, description), optional body (children), optional footer.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"card"` | |
| `title` | `string?` | Shown in the card header. |
| `description` | `string?` | Muted text under the title. |
| `footerText` | `string?` | Footer area text. |
| `descendants` | `TComponentUnion[]?` | Rendered as the card body (nested components). |

**Behavior:** Wraps content in the design-system card shell (border, radius, padding). Children are laid out in a vertical stack inside the content region.

---

### `h_stack`

**Purpose:** Horizontal flex row of child components.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"h_stack"` | |
| `descendants` | `TComponentUnion[]?` | Children placed in a row with gap. |

**Behavior:** Uses flex row; useful for button groups or side-by-side controls.

---

### `v_stack`

**Purpose:** Vertical flex column of child components.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"v_stack"` | |
| `descendants` | `TComponentUnion[]?` | Children stacked vertically with gap. |

**Behavior:** Default layout for page sections (titles, forms, paragraphs).

---

### `form`

**Purpose:** `<form>` wrapper with optional **prefill** from an API and **`descendants`** rendered as nested **`Component`** nodes (you may nest **`v_stack`**, **`h_stack`**, **`card`**, etc., inside the form).

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"form"` | |
| `title` | `string?` | Heading above the body. |
| `dataSource` | `string?` | Base URL for **`GET ${dataSource}/:id`** when route param **`id`** exists (prefill). |
| `descendants` | `TComponentUnion[]?` | Form controls, buttons, and nested layouts. |

**Behavior:** Uses **`FormActionsProvider`** so buttons inside can run HTTP actions with the form DOM. Prefill walks **`descendants` recursively** (named inputs inside stacks/cards get **`defaultValue`** / **`checked`** merged from the API payload). Shows a loading state while fetching. **`id`** comes from React Router **`useParams()`**.

---

## Leaves

### `title`

**Purpose:** Primary page or section heading.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"title"` | |
| `text` | `string?` | Heading text. |
| `hidden` | `boolean?` | If true, nothing is rendered. |

---

### `subtitle`

**Purpose:** Secondary, muted one-line text (supporting copy).

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"subtitle"` | |
| `text` | `string?` | |
| `hidden` | `boolean?` | |

---

### `markdown`

**Purpose:** Render **GitHub Flavored Markdown** (tables, lists, fenced code, task lists, etc.).

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"markdown"` | |
| `content` | `string?` | Markdown source. |
| `className` | `string?` | Extra classes on the wrapper `div` (e.g. Tailwind). |
| `hidden` | `boolean?` | |

**Behavior:** Uses `react-markdown` with **`remark-gfm`** and **`rehype-sanitize`** so untrusted strings are not rendered as raw HTML. Styling uses Tailwind arbitrary selectors on the wrapper for headings, lists, code blocks, and tables.

---

### `image`

**Purpose:** Display an image from a URL (hero, illustration, avatar, etc.).

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"image"` | |
| `src` | `string?` | Image URL. If missing or blank, nothing is rendered. |
| `alt` | `string?` | Accessible text; use `""` for decorative images when appropriate. |
| `className` | `string?` | Extra classes on the wrapper (layout, max width). |
| `imgClassName` | `string?` | Extra classes on the `<img>`. |
| `loading` | `"lazy"` \| `"eager"` | Native lazy loading (default **`lazy`**). |
| `width` / `height` | `number?` | Optional intrinsic size (pixel attributes on `<img>`). |
| `hidden` | `boolean?` | |

**Behavior:** Renders a bordered, rounded wrapper and a responsive `<img>` (`max-w-full`, `object-contain`). Does not fetch or optimize URLs; the app is responsible for trusted `src` values (CDN, same-origin, etc.).

---

### `button`

**Purpose:** Clickable button; can submit a parent form or run **`actions`**.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"button"` | |
| `text` | `string?` | Label. |
| `variant` | shadcn variants | `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`. |
| `size` | `default` \| `sm` \| `lg` \| `icon` | |
| `expand` | `boolean?` | Full width when true. |
| `actions` | `IAction[]?` | On click, runs these (navigation, HTTP, etc.). |

**Behavior:** If **`actions`** are present, the button is `type="button"` and handlers run from the action pipeline (with React Router **`navigate`** and optional **`useDialog`**). If there are no actions and the button is inside a **form**, it may act as submit depending on layout code paths.

---

### `input`

**Purpose:** Single-line text field.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"input"` | |
| `name` | `string?` | Form field name. |
| `label` | `string?` | Accessible label. |
| `defaultValue` | `string?` | |
| `required` | `boolean?` | |
| `hidden` | `boolean?` | |

---

### `textarea`

**Purpose:** Multi-line text field.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"textarea"` | |
| `name` | `string?` | |
| `label` | `string?` | |
| `defaultValue` | `string?` | |
| `required` | `boolean?` | |
| `hidden` | `boolean?` | |

---

### `select`

**Purpose:** Native `<select>` with options.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"select"` | |
| `name` | `string?` | |
| `label` | `string?` | |
| `options` | `{ label, value }[]?` | Options list. |
| `required` | `boolean?` | |
| `hidden` | `boolean?` | |

---

### `checkbox`

**Purpose:** Checkbox input.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"checkbox"` | |
| `name` | `string?` | |
| `label` | `string?` | |
| `required` | `boolean?` | |
| `checked` | `boolean?` | Initial checked state. |

---

### `datepicker`

**Purpose:** Date input (native date picker styling from the design system).

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"datepicker"` | |
| `name` | `string?` | |
| `label` | `string?` | |
| `defaultValue` | `string?` | |
| `required` | `boolean?` | |
| `hidden` | `boolean?` | |

---

### `slider`

**Purpose:** Numeric range slider.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"slider"` | |
| `name` | `string?` | |
| `label` | `string?` | |
| `min` | `number?` | Default `0`. |
| `max` | `number?` | Default `100`. |
| `step` | `number?` | Default `1`. |
| `defaultValue` | `number?` | |
| `valueSuffix` | `string?` | Shown after the value (e.g. `%`). |
| `required` | `boolean?` | |

**Behavior:** Controlled internal state for display; integrates with the design-system slider primitive.

---

### `accordion`

**Purpose:** Collapsible sections (one panel open at a time depending on implementation).

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"accordion"` | |
| `items` | `{ name, title, text }[]?` | **`name`** — stable id; **`title`** — header; **`text`** — body (plain text / simple content). |

---

### `table`

**Purpose:** Data table with optional remote **dataSource**, pagination, row actions, and dialogs.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"table"` | |
| `heads` | `{ name, label, type: "string"\|"date" }[]?` | Column definitions; **`name`** keys rows in **`data`**. |
| `data` | `any[]?` | Static rows when not loading from API. |
| `dataSource` | `string?` | API base for paginated list (fetch + merge with URL search params). |
| `pageParam` | `string?` | Query param for page (default in code). |
| `limitParam` | `string?` | Query param for page size. |
| `defaultLimit` | `number?` | |
| `actions` | `IAction[]?` | Row-level actions (menus, etc.). |

**Behavior:** When **`dataSource`** is set, the table fetches and syncs with **`useSearchParams`**. Row actions can open **`useDialog`** and call **`http`** helpers. Static **`data`** is used for simple demos without network.

---

### `pagination`

**Purpose:** Page control linked to URL query parameters.

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"pagination"` | |
| `pages` | `number` | Total page count (required). |
| `pageParam` | `string?` | Query key for current page (e.g. `page`). |
| `limitParam` | `string?` | Query key for page size. |
| `defaultLimit` | `number?` | |

**Behavior:** Reads/writes **`useSearchParams`** so pagination is shareable via URL.

---

## Custom kinds

Register your own React components with **`componentRegistry.registerLayout(name, Component)`** or **`registerLeaf(name, Component)`**. Layout components receive React **`children`** built from **`descendants`**, except the built-in **`form`** layout (it receives **`descendants`** as props and renders the tree itself for prefill). Leaf components receive the rest of the props object (everything except **`type`**).

---

## See also

- [README.md](./README.md) — install, `Renderer`, `register` entry points, exports.
