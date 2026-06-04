import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DebugPalette } from "@/components/core/DebugOutline";
import { DebugOutline } from "@/components/core/DebugOutline";

const palette: DebugPalette = {
  outline: "outline-blue-500",
  bg: "bg-blue-500",
  text: "text-white",
};

describe("DebugOutline", () => {
  it("renders children when disabled", () => {
    render(
      <DebugOutline enabled={false} label="test" palette={palette}>
        <span data-testid="child">content</span>
      </DebugOutline>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("content");
  });

  it("shows label when enabled", () => {
    render(
      <DebugOutline enabled={true} label="MyLabel" palette={palette}>
        <span>content</span>
      </DebugOutline>,
    );
    expect(screen.getByText("MyLabel")).toBeInTheDocument();
  });

  it("does not show label when disabled", () => {
    render(
      <DebugOutline enabled={false} label="MyLabel" palette={palette}>
        <span>content</span>
      </DebugOutline>,
    );
    expect(screen.queryByText("MyLabel")).not.toBeInTheDocument();
  });
});
