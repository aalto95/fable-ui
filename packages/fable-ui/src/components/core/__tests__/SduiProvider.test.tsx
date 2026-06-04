import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SduiProvider } from "@/components/core/SduiProvider";
import { useDebug } from "@/contexts/debug";

function DebugConsumer() {
  const { enabled } = useDebug();
  return <div data-testid="debug-state">{enabled ? "on" : "off"}</div>;
}

describe("SduiProvider", () => {
  it("renders children", () => {
    render(
      <SduiProvider>
        <div data-testid="child">content</div>
      </SduiProvider>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("content");
  });

  it("provides debug context with controlled value", () => {
    render(
      <SduiProvider debug={{ enabled: true, setEnabled: () => {} }}>
        <DebugConsumer />
      </SduiProvider>,
    );
    expect(screen.getByTestId("debug-state")).toHaveTextContent("on");
  });

  it("provides debug context disabled by default", () => {
    render(
      <SduiProvider>
        <DebugConsumer />
      </SduiProvider>,
    );
    expect(screen.getByTestId("debug-state")).toHaveTextContent("off");
  });

  it("renders children without errors", () => {
    render(
      <SduiProvider>
        <span>child</span>
      </SduiProvider>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
