import { createAdminClient } from "@/lib/supabase/server";
import { AdminMusicasContent } from "@/components/admin/admin-musicas-content";
import type { AdminMusica } from "@/components/admin/musicas-table";

export default async function AdminMusicasPage() {
  const admin = createAdminClient();

  const { data } = await admin
    .from("musicas")
    .select("id, nome, estilo, data_criacao, curado_por, data_curadoria")
    .order("data_criacao", { ascending: false });

  const musicas: AdminMusica[] = (data ?? []).map((m) => ({
    id: m.id as string,
    nome: m.nome as string,
    estilo: (m.estilo as string | null) ?? "—",
    criadoEm: m.data_criacao as string,
    curadoPor: m.curado_por as string | null,
    dataCuradoria: m.data_curadoria as string | null,
  }));

  return <AdminMusicasContent musicas={musicas} />;
}
