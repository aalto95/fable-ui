import type { TComponentUnion } from "fable-ui";

import markdownDemo from "./markdown-demo.md?raw";

/**
 * Documentation page tree rendered by {@link Renderer} at `/docs`.
 */
export const DOCS_UI: TComponentUnion[] = [
  {
    type: "v_stack",
    descendants: [
      {
        type: "title",
        text: "Fable UI",
      },
      {
        type: "subtitle",
        text: "Schema-driven React: load pages from JSON, render forms and layouts from a pluggable component registry.",
      },
      {
        type: "markdown",
        content: markdownDemo,
      },
      {
        type: "card",
        title: "Overview",
        description:
          "The demo app bundles a UI schema in src/schema/ui-schema.ts (pages with routes and component trees) and renders each route with Renderer.",
      },
      {
        type: "card",
        title: "npm package",
        description:
          "Install fable-ui in your app, wrap routes with the same providers as this demo (dialog, debug, toasts), and register built-ins or custom components via componentRegistry.",
      },
      {
        type: "card",
        title: "Built-in kinds",
        description:
          "Layouts: card, form, h_stack, v_stack. Leaves include markdown, image, input, button, table, accordion, title, subtitle, and more. Open Components in the sidebar: each showcase page documents props and behavior, then a Demo section with a live example. The fable-ui package also ships COMPONENTS.md with the same reference.",
      },
      {
        type: "accordion",
        items: [
          {
            name: "renderer",
            title: "Renderer",
            text: "Maps page.ui to Component trees. Each node has a type string resolved via the registry or lazy-built-ins.",
          },
          {
            name: "registry",
            title: "Registry",
            text: "Register custom layout and leaf components with componentRegistry.registerLayout / registerLeaf.",
          },
          {
            name: "register",
            title: "register & register-async",
            text: "Optional entry points to eagerly register all built-ins synchronously or via dynamic import.",
          },
        ],
      },
      {
        type: "h_stack",
        descendants: [
          {
            type: "button",
            text: "Back to app",
            variant: "outline",
            actions: [
              {
                type: "GO_TO",
                label: "home",
                path: "/",
              },
            ],
          },
        ],
      },
    ],
  },
];
