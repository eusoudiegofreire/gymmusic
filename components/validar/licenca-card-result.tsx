import { ShieldCheck, ShieldOff, SearchX, AlertCircle, MapPin, Calendar, Hash, ExternalLink } from "lucide-react";
import Link from "next/link";

export type LicencaState = "ativa" | "inativa" | "nao_encontrado" | "invalido";

interface LicencaData {
  razaoSocial: string;
  cnpjFormatado: string;
  endereco: string;
  validade: string;
  status: "ativa" | "inadimplente" | "cancelada";
}

interface LicencaCardResultProps {
  state: LicencaState;
  data?: LicencaData;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const STATUS_LABELS: Record<NonNullable<LicencaData["status"]>, string> = {
  ativa: "Ativa",
  inadimplente: "Inadimplente",
  cancelada: "Cancelada",
};

const STATUS_COLORS: Record<NonNullable<LicencaData["status"]>, string> = {
  ativa: "#F97316",
  inadimplente: "#EF4444",
  cancelada: "#666666",
};

export function LicencaCardResult({ state, data }: LicencaCardResultProps) {
  if (state === "ativa" && data) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#F97316]/30 bg-[#0F0F0F] shadow-[0_0_60px_rgba(249,115,22,0.12)]">
        {/* Top accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#F97316]/40 via-[#F97316] to-[#F97316]/40" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#1E1E1E] px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316]/10">
            <ShieldCheck size={20} className="text-[#F97316]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#555555]">
              Verificação de Licença
            </p>
            <p className="text-base font-black uppercase tracking-tight text-white">
              Licença Ativa
            </p>
          </div>
          <span
            className="ml-auto inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: STATUS_COLORS[data.status] }}
          >
            {STATUS_LABELS[data.status]}
          </span>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-5 px-6 py-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
              Razão Social
            </span>
            <span className="text-sm font-semibold text-white">{data.razaoSocial}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
                <Hash size={9} aria-hidden="true" />
                CNPJ
              </span>
              <span className="font-mono text-sm text-[#CCCCCC]">{data.cnpjFormatado}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
                <Calendar size={9} aria-hidden="true" />
                Válida até
              </span>
              <span className="text-sm text-[#CCCCCC]">{formatDate(data.validade)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
              <MapPin size={9} aria-hidden="true" />
              Endereço autorizado
            </span>
            <span className="text-sm text-[#CCCCCC]">{data.endereco}</span>
          </div>
        </div>

        {/* Footer note */}
        <div className="border-t border-[#1A1A1A] bg-[#0A0A0A] px-6 py-4">
          <p className="text-[11px] leading-relaxed text-[#333333]">
            Esta academia possui licença musical ativa emitida pelo{" "}
            <span className="text-[#F97316]">Gym Music IA</span>. A licença é direta do autor,
            dispensando o pagamento ao ECAD.
          </p>
        </div>
      </div>
    );
  }

  if (state === "inativa" && data) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#EF4444]/20 bg-[#0F0F0F] shadow-[0_0_40px_rgba(239,68,68,0.08)]">
        <div className="h-[3px] w-full bg-gradient-to-r from-[#EF4444]/20 via-[#EF4444]/60 to-[#EF4444]/20" />

        <div className="flex items-center gap-3 border-b border-[#1E1E1E] px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EF4444]/10">
            <ShieldOff size={20} className="text-[#EF4444]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#555555]">
              Verificação de Licença
            </p>
            <p className="text-base font-black uppercase tracking-tight text-white">
              Licença Inativa
            </p>
          </div>
          <span
            className="ml-auto inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: STATUS_COLORS[data.status] }}
          >
            {STATUS_LABELS[data.status]}
          </span>
        </div>

        <div className="flex flex-col gap-4 px-6 py-6">
          <p className="text-sm text-[#999999]">
            A academia abaixo consta no sistema, mas sua licença está{" "}
            <span className="font-semibold text-[#EF4444]">suspensa ou cancelada</span>. O uso de
            música neste estabelecimento não está licenciado no momento.
          </p>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
              Razão Social
            </span>
            <span className="text-sm text-[#777777]">{data.razaoSocial}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
              <Hash size={9} aria-hidden="true" />
              CNPJ
            </span>
            <span className="font-mono text-sm text-[#777777]">{data.cnpjFormatado}</span>
          </div>
        </div>

        <div className="border-t border-[#1A1A1A] bg-[#0A0A0A] px-6 py-4">
          <Link
            href="/#planos"
            className="flex items-center gap-1.5 text-[11px] text-[#555555] transition-colors hover:text-[#F97316]"
          >
            <ExternalLink size={11} aria-hidden="true" />
            Esta é a sua academia? Regularize sua assinatura →
          </Link>
        </div>
      </div>
    );
  }

  if (state === "nao_encontrado") {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#222222] bg-[#0F0F0F]">
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#222222] bg-[#141414]">
            <SearchX size={24} className="text-[#333333]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-black uppercase tracking-tight text-[#777777]">
              Não encontrado
            </p>
            <p className="mt-2 text-sm text-[#444444]">
              Nenhuma academia com este CNPJ está cadastrada no Gym Music IA.
            </p>
          </div>
          <Link
            href="/#planos"
            className="mt-2 text-xs text-[#F97316] underline underline-offset-4 transition-colors hover:text-[#EA6E0A]"
          >
            Cadastre sua academia agora →
          </Link>
        </div>
      </div>
    );
  }

  // invalido
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#222222] bg-[#0F0F0F]">
      <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#EF4444]/20 bg-[#EF4444]/5">
          <AlertCircle size={24} className="text-[#EF4444]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-black uppercase tracking-tight text-[#777777]">
            CNPJ inválido
          </p>
          <p className="mt-2 text-sm text-[#444444]">
            O CNPJ informado não tem o formato correto. Verifique o link e tente novamente.
          </p>
        </div>
      </div>
    </div>
  );
}
