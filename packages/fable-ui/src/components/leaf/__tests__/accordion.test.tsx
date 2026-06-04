import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Accordion } from "@/components/leaf/Accordion";

describe("Accordion", () => {
  it("renders accordion items", () => {
    render(
      <Accordion
        items={[
          { name: "item1", title: "Section 1", text: "Content 1" },
          { name: "item2", title: "Section 2", text: "Content 2" },
        ]}
      />,
    );
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
  });
});
