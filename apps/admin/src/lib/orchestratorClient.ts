const ADMIN_KEY_STORAGE_KEY = "fable-sdui-admin-api-key";

/** Base URL from `VITE_API_URL` (no trailing slash). */
export function orchestratorBaseUrl(): string {
  return import.meta.env.VITE_API_URL as string;
}

export const jsonContentType: HeadersInit = { "Content-Type": "application/json" };

/** Admin API key persisted in localStorage. */
export function getAdminApiKey(): string {
  return localStorage.getItem(ADMIN_KEY_STORAGE_KEY) ?? "";
}

export function setAdminApiKey(key: string): void {
  localStorage.setItem(ADMIN_KEY_STORAGE_KEY, key.trim());
}

/**
 * Merge `Authorization: Bearer <key>` into request headers when an admin API key
 * is stored. Used for mutating endpoints that require admin auth.
 */
export function withAdminAuth(headers: HeadersInit = {}): HeadersInit {
  const key = getAdminApiKey();
  if (!key) return headers;
  return { ...headers, Authorization: `Bearer ${key}` };
}
