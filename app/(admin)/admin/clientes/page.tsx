import { createAdminClient } from "@/lib/supabase/server";
import { AdminClientesContent } from "@/components/admin/admin-clientes-content";
import type { Cliente } from "@/components/admin/clientes-table";

function formatCnpj(digits: string): string {
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export default async function AdminClientesPage() {
  const admin = createAdminClient();

  const [{ data: rows }, { data: authData }, { data: logsData }] =
    await Promise.all([
      admin
        .from("clientes_academias")
        .select(
          "id, razao_social, cnpj, status_assinatura, data_validade, data_inicio, user_id, endereco_autorizado, stripe_customer_id"
        )
        .order("data_inicio", { ascending: false }),
      admin.auth.admin.listUsers({ perPage: 1000 }),
      admin
        .from("logs_execucao")
        .select("id, cliente_id, data_hora, musicas(nome)")
        .order("data_hora", { ascending: false })
        .limit(200),
    ]);

  // Mapa userId → email
  const emailByUserId: Record<string, string> = {};
  for (const u of authData?.users ?? []) {
    emailByUserId[u.id] = u.email ?? "";
  }

  const clientes: Cliente[] = (rows ?? []).map((r) => ({
    id: r.id as string,
    razaoSocial: r.razao_social as string,
    cnpj: formatCnpj(r.cnpj as string),
    status: r.status_assinatura as Cliente["status"],
    validade: (r.data_validade as string | null) ?? new Date().toISOString(),
    inicio: (r.data_inicio as string | null) ?? new Date().toISOString(),
    email: emailByUserId[r.user_id as string] ?? "",
    endereco: r.endereco_autorizado as string,
    stripeCustomerId: (r.stripe_customer_id as string | null) ?? null,
  }));

  // Agrupa plays recentes por cliente_id (últimas 5 por cliente)
  const playsByClienteId: Record<string, { id: string; musica: string; tocadoEm: string }[]> = {};
  for (const log of logsData ?? []) {
    const cid = log.cliente_id as string;
    if (!playsByClienteId[cid]) playsByClienteId[cid] = [];
    if (playsByClienteId[cid].length < 5) {
      const musicas = Array.isArray(log.musicas)
        ? (log.musicas[0] as { nome: string } | undefined) ?? null
        : (log.musicas as { nome: string } | null);
      playsByClienteId[cid].push({
        id: log.id as string,
        musica: musicas?.nome ?? "—",
        tocadoEm: log.data_hora as string,
      });
    }
  }

  return (
    <AdminClientesContent
      clientes={clientes}
      playsByClienteId={playsByClienteId}
    />
  );
}
