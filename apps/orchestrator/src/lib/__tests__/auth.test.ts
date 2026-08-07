import { Hono } from "hono";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  extractBearerToken,
  hashAdminKey,
  isAdminAuthDisabled,
  masterAdminApiKey,
  requireAdminAuth,
} from "@/lib/auth";

vi.mock("@/db/adminApiKeysRepo", () => ({
  findActiveAdminKeyByHash: vi.fn(),
  touchAdminApiKey: vi.fn(),
  insertAdminApiKey: vi.fn(),
  listAdminApiKeys: vi.fn(),
  revokeAdminApiKey: vi.fn(),
}));

import * as adminApiKeysRepo from "@/db/adminApiKeysRepo";

function buildApp() {
  const app = new Hono();
  app.get("/protected", requireAdminAuth, (c) => c.json({ ok: true }, 200));
  return app;
}

describe("hashAdminKey", () => {
  it("is deterministic and 64 hex chars", () => {
    const a = hashAdminKey("sdui_token");
    const b = hashAdminKey("sdui_token");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it("differs across tokens", () => {
    expect(hashAdminKey("token-a")).not.toBe(hashAdminKey("token-b"));
  });
});

describe("extractBearerToken", () => {
  it("parses a Bearer token", () => {
    expect(extractBearerToken("Bearer abc123")).toBe("abc123");
    expect(extractBearerToken("bearer abc123")).toBe("abc123");
    expect(extractBearerToken("  Bearer  abc123  ")).toBe("abc123");
  });

  it("returns null for missing or malformed headers", () => {
    expect(extractBearerToken(null)).toBeNull();
    expect(extractBearerToken(undefined)).toBeNull();
    expect(extractBearerToken("")).toBeNull();
    expect(extractBearerToken("Basic abc")).toBeNull();
    expect(extractBearerToken("Bearer")).toBeNull();
  });
});

describe("requireAdminAuth", () => {
  const MASTER_KEY = "sdui_master";

  beforeEach(() => {
    process.env.SDUI_ADMIN_API_KEY = MASTER_KEY;
    delete process.env.SDUI_ADMIN_AUTH_DISABLED;
    vi.mocked(adminApiKeysRepo.findActiveAdminKeyByHash).mockReset();
    vi.mocked(adminApiKeysRepo.findActiveAdminKeyByHash).mockResolvedValue(null);
    vi.mocked(adminApiKeysRepo.touchAdminApiKey).mockResolvedValue(undefined);
  });

  afterEach(() => {
    delete process.env.SDUI_ADMIN_API_KEY;
    delete process.env.SDUI_ADMIN_AUTH_DISABLED;
  });

  it("rejects requests without a token", async () => {
    const res = await buildApp().request("/protected");
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toMatchObject({ success: false });
    expect(res.headers.get("WWW-Authenticate")).toBe("Bearer");
  });

  it("rejects a wrong master key", async () => {
    const res = await buildApp().request("/protected", {
      headers: { Authorization: "Bearer wrong-key" },
    });
    expect(res.status).toBe(401);
  });

  it("accepts the env master key", async () => {
    const res = await buildApp().request("/protected", {
      headers: { Authorization: `Bearer ${MASTER_KEY}` },
    });
    expect(res.status).toBe(200);
  });

  it("accepts an active DB key", async () => {
    vi.mocked(adminApiKeysRepo.findActiveAdminKeyByHash).mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "CI",
      keyPrefix: "sdui_abc",
    });
    delete process.env.SDUI_ADMIN_API_KEY;
    const res = await buildApp().request("/protected", {
      headers: { Authorization: "Bearer sdui_db-key" },
    });
    expect(res.status).toBe(200);
    expect(adminApiKeysRepo.findActiveAdminKeyByHash).toHaveBeenCalledWith(
      hashAdminKey("sdui_db-key"),
    );
  });

  it("rejects a revoked or unknown DB key", async () => {
    delete process.env.SDUI_ADMIN_API_KEY;
    vi.mocked(adminApiKeysRepo.findActiveAdminKeyByHash).mockResolvedValue(null);
    const res = await buildApp().request("/protected", {
      headers: { Authorization: "Bearer sdui_unknown" },
    });
    expect(res.status).toBe(401);
  });

  it("allows everything when auth is disabled (dev only)", async () => {
    process.env.SDUI_ADMIN_AUTH_DISABLED = "true";
    const res = await buildApp().request("/protected");
    expect(res.status).toBe(200);
  });
});

describe("env helpers", () => {
  afterEach(() => {
    delete process.env.SDUI_ADMIN_API_KEY;
    delete process.env.SDUI_ADMIN_AUTH_DISABLED;
  });

  it("masterAdminApiKey trims and returns undefined when unset", () => {
    expect(masterAdminApiKey()).toBeUndefined();
    process.env.SDUI_ADMIN_API_KEY = "  abc  ";
    expect(masterAdminApiKey()).toBe("abc");
  });

  it("isAdminAuthDisabled checks the flag", () => {
    expect(isAdminAuthDisabled()).toBe(false);
    process.env.SDUI_ADMIN_AUTH_DISABLED = "true";
    expect(isAdminAuthDisabled()).toBe(true);
  });
});
