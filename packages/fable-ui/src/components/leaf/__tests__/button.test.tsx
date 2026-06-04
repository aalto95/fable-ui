import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeAll, describe, expect, it } from "vitest";
import { SduiProvider } from "@/components/core/SduiProvider";
import { Button } from "@/components/leaf/Button";
import { registerDefaultComponents } from "@/registry/register-defaults";

describe("Button", () => {
  beforeAll(() => {
    registerDefaultComponents();
  });

  it("renders with text", () => {
    render(
      <MemoryRouter>
        <SduiProvider>
          <Button text="Click me" />
        </SduiProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("is not disabled by default", () => {
    render(
      <MemoryRouter>
        <SduiProvider>
          <Button text="Save" />
        </SduiProvider>
      </MemoryRouter>,
    );
    const button = screen.getByText("Save").closest("button");
    expect(button).not.toBeDisabled();
  });
});
