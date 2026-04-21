import type { TComponentUnion } from "fable-ui";

import { showcaseDocFor } from "./showcase-docs";

/** URL slugs for `/showcase/:kind` (match built-in layout + leaf kinds). */
export const SHOWCASE_SLUGS = [
  "card",
  "h-stack",
  "v-stack",
  "accordion",
  "button",
  "checkbox",
  "datepicker",
  "form",
  "image",
  "input",
  "markdown",
  "pagination",
  "select",
  "subtitle",
  "table",
  "title",
  "textarea",
  "slider",
] as const;

export type ShowcaseSlug = (typeof SHOWCASE_SLUGS)[number];

function shell(
  heading: string,
  description: string | undefined,
  slug: ShowcaseSlug,
  body: TComponentUnion[],
): TComponentUnion[] {
  return [
    {
      type: "v_stack",
      descendants: [
        { type: "title", text: heading },
        ...(description ? [{ type: "subtitle", text: description } as const] : []),
        {
          type: "markdown",
          content: showcaseDocFor(slug),
        },
        { type: "subtitle", text: "Demo" },
        ...body,
      ],
    },
  ];
}

export function showcaseSlugLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getShowcaseUi(kind: string): TComponentUnion[] | null {
  switch (kind) {
    case "card":
      return shell("Layout: card", "Container with optional header and footer.", "card", [
        {
          type: "card",
          title: "Example card",
          description: "Card description text.",
          descendants: [{ type: "subtitle", text: "Content inside the card layout." }],
        },
      ]);
    case "h-stack":
      return shell("Layout: h_stack", "Horizontal children row.", "h-stack", [
        {
          type: "h_stack",
          descendants: [
            { type: "button", text: "Left", variant: "outline" },
            { type: "button", text: "Right", variant: "outline" },
          ],
        },
      ]);
    case "v-stack":
      return shell("Layout: v_stack", "Vertical stack of children.", "v-stack", [
        {
          type: "v_stack",
          descendants: [
            { type: "subtitle", text: "First row" },
            { type: "subtitle", text: "Second row" },
          ],
        },
      ]);
    case "accordion":
      return shell("Accordion", undefined, "accordion", [
        {
          type: "accordion",
          items: [
            {
              name: "a1",
              title: "Section one",
              text: "Body for section one.",
            },
            {
              name: "a2",
              title: "Section two",
              text: "Body for section two.",
            },
          ],
        },
      ]);
    case "button":
      return shell("Button", "Actions on click (e.g. GO_TO).", "button", [
        {
          type: "button",
          text: "Go to Docs",
          actions: [
            {
              type: "GO_TO",
              label: "docs",
              path: "/docs",
            },
          ],
        },
      ]);
    case "checkbox":
      return shell("Checkbox", undefined, "checkbox", [
        { type: "checkbox", name: "demo", label: "Accept terms" },
      ]);
    case "datepicker":
      return shell("Datepicker", undefined, "datepicker", [
        {
          type: "datepicker",
          name: "date",
          label: "Pick a date",
        },
      ]);
    case "form":
      return shell("Form", "Fields and submit wired to form actions.", "form", [
        {
          type: "form",
          title: "Sample form",
          descendants: [
            {
              type: "input",
              name: "email",
              label: "Email",
            },
            {
              type: "button",
              text: "Submit",
              variant: "default",
              actions: [{ type: "HIDE", label: "noop" }],
            },
          ],
        },
      ]);
    case "input":
      return shell("Input", undefined, "input", [{ type: "input", name: "name", label: "Name" }]);
    case "image":
      return shell(
        "Image",
        "Responsive figure from a URL; lazy-loaded by default.",
        "image",
        [
          {
            type: "image",
            src: "https://picsum.photos/seed/fable-ui/640/360",
            alt: "Random sample photo from picsum.photos",
            className: "max-w-md",
          },
        ],
      );
    case "markdown":
      return shell("Markdown", "GFM + sanitization.", "markdown", [
        {
          type: "markdown",
          content:
            "## Rich text\n\n- **Bold** and *italic*\n- `inline code`\n\n```ts\nconst ok = true;\n```",
        },
      ]);
    case "pagination":
      return shell("Pagination", "Synced with URL search params.", "pagination", [
        { type: "pagination", pages: 5, pageParam: "page" },
      ]);
    case "select":
      return shell("Select", undefined, "select", [
        {
          type: "select",
          name: "choice",
          label: "Choose",
          options: [
            { label: "One", value: "1" },
            { label: "Two", value: "2" },
          ],
        },
      ]);
    case "subtitle":
      return shell("Subtitle", undefined, "subtitle", [
        { type: "subtitle", text: "Muted supporting text." },
      ]);
    case "table":
      return shell("Table", "Static rows with optional headers.", "table", [
        {
          type: "table",
          heads: [
            { name: "a", label: "Column A", type: "string" },
            { name: "b", label: "Column B", type: "string" },
          ],
          data: [
            { a: "Row 1", b: "Alpha" },
            { a: "Row 2", b: "Beta" },
          ],
        },
      ]);
    case "title":
      return shell("Title", undefined, "title", [{ type: "title", text: "Page title component" }]);
    case "textarea":
      return shell("Textarea", undefined, "textarea", [
        {
          type: "textarea",
          name: "notes",
          label: "Notes",
          defaultValue: "Multi-line text.",
        },
      ]);
    case "slider":
      return shell("Slider", undefined, "slider", [
        {
          type: "slider",
          name: "volume",
          label: "Volume",
          min: 0,
          max: 100,
          defaultValue: 42,
          valueSuffix: "%",
        },
      ]);
    default:
      return null;
  }
}
