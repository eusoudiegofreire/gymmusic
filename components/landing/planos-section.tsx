import Link from "next/link";
import { Check, X, Star, ShieldCheck } from "lucide-react";

const PLANOS = [
  {
    id: "basico",
    nome: "Básico",
    preco: "97",
    descricao: "Para academias que querem começar com música licenciada e zero risco jurídico.",
    popular: false,
    features: [
      { label: "Catálogo completo de músicas", ok: true },
      { label: "1 estabelecimento licenciado", ok: true },
      { label: "Licença com CNPJ documentada", ok: true },
      { label: "Página pública de validação", ok: true },
      { label: "Suporte por e-mail", ok: true },
      { label: "Até 3 estabelecimentos", ok: false },
      { label: "Suporte prioritário (WhatsApp)", ok: false },
    ],
    cta: "Assinar Básico",
  },
  {
    id: "pro",
    nome: "Pro",
    preco: "197",
    descricao: "Para redes e academias que precisam de cobertura ampla e atendimento prioritário.",
    popular: true,
    features: [
      { label: "Tudo do plano Básico", ok: true },
      { label: "Até 3 estabelecimentos", ok: true },
      { label: "Licença multi-CNPJ", ok: true },
      { label: "Página pública de validação", ok: true },
      { label: "Suporte prioritário (WhatsApp)", ok: true },
      { label: "Relatório mensal de execução", ok: true },
      { label: "Novidades em primeira mão", ok: true },
    ],
    cta: "Assinar Pro",
  },
] as const;

export function PlanosSection() {
  return (
    <section
      id="planos"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6"
      aria-labelledby="planos-heading"
    >
      {/* Top divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#F97316]/20 to-transparent"
      />

      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="scroll-reveal mb-14 flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F97316]">
            Planos
          </span>
          <h2
            id="planos-heading"
            className="font-display text-[clamp(2rem,6vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-white"
          >
            Escolha o plano
            <br />
            <span className="text-[#F97316]">certo para você</span>
          </h2>
          <p className="max-w-sm text-sm text-[#999999]">
            Sem contrato de fidelidade. Cancele quando quiser.
            Todos os planos incluem licença documentada.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-start">
          {PLANOS.map((plano, i) => (
            <article
              key={plano.id}
              className={`scroll-reveal group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 ${
                plano.popular
                  ? "border-[#F97316]/50 bg-[#1A1A1A] shadow-[0_0_56px_rgba(249,115,22,0.13)] hover:shadow-[0_0_72px_rgba(249,115,22,0.2)]"
                  : "border-[#2A2A2A] bg-[#141414] hover:border-[#F97316]/20 hover:shadow-[0_0_32px_rgba(249,115,22,0.06)]"
              }`}
              style={{ animationDelay: `${0.08 + i * 0.14}s` }}
            >
              {/* Popular badge — full-width banner */}
              {plano.popular && (
                <div className="flex items-center justify-center gap-1.5 bg-[#F97316] py-2">
                  <Star size={11} className="fill-white text-white" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    Mais popular
                  </span>
                  <Star size={11} className="fill-white text-white" aria-hidden="true" />
                </div>
              )}

              {/* Top orange accent — only on basic */}
              {!plano.popular && (
                <div className="h-[3px] w-full bg-gradient-to-r from-[#333333] via-[#444444] to-[#333333] opacity-60" />
              )}

              <div className="flex flex-1 flex-col gap-6 p-7">
                {/* Plan name + description */}
                <div>
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-white">
                    {plano.nome}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#777777]">
                    {plano.descricao}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1">
                  <span className="text-sm font-semibold text-[#777777]">R$</span>
                  <span
                    className={`font-display text-[3.8rem] font-black leading-none tracking-tight ${
                      plano.popular ? "text-[#F97316]" : "text-white"
                    }`}
                  >
                    {plano.preco}
                  </span>
                  <span className="mb-2 text-sm text-[#555555]">/mês</span>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-[#222222]" />

                {/* Feature list */}
                <ul className="flex flex-1 flex-col gap-3" role="list">
                  {plano.features.map(({ label, ok }) => (
                    <li key={label} className="flex items-start gap-2.5">
                      {ok ? (
                        <Check
                          size={15}
                          className={`mt-0.5 shrink-0 ${plano.popular ? "text-[#F97316]" : "text-[#888888]"}`}
                          aria-label="Incluído"
                        />
                      ) : (
                        <X
                          size={15}
                          className="mt-0.5 shrink-0 text-[#333333]"
                          aria-label="Não incluído"
                        />
                      )}
                      <span
                        className={`text-sm leading-snug ${
                          ok
                            ? plano.popular
                              ? "text-[#CCCCCC]"
                              : "text-[#AAAAAA]"
                            : "text-[#444444] line-through"
                        }`}
                      >
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/cadastro?plano=${plano.id}`}
                  className={`mt-auto flex min-h-[48px] w-full items-center justify-center rounded-md text-sm font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] ${
                    plano.popular
                      ? "bg-[#F97316] text-white hover:bg-[#EA6E0A] hover:shadow-[0_0_24px_rgba(249,115,22,0.4)]"
                      : "border border-[#333333] text-white hover:border-[#F97316]/40 hover:bg-[#1A1A1A]"
                  }`}
                >
                  {plano.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Guarantee strip */}
        <div className="scroll-reveal mt-8 flex flex-col items-center gap-2 text-center" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 text-[#555555]">
            <ShieldCheck size={14} aria-hidden="true" />
            <span className="text-xs">
              Garantia de 7 dias · Pagamento seguro via Stripe · Licença ativa imediatamente após confirmação
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
