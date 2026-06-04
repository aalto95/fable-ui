import { afterEach, describe, expect, it, vi } from "vitest";
import { executeAction } from "@/lib/http-actions";
import type { IAction } from "@/models/interfaces/component";

function createForm(): HTMLFormElement {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.name = "email";
  input.value = "test@test.com";
  form.appendChild(input);
  return form;
}

describe("executeAction", () => {
  const navigate = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GO_TO", () => {
    it("navigates to path", async () => {
      const action: IAction = { type: "GO_TO", path: "/dashboard", label: "test" };
      await executeAction(action, { navigate });
      expect(navigate).toHaveBeenCalledWith("/dashboard");
    });

    it("throws if path is missing", async () => {
      const action: IAction = { type: "GO_TO", label: "test" };
      await expect(executeAction(action, { navigate })).rejects.toThrow("requires path");
    });
  });

  describe("GO_BACK", () => {
    it("navigates back", async () => {
      await executeAction({ type: "GO_BACK", label: "test" }, { navigate });
      expect(navigate).toHaveBeenCalledWith(-1);
    });
  });

  describe("HIDE", () => {
    it("does nothing", async () => {
      await expect(
        executeAction({ type: "HIDE", label: "test" }, { navigate }),
      ).resolves.toBeUndefined();
    });
  });

  describe("HTTP_GET", () => {
    it("sends GET request with form data as query params", async () => {
      const form = createForm();
      const action: IAction = {
        type: "HTTP_GET",
        path: "https://api.example.com/search",
        label: "test",
      };

      const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({})),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await executeAction(action, { form, navigate });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("https://api.example.com/search?email=test%40test.com"),
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("throws if form is missing", async () => {
      const action: IAction = { type: "HTTP_GET", path: "/api/resource", label: "test" };
      await expect(executeAction(action, { navigate })).rejects.toThrow(
        "Form required for HTTP_GET",
      );
    });
  });

  describe("HTTP_POST", () => {
    it("sends POST request with form data as JSON", async () => {
      const form = createForm();
      const action: IAction = {
        type: "HTTP_POST",
        path: "https://api.example.com/users",
        label: "test",
      };

      const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve(JSON.stringify({})),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await executeAction(action, { form, navigate });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "test@test.com" }),
        }),
      );
    });

    it("appends id to path when provided", async () => {
      const form = createForm();
      const action: IAction = {
        type: "HTTP_POST",
        path: "https://api.example.com/users",
        label: "test",
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve(JSON.stringify({})),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await executeAction(action, { form, navigate, id: "123" });
      expect(fetch).toHaveBeenCalledWith("https://api.example.com/users/123", expect.anything());
    });

    it("throws if form is missing", async () => {
      const action: IAction = { type: "HTTP_POST", path: "/api/resource", label: "test" };
      await expect(executeAction(action, { navigate })).rejects.toThrow(
        "Form required for HTTP_POST",
      );
    });
  });

  describe("HTTP_PUT", () => {
    it("sends PUT request with form data and id", async () => {
      const form = createForm();
      const action: IAction = {
        type: "HTTP_PUT",
        path: "https://api.example.com/users",
        label: "test",
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({})),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await executeAction(action, { form, navigate, id: "123" });
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/123",
        expect.objectContaining({ method: "PUT" }),
      );
    });

    it("throws if id is missing", async () => {
      const form = createForm();
      const action: IAction = { type: "HTTP_PUT", path: "/api/resource", label: "test" };
      await expect(executeAction(action, { form, navigate })).rejects.toThrow(
        "Route id is required for HTTP_PUT",
      );
    });
  });

  describe("HTTP_PATCH", () => {
    it("sends PATCH request with form data and id", async () => {
      const form = createForm();
      const action: IAction = {
        type: "HTTP_PATCH",
        path: "https://api.example.com/users",
        label: "test",
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({})),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await executeAction(action, { form, navigate, id: "123" });
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/123",
        expect.objectContaining({ method: "PATCH" }),
      );
    });

    it("throws if id is missing", async () => {
      const form = createForm();
      const action: IAction = { type: "HTTP_PATCH", path: "/api/resource", label: "test" };
      await expect(executeAction(action, { form, navigate })).rejects.toThrow(
        "Route id is required for HTTP_PATCH",
      );
    });
  });

  describe("HTTP_DELETE", () => {
    it("sends DELETE request with id", async () => {
      const action: IAction = {
        type: "HTTP_DELETE",
        path: "https://api.example.com/users",
        label: "test",
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({})),
        headers: new Headers({ "content-type": "application/json" }),
      } as Response);

      await executeAction(action, { navigate, id: "123" });
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/123",
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("throws if id is missing", async () => {
      const action: IAction = { type: "HTTP_DELETE", path: "/api/resource", label: "test" };
      await expect(executeAction(action, { navigate })).rejects.toThrow(
        "Route id is required for HTTP_DELETE",
      );
    });
  });

  describe("unsupported action", () => {
    it("throws for unknown action type", async () => {
      const action = { type: "UNKNOWN", label: "test" } as unknown as IAction;
      await expect(executeAction(action, { navigate })).rejects.toThrow("Unsupported action");
    });
  });
});
