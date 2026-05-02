import { FaqAccordion } from "./faq-accordion";

const FAQ_ITEMS = [
  {
    q: "O que é o ECAD e por que não preciso pagar?",
    a: "O ECAD (Escritório Central de Arrecadação e Distribuição) cobra direitos autorais de músicas de artistas cadastrados. Como as músicas do Gym Music IA são geradas por inteligência artificial e licenciadas diretamente pelo autor do sistema, não há nenhuma obrigação de pagamento ao ECAD.",
  },
  {
    q: "As músicas são realmente geradas por IA?",
    a: "Sim. Todas as faixas são criadas com modelos de inteligência artificial usando prompts especializados para diferentes estilos de treino. Cada música passa por curadoria humana antes de entrar no catálogo, garantindo qualidade e adequação ao ambiente da academia.",
  },
  {
    q: "Como funciona a licença do CNPJ?",
    a: "Ao assinar, seu CNPJ e o endereço do estabelecimento são registrados na plataforma. Você recebe uma licença digital auditável e uma página pública (/validar/[cnpj]) onde qualquer pessoa pode verificar em tempo real que seu estabelecimento está regularizado.",
  },
  {
    q: "Posso usar em mais de uma academia?",
    a: "O plano Básico cobre 1 estabelecimento licenciado. O plano Pro permite até 3 CNPJs diferentes. Para redes com mais de 3 unidades, entre em contato para um plano customizado.",
  },
  {
    q: "Como cancelo minha assinatura?",
    a: "Você pode cancelar a qualquer momento diretamente pelo painel da academia, sem precisar falar com ninguém. O acesso fica ativo até o final do período já pago. Sem multas, sem taxas de cancelamento.",
  },
  {
    q: "A licença é aceita em caso de fiscalização do ECAD?",
    a: "Sim. A licença é um documento legal emitido diretamente pelo autor das obras. Em caso de fiscalização, você apresenta a URL pública de validação (/validar/[cnpj]) que comprova, em tempo real, a regularidade da sua licença de uso.",
  },
] satisfies { q: string; a: string }[];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6"
      aria-labelledby="faq-heading"
    >
      {/* Top divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#333333] to-transparent"
      />

      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <div className="scroll-reveal mb-10 flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#333333] bg-[#1A1A1A] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777777]">
            Perguntas frequentes
          </span>
          <h2
            id="faq-heading"
            className="font-display text-[clamp(2rem,6vw,3.5rem)] font-black uppercase leading-[0.92] tracking-tight text-white"
          >
            Ainda tem
            <br />
            <span className="text-[#999999]">dúvidas?</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="scroll-reveal" style={{ animationDelay: "0.12s" }}>
          <FaqAccordion items={FAQ_ITEMS} />
        </div>

        {/* Bottom CTA nudge */}
        <p
          className="scroll-reveal mt-8 text-center text-sm text-[#555555]"
          style={{ animationDelay: "0.22s" }}
        >
          Ainda ficou alguma dúvida?{" "}
          <a
            href="mailto:contato@gymmusicia.com.br"
            className="text-[#F97316] underline underline-offset-4 hover:text-[#EA6E0A] transition-colors"
          >
            Fale com a gente
          </a>
        </p>
      </div>
    </section>
  );
}
