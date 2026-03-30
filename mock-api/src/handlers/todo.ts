import { json } from "../lib/http";
import { todoService } from "../services/todoService";

export async function getTodos(req: Request, url: URL): Promise<Response> {
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;

  const result = await todoService.getTodos({ page, limit });

  return json(
    {
      data: result.data,
      total: result.total,
      totalPages: result.totalPages,
    },
    req,
  );
}

export async function getTodoById(req: Request, id: string): Promise<Response> {
  const result = await todoService.getTodoById(id);
  return json(result, req);
}

export async function addTodo(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ success: false, message: "Invalid JSON" }, req, { status: 400 });
  }

  const { name, text, dueDate } = body as Record<string, unknown>;
  if (!name || !text) {
    return json(
      {
        success: false,
        message: "All fields (name, text) are required",
      },
      req,
      { status: 400 },
    );
  }

  const result = await todoService.addTodo({
    name: String(name),
    text: String(text),
    dueDate: dueDate != null ? String(dueDate) : undefined,
  });

  return json(
    {
      success: true,
      message: "Item added successfully",
      data: result.data,
    },
    req,
  );
}

export async function updateTodo(req: Request, id: string): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ success: false, message: "Invalid JSON" }, req, { status: 400 });
  }

  const result = await todoService.updateTodo(id, body as Record<string, unknown>);

  return json(
    {
      success: true,
      message: "Item updated successfully",
      data: result.data,
    },
    req,
  );
}

export async function deleteTodo(req: Request, id: string): Promise<Response> {
  await todoService.deleteTodo(id);

  return json(
    {
      success: true,
      message: "Item deleted successfully",
    },
    req,
  );
}
