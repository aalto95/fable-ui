import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BaseSelect, BaseSelectOption } from "@/components/select";

describe("BaseSelect", () => {
  it("renders a select element", () => {
    render(
      <BaseSelect>
        <BaseSelectOption value="a">A</BaseSelectOption>
      </BaseSelect>,
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders options", () => {
    render(
      <BaseSelect>
        <BaseSelectOption value="1">One</BaseSelectOption>
        <BaseSelectOption value="2">Two</BaseSelectOption>
      </BaseSelect>,
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("applies data-slot attributes", () => {
    render(
      <BaseSelect>
        <BaseSelectOption value="a">A</BaseSelectOption>
      </BaseSelect>,
    );
    expect(screen.getByRole("combobox")).toHaveAttribute("data-slot", "native-select");
  });

  it("forwards disabled prop", () => {
    render(
      <BaseSelect disabled>
        <BaseSelectOption value="a">A</BaseSelectOption>
      </BaseSelect>,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
