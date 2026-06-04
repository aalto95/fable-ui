import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "@/components/spinner";

describe("Spinner", () => {
  it("renders with status role and label", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });

  it("applies animate-spin class", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass("animate-spin");
  });

  it("forwards className", () => {
    render(<Spinner className="custom-spinner" />);
    expect(screen.getByRole("status")).toHaveClass("custom-spinner");
  });
});
