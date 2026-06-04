import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BaseInput } from "@/components/input";

describe("BaseInput", () => {
  it("renders an input element", () => {
    render(<BaseInput />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("applies data-slot attribute", () => {
    render(<BaseInput />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
  });

  it("forwards placeholder", () => {
    render(<BaseInput placeholder="Enter name" />);
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  it("forwards value", () => {
    render(<BaseInput value="test" onChange={() => {}} />);
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });

  it("renders as disabled", () => {
    render(<BaseInput disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("applies type attribute", () => {
    render(<BaseInput type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });
});
