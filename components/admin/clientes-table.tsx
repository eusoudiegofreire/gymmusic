"use client";

import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

type SubscriptionStatus = "ativa" | "trial" | "inadimplente" | "cancelada";

export interface Cliente {
  id: string;
  razaoSocial: string;
  cnpj: string;
  status: SubscriptionStatus;
  validade: string;
  inicio: string;
  email: string;
  endereco: string;
  stripeCustomerId: string | null;
}

const STATUS_FILTERS: { label: string; value: SubscriptionStatus | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Ativa", value: "ativa" },
  { label: "Trial", value: "trial" },
  { label: "Inadimplente", value: "inadimplente" },
  { label: "Cancelada", value: "cancelada" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface ClientesTableProps {
  clientes: Cliente[];
  onVerDetalhes?: (cliente: Cliente) => void;
}

export function ClientesTable({ clientes, onVerDetalhes }: ClientesTableProps) {
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<SubscriptionStatus | "todos">("todos");

  const filtered = clientes.filter((c) => {
    const matchStatus = statusFiltro === "todos" || c.status === statusFiltro;
    const q = busca.toLowerCase();
    const matchBusca =
      !q ||
      c.razaoSocial.toLowerCase().includes(q) ||
      c.cnpj.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
      c.cnpj.toLowerCase().includes(q);
    return matchStatus && matchBusca;
  });

  const thClass =
    "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#555555]";
  const tdClass = "px-4 py-3.5 text-sm";

  return (
    <div className="flex flex-col gap-4">
      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#444444]"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Buscar por nome ou CNPJ…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-lg border border-[#2A2A2A] bg-[#141414] py-2 pl-8 pr-3.5 text-xs text-white placeholder-[#444444] outline-none transition-colors focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30"
          />
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-0.5"
          role="group"
          aria-label="Filtrar por status"
        >
          {STATUS_FILTERS.map(({ label, value }) => {
            const isActive = statusFiltro === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFiltro(value)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-150 ${
                  isActive
                    ? "bg-[#F97316] text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                    : "border border-[#2A2A2A] text-[#555555] hover:border-[#F97316]/30 hover:text-[#999999]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-[#333333]">
        {filtered.length} de {clientes.length} clientes
      </p>

      <div className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#1A1A1A]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Search size={22} className="text-[#2A2A2A]" aria-hidden="true" />
            <p className="text-sm text-[#333333]">Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-[#222222] bg-[#141414]">
                  <th className={thClass}>Razão Social</th>
                  <th className={thClass}>CNPJ</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Válida até</th>
                  <th className={thClass}>Início</th>
                  <th className={`${thClass} text-right`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cliente, i) => (
                  <tr
                    key={cliente.id}
                    className={`transition-colors hover:bg-[#1F1F1F] ${
                      i < filtered.length - 1 ? "border-b border-[#1A1A1A]" : ""
                    }`}
                  >
                    <td className={`${tdClass} max-w-[200px] font-semibold text-white`}>
                      <span className="block truncate">{cliente.razaoSocial}</span>
                    </td>
                    <td className={tdClass}>
                      <span className="font-mono text-xs text-[#888888]">{cliente.cnpj}</span>
                    </td>
                    <td className={tdClass}>
                      <StatusBadge status={cliente.status} />
                    </td>
                    <td className={`${tdClass} text-[#555555]`}>
                      {formatDate(cliente.validade)}
                    </td>
                    <td className={`${tdClass} text-[#555555]`}>
                      {formatDate(cliente.inicio)}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <button
                        type="button"
                        onClick={() => onVerDetalhes?.(cliente)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#2A2A2A] px-3 py-1.5 text-[11px] font-semibold text-[#666666] transition-colors hover:border-[#F97316]/40 hover:text-[#F97316]"
                      >
                        <ExternalLink size={11} aria-hidden="true" />
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
