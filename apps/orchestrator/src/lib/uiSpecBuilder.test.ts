import { describe, expect, it } from "vitest";
import { rewriteOrchestratorApiPaths } from "@/lib/uiSpecBuilder";

describe("rewriteOrchestratorApiPaths", () => {
  it("rewrites relative /api fields against the base URL", () => {
    const doc = { ui: [{ type: "table", dataSource: "/api/todo" }] };
    rewriteOrchestratorApiPaths(doc, "https://api.example.com");
    expect((doc.ui[0] as { dataSource: string }).dataSource).toBe(
      "https://api.example.com/api/todo",
    );
  });

  it("rewrites absolute URLs whose pathname starts with /api", () => {
    const doc = {
      ui: [{ type: "button", path: "https://orchestrator.example.com/api/submit?x=1" }],
    };
    rewriteOrchestratorApiPaths(doc, "https://api.example.com");
    expect((doc.ui[0] as { path: string }).path).toBe("https://api.example.com/api/submit?x=1");
  });

  it("leaves non-api paths unchanged", () => {
    const doc = { ui: [{ type: "button", path: "/todo" }] };
    rewriteOrchestratorApiPaths(doc, "https://api.example.com");
    expect((doc.ui[0] as { path: string }).path).toBe("/todo");
  });

  it("is a no-op when the base URL is empty", () => {
    const doc = { ui: [{ type: "table", dataSource: "/api/todo" }] };
    rewriteOrchestratorApiPaths(doc, "");
    expect((doc.ui[0] as { dataSource: string }).dataSource).toBe("/api/todo");
  });

  it("recurses into nested structures", () => {
    const doc = {
      ui: [{ type: "h_stack", descendants: [{ type: "table", dataSource: "/api/x" }] }],
    };
    rewriteOrchestratorApiPaths(doc, "https://api.example.com");
    const child = (doc.ui[0] as { descendants: unknown[] }).descendants[0] as {
      dataSource: string;
    };
    expect(child.dataSource).toBe("https://api.example.com/api/x");
  });
});
