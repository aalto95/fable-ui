import type { ShowcaseSlug } from "./showcase-demos";

const DOC_FOOTER = `

---

*Full built-in reference: **COMPONENTS.md** in the published \`fable-ui\` package (same content as this table of fields and behaviors).*`;

/** Long-form docs shown on each `/showcase/:kind` page (GFM markdown). */
export const SHOWCASE_MARKDOWN: Record<ShowcaseSlug, string> = {
  card: `### \`card\` (layout)

**Purpose:** Card container with optional header (title, description), body (nested components), and optional footer text.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"card"\` | Discriminator. |
| \`title\` | \`string?\` | Header title. |
| \`description\` | \`string?\` | Muted text under the title. |
| \`footerText\` | \`string?\` | Footer area text. |
| \`descendants\` | array? | Child nodes rendered in the card body. |

**Behavior:** Uses the design-system card shell (border, radius, padding). Body children are stacked vertically.`,

  "h-stack": `### \`h_stack\` (layout)

**Purpose:** Horizontal flex row of child components.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"h_stack"\` | |
| \`descendants\` | array? | Children in a row with gap. |

**Behavior:** Flex row—use for button groups, side-by-side controls, or toolbars.`,

  "v-stack": `### \`v_stack\` (layout)

**Purpose:** Vertical flex column of child components.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"v_stack"\` | |
| \`descendants\` | array? | Children stacked with gap. |

**Behavior:** Default pattern for page sections: titles, copy, forms, and blocks in reading order.`,

  accordion: `### \`accordion\` (leaf)

**Purpose:** Collapsible sections (expand/collapse panels).

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"accordion"\` | |
| \`items\` | \`{ name, title, text }[]?\` | \`name\` is a stable id; \`title\` is the header; \`text\` is the body. |

**Behavior:** Each item is a section with a header and body string.`,

  button: `### \`button\` (leaf)

**Purpose:** Clickable button; can run **actions** (navigation, HTTP, etc.) or participate in **form** submit when placed inside a form.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"button"\` | |
| \`text\` | \`string?\` | Label. |
| \`variant\` | string | \`default\`, \`outline\`, \`secondary\`, \`ghost\`, \`destructive\`, \`link\`. |
| \`size\` | string | \`default\`, \`sm\`, \`lg\`, \`icon\`. |
| \`expand\` | \`boolean?\` | Full width when true. |
| \`actions\` | \`IAction[]?\` | Executed on click when present. |

#### Common action \`type\` values

| \`type\` | Role |
| --- | --- |
| \`GO_TO\` | Client navigation; needs \`path\`. |
| \`GO_BACK\` | Browser history back. |
| \`HIDE\` | No-op (e.g. close flows). |
| \`HTTP_GET\` / \`HTTP_POST\` / \`HTTP_PUT\` / \`HTTP_PATCH\` / \`HTTP_DELETE\` | HTTP with form/query; see full reference. |

Optional \`dialogConfig\` on an action can show a confirmation dialog first.`,

  checkbox: `### \`checkbox\` (leaf)

**Purpose:** Boolean checkbox input.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"checkbox"\` | |
| \`name\` | \`string?\` | Form field name. |
| \`label\` | \`string?\` | Visible label. |
| \`required\` | \`boolean?\` | |
| \`checked\` | \`boolean?\` | Initial checked state. |`,

  datepicker: `### \`datepicker\` (leaf)

**Purpose:** Date field using the design-system date input (native date picker where supported).

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"datepicker"\` | |
| \`name\` | \`string?\` | |
| \`label\` | \`string?\` | |
| \`defaultValue\` | \`string?\` | |
| \`required\` | \`boolean?\` | |
| \`hidden\` | \`boolean?\` | Skip rendering when true. |`,

  form: `### \`form\` (leaf)

**Purpose:** \`<form>\` wrapper with optional **prefill** from an API and **fields** as nested component nodes.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"form"\` | |
| \`title\` | \`string?\` | Heading above fields. |
| \`dataSource\` | \`string?\` | Base URL for \`GET\` prefill when route param \`id\` exists. |
| \`fields\` | array? | Inputs, buttons, etc. as \`Component\` nodes. |

**Behavior:** **FormActionsProvider** wires buttons inside the form so HTTP actions can read the form DOM. Prefill shows loading while fetching; \`id\` comes from React Router \`useParams()\`.`,

  input: `### \`input\` (leaf)

**Purpose:** Single-line text field.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"input"\` | |
| \`name\` | \`string?\` | |
| \`label\` | \`string?\` | |
| \`defaultValue\` | \`string?\` | |
| \`required\` | \`boolean?\` | |
| \`hidden\` | \`boolean?\` | |`,

  markdown: `### \`markdown\` (leaf)

**Purpose:** Render **GitHub Flavored Markdown** (tables, lists, fenced code, task lists, etc.).

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"markdown"\` | |
| \`content\` | \`string?\` | Markdown source. |
| \`className\` | \`string?\` | Extra classes on the wrapper. |
| \`hidden\` | \`boolean?\` | |

**Behavior:** \`react-markdown\` + **remark-gfm** + **rehype-sanitize** so untrusted content is not rendered as raw HTML. Typography is styled via the wrapper (headings, lists, code, tables).

This showcase page uses the same \`markdown\` component for the documentation block above the demo.`,

  pagination: `### \`pagination\` (leaf)

**Purpose:** Page control synchronized with **URL search params** (shareable links).

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"pagination"\` | |
| \`pages\` | \`number\` | Total page count (required). |
| \`pageParam\` | \`string?\` | Query key for current page (e.g. \`page\`). |
| \`limitParam\` | \`string?\` | Query key for page size. |
| \`defaultLimit\` | \`number?\` | |

**Behavior:** Reads and writes \`useSearchParams\` so state lives in the URL.`,

  select: `### \`select\` (leaf)

**Purpose:** Native \`<select>\` with labeled options.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"select"\` | |
| \`name\` | \`string?\` | |
| \`label\` | \`string?\` | |
| \`options\` | \`{ label, value }[]?\` | |
| \`required\` | \`boolean?\` | |
| \`hidden\` | \`boolean?\` | |`,

  subtitle: `### \`subtitle\` (leaf)

**Purpose:** Secondary, muted one-line text (supporting copy under titles).

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"subtitle"\` | |
| \`text\` | \`string?\` | |
| \`hidden\` | \`boolean?\` | |`,

  table: `### \`table\` (leaf)

**Purpose:** Data table with optional remote **dataSource**, URL-driven pagination, row actions, and dialogs.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"table"\` | |
| \`heads\` | array? | \`{ name, label, type }\` columns; \`name\` keys row objects. |
| \`data\` | \`any[]?\` | Static rows when not using an API. |
| \`dataSource\` | \`string?\` | API base for fetched, paginated data. |
| \`pageParam\` / \`limitParam\` | \`string?\` | Query keys. |
| \`defaultLimit\` | \`number?\` | |
| \`actions\` | \`IAction[]?\` | Per-row actions (menus, HTTP, etc.). |

**Behavior:** With \`dataSource\`, fetches and syncs with search params. Row actions can use \`useDialog\` and \`http\` helpers. Static \`data\` is enough for demos without network.`,

  title: `### \`title\` (leaf)

**Purpose:** Primary page or section heading.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"title"\` | |
| \`text\` | \`string?\` | |
| \`hidden\` | \`boolean?\` | |`,

  textarea: `### \`textarea\` (leaf)

**Purpose:** Multi-line text field.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"textarea"\` | |
| \`name\` | \`string?\` | |
| \`label\` | \`string?\` | |
| \`defaultValue\` | \`string?\` | |
| \`required\` | \`boolean?\` | |
| \`hidden\` | \`boolean?\` | |`,

  slider: `### \`slider\` (leaf)

**Purpose:** Numeric range slider.

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"slider"\` | |
| \`name\` | \`string?\` | |
| \`label\` | \`string?\` | |
| \`min\` / \`max\` | \`number?\` | Defaults often \`0\` / \`100\`. |
| \`step\` | \`number?\` | |
| \`defaultValue\` | \`number?\` | |
| \`valueSuffix\` | \`string?\` | e.g. \`%\` after the value. |
| \`required\` | \`boolean?\` | |

**Behavior:** Uses the design-system slider; integrates with form context where applicable.`,
} satisfies Record<ShowcaseSlug, string>;

/** Markdown block for the showcase page (includes footer pointer to COMPONENTS.md). */
export function showcaseDocFor(slug: ShowcaseSlug): string {
  return SHOWCASE_MARKDOWN[slug] + DOC_FOOTER;
}
