import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { HorizontalStack } from "@/components/branch/HorizontalStack";
import { VerticalStack } from "@/components/branch/VerticalStack";
import { Component } from "@/components/core/Component";
import { SduiProvider } from "@/components/core/SduiProvider";
import { registerDefaultComponents } from "@/registry/register-defaults";

describe("VerticalStack", () => {
  beforeAll(() => {
    registerDefaultComponents();
  });

  it("renders children", () => {
    render(
      <SduiProvider>
        <VerticalStack>
          <span>content</span>
        </VerticalStack>
      </SduiProvider>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders descendants through Component dispatch", () => {
    render(
      <SduiProvider>
        <Component
          type="v_stack"
          descendants={[
            { type: "title", text: "Item 1" },
            { type: "title", text: "Item 2" },
          ]}
        />
      </SduiProvider>,
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});

describe("HorizontalStack", () => {
  beforeAll(() => {
    registerDefaultComponents();
  });

  it("renders children", () => {
    render(
      <SduiProvider>
        <HorizontalStack>
          <span>left</span>
          <span>right</span>
        </HorizontalStack>
      </SduiProvider>,
    );
    expect(screen.getByText("left")).toBeInTheDocument();
    expect(screen.getByText("right")).toBeInTheDocument();
  });
});
