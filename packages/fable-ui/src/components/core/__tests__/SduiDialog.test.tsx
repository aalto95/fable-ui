import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SduiDialog } from "@/components/core/SduiDialog";
import { DialogProvider } from "@/contexts/dialog";

describe("SduiDialog", () => {
  it("renders null when no config", () => {
    const { container } = render(
      <DialogProvider config={null} setConfig={() => {}}>
        <SduiDialog />
      </DialogProvider>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders dialog with config values", () => {
    const config = {
      title: "Confirm",
      description: "Are you sure?",
      confirmText: "Yes",
      cancelText: "No",
    };

    render(
      <DialogProvider config={config} setConfig={() => {}}>
        <SduiDialog />
      </DialogProvider>,
    );

    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("hides cancel button when hideCancel is true", () => {
    const config = {
      title: "Confirm",
      hideCancel: true,
    };

    render(
      <DialogProvider config={config} setConfig={() => {}}>
        <SduiDialog />
      </DialogProvider>,
    );

    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  it("disables buttons when isPending is true", () => {
    const config = {
      title: "Confirm",
      isPending: true,
    };

    render(
      <DialogProvider config={config} setConfig={() => {}}>
        <SduiDialog />
      </DialogProvider>,
    );

    const confirmBtn = screen.getByText("Save");
    expect(confirmBtn.closest("button")).toBeDisabled();
  });

  it("calls onConfirm when confirm button clicked", async () => {
    const user = userEvent.setup();
    let confirmed = false;
    const config = {
      title: "Confirm",
      onConfirm: () => {
        confirmed = true;
      },
    };

    render(
      <DialogProvider config={config} setConfig={() => {}}>
        <SduiDialog />
      </DialogProvider>,
    );

    await user.click(screen.getByText("Save"));
    expect(confirmed).toBe(true);
  });
});
