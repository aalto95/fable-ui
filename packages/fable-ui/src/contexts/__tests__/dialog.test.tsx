import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DialogProvider, useDialog } from "@/contexts/dialog";

function DialogConsumer() {
  const { config, setConfig } = useDialog();
  return (
    <div>
      <div data-testid="dialog-state">{config ? (config.title ?? "has-config") : "null"}</div>
      <button type="button" onClick={() => setConfig({ title: "New Config" })}>
        Set
      </button>
    </div>
  );
}

describe("DialogProvider", () => {
  it("provides null config by default", () => {
    render(
      <DialogProvider config={null} setConfig={() => {}}>
        <DialogConsumer />
      </DialogProvider>,
    );
    expect(screen.getByTestId("dialog-state")).toHaveTextContent("null");
  });

  it("provides config when set", () => {
    const config = { title: "My Dialog" };
    render(
      <DialogProvider config={config} setConfig={() => {}}>
        <DialogConsumer />
      </DialogProvider>,
    );
    expect(screen.getByTestId("dialog-state")).toHaveTextContent("My Dialog");
  });

  it("throws when useDialog is used outside provider", () => {
    expect(() => render(<DialogConsumer />)).toThrow(
      "useDialog must be used within DialogProvider",
    );
  });
});
