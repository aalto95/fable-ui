import { buildGetUrl, formDataToJson } from "@/lib/form-utils";
import { http } from "@/lib/http-client";
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
      await http.get(url);
      return;
    }
    case "HTTP_POST": {
      if (!form) throw new Error("Form required for HTTP_POST");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      const url = id ? `${action.path}/${id}` : action.path;
      await http.post(url, json);
      return;
    }
    case "HTTP_PUT": {
      if (!form) throw new Error("Form required for HTTP_PUT");
      if (!id) throw new Error("Route id is required for HTTP_PUT");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      await http.put(`${action.path}/${id}`, json);
      return;
    }
    case "HTTP_PATCH": {
      if (!form) throw new Error("Form required for HTTP_PATCH");
      if (!id) throw new Error("Route id is required for HTTP_PATCH");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      await http.patch(`${action.path}/${id}`, json);
      return;
    }
    case "HTTP_DELETE": {
      if (!id) throw new Error("Route id is required for HTTP_DELETE");
      await http.delete(`${action.path}/${id}`, { id });
      return;
    }
    default: {
      throw new Error(`Unsupported action: ${(action as IAction).type}`);
    }
  }
}
