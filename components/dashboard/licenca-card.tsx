import { ShieldCheck, ExternalLink, MapPin, Calendar, Hash } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";

type SubscriptionStatus = "ativa" | "trial" | "inadimplente" | "cancelada";

interface LicencaCardProps {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  validade: string;
  status: SubscriptionStatus;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function LicencaCard({ razaoSocial, cnpj, endereco, validade, status }: LicencaCardProps) {
  const cnpjDigits = cnpj.replace(/\D/g, "");

  return (
    <div className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222222] px-5 py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#F97316]" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#555555]">
            Licença Musical
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
            Razão Social
          </span>
          <span className="text-sm font-semibold text-white">{razaoSocial}</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
              <Hash size={10} aria-hidden="true" />
              CNPJ
            </span>
            <span className="font-mono text-sm text-[#CCCCCC]">{cnpj}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
              <Calendar size={10} aria-hidden="true" />
              Válida até
            </span>
            <span className="text-sm text-[#CCCCCC]">{formatDate(validade)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
            <MapPin size={10} aria-hidden="true" />
            Endereço autorizado
          </span>
          <span className="text-sm text-[#CCCCCC]">{endereco}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1E1E1E] px-5 py-3">
        <Link
          href={`/validar/${cnpjDigits}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#F97316] transition-colors hover:text-[#EA6E0A]"
        >
          <ExternalLink size={12} aria-hidden="true" />
          Ver página pública de validação
        </Link>
      </div>
    </div>
  );
}
