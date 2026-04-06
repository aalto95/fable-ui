/**
 * Thin fetch wrapper: consistent JSON handling, errors, and AbortSignal support.
 * No external HTTP dependency — uses the Fetch API only.
 */

export class HttpError extends Error {
  readonly status: number;
  readonly bodyText?: string;

  constructor(message: string, status: number, bodyText?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

export type HttpRequestInit = RequestInit;

async function readErrorBody(res: Response): Promise<string> {
  return res.text().catch(() => "");
}

async function parseJsonBody<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

async function request<T>(
  url: string,
  init: HttpRequestInit & { jsonBody?: unknown },
): Promise<T> {
  const { jsonBody, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);

  let body = rest.body;
  if (jsonBody !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(jsonBody);
  }

  const res = await fetch(url, { ...rest, headers, body });

  if (!res.ok) {
    const text = await readErrorBody(res);
    throw new HttpError(text || `HTTP ${res.status}`, res.status, text);
  }

  return parseJsonBody<T>(res);
}

export const http = {
  get<T>(url: string, init?: HttpRequestInit): Promise<T> {
    return request<T>(url, { ...init, method: "GET" });
  },

  post<T>(url: string, jsonBody: unknown, init?: HttpRequestInit): Promise<T> {
    return request<T>(url, { ...init, method: "POST", jsonBody });
  },

  put<T>(url: string, jsonBody: unknown, init?: HttpRequestInit): Promise<T> {
    return request<T>(url, { ...init, method: "PUT", jsonBody });
  },

  patch<T>(url: string, jsonBody: unknown, init?: HttpRequestInit): Promise<T> {
    return request<T>(url, { ...init, method: "PATCH", jsonBody });
  },

  delete<T>(
    url: string,
    jsonBody?: unknown,
    init?: HttpRequestInit,
  ): Promise<T> {
    if (jsonBody === undefined) {
      return request<T>(url, { ...init, method: "DELETE" });
    }
    return request<T>(url, { ...init, method: "DELETE", jsonBody });
  },
};
