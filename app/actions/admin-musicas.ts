"use server";

import { createHash } from "crypto";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

const AUDIO_BUCKET = "audio";

export interface AdminMusicaState {
  error?: string;
  success?: boolean;
}

async function assertAdmin(): Promise<string> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    throw new Error("Acesso negado.");
  }

  return user.email ?? user.id;
}

// ── ADICIONAR ────────────────────────────────────────────────

export async function adicionarMusica(
  formData: FormData
): Promise<AdminMusicaState> {
  try {
    const adminEmail = await assertAdmin();

    const nome = (formData.get("nome") as string | null)?.trim() ?? "";
    const estilo = (formData.get("estilo") as string | null)?.trim() ?? "";
    const letra = (formData.get("letra") as string | null)?.trim() || null;
    const promptUsado = (formData.get("prompt") as string | null)?.trim() || null;
    const arquivo = formData.get("arquivo") as File | null;

    if (!nome) return { error: "Nome é obrigatório." };
    if (!estilo) return { error: "Estilo é obrigatório." };
    if (!arquivo || arquivo.size === 0)
      return { error: "Arquivo de áudio é obrigatório." };

    const buffer = Buffer.from(await arquivo.arrayBuffer());
    const hashSha256 = createHash("sha256").update(buffer).digest("hex");

    const admin = createAdminClient();

    // Unicidade do arquivo
    const { data: existing } = await admin
      .from("musicas")
      .select("id")
      .eq("hash_sha256", hashSha256)
      .maybeSingle();

    if (existing) return { error: "Este arquivo já foi enviado anteriormente." };

    // Upload para Storage
    const ext = arquivo.name.split(".").pop() ?? "mp3";
    const storagePath = `${Date.now()}-${nome
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}.${ext}`;

    const { error: uploadError } = await admin.storage
      .from(AUDIO_BUCKET)
      .upload(storagePath, buffer, {
        contentType: arquivo.type || "audio/mpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("[adicionarMusica] upload", uploadError);
      return { error: "Erro ao fazer upload do arquivo." };
    }

    // Insere no banco com curadoria automática
    const { error: insertError } = await admin.from("musicas").insert({
      nome,
      estilo,
      letra,
      prompt_usado: promptUsado,
      link_audio: storagePath,
      hash_sha256: hashSha256,
      curado_por: adminEmail,
      data_curadoria: new Date().toISOString(),
    });

    if (insertError) {
      await admin.storage.from(AUDIO_BUCKET).remove([storagePath]);
      console.error("[adicionarMusica] insert", insertError);
      return { error: "Erro ao salvar a música no banco." };
    }

    return { success: true };
  } catch (err) {
    console.error("[adicionarMusica]", err);
    return {
      error: err instanceof Error ? err.message : "Erro inesperado.",
    };
  }
}

// ── EDITAR ───────────────────────────────────────────────────

export async function editarMusica(
  id: string,
  formData: FormData
): Promise<AdminMusicaState> {
  try {
    await assertAdmin();

    const nome = (formData.get("nome") as string | null)?.trim() ?? "";
    const estilo = (formData.get("estilo") as string | null)?.trim() ?? "";
    const letra = (formData.get("letra") as string | null)?.trim() || null;
    const promptUsado = (formData.get("prompt") as string | null)?.trim() || null;

    if (!nome) return { error: "Nome é obrigatório." };
    if (!estilo) return { error: "Estilo é obrigatório." };

    const admin = createAdminClient();

    const { error } = await admin
      .from("musicas")
      .update({ nome, estilo, letra, prompt_usado: promptUsado })
      .eq("id", id);

    if (error) {
      console.error("[editarMusica]", error);
      return { error: "Erro ao atualizar a música." };
    }

    return { success: true };
  } catch (err) {
    console.error("[editarMusica]", err);
    return {
      error: err instanceof Error ? err.message : "Erro inesperado.",
    };
  }
}

// ── EXCLUIR ──────────────────────────────────────────────────

export async function excluirMusica(id: string): Promise<AdminMusicaState> {
  try {
    await assertAdmin();

    const admin = createAdminClient();

    // Busca o caminho do arquivo antes de deletar
    const { data: musica } = await admin
      .from("musicas")
      .select("link_audio")
      .eq("id", id)
      .single();

    const { error: deleteError } = await admin
      .from("musicas")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[excluirMusica] delete", deleteError);
      return { error: "Erro ao excluir a música do banco." };
    }

    // Remove do Storage após confirmar exclusão do banco
    if (musica?.link_audio) {
      const { error: storageError } = await admin.storage
        .from(AUDIO_BUCKET)
        .remove([musica.link_audio as string]);

      if (storageError) {
        console.error("[excluirMusica] storage remove", storageError);
        // Não retorna erro — registro já foi removido do banco
      }
    }

    return { success: true };
  } catch (err) {
    console.error("[excluirMusica]", err);
    return {
      error: err instanceof Error ? err.message : "Erro inesperado.",
    };
  }
}
