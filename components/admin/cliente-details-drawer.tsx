"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ExternalLink, Hash, MapPin, Mail, Calendar, Play, AlertTriangle, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cancelarAssinatura } from "@/app/actions/admin-clientes";
import type { Cliente } from "./clientes-table";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDatetime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Field({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444444]">
        <Icon size={10} aria-hidden="true" />
        {label}
      </span>
      <span className="text-sm text-[#CCCCCC]">{value}</span>
    </div>
  );
}

interface ClienteDetailsDrawerProps {
  cliente: Cliente | null;
  recentPlays?: { id: string; musica: string; tocadoEm: string }[];
  onClose: () => void;
}

export function ClienteDetailsDrawer({
  cliente,
  recentPlays = [],
  onClose,
}: ClienteDetailsDrawerProps) {
  const router = useRouter();
  const isOpen = !!cliente;

  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => { setCancelError(null); }, [cliente?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleCancelar = async () => {
    if (!cliente) return;
    if (!window.confirm(
      `Cancelar assinatura de "${cliente.razaoSocial}"?\n\nO acesso será mantido até o fim do período pago. Esta ação não pode ser desfeita.`
    )) return;

    setCanceling(true);
    setCancelError(null);
    const result = await cancelarAssinatura(cliente.id);
    setCanceling(false);

    if (result.error) {
      setCancelError(result.error);
      return;
    }

    router.refresh();
    onClose();
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={cliente ? `Detalhes: ${cliente.razaoSocial}` : "Detalhes do cliente"}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[#1A1A1A] bg-[#0A0A0A] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#1A1A1A] px-5 py-4">
          <div className="flex flex-col gap-1 overflow-hidden">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#555555]">
              Detalhes do cliente
            </p>
            <h2 className="truncate font-display text-lg font-black uppercase tracking-tight text-white">
              {cliente?.razaoSocial ?? "—"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#555555] transition-colors hover:bg-[#1A1A1A] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-1 flex-col gap-7 overflow-y-auto px-5 py-6">
          {cliente && (
            <>
              {/* Status + validade */}
              <div className="flex items-center justify-between">
                <StatusBadge status={cliente.status} />
                <span className="text-[11px] text-[#444444]">
                  Válida até {formatDate(cliente.validade)}
                </span>
              </div>

              {/* Dados cadastrais */}
              <section aria-labelledby="dados-heading">
                <h3
                  id="dados-heading"
                  className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#333333]"
                >
                  Dados cadastrais
                </h3>
                <div className="flex flex-col gap-4 rounded-xl border border-[#1A1A1A] bg-[#111111] p-4">
                  <Field icon={Hash} label="CNPJ" value={cliente.cnpj} />
                  {cliente.email && (
                    <Field icon={Mail} label="E-mail" value={cliente.email} />
                  )}
                  <Field icon={MapPin} label="Endereço" value={cliente.endereco} />
                  <Field icon={Calendar} label="Início da assinatura" value={formatDate(cliente.inicio)} />
                </div>
              </section>

              {/* Stripe */}
              {cliente.stripeCustomerId && (
                <section aria-labelledby="stripe-heading">
                  <h3
                    id="stripe-heading"
                    className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#333333]"
                  >
                    Pagamento
                  </h3>
                  <div className="flex items-center justify-between rounded-xl border border-[#1A1A1A] bg-[#111111] p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-[#444444]">Stripe Customer ID</span>
                      <span className="font-mono text-xs text-[#888888]">{cliente.stripeCustomerId}</span>
                    </div>
                    <a
                      href={`https://dashboard.stripe.com/customers/${cliente.stripeCustomerId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-md border border-[#2A2A2A] px-3 py-1.5 text-[11px] font-semibold text-[#666666] transition-colors hover:border-[#F97316]/40 hover:text-[#F97316]"
                    >
                      <ExternalLink size={11} aria-hidden="true" />
                      Ver no Stripe
                    </a>
                  </div>
                </section>
              )}

              {/* Plays recentes */}
              {recentPlays.length > 0 && (
                <section aria-labelledby="plays-heading">
                  <h3
                    id="plays-heading"
                    className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#333333]"
                  >
                    Plays recentes
                  </h3>
                  <ul
                    className="overflow-hidden rounded-xl border border-[#1A1A1A] bg-[#111111]"
                    role="list"
                  >
                    {recentPlays.map((play, i) => (
                      <li
                        key={play.id}
                        className={`flex items-center gap-3 px-4 py-3 ${
                          i < recentPlays.length - 1 ? "border-b border-[#1A1A1A]" : ""
                        }`}
                      >
                        <Play size={11} className="shrink-0 text-[#F97316]" aria-hidden="true" />
                        <span className="flex-1 truncate text-sm text-[#CCCCCC]">
                          {play.musica}
                        </span>
                        <span className="shrink-0 text-[11px] text-[#444444]">
                          {formatDatetime(play.tocadoEm)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#1A1A1A] px-5 py-4">
          {cancelError && (
            <p className="mb-3 text-center text-xs text-[#EF4444]">{cancelError}</p>
          )}
          <button
            type="button"
            onClick={handleCancelar}
            disabled={!cliente || cliente.status === "cancelada" || canceling}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#EF4444]/30 py-2.5 text-sm font-bold text-[#EF4444] transition-all hover:bg-[#EF4444]/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {canceling ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <AlertTriangle size={14} aria-hidden="true" />
            )}
            {canceling ? "Cancelando…" : "Cancelar assinatura"}
          </button>
        </div>
      </aside>
    </>
  );
}
