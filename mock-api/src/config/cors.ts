const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://sdui-renderer.vercel.app",
];

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true;
  if (process.env.NODE_ENV === "development") return true;
  return allowedOrigins.includes(origin);
}

export function corsHeadersForRequest(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
  if (origin && isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}
