import { Receipt, Radio, ShieldAlert } from "lucide-react";

const pains = [
  {
    number: "01",
    icon: Receipt,
    title: "Fiscalização cara demais",
    text: "O ECAD pode cobrar valores altos por músicas tocadas no seu estabelecimento, com pouco controle sobre o que você deve pagar e sem transparência no cálculo.",
  },
  {
    number: "02",
    icon: Radio,
    title: "Músicas sem energia para treino",
    text: "Rádios comuns e playlists genéricas não foram feitas para academia. Sua grade de treino merece uma trilha sonora de alta intensidade, não o que toca no elevador.",
  },
  {
    number: "03",
    icon: ShieldAlert,
    title: "Risco jurídico constante",
    text: "Tocar músicas sem licença expõe seu negócio a multas e processos. Documentação clara de uso é obrigatória — não é detalhe, é proteção do seu CNPJ.",
  },
] as const;

export function ProblemaSection() {
  return (
    <section
      id="problema"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6"
      aria-labelledby="problema-heading"
    >
      {/* Subtle top divider glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#F97316]/20 to-transparent"
      />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="scroll-reveal mb-14 flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EF4444]/30 bg-[#EF4444]/08 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#EF4444]">
            O problema
          </span>
          <h2
            id="problema-heading"
            className="font-display text-[clamp(2rem,6vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-white"
          >
            O que toda academia
            <br />
            <span className="text-[#999999]">enfrenta todo mês</span>
          </h2>
        </div>

        {/* Pain cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {pains.map(({ number, icon: Icon, title, text }, i) => (
            <article
              key={number}
              className="scroll-reveal group relative flex flex-col gap-5 rounded-lg border border-[#333333] bg-[#1A1A1A] p-6 transition-all duration-300 hover:border-[#F97316]/30 hover:shadow-[0_0_28px_rgba(249,115,22,0.07)]"
              style={{ animationDelay: `${0.1 + i * 0.12}s` }}
            >
              {/* Card number */}
              <span className="absolute right-5 top-5 font-display text-5xl font-black leading-none text-[#ffffff05] select-none">
                {number}
              </span>

              {/* Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#EF4444]/10 ring-1 ring-[#EF4444]/20 transition-all duration-300 group-hover:bg-[#EF4444]/15">
                <Icon
                  size={20}
                  className="text-[#EF4444] transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold leading-snug text-white">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[#999999]">{text}</p>
              </div>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-6 right-6 h-px scale-x-0 rounded-full bg-[#F97316]/40 transition-transform duration-300 group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
