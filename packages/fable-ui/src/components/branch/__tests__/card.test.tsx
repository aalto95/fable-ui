import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { Card } from "@/components/branch/Card";
import { Component } from "@/components/core/Component";
import { SduiProvider } from "@/components/core/SduiProvider";
import { registerDefaultComponents } from "@/registry/register-defaults";

describe("Card", () => {
  beforeAll(() => {
    registerDefaultComponents();
  });

  it("renders title and description", () => {
    render(
      <SduiProvider>
        <Card title="My Card" description="Card description">
          <span>child</span>
        </Card>
      </SduiProvider>,
    );
    expect(screen.getByText("My Card")).toBeInTheDocument();
    expect(screen.getByText("Card description")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <SduiProvider>
        <Card>
          <span>Inside</span>
        </Card>
      </SduiProvider>,
    );
    expect(screen.getByText("Inside")).toBeInTheDocument();
  });

  it("renders footer text", () => {
    render(
      <SduiProvider>
        <Card footerText="Footer">
          <span>child</span>
        </Card>
      </SduiProvider>,
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders descendants through Component dispatch", () => {
    render(
      <SduiProvider>
        <Component type="card" descendants={[{ type: "subtitle", text: "Inside" }]} />
      </SduiProvider>,
    );
    expect(screen.getByText("Inside")).toBeInTheDocument();
  });
});
