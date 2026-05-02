import { createServerClient as _createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Cliente com a sessão do usuário (cookies).
 * Usa a anon key + RLS. Para Server Components, Server Actions e Route Handlers
 * que precisam respeitar as permissões do usuário autenticado.
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll pode falhar em Server Components (read-only).
          // O middleware renova os cookies — pode ignorar aqui.
        }
      },
    },
  });
}

/**
 * Cliente com service role key — bypassa o RLS completamente.
 * Usar APENAS em Server Actions, Route Handlers e Server Components.
 * NUNCA importar em arquivos com "use client".
 */
export function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
