"use client";

import { useState, useId } from "react";
import { Check, Loader2, ShieldCheck, Star, AlertCircle } from "lucide-react";

type PlanoId = "basico" | "pro";

const PLANOS = {
  basico: {
    nome: "Básico",
    preco: "97",
    highlights: [
      "Catálogo completo de músicas",
      "1 estabelecimento licenciado",
      "Licença com CNPJ documentada",
      "Suporte por e-mail",
    ],
    popular: false,
  },
  pro: {
    nome: "Pro",
    preco: "197",
    highlights: [
      "Tudo do plano Básico",
      "Até 3 estabelecimentos",
      "Licença multi-CNPJ",
      "Suporte prioritário (WhatsApp)",
      "Relatório mensal de execução",
    ],
    popular: true,
  },
} as const;

interface CadastroStep3Props {
  planoInicial?: PlanoId;
  onBack: () => void;
  /** Deve lançar Error em caso de falha para exibir mensagem inline. */
  onSubmit: (plano: PlanoId) => Promise<void>;
}

export function CadastroStep3({ planoInicial = "basico", onBack, onSubmit }: CadastroStep3Props) {
  const [plano, setPlano] = useState<PlanoId>(planoInicial);
  const [termos, setTermos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termosError, setTermosError] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const termosId = useId();

  const planoAtual = PLANOS[plano];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termos) { setTermosError(true); return; }
    setServerError(null);
    setLoading(true);
    try {
      await onSubmit(plano);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao processar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Plan toggle */}
      <div className="flex rounded-md border border-[#2A2A2A] p-1">
        {(["basico", "pro"] as PlanoId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setPlano(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
              plano === id
                ? "bg-[#F97316] text-white shadow-[0_0_16px_rgba(249,115,22,0.3)]"
                : "text-[#555555] hover:text-[#999999]"
            }`}
          >
            {PLANOS[id].popular && <Star size={10} className={plano === id ? "fill-white text-white" : "fill-[#555555] text-[#555555]"} aria-hidden="true" />}
            {PLANOS[id].nome}
          </button>
        ))}
      </div>

      {/* Plan summary card */}
      <div
        className={`rounded-xl border p-5 transition-all duration-300 ${
          planoAtual.popular
            ? "border-[#F97316]/40 bg-[#1A1A1A] shadow-[0_0_32px_rgba(249,115,22,0.1)]"
            : "border-[#252525] bg-[#141414]"
        }`}
      >
        {/* Price */}
        <div className="mb-4 flex items-end gap-1">
          <span className="text-sm font-semibold text-[#666666]">R$</span>
          <span className={`font-display text-5xl font-black leading-none tracking-tight ${planoAtual.popular ? "text-[#F97316]" : "text-white"}`}>
            {planoAtual.preco}
          </span>
          <span className="mb-1 text-sm text-[#444444]">/mês</span>
        </div>

        <div className="h-px w-full bg-[#222222] mb-4" />

        {/* Feature list */}
        <ul className="flex flex-col gap-2.5" role="list">
          {planoAtual.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check
                size={13}
                className={`mt-0.5 shrink-0 ${planoAtual.popular ? "text-[#F97316]" : "text-[#888888]"}`}
                aria-hidden="true"
              />
              <span className="text-xs leading-snug text-[#AAAAAA]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Guarantee note */}
      <div className="flex items-center gap-2 text-[#444444]">
        <ShieldCheck size={13} className="shrink-0" aria-hidden="true" />
        <span className="text-[11px]">Garantia de 7 dias · Pagamento seguro via Stripe</span>
      </div>

      {/* Erro server-side */}
      {serverError && (
        <div role="alert" className="flex items-start gap-2.5 rounded-md border border-[#EF4444]/20 bg-[#EF4444]/10 px-3.5 py-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#EF4444]" aria-hidden="true" />
          <p className="text-sm text-[#FCA5A5]">{serverError}</p>
        </div>
      )}

      {/* Terms checkbox */}
      <div className="flex flex-col gap-1">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            id={termosId}
            type="checkbox"
            checked={termos}
            onChange={(e) => { setTermos(e.target.checked); setTermosError(false); }}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#F97316]"
          />
          <span className="text-xs leading-relaxed text-[#555555]">
            Li e aceito os{" "}
            <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-[#F97316] underline underline-offset-4 hover:text-[#EA6E0A]">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-[#F97316] underline underline-offset-4 hover:text-[#EA6E0A]">
              Política de Privacidade
            </a>
          </span>
        </label>
        {termosError && (
          <p className="text-[11px] text-[#EF4444] pl-7" role="alert">Aceite os termos para continuar</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex h-[48px] flex-1 items-center justify-center rounded-md border border-[#2A2A2A] text-sm font-semibold text-[#666666] transition-all duration-200 hover:border-[#444444] hover:text-white disabled:pointer-events-none disabled:opacity-40"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex h-[48px] flex-[2] items-center justify-center gap-2 rounded-md bg-[#F97316] text-sm font-bold text-white transition-all duration-200 hover:bg-[#EA6E0A] hover:shadow-[0_0_24px_rgba(249,115,22,0.35)] disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              Criando conta…
            </>
          ) : (
            "Criar conta"
          )}
        </button>
      </div>
    </form>
  );
}
