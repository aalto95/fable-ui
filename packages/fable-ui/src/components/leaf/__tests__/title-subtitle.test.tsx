import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Subtitle } from "@/components/leaf/Subtitle";
import { Title } from "@/components/leaf/Title";

describe("Title", () => {
  it("renders text in a heading", () => {
    render(<Title text="Welcome" />);
    const el = screen.getByText("Welcome");
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("H2");
  });
});

describe("Subtitle", () => {
  it("renders text", () => {
    render(<Subtitle text="Description" />);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});
