"use client";

import { useState } from "react";
import { Music2, ShieldCheck, Activity } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { MusicPlayer } from "@/components/player/music-player";
import { MusicaList, type DashboardTrack } from "@/components/dashboard/musica-list";
import { LicencaCard } from "@/components/dashboard/licenca-card";
import { StatusBanner } from "@/components/dashboard/status-banner";

type StatusAssinatura = "ativa" | "cancelada" | "inadimplente" | "trial";

export interface ClienteInfo {
  razao_social: string;
  cnpj: string;
  endereco_autorizado: string;
  status_assinatura: StatusAssinatura;
  data_validade: string | null;
}

interface DashboardContentProps {
  musicas: DashboardTrack[];
  cliente: ClienteInfo;
}

function getDiasRestantes(iso: string | null): number {
  if (!iso) return 999;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const validade = new Date(iso);
  validade.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((validade.getTime() - hoje.getTime()) / 86_400_000));
}

function formatCnpj(digits: string): string {
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

export function DashboardContent({ musicas, cliente }: DashboardContentProps) {
  const [selectedTrack, setSelectedTrack] = useState<DashboardTrack | null>(
    musicas[0] ?? null
  );

  const diasRestantes = getDiasRestantes(cliente.data_validade);
  const cnpjFormatado = formatCnpj(cliente.cnpj);

  const currentIndex = selectedTrack
    ? musicas.findIndex((m) => m.id === selectedTrack.id)
    : -1;

  const handlePrevious =
    currentIndex > 0 ? () => setSelectedTrack(musicas[currentIndex - 1]) : undefined;
  const handleNext =
    currentIndex >= 0 && currentIndex < musicas.length - 1
      ? () => setSelectedTrack(musicas[currentIndex + 1])
      : undefined;

  return (
    <>
      <StatusBanner diasRestantes={diasRestantes} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#555555]">
            Bem-vindo de volta
          </p>
          <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            {cliente.razao_social.split(" ").slice(0, 2).join(" ")}
          </h1>
        </div>

        {/* Quick-info cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-3 rounded-xl border border-[#1E1E1E] bg-[#1A1A1A] p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#555555]">
                Assinatura
              </span>
              <ShieldCheck size={15} className="text-[#F97316]" aria-hidden="true" />
            </div>
            <StatusBadge status={cliente.status_assinatura} />
            {cliente.data_validade && (
              <p className="text-[11px] text-[#444444]">
                Válida até{" "}
                {new Date(cliente.data_validade).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-[#1E1E1E] bg-[#1A1A1A] p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#555555]">
                Catálogo
              </span>
              <Music2 size={15} className="text-[#F97316]" aria-hidden="true" />
            </div>
            <p className="font-display text-4xl font-black leading-none text-white">
              {musicas.length}
            </p>
            <p className="text-[11px] text-[#444444]">músicas disponíveis</p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-[#1E1E1E] bg-[#1A1A1A] p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#555555]">
                Licença
              </span>
              <Activity size={15} className="text-[#F97316]" aria-hidden="true" />
            </div>
            <p className="font-mono text-sm font-semibold text-white">{cnpjFormatado}</p>
            <a
              href={`/validar/${cliente.cnpj}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#F97316] underline underline-offset-4 transition-colors hover:text-[#EA6E0A]"
            >
              Ver página de validação →
            </a>
          </div>
        </div>

        {/* Layout: lista + player à esquerda, licença à direita */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <section aria-labelledby="musicas-heading">
              <h2
                id="musicas-heading"
                className="mb-4 font-display text-lg font-black uppercase tracking-tight text-white"
              >
                Suas Músicas
              </h2>
              <MusicaList
                tracks={musicas}
                selectedId={selectedTrack?.id}
                onTrackSelect={setSelectedTrack}
              />
            </section>

            <section aria-labelledby="player-heading">
              <h2
                id="player-heading"
                className="mb-4 font-display text-lg font-black uppercase tracking-tight text-white"
              >
                Player
              </h2>
              <MusicPlayer
                track={selectedTrack}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </section>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <h2 className="mb-4 font-display text-lg font-black uppercase tracking-tight text-white">
              Minha Licença
            </h2>
            <LicencaCard
              razaoSocial={cliente.razao_social}
              cnpj={cnpjFormatado}
              endereco={cliente.endereco_autorizado}
              validade={cliente.data_validade ?? "—"}
              status={cliente.status_assinatura}
            />
          </div>
        </div>
      </main>
    </>
  );
}
