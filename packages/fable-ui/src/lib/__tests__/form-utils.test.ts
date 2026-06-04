import { describe, expect, it } from "vitest";
import {
  buildGetUrl,
  dateOnlyToISO,
  formDataToJson,
  hasNameField,
  mergePrefillIntoDescendants,
  mergePrefillToField,
  unwrapRecordPayload,
  validateRequired,
} from "@/lib/form-utils";
import type { TComponentUnion } from "@/models/interfaces/component";

describe("dateOnlyToISO", () => {
  it("converts date string to ISO date format", () => {
    const result = dateOnlyToISO("2024-01-15");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it("returns empty string as-is", () => {
    expect(dateOnlyToISO("")).toBe("");
  });
});

describe("formDataToJson", () => {
  it("converts FormData to JSON", () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.type = "text";
    input.name = "username";
    input.value = "john";
    form.appendChild(input);

    const formData = new FormData(form);
    formData.set("username", "john");

    const result = formDataToJson(formData, form);
    expect(result).toEqual({ username: "john" });
  });

  it("converts date inputs to ISO strings", () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.type = "date";
    input.name = "dob";
    input.value = "2024-01-15";
    form.appendChild(input);

    const formData = new FormData(form);
    formData.set("dob", "2024-01-15");

    const result = formDataToJson(formData, form);
    expect(result.dob).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe("buildGetUrl", () => {
  it("appends query params to URL without existing query", () => {
    const url = buildGetUrl("https://api.example.com/users", { page: "1", limit: "10" });
    expect(url).toBe("https://api.example.com/users?page=1&limit=10");
  });

  it("appends query params to URL with existing query", () => {
    const url = buildGetUrl("https://api.example.com/users?filter=active", { page: "1" });
    expect(url).toBe("https://api.example.com/users?filter=active&page=1");
  });

  it("skips null/undefined values", () => {
    const url = buildGetUrl("https://api.example.com/users", { page: "1", skip: null });
    expect(url).toBe("https://api.example.com/users?page=1");
  });

  it("returns base URL unchanged when no data", () => {
    const url = buildGetUrl("https://api.example.com/users", {});
    expect(url).toBe("https://api.example.com/users");
  });
});

describe("validateRequired", () => {
  it("returns empty array when all required fields are filled", () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.name = "email";
    input.required = true;
    input.value = "a@b.com";
    form.appendChild(input);

    const formData = new FormData(form);
    const missing = validateRequired(form, formData);
    expect(missing).toHaveLength(0);
  });

  it("returns missing fields when required fields are empty", () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.name = "email";
    input.required = true;
    input.value = "";
    form.appendChild(input);

    const formData = new FormData(form);
    const missing = validateRequired(form, formData);
    expect(missing).toHaveLength(1);
    expect(missing[0]?.label).toBe("email");
  });

  it("uses data-fable-ui-label when available", () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.name = "email";
    input.required = true;
    input.setAttribute("data-fable-ui-label", "Email Address");
    input.value = "";
    form.appendChild(input);

    const formData = new FormData(form);
    const missing = validateRequired(form, formData);
    expect(missing[0]?.label).toBe("Email Address");
  });
});

describe("unwrapRecordPayload", () => {
  it("extracts nested data property", () => {
    const result = unwrapRecordPayload({ data: { name: "John", age: 30 } });
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("returns object as-is when no data property", () => {
    const result = unwrapRecordPayload({ name: "John" });
    expect(result).toEqual({ name: "John" });
  });

  it("returns empty object for non-object input", () => {
    expect(unwrapRecordPayload(null)).toEqual({});
    expect(unwrapRecordPayload("string")).toEqual({});
    expect(unwrapRecordPayload(42)).toEqual({});
  });

  it("returns empty object for arrays", () => {
    expect(unwrapRecordPayload([1, 2, 3])).toEqual({});
  });
});

describe("hasNameField", () => {
  it("returns true for objects with string name", () => {
    expect(hasNameField({ name: "email" })).toBe(true);
  });

  it("returns false for objects without name", () => {
    expect(hasNameField({ type: "input" })).toBe(false);
  });

  it("returns false for null", () => {
    expect(hasNameField(null)).toBe(false);
  });
});

describe("mergePrefillToField", () => {
  it("merges value into input field", () => {
    const field = mergePrefillToField(
      { type: "input", name: "email" } as TComponentUnion,
      "john@test.com",
    );
    expect(field).toHaveProperty("defaultValue", "john@test.com");
  });

  it("merges value into slider field as number", () => {
    const field = mergePrefillToField({ type: "slider", name: "volume" } as TComponentUnion, 75);
    expect(field).toHaveProperty("defaultValue", 75);
  });

  it("returns field unchanged if value is undefined", () => {
    const original = { type: "input", name: "email" } as TComponentUnion;
    const field = mergePrefillToField(original, undefined);
    expect(field).toBe(original);
  });
});

describe("mergePrefillIntoDescendants", () => {
  it("deep-merges prefill values into nested component tree", () => {
    const nodes: TComponentUnion[] = [
      {
        type: "form",
        name: "user-form",
        descendants: [
          { type: "input", name: "email" } as TComponentUnion,
          { type: "textarea", name: "bio" } as TComponentUnion,
        ],
      } as TComponentUnion,
    ];

    const result = mergePrefillIntoDescendants(nodes, {
      email: "john@test.com",
      bio: "Hello world",
    });

    expect(result).toBeDefined();
    const formNode = result?.[0] as TComponentUnion & { descendants: TComponentUnion[] };
    expect(formNode.descendants).toBeDefined();
    const descendants = formNode.descendants;
    expect(descendants[0]).toHaveProperty("defaultValue", "john@test.com");
    expect(descendants[1]).toHaveProperty("defaultValue", "Hello world");
  });

  it("returns undefined when nodes is undefined", () => {
    expect(mergePrefillIntoDescendants(undefined, {})).toBeUndefined();
  });
});
