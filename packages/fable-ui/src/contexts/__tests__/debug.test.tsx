import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DebugProvider, useDebug } from "@/contexts/debug";

function DebugConsumer() {
  const { enabled } = useDebug();
  return <div data-testid="debug-value">{String(enabled)}</div>;
}

describe("DebugProvider", () => {
  it("provides enabled value", () => {
    render(
      <DebugProvider enabled={true} setEnabled={() => {}}>
        <DebugConsumer />
      </DebugProvider>,
    );
    expect(screen.getByTestId("debug-value")).toHaveTextContent("true");
  });

  it("provides disabled value", () => {
    render(
      <DebugProvider enabled={false} setEnabled={() => {}}>
        <DebugConsumer />
      </DebugProvider>,
    );
    expect(screen.getByTestId("debug-value")).toHaveTextContent("false");
  });

  it("throws when useDebug is used outside provider", () => {
    expect(() => render(<DebugConsumer />)).toThrow(
      "useDebug must be used within SduiProvider or DebugProvider",
    );
  });
});
