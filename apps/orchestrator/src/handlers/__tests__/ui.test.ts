import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "@/app";
import { defaultEmptySpec } from "@/lib/uiSchemaStore";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

vi.mock("@/db/uiSpecsRepo", () => ({
  listUiSpecIds: vi.fn(),
  getUiSpec: vi.fn(),
  setUiSpec: vi.fn(),
  resetUiSpec: vi.fn(),
  collectOriginsFromAllUiSpecs: vi.fn(),
  findSpecIdForOrigin: vi.fn(),
}));

vi.mock("@/db/uiOriginsRepo", () => ({
  listUiOriginBindings: vi.fn(),
  collectAllUiOrigins: vi.fn(),
  findSpecIdForOrigin: vi.fn(),
  setUiOriginBinding: vi.fn(),
  clearUiOriginBinding: vi.fn(),
}));

vi.mock("@/db/schemaRepo", () => ({
  getSchemaOverride: vi.fn(),
  setSchemaOverride: vi.fn(),
  clearSchemaOverride: vi.fn(),
}));

import * as schemaRepo from "@/db/schemaRepo";
import * as uiOriginsRepo from "@/db/uiOriginsRepo";
import * as uiSpecsRepo from "@/db/uiSpecsRepo";

describe("orchestrator app", () => {
  beforeEach(() => {
    vi.mocked(uiSpecsRepo.listUiSpecIds).mockResolvedValue([]);
    vi.mocked(uiSpecsRepo.getUiSpec).mockResolvedValue(undefined);
    vi.mocked(uiSpecsRepo.collectOriginsFromAllUiSpecs).mockResolvedValue([]);
    vi.mocked(uiOriginsRepo.collectAllUiOrigins).mockResolvedValue([]);
    vi.mocked(schemaRepo.getSchemaOverride).mockResolvedValue(null);
  });

  it("serves a health check", async () => {
    const app = createApp();
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ ok: true });
  });

  describe("CORS", () => {
    it("allows requests without an Origin header", async () => {
      const app = createApp();
      const res = await app.request("/ui/specs");
      expect(res.status).toBe(200);
    });

    it("allows known default origins", async () => {
      const app = createApp();
      const res = await app.request("/ui/specs", {
        headers: { Origin: "http://localhost:5173" },
      });
      expect(res.status).toBe(200);
    });

    it("rejects unknown origins", async () => {
      const app = createApp();
      const res = await app.request("/ui/specs", {
        headers: { Origin: "https://evil.example.com" },
      });
      expect(res.status).toBe(403);
      await expect(res.json()).resolves.toMatchObject({ success: false });
    });
  });

  describe("GET /ui/specs", () => {
    it("lists stored spec ids", async () => {
      vi.mocked(uiSpecsRepo.listUiSpecIds).mockResolvedValue([VALID_UUID]);
      const app = createApp();
      const res = await app.request("/ui/specs");
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual({ specs: [{ id: VALID_UUID }] });
    });
  });

  describe("GET /ui/{id}", () => {
    it("rejects malformed spec ids", async () => {
      const app = createApp();
      const res = await app.request("/ui/not-a-uuid");
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toMatchObject({ success: false });
    });

    it("returns a stored document", async () => {
      const doc = { ui: [{ route: "/", name: "Home", ui: [{ type: "title", text: "Hi" }] }] };
      vi.mocked(uiSpecsRepo.getUiSpec).mockResolvedValue(doc);
      const app = createApp();
      const res = await app.request(`/ui/${VALID_UUID}`);
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual(doc);
    });

    it("returns the empty spec when nothing is stored", async () => {
      const app = createApp();
      const res = await app.request(`/ui/${VALID_UUID}`);
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual(defaultEmptySpec());
    });

    it("serves 304 when the client ETag is current", async () => {
      const doc = { ui: [{ route: "/", name: "Home", ui: [{ type: "title", text: "Hi" }] }] };
      vi.mocked(uiSpecsRepo.getUiSpec).mockResolvedValue(doc);
      const app = createApp();
      const first = await app.request(`/ui/${VALID_UUID}`);
      const etag = first.headers.get("ETag");
      expect(etag).toBeTruthy();
      const second = await app.request(`/ui/${VALID_UUID}`, {
        headers: { "If-None-Match": etag as string },
      });
      expect(second.status).toBe(304);
    });
  });

  describe("PUT /ui/{id}", () => {
    it("rejects malformed spec ids", async () => {
      const app = createApp();
      const res = await app.request("/ui/not-a-uuid", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultEmptySpec()),
      });
      expect(res.status).toBe(400);
    });

    it("stores a valid UI document", async () => {
      const app = createApp();
      const res = await app.request(`/ui/${VALID_UUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultEmptySpec()),
      });
      expect(res.status).toBe(200);
      expect(uiSpecsRepo.setUiSpec).toHaveBeenCalledWith(VALID_UUID, defaultEmptySpec());
    });

    it("rejects documents that fail schema validation", async () => {
      const app = createApp();
      const res = await app.request(`/ui/${VALID_UUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notAVeryValidUiDocument: true }),
      });
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toMatchObject({ success: false });
    });
  });

  describe("GET /ui/schema", () => {
    it("serves the bundled JSON schema", async () => {
      const app = createApp();
      const res = await app.request("/ui/schema");
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toMatchObject({ type: "object", required: ["ui"] });
      expect(res.headers.get("ETag")).toBeTruthy();
    });
  });

  describe("PUT /ui/origins", () => {
    it("rejects an invalid spec id", async () => {
      const app = createApp();
      const res = await app.request("/ui/origins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: "https://app.example.com", specId: "nope" }),
      });
      expect(res.status).toBe(400);
    });

    it("saves an origin binding", async () => {
      const app = createApp();
      const res = await app.request("/ui/origins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: "https://app.example.com", specId: VALID_UUID }),
      });
      expect(res.status).toBe(200);
      expect(uiOriginsRepo.setUiOriginBinding).toHaveBeenCalledWith(
        "https://app.example.com",
        VALID_UUID,
      );
    });
  });
});
