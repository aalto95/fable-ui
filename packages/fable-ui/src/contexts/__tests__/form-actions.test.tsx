import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { FormActionsProvider, useFormActionsContext } from "@/contexts/form-actions";

function FormActionsConsumer() {
  const ctx = useFormActionsContext();
  if (!ctx) return <div>no context</div>;
  return (
    <div>
      <div data-testid="pending">{String(ctx.isHttpActionPending)}</div>
      <button type="button" onClick={ctx.beginHttpAction}>
        Begin
      </button>
      <button type="button" onClick={ctx.endHttpAction}>
        End
      </button>
    </div>
  );
}

describe("FormActionsProvider", () => {
  it("provides context with initial pending=false", () => {
    const ref = createRef<HTMLFormElement>();
    render(
      <FormActionsProvider formRef={ref}>
        <FormActionsConsumer />
      </FormActionsProvider>,
    );
    expect(screen.getByTestId("pending")).toHaveTextContent("false");
  });

  it("increments pending count on beginHttpAction", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLFormElement>();
    render(
      <FormActionsProvider formRef={ref}>
        <FormActionsConsumer />
      </FormActionsProvider>,
    );

    await user.click(screen.getByText("Begin"));
    expect(screen.getByTestId("pending")).toHaveTextContent("true");
  });

  it("decrements pending count on endHttpAction", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLFormElement>();
    render(
      <FormActionsProvider formRef={ref}>
        <FormActionsConsumer />
      </FormActionsProvider>,
    );

    await user.click(screen.getByText("Begin"));
    await user.click(screen.getByText("End"));
    expect(screen.getByTestId("pending")).toHaveTextContent("false");
  });

  it("returns null when used outside provider", () => {
    render(<FormActionsConsumer />);
    expect(screen.getByText("no context")).toBeInTheDocument();
  });
});
