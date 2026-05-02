import { BrainCircuit, BadgeCheck, ListMusic, ArrowDown } from "lucide-react";

const pillars = [
  {
    icon: BrainCircuit,
    label: "Tecnologia",
    title: "Gerada por IA",
    text: "Músicas criadas especificamente para treino, com ritmo e intensidade calibrados para cada estilo de workout — funk, eletrônico, hip-hop.",
    highlight: "Alta intensidade por padrão",
  },
  {
    icon: BadgeCheck,
    label: "Jurídico",
    title: "Licença direta",
    text: "Contrato direto com o criador, sem intermediários. Seu CNPJ protegido com documentação clara e auditável a qualquer momento.",
    highlight: "Zero risco com o ECAD",
  },
  {
    icon: ListMusic,
    label: "Curadoria",
    title: "Playlist de treino",
    text: "Cada faixa passa por curadoria humana antes de entrar no catálogo. Só o que funciona no chão da academia vai para a sua playlist.",
    highlight: "Qualidade garantida",
  },
] as const;

export function SolucaoSection() {
  return (
    <section
      id="solucao"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6"
      aria-labelledby="solucao-heading"
    >
      {/* Bottom-center orange glow — espelhado do hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-[#F97316] opacity-[0.055] blur-[110px]"
      />

      <div className="mx-auto max-w-6xl">
        {/* Bridge connector entre Problema e Solução */}
        <div className="scroll-reveal mb-14 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-px bg-gradient-to-b from-[#333333] to-[#F97316]/60" />
            <div className="flex items-center justify-center rounded-full border border-[#F97316]/25 bg-[#F97316]/08 p-1.5">
              <ArrowDown size={13} className="text-[#F97316]" aria-hidden="true" />
            </div>
          </div>

          {/* Section header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F97316]">
              A solução
            </span>
            <h2
              id="solucao-heading"
              className="font-display text-[clamp(2rem,6vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-white"
            >
              Tudo que sua academia
              <br />
              <span className="text-[#F97316]">precisa, num só lugar</span>
            </h2>
          </div>
        </div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {pillars.map(({ icon: Icon, label, title, text, highlight }, i) => (
            <article
              key={label}
              className="scroll-reveal group relative flex flex-col gap-5 overflow-hidden rounded-lg border border-[#333333] bg-[#1A1A1A] p-6 pt-5 transition-all duration-300 hover:border-[#F97316]/35 hover:shadow-[0_0_32px_rgba(249,115,22,0.08)]"
              style={{ animationDelay: `${0.1 + i * 0.13}s` }}
            >
              {/* Orange top-border accent */}
              <div className="absolute left-0 right-0 top-0 h-[3px] rounded-t-lg bg-gradient-to-r from-[#F97316]/60 via-[#F97316] to-[#F97316]/60 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Label */}
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#555555]">
                {label}
              </span>

              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#F97316]/10 ring-1 ring-[#F97316]/20 transition-all duration-300 group-hover:bg-[#F97316]/18 group-hover:ring-[#F97316]/35">
                <Icon
                  size={22}
                  className="text-[#F97316] transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
              </div>

              {/* Title */}
              <h3 className="font-display text-[1.6rem] font-black uppercase leading-none tracking-tight text-white">
                {title}
              </h3>

              {/* Description */}
              <p className="flex-1 text-sm leading-relaxed text-[#999999]">{text}</p>

              {/* Benefit highlight */}
              <div className="flex items-center gap-2 rounded-md border border-[#F97316]/20 bg-[#F97316]/06 px-3 py-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                <span className="text-xs font-semibold text-[#F97316]">{highlight}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
