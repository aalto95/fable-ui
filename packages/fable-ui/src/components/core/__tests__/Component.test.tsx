import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { Component } from "@/components/core/Component";
import { SduiProvider } from "@/components/core/SduiProvider";
import type { TComponentUnion } from "@/models/interfaces/component";
import { componentRegistry } from "@/registry/component-registry";
import { registerDefaultComponents } from "@/registry/register-defaults";

function SimpleLeaf({ text }: { text?: string }) {
  return <div data-testid="custom-leaf">{text ?? "custom leaf"}</div>;
}

describe("Component", () => {
  beforeAll(() => {
    registerDefaultComponents();
  });

  function renderInProvider(element: React.ReactElement) {
    return render(<SduiProvider>{element}</SduiProvider>);
  }

  it("renders a built-in leaf component", () => {
    renderInProvider(<Component type="title" text="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders a built-in branch component with descendants", () => {
    renderInProvider(
      <Component type="v_stack" descendants={[{ type: "title", text: "Nested" }]} />,
    );
    expect(screen.getByText("Nested")).toBeInTheDocument();
  });

  it("renders a registered custom leaf component", () => {
    componentRegistry.registerLeaf("custom-leaf", SimpleLeaf);
    renderInProvider(
      <Component
        {...({ type: "custom-leaf" as const, text: "custom" } as unknown as TComponentUnion)}
      />,
    );
    expect(screen.getByTestId("custom-leaf")).toHaveTextContent("custom");
  });

  it("returns null for unknown component type", () => {
    const { container } = renderInProvider(
      <Component {...({ type: "unknown_type" as const } as unknown as TComponentUnion)} />,
    );
    expect(container.innerHTML).not.toContain("fable-ui-debug");
  });
});
