import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Markdown } from "@/components/leaf/Markdown";

describe("Markdown", () => {
  it("renders markdown content", () => {
    render(<Markdown content="# Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("forwards className", () => {
    const { container } = render(<Markdown content="text" className="custom" />);
    const child = container.firstChild as HTMLElement;
    expect(child.className).toContain("custom");
  });
});
