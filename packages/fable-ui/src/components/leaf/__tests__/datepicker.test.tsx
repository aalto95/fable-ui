import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Datepicker } from "@/components/leaf/Datepicker";

describe("Datepicker", () => {
  it("renders with label and defaultValue", () => {
    render(<Datepicker name="dob" label="Date of Birth" defaultValue="2024-01-15" />);
    expect(screen.getByText("Date of Birth")).toBeInTheDocument();
  });
});
