import { Headphones } from "lucide-react";
import { DemoPlayer } from "./demo-player";

export function DemoPlayerSection() {
  return (
    <section
      id="demo"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6"
      aria-labelledby="demo-heading"
    >
      {/* Top divider glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#F97316]/20 to-transparent"
      />

      {/* Centered background glow behind player */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316] opacity-[0.04] blur-[100px]"
      />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="scroll-reveal mb-12 flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F97316]">
            <Headphones size={12} aria-hidden="true" />
            Ouça antes de assinar
          </span>

          <h2
            id="demo-heading"
            className="font-display text-[clamp(2rem,6vw,4rem)] font-black uppercase leading-[0.92] tracking-tight text-white"
          >
            Soa como
            <br />
            <span className="text-[#F97316]">sua academia merece</span>
          </h2>

          <p className="max-w-md text-sm leading-relaxed text-[#999999]">
            Duas faixas de demonstração gratuita. Sem cadastro, sem cartão.
            O catálogo completo fica disponível após a assinatura.
          </p>
        </div>

        {/* Player — Client Component */}
        <div className="scroll-reveal" style={{ animationDelay: "0.15s" }}>
          <DemoPlayer />
        </div>

        {/* Bottom note */}
        <p className="scroll-reveal mt-6 text-center text-xs text-[#444444]" style={{ animationDelay: "0.25s" }}>
          Faixas de demonstração com duração reduzida · Catálogo completo disponível no plano assinante
        </p>
      </div>
    </section>
  );
}
