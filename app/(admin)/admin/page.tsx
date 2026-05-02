import { Users, Music2, Activity, TrendingUp, Play } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { MetricCard } from "@/components/admin/metric-card";

function formatDatetime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const admin = createAdminClient();

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalAtivos },
    { count: totalTrial },
    { count: totalMusicas },
    { count: plays24h },
    { data: recentLogs },
  ] = await Promise.all([
    admin
      .from("clientes_academias")
      .select("id", { count: "exact", head: true })
      .eq("status_assinatura", "ativa"),
    admin
      .from("clientes_academias")
      .select("id", { count: "exact", head: true })
      .eq("status_assinatura", "trial"),
    admin
      .from("musicas")
      .select("id", { count: "exact", head: true }),
    admin
      .from("logs_execucao")
      .select("id", { count: "exact", head: true })
      .gte("data_hora", since24h),
    admin
      .from("logs_execucao")
      .select("id, data_hora, musicas(nome), clientes_academias(razao_social)")
      .order("data_hora", { ascending: false })
      .limit(10),
  ]);

  const ativos = totalAtivos ?? 0;
  const trial = totalTrial ?? 0;
  const mrr = ativos * 97; // estimativa conservadora (plano básico)

  const METRICS = [
    {
      value: String(ativos),
      label: "Clientes Ativos",
      icon: Users,
      sublabel: trial > 0 ? `${trial} em período de trial` : "Nenhum em trial",
      trend: "neutral" as const,
      trendValue: `${ativos + trial} total`,
    },
    {
      value: `R$ ${mrr.toLocaleString("pt-BR")}`,
      label: "MRR Estimado",
      icon: TrendingUp,
      sublabel: `${ativos} × R$97 (plano básico)`,
      trend: "neutral" as const,
      trendValue: "estimativa conservadora",
    },
    {
      value: String(totalMusicas ?? 0),
      label: "Músicas no Catálogo",
      icon: Music2,
      sublabel: "total de faixas disponíveis",
      trend: "neutral" as const,
      trendValue: "atualizado agora",
    },
    {
      value: String(plays24h ?? 0),
      label: "Plays nas últimas 24h",
      icon: Activity,
      sublabel: ativos > 0 ? `Média de ${Math.round((plays24h ?? 0) / ativos)} por academia` : "—",
      trend: "neutral" as const,
      trendValue: "últimas 24 horas",
    },
  ];

  return (
    <main className="flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#555555]">
          Painel
        </p>
        <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
          Visão Geral
        </h1>
      </div>

      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Métricas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </section>

      {/* Atividade recente */}
      <section aria-labelledby="activity-heading" className="mt-10">
        <h2
          id="activity-heading"
          className="mb-4 font-display text-lg font-black uppercase tracking-tight text-white"
        >
          Atividade Recente
        </h2>

        {!recentLogs || recentLogs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#1E1E1E] bg-[#111111] py-12 text-center">
            <Activity size={24} className="text-[#2A2A2A]" aria-hidden="true" />
            <p className="text-sm text-[#333333]">Nenhuma atividade registrada ainda</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#1A1A1A]">
            <ul role="list">
              {recentLogs.map((log, i) => {
                const musica = Array.isArray(log.musicas)
                  ? (log.musicas[0] as { nome: string } | undefined) ?? null
                  : (log.musicas as { nome: string } | null);
                const academia = Array.isArray(log.clientes_academias)
                  ? (log.clientes_academias[0] as { razao_social: string } | undefined) ?? null
                  : (log.clientes_academias as { razao_social: string } | null);
                return (
                  <li
                    key={log.id as string}
                    className={`flex items-center gap-3 px-4 py-3.5 ${
                      i < recentLogs.length - 1 ? "border-b border-[#1A1A1A]" : ""
                    }`}
                  >
                    <Play size={12} className="shrink-0 text-[#F97316]" aria-hidden="true" />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm font-semibold text-white">
                        {musica?.nome ?? "—"}
                      </span>
                      <span className="truncate text-[11px] text-[#555555]">
                        {academia?.razao_social ?? "—"}
                      </span>
                    </div>
                    <span className="shrink-0 text-[11px] tabular-nums text-[#444444]">
                      {formatDatetime(log.data_hora as string)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
