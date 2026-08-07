import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "@/app";

const MASTER_KEY = "test-master-key";
const AUTH = { Authorization: `Bearer ${MASTER_KEY}` };
const KEY_ID = "550e8400-e29b-41d4-a716-446655440000";

vi.mock("@/db/adminApiKeysRepo", () => ({
  findActiveAdminKeyByHash: vi.fn(),
  touchAdminApiKey: vi.fn(),
  insertAdminApiKey: vi.fn(),
  listAdminApiKeys: vi.fn(),
  revokeAdminApiKey: vi.fn(),
}));

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

import * as adminApiKeysRepo from "@/db/adminApiKeysRepo";
import * as schemaRepo from "@/db/schemaRepo";
import * as uiOriginsRepo from "@/db/uiOriginsRepo";
import * as uiSpecsRepo from "@/db/uiSpecsRepo";

const keyRow = {
  id: KEY_ID,
  name: "CI",
  keyPrefix: "sdui_abc123",
  createdAt: "2026-01-01T00:00:00.000Z",
  lastUsedAt: null,
  revokedAt: null,
};

describe("admin api keys", () => {
  beforeEach(() => {
    process.env.SDUI_ADMIN_API_KEY = MASTER_KEY;
    vi.mocked(adminApiKeysRepo.listAdminApiKeys).mockResolvedValue([keyRow]);
    vi.mocked(adminApiKeysRepo.revokeAdminApiKey).mockResolvedValue(true);
    vi.mocked(adminApiKeysRepo.insertAdminApiKey).mockImplementation(async (opts) => ({
      ...keyRow,
      name: opts.name,
      keyPrefix: opts.keyPrefix,
      createdAt: "2026-01-02T00:00:00.000Z",
    }));
    vi.mocked(adminApiKeysRepo.touchAdminApiKey).mockResolvedValue(undefined);
    vi.mocked(uiSpecsRepo.listUiSpecIds).mockResolvedValue([]);
    vi.mocked(uiSpecsRepo.getUiSpec).mockResolvedValue(undefined);
    vi.mocked(uiSpecsRepo.collectOriginsFromAllUiSpecs).mockResolvedValue([]);
    vi.mocked(uiOriginsRepo.collectAllUiOrigins).mockResolvedValue([]);
    vi.mocked(schemaRepo.getSchemaOverride).mockResolvedValue(null);
  });

  afterEach(() => {
    delete process.env.SDUI_ADMIN_API_KEY;
    delete process.env.SDUI_ADMIN_AUTH_DISABLED;
  });

  it("rejects requests without a token", async () => {
    const app = createApp();
    const res = await app.request("/admin/api-keys");
    expect(res.status).toBe(401);
  });

  it("lists keys", async () => {
    const app = createApp();
    const res = await app.request("/admin/api-keys", { headers: AUTH });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ keys: [keyRow] });
  });

  it("creates a key and returns the raw token once", async () => {
    const app = createApp();
    const res = await app.request("/admin/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...AUTH },
      body: JSON.stringify({ name: "CI" }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as { key: string; keyPrefix: string };
    expect(body.key).toMatch(/^sdui_[A-Za-z0-9_-]{32}$/);
    expect(body.keyPrefix).toBe(body.key.slice(0, 13));
    expect(adminApiKeysRepo.insertAdminApiKey).toHaveBeenCalledWith(
      expect.objectContaining({ name: "CI", keyHash: expect.stringMatching(/^[0-9a-f]{64}$/) }),
    );
  });

  it("rejects creating a key with an empty name", async () => {
    const app = createApp();
    const res = await app.request("/admin/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...AUTH },
      body: JSON.stringify({ name: "   " }),
    });
    expect(res.status).toBe(400);
  });

  it("revokes a key", async () => {
    const app = createApp();
    const res = await app.request(`/admin/api-keys/${KEY_ID}`, { method: "DELETE", headers: AUTH });
    expect(res.status).toBe(200);
    expect(adminApiKeysRepo.revokeAdminApiKey).toHaveBeenCalledWith(KEY_ID);
  });

  it("returns 404 when revoking an unknown key", async () => {
    vi.mocked(adminApiKeysRepo.revokeAdminApiKey).mockResolvedValueOnce(false);
    const app = createApp();
    const res = await app.request(`/admin/api-keys/${KEY_ID}`, { method: "DELETE", headers: AUTH });
    expect(res.status).toBe(404);
  });

  it("serves an auth ping for a valid key", async () => {
    const app = createApp();
    const res = await app.request("/admin/ping", { headers: AUTH });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });
});
