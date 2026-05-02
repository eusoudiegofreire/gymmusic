import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface StatusBannerProps {
  diasRestantes: number;
}

export function StatusBanner({ diasRestantes }: StatusBannerProps) {
  if (diasRestantes > 7) return null;

  const isUrgent = diasRestantes <= 2;

  return (
    <div
      role="alert"
      className={`flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6 ${
        isUrgent
          ? "border-[#EF4444]/20 bg-[#EF4444]/10"
          : "border-[#EAB308]/20 bg-[#EAB308]/10"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <AlertTriangle
          size={15}
          className={`shrink-0 ${isUrgent ? "text-[#EF4444]" : "text-[#EAB308]"}`}
          aria-hidden="true"
        />
        <p className={`text-xs font-semibold ${isUrgent ? "text-[#FCA5A5]" : "text-[#FDE68A]"}`}>
          {diasRestantes === 0
            ? "Sua assinatura vence hoje"
            : diasRestantes === 1
            ? "Sua assinatura vence amanhã"
            : `Sua assinatura vence em ${diasRestantes} dias`}
          {" "}— renove para não perder o acesso.
        </p>
      </div>

      <Link
        href="/#planos"
        className={`shrink-0 rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-opacity hover:opacity-80 ${
          isUrgent ? "bg-[#EF4444] text-white" : "bg-[#EAB308] text-black"
        }`}
      >
        Renovar
      </Link>
    </div>
  );
}
