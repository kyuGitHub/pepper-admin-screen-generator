import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** False when the Supabase variables are missing: the app then runs in demo mode (no login, sample screen only). */
export const isConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isConfigured ? createClient(url!, anonKey!) : null;

/** Throws a readable error instead of a null dereference when called in demo mode. */
export function db(): SupabaseClient {
  if (!supabase) throw new Error('Supabase가 설정되지 않았습니다 (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  return supabase;
}
