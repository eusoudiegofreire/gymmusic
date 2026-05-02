import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

const AUDIO_BUCKET = "audio";
const SIGNED_URL_TTL = 60; // segundos

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ musicaId: string }> }
) {
  const { musicaId } = await params;

  // ── 1. Verifica sessão ────────────────────────────────────────
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const admin = createAdminClient();

  // ── 2. Verifica status da assinatura ──────────────────────────
  const { data: cliente } = await admin
    .from("clientes_academias")
    .select("id, status_assinatura")
    .eq("user_id", user.id)
    .single();

  if (!cliente || cliente.status_assinatura !== "ativa") {
    return NextResponse.json(
      { error: "Assinatura inativa. Acesso não autorizado." },
      { status: 403 }
    );
  }

  // ── 3. Busca a música ─────────────────────────────────────────
  const { data: musica } = await admin
    .from("musicas")
    .select("id, link_audio")
    .eq("id", musicaId)
    .single();

  if (!musica) {
    return NextResponse.json({ error: "Música não encontrada." }, { status: 404 });
  }

  // ── 4. Gera URL assinada (60s) ────────────────────────────────
  const { data: signed, error: signError } = await admin.storage
    .from(AUDIO_BUCKET)
    .createSignedUrl(musica.link_audio, SIGNED_URL_TTL);

  if (signError || !signed?.signedUrl) {
    console.error("[api/audio] createSignedUrl", signError);
    return NextResponse.json(
      { error: "Erro ao gerar URL de áudio." },
      { status: 500 }
    );
  }

  // ── 5. Registra play em logs_execucao (não bloqueia a resposta) ─
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    null;

  admin
    .from("logs_execucao")
    .insert({ cliente_id: cliente.id, musica_id: musica.id, ip_origem: ip })
    .then(({ error }) => {
      if (error) console.error("[api/audio] logs_execucao insert", error);
    });

  // ── 6. Redireciona para a URL assinada ────────────────────────
  return NextResponse.redirect(signed.signedUrl, 302);
}
