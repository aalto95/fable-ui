import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  ifNoneMatchSatisfied,
  loadUiSchemaJsonText,
  strongEtagFromBody,
} from "@/lib/uiSchemaCaching";
import { getSchemaOverride } from "@/lib/uiSchemaStore";

vi.mock("@/lib/uiSchemaStore", () => ({
  getSchemaOverride: vi.fn(),
}));

describe("strongEtagFromBody", () => {
  it("produces a quoted opaque token", () => {
    expect(strongEtagFromBody("hello")).toMatch(/^"[^"]+"$/);
  });

  it("is deterministic for the same body", () => {
    expect(strongEtagFromBody("hello")).toBe(strongEtagFromBody("hello"));
  });

  it("differs for different bodies", () => {
    expect(strongEtagFromBody("hello")).not.toBe(strongEtagFromBody("world"));
  });
});

describe("ifNoneMatchSatisfied", () => {
  const etag = '"abc123"';

  it("returns false when the header is absent or empty", () => {
    expect(ifNoneMatchSatisfied(null, etag)).toBe(false);
    expect(ifNoneMatchSatisfied("", etag)).toBe(false);
    expect(ifNoneMatchSatisfied("   ", etag)).toBe(false);
  });

  it("matches a wildcard", () => {
    expect(ifNoneMatchSatisfied("*", etag)).toBe(true);
  });

  it("matches an exact etag", () => {
    expect(ifNoneMatchSatisfied(etag, etag)).toBe(true);
  });

  it("matches within a comma-separated list", () => {
    expect(ifNoneMatchSatisfied(`"other", ${etag}`, etag)).toBe(true);
  });

  it("matches a weak etag", () => {
    expect(ifNoneMatchSatisfied(`W/${etag}`, etag)).toBe(true);
  });

  it("rejects a different etag", () => {
    expect(ifNoneMatchSatisfied('"zzz"', etag)).toBe(false);
  });
});

describe("loadUiSchemaJsonText", () => {
  const getOverrideMock = vi.mocked(getSchemaOverride);
  let dir: string;
  let schemaPath: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "fable-ui-schema-"));
    schemaPath = join(dir, "schema.json");
    await writeFile(schemaPath, JSON.stringify({ $id: "https://example.com/schema.json" }), "utf8");
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("returns the override when present", async () => {
    getOverrideMock.mockResolvedValueOnce({ ui: [] });
    const text = await loadUiSchemaJsonText(schemaPath);
    expect(text).toBe('{"ui":[]}');
  });

  it("reads the bundled schema when there is no override", async () => {
    getOverrideMock.mockResolvedValueOnce(null);
    const text = await loadUiSchemaJsonText(schemaPath);
    expect(JSON.parse(text)).toEqual({ $id: "https://example.com/schema.json" });
  });
});
