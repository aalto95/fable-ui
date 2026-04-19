/** Base URL from `VITE_API_URL` (no trailing slash). */
export function orchestratorBaseUrl(): string {
  return import.meta.env.VITE_API_URL as string;
}

export const jsonContentType: HeadersInit = { "Content-Type": "application/json" };
