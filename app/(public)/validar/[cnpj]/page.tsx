import Link from "next/link";
import { Music2 } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { isValidCnpj, sanitizeCnpj } from "@/lib/validations/cnpj";
import {
  LicencaCardResult,
  type LicencaState,
} from "@/components/validar/licenca-card-result";

function formatCnpj(digits: string): string {
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

async function resolveFromDb(
  cnpj: string
): Promise<Parameters<typeof LicencaCardResult>[0]> {
  const digits = sanitizeCnpj(cnpj);

  if (!isValidCnpj(digits)) {
    return { state: "invalido" };
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("clientes_academias")
    .select("razao_social, cnpj, endereco_autorizado, status_assinatura, data_validade")
    .eq("cnpj", digits)
    .single();

  if (!data) {
    return { state: "nao_encontrado" };
  }

  const status = data.status_assinatura as string;
  const cnpjFormatado = formatCnpj(data.cnpj as string);

  if (status === "ativa") {
    return {
      state: "ativa" satisfies LicencaState,
      data: {
        razaoSocial: data.razao_social as string,
        cnpjFormatado,
        endereco: data.endereco_autorizado as string,
        validade: data.data_validade as string,
        status: "ativa",
      },
    };
  }

  // cancelada, inadimplente ou trial → licença inativa
  return {
    state: "inativa" satisfies LicencaState,
    data: {
      razaoSocial: data.razao_social as string,
      cnpjFormatado,
      endereco: data.endereco_autorizado as string,
      validade: (data.data_validade as string | null) ?? new Date().toISOString(),
      status: status === "cancelada" ? "cancelada" : "inadimplente",
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cnpj: string }>;
}) {
  const { cnpj } = await params;
  const digits = sanitizeCnpj(cnpj);
  return {
    title: `Validar licença ${isValidCnpj(digits) ? formatCnpj(digits) : cnpj} — Gym Music IA`,
  };
}

export default async function ValidarPage({
  params,
}: {
  params: Promise<{ cnpj: string }>;
}) {
  const { cnpj } = await params;
  const result = await resolveFromDb(cnpj);
  const digits = sanitizeCnpj(cnpj);

  return (
    <div className="flex min-h-dvh flex-col bg-[#0A0A0A]">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316] opacity-[0.04] blur-[100px]"
      />

      {/* Simple header */}
      <header className="relative z-10 border-b border-[#151515]">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-white transition-opacity hover:opacity-75"
          >
            <Music2 size={20} className="text-[#F97316]" aria-hidden="true" />
            <span className="text-base font-bold tracking-tight">
              Gym Music <span className="text-[#F97316]">IA</span>
            </span>
          </Link>
          <span className="ml-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#333333]">
            / Validação de Licença
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#444444]">
            CNPJ verificado
          </p>
          <p className="mt-1 font-mono text-sm text-[#666666]">
            {isValidCnpj(digits) ? formatCnpj(digits) : cnpj}
          </p>
        </div>

        <LicencaCardResult {...result} />

        <p className="mt-8 text-center text-[11px] text-[#2A2A2A]">
          Verificação automática via{" "}
          <span className="text-[#F97316]">Gym Music IA</span> · Licença direta do autor
        </p>
      </main>
    </div>
  );
}
