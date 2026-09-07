import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_URL;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!baseUrl || !anonKey) {
  console.error('Missing InsForge environment variables (VITE_INSFORGE_URL / VITE_INSFORGE_ANON_KEY)');
}

// The single InsForge client for the app. Prefer importing this directly in new code.
export const insforge = createClient({
  baseUrl: baseUrl || '',
  anonKey: anonKey || '',
});

/**
 * Backwards-compatible facade.
 *
 * This project was migrated from Supabase to InsForge. InsForge's database layer
 * is built on @supabase/postgrest-js, so `supabase.from(...)` and the whole query
 * builder (`select/insert/update/delete/eq/or/ilike/range/maybeSingle/upsert/...`,
 * nested embeds, and `{ count }`) behave exactly as before. Existing service code
 * keeps working unchanged; only auth flows were rewritten against `insforge.auth`.
 */
export const supabase = {
  from: (table: string) => insforge.database.from(table),
  rpc: (fn: string, args?: Record<string, unknown>) => insforge.database.rpc(fn, args),
  auth: {
    // Alias for the one call site that used Supabase's getUser().
    getUser: () => insforge.auth.getCurrentUser(),
    getCurrentUser: () => insforge.auth.getCurrentUser(),
    signInWithPassword: insforge.auth.signInWithPassword.bind(insforge.auth),
    signInWithOtp: insforge.auth.signInWithOtp.bind(insforge.auth),
    verifyOtp: insforge.auth.verifyOtp.bind(insforge.auth),
    signOut: insforge.auth.signOut.bind(insforge.auth),
    onAuthStateChange: insforge.auth.onAuthStateChange.bind(insforge.auth),
  },
};
