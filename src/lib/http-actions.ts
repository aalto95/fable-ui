import { buildGetUrl, formDataToJson } from "@/lib/form-utils";
import type { IAction } from "@/models/interfaces/component";

export type NavigateFn = (to: string) => void;

export async function executeAction(
  action: IAction,
  ctx: {
    form?: HTMLFormElement | null;
    id?: string;
    navigate: NavigateFn;
  },
): Promise<void> {
  const { form, id, navigate } = ctx;

  switch (action.type) {
    case "GO_TO": {
      navigate(action.path);
      return;
    }
    case "HIDE": {
      return;
    }
    case "HTTP_GET": {
      if (!form) throw new Error("Form required for HTTP_GET");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      const url = buildGetUrl(action.path, json);
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Error ${res.status}`);
      }
      return;
    }
    case "HTTP_POST": {
      if (!form) throw new Error("Form required for HTTP_POST");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      const url = id ? `${action.path}/${id}` : action.path;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Error ${res.status}`);
      }
      return;
    }
    case "HTTP_PUT": {
      if (!form) throw new Error("Form required for HTTP_PUT");
      if (!id) throw new Error("Route id is required for HTTP_PUT");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      const res = await fetch(`${action.path}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Error ${res.status}`);
      }
      return;
    }
    case "HTTP_PATCH": {
      if (!form) throw new Error("Form required for HTTP_PATCH");
      if (!id) throw new Error("Route id is required for HTTP_PATCH");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      const res = await fetch(`${action.path}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Error ${res.status}`);
      }
      return;
    }
    case "HTTP_DELETE": {
      if (!id) throw new Error("Route id is required for HTTP_DELETE");
      const res = await fetch(`${action.path}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Error ${res.status}`);
      }
      return;
    }
    default: {
      throw new Error(`Unsupported action: ${(action as IAction).type}`);
    }
  }
}
