import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BaseDialog, BaseDialogContent, BaseDialogTrigger } from "@/components/dialog";

describe("BaseDialog", () => {
  it("renders trigger and opens on click", async () => {
    const user = userEvent.setup();

    render(
      <BaseDialog>
        <BaseDialogTrigger>Open</BaseDialogTrigger>
        <BaseDialogContent title="Title">
          <p>Content</p>
        </BaseDialogContent>
      </BaseDialog>,
    );

    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();

    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
