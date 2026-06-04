import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BaseButton } from "@/components/button";

describe("BaseButton", () => {
  it("renders with text", () => {
    render(<BaseButton>Click me</BaseButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("applies default variant and size data attributes", () => {
    render(<BaseButton>OK</BaseButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "default");
  });

  it("applies custom variant", () => {
    render(<BaseButton variant="destructive">Delete</BaseButton>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "destructive");
  });

  it("applies custom size", () => {
    render(<BaseButton size="sm">Small</BaseButton>);
    expect(screen.getByRole("button")).toHaveAttribute("data-size", "sm");
  });

  it("forwards className", () => {
    render(<BaseButton className="custom-class">Click</BaseButton>);
    expect(screen.getByRole("button").className).toContain("custom-class");
  });

  it("renders as disabled", () => {
    render(<BaseButton disabled>Disabled</BaseButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
