import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "@/components/leaf/Checkbox";
import { Input } from "@/components/leaf/Input";
import { Select } from "@/components/leaf/Select";
import { Slider } from "@/components/leaf/Slider";
import { Textarea } from "@/components/leaf/Textarea";

describe("Input", () => {
  it("renders with label and defaultValue", () => {
    const { container } = render(<Input name="email" label="Email" defaultValue="a@b.com" />);
    expect(container.querySelector("[data-slot='field']")).toBeInTheDocument();
  });
});

describe("Textarea", () => {
  it("renders with label", () => {
    const { container } = render(<Textarea name="bio" label="Bio" />);
    expect(container.querySelector("[data-slot='field']")).toBeInTheDocument();
  });
});

describe("Checkbox", () => {
  it("renders with label", () => {
    const { container } = render(<Checkbox name="agree" label="Agree" />);
    expect(container.querySelector("[data-slot='field']")).toBeInTheDocument();
  });
});

describe("Select", () => {
  it("renders with options", () => {
    const { container } = render(
      <Select
        name="choice"
        label="Pick"
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
      />,
    );
    expect(container.querySelector("[data-slot='field']")).toBeInTheDocument();
  });
});

describe("Slider", () => {
  it("renders with label", () => {
    const { container } = render(<Slider name="volume" label="Volume" />);
    expect(container.querySelector("[data-slot='field']")).toBeInTheDocument();
  });
});
