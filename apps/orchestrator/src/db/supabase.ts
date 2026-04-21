import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/** Project URL (dashboard → Settings → API). */
export function getSupabaseUrl(): string | undefined {
  const raw = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return raw || undefined;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && process.env.SUPABASE_ANON_KEY?.trim());
}

/**
 * Browser-style Supabase client (anon key). Use for PostgREST-style access, e.g.
 * `getSupabase().from('todos').select()`.
 */
export function getSupabase(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    throw new Error("Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_ANON_KEY");
  }
  if (!_client) {
    _client = createClient(url, key);
  }
  return _client;
}
