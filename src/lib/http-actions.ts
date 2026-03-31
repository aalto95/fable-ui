import { buildGetUrl, formDataToJson } from "@/lib/form-utils";
import { http } from "@/lib/http-client";
import type { IAction } from "@/models/interfaces/component";

export type NavigateFn = (to: string | number) => void;

function requirePath(action: IAction): string {
  if (!action.path) {
    throw new Error(`Action ${action.type} requires path`);
  }
  return action.path;
}

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
      navigate(requirePath(action));
      return;
    }
    case "GO_BACK": {
      navigate(-1);
      return;
    }
    case "HIDE": {
      return;
    }
    case "HTTP_GET": {
      if (!form) throw new Error("Form required for HTTP_GET");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      const url = buildGetUrl(requirePath(action), json);
      await http.get(url);
      return;
    }
    case "HTTP_POST": {
      if (!form) throw new Error("Form required for HTTP_POST");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      const path = requirePath(action);
      const url = id ? `${path}/${id}` : path;
      await http.post(url, json);
      return;
    }
    case "HTTP_PUT": {
      if (!form) throw new Error("Form required for HTTP_PUT");
      if (!id) throw new Error("Route id is required for HTTP_PUT");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      await http.put(`${requirePath(action)}/${id}`, json);
      return;
    }
    case "HTTP_PATCH": {
      if (!form) throw new Error("Form required for HTTP_PATCH");
      if (!id) throw new Error("Route id is required for HTTP_PATCH");
      const formData = new FormData(form);
      const json = formDataToJson(formData, form);
      await http.patch(`${requirePath(action)}/${id}`, json);
      return;
    }
    case "HTTP_DELETE": {
      if (!id) throw new Error("Route id is required for HTTP_DELETE");
      await http.delete(`${requirePath(action)}/${id}`, { id });
      return;
    }
    default: {
      throw new Error(`Unsupported action: ${(action as IAction).type}`);
    }
  }
}
