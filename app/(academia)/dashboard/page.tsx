import { redirect } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import type { DashboardTrack } from "@/components/dashboard/musica-list";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [{ data: cliente }, { data: musicasRaw }] = await Promise.all([
    admin
      .from("clientes_academias")
      .select("razao_social, cnpj, endereco_autorizado, status_assinatura, data_validade")
      .eq("user_id", user.id)
      .single(),
    admin
      .from("musicas")
      .select("id, nome, estilo")
      .order("data_criacao", { ascending: false }),
  ]);

  if (!cliente) redirect("/login");

  const musicas: DashboardTrack[] = (musicasRaw ?? []).map((m) => ({
    id: m.id as string,
    nome: m.nome as string,
    estilo: (m.estilo as string | null) ?? "Outros",
  }));

  return (
    <DashboardContent
      musicas={musicas}
      cliente={{
        razao_social: cliente.razao_social as string,
        cnpj: cliente.cnpj as string,
        endereco_autorizado: cliente.endereco_autorizado as string,
        status_assinatura: cliente.status_assinatura as "ativa" | "cancelada" | "inadimplente" | "trial",
        data_validade: cliente.data_validade as string | null,
      }}
    />
  );
}
