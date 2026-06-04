import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { Renderer } from "@/components/core/Renderer";
import { SduiProvider } from "@/components/core/SduiProvider";
import { registerDefaultComponents } from "@/registry/register-defaults";

describe("Renderer", () => {
  beforeAll(() => {
    registerDefaultComponents();
  });

  it("renders null when ui is undefined", () => {
    const { container } = render(
      <SduiProvider>
        <Renderer />
      </SduiProvider>,
    );
    expect(container.innerHTML).not.toContain("fable-ui-debug");
  });

  it("renders null when ui is null", () => {
    const { container } = render(
      <SduiProvider>
        <Renderer ui={null as unknown as undefined} />
      </SduiProvider>,
    );
    expect(container.innerHTML).not.toContain("fable-ui-debug");
  });

  it("renders null when ui is an empty array", () => {
    const { container } = render(
      <SduiProvider>
        <Renderer ui={[]} />
      </SduiProvider>,
    );
    expect(container.innerHTML).not.toContain("fable-ui-debug");
  });

  it("renders a single component", () => {
    render(
      <SduiProvider>
        <Renderer ui={{ type: "title", text: "Hello" }} />
      </SduiProvider>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders multiple components", () => {
    render(
      <SduiProvider>
        <Renderer
          ui={[
            { type: "title", text: "First" },
            { type: "subtitle", text: "Second" },
          ]}
        />
      </SduiProvider>,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
