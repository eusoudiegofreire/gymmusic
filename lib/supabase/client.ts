import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso em Client Components ("use client").
 * Usa apenas a anon key pública — nunca a service role key.
 * A sessão é lida automaticamente dos cookies gerenciados pelo middleware.
 *
 * Uso: const supabase = createBrowserClient()
 */
export function createBrowserClient() {
  return _createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
