import Link from "next/link";
import { ShieldCheck, Zap } from "lucide-react";

// Deterministic EQ bar params — computed once at build time, no hydration mismatch
const EQ_BAR_COUNT = 72;
const eqBars = Array.from({ length: EQ_BAR_COUNT }, (_, i) => {
  const phase = (i / EQ_BAR_COUNT) * Math.PI * 8;
  const height = Math.round(
    Math.abs(Math.sin(phase) * 65 + Math.cos(phase * 0.6) * 35) + 8
  );
  const dur = (0.7 + Math.abs(Math.sin(i * 0.37)) * 1.1).toFixed(2);
  const delay = (Math.abs(Math.cos(i * 0.29)) * 1.3).toFixed(2);
  return { height, dur, delay };
});

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6"
      aria-label="Seção principal"
    >
      {/* ── Radial orange glow ── */}
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[560px] w-[760px] rounded-full bg-[#F97316] blur-[130px]" />
      </div>

      {/* ── Diagonal accent streaks (top-right) ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-5%] top-[-2%] h-px w-[65%] origin-right -rotate-[8deg] bg-gradient-to-l from-[#F97316]/25 to-transparent" />
        <div className="absolute right-[-5%] top-[4%] h-px w-[45%] origin-right -rotate-[8deg] bg-gradient-to-l from-[#F97316]/12 to-transparent" />
        <div className="absolute right-[-5%] top-[8%] h-px w-[30%] origin-right -rotate-[8deg] bg-gradient-to-l from-[#F97316]/06 to-transparent" />
      </div>

      {/* ── EQ visualizer bars (bottom, decorative) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-52 items-end justify-center gap-[2.5px] overflow-hidden opacity-[0.08]"
      >
        {eqBars.map(({ height, dur, delay }, i) => (
          <div
            key={i}
            className="eq-bar w-[4.5px] rounded-t-sm bg-[#F97316]"
            style={
              {
                height: `${height}%`,
                "--eq-dur": `${dur}s`,
                "--eq-delay": `${delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex max-w-5xl flex-col items-center gap-7">

        {/* Badge */}
        <div
          className="hero-fade-up inline-flex items-center gap-2 rounded-full border border-[#F97316]/35 bg-[#F97316]/10 px-4 py-1.5"
          style={{ animationDelay: "0.08s" }}
        >
          <ShieldCheck size={13} className="text-[#F97316]" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F97316]">
            Sem ECAD — Licença direta do autor
          </span>
        </div>

        {/* Headline */}
        <h1
          className="hero-fade-up font-display text-[clamp(3.2rem,11vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight text-white"
          style={{ animationDelay: "0.2s" }}
        >
          A trilha sonora
          <br />
          <span className="text-[#F97316]">da sua academia</span>
        </h1>

        {/* Subheadline */}
        <p
          className="hero-fade-up max-w-[520px] text-base leading-relaxed text-[#999999] sm:text-[1.05rem]"
          style={{ animationDelay: "0.35s" }}
        >
          Músicas geradas por IA, curadas para treino intenso, com licença
          direta do autor. Sem burocracia, sem fiscalização do ECAD.
        </p>

        {/* CTAs */}
        <div
          className="hero-fade-up mt-1 flex flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.5s" }}
        >
          <Link
            href="/cadastro"
            className="group inline-flex min-h-[48px] items-center gap-2 rounded-md bg-[#F97316] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#EA6E0A] hover:shadow-[0_0_32px_rgba(249,115,22,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
          >
            <Zap
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Começar agora
          </Link>

          <Link
            href="#planos"
            className="min-h-[48px] inline-flex items-center text-sm text-[#666666] underline underline-offset-4 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
          >
            Ver planos e preços
          </Link>
        </div>
      </div>
    </section>
  );
}
