import { corsHeadersForRequest, isOriginAllowed } from "./config/cors";
import * as todoHandlers from "./handlers/todo";
import { json } from "./lib/http";

function errorToResponse(err: unknown, req: Request): Response {
  console.error("Error:", err);

  if (err instanceof Error) {
    if (err.name === "ValidationError") {
      return json({ success: false, message: err.message }, req, { status: 400 });
    }
    return json(
      {
        success: false,
        message: err.message || "Internal server error",
      },
      req,
      { status: 500 },
    );
  }

  return json({ success: false, message: "Internal server error" }, req, {
    status: 500,
  });
}

async function route(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");
  if (origin && !isOriginAllowed(origin)) {
    return json(
      { success: false, message: "CORS error: Origin not allowed" },
      req,
      { status: 403 },
    );
  }

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeadersForRequest(req),
    });
  }

  const url = new URL(req.url);
  const { pathname } = url;
  const { method } = req;

  try {
    if (pathname === "/api/todo" && method === "GET") {
      return todoHandlers.getTodos(req, url);
    }
    if (pathname === "/api/todo" && method === "POST") {
      return todoHandlers.addTodo(req);
    }

    const match = /^\/api\/todo\/([^/]+)$/.exec(pathname);
    if (match) {
      const id = match[1];
      if (method === "GET") return todoHandlers.getTodoById(req, id);
      if (method === "PUT") return todoHandlers.updateTodo(req, id);
      if (method === "DELETE") return todoHandlers.deleteTodo(req, id);
    }

    return json({ success: false, message: "Not found" }, req, { status: 404 });
  } catch (err) {
    return errorToResponse(err, req);
  }
}

const PORT = Number(process.env.PORT) || 3000;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    return route(req);
  },
});

console.log(`Server running on http://localhost:${server.port}`);
