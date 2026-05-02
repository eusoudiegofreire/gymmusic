import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rotas públicas — passam sem verificação
const PUBLIC_PATHS = ["/", "/login", "/cadastro", "/validar", "/api/stripe/webhook"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Passa arquivos estáticos e rotas Next.js internas sem verificação
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|webp|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Constrói response mutável para que o @supabase/ssr possa renovar cookies
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Propaga cookies novos para o request e para a response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verifica sessão (e renova token se necessário)
  const { data: { user } } = await supabase.auth.getUser();

  // ── Rotas de academia: /dashboard e /api/audio ──────────────
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/audio")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // ── Rotas de admin: /admin ───────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const adminUserId = process.env.ADMIN_USER_ID;
    if (!adminUserId || user.id !== adminUserId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas exceto:
     * - _next/static (arquivos estáticos do build)
     * - _next/image (otimização de imagens)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
