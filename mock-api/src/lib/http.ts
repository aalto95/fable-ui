import { corsHeadersForRequest } from "../config/cors";

export function json(
  data: unknown,
  req: Request,
  init: ResponseInit = {},
): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const cors = corsHeadersForRequest(req);
  for (const [k, v] of Object.entries(cors)) {
    headers.set(k, v);
  }
  return new Response(JSON.stringify(data), { ...init, headers });
}
