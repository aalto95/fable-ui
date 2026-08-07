import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError, http } from "@/lib/http-client";

function mockFetch(status: number, body: unknown, ok?: boolean) {
  const bodyText = typeof body === "string" ? body : JSON.stringify(body);
  return vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
    ok: ok ?? (status >= 200 && status < 300),
    status,
    text: () => Promise.resolve(bodyText),
    headers: new Headers({ "content-type": "application/json" }),
  } as Response);
}

describe("http client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("get", () => {
    it("performs GET request and returns parsed JSON", async () => {
      const fetchSpy = mockFetch(200, { data: "ok" });
      const result = await http.get<{ data: string }>("https://api.example.com/resource");
      expect(result).toEqual({ data: "ok" });
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.example.com/resource",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("throws HttpError on non-ok response", async () => {
      mockFetch(404, "Not found", false);
      const result = http.get("https://api.example.com/missing");
      await expect(result).rejects.toThrow(HttpError);
      await expect(result).rejects.toMatchObject({
        status: 404,
        bodyText: "Not found",
      });
    });

    it("throws HttpError on server error", async () => {
      mockFetch(500, "Internal error", false);
      await expect(http.get("https://api.example.com/error")).rejects.toMatchObject({
        status: 500,
      });
    });
  });

  describe("post", () => {
    it("performs POST request with JSON body", async () => {
      const fetchSpy = mockFetch(201, { id: 1 });
      const result = await http.post("https://api.example.com/resource", { name: "test" });
      expect(result).toEqual({ id: 1 });
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.example.com/resource",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "test" }),
        }),
      );
    });
  });

  describe("put", () => {
    it("performs PUT request with JSON body", async () => {
      const fetchSpy = mockFetch(200, { updated: true });
      const result = await http.put("https://api.example.com/resource/1", { name: "updated" });
      expect(result).toEqual({ updated: true });
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.example.com/resource/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ name: "updated" }),
        }),
      );
    });
  });

  describe("patch", () => {
    it("performs PATCH request with JSON body", async () => {
      const fetchSpy = mockFetch(200, { patched: true });
      const result = await http.patch("https://api.example.com/resource/1", { field: "value" });
      expect(result).toEqual({ patched: true });
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.example.com/resource/1",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ field: "value" }),
        }),
      );
    });
  });

  describe("delete", () => {
    it("performs DELETE request without body", async () => {
      const fetchSpy = mockFetch(204, "");
      const result = await http.delete("https://api.example.com/resource/1");
      expect(result).toBeUndefined();
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.example.com/resource/1",
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("performs DELETE request with body", async () => {
      const fetchSpy = mockFetch(200, { deleted: true });
      const result = await http.delete("https://api.example.com/resource/1", { id: "1" });
      expect(result).toEqual({ deleted: true });
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.example.com/resource/1",
        expect.objectContaining({
          method: "DELETE",
          body: JSON.stringify({ id: "1" }),
        }),
      );
    });
  });

  it("sets Content-Type header for JSON body requests", async () => {
    const fetchSpy = mockFetch(200, {});
    await http.post("https://api.example.com/resource", { key: "value" });
    const callArgs = fetchSpy.mock.calls[0]?.[1] as RequestInit;
    const headers = callArgs.headers as Headers;
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("handles empty response body gracefully", async () => {
    mockFetch(200, "");
    const result = await http.get("https://api.example.com/empty");
    expect(result).toBeUndefined();
  });

  it("throws HttpError with empty body message when response body is empty on error", async () => {
    mockFetch(500, "", false);
    await expect(http.get("https://api.example.com/error")).rejects.toMatchObject({
      message: "HTTP 500",
    });
  });
});
