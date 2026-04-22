import type { TComponentUnion } from "fable-ui";

/** Landing page for `/` rendered by {@link Renderer}. */
export const HOME_UI: TComponentUnion[] = [
  {
    type: "v_stack",
    descendants: [
      {
        type: "title",
        text: "Fable UI demo",
      },
      {
        type: "subtitle",
        text: "Schema-driven branches, built-in components, and Markdown — explore from the sidebar.",
      },
      {
        type: "card",
        title: "Get started",
        description:
          "Browse Docs for an overview, or open Components to see each built-in leaf and branch in isolation.",
        descendants: [
          {
            type: "h_stack",
            descendants: [
              {
                type: "button",
                text: "Documentation",
                variant: "default",
                actions: [
                  {
                    type: "GO_TO",
                    label: "docs",
                    path: "/docs",
                  },
                ],
              },
              {
                type: "button",
                text: "Title component",
                variant: "outline",
                actions: [
                  {
                    type: "GO_TO",
                    label: "showcase-title",
                    path: "/showcase/title",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
