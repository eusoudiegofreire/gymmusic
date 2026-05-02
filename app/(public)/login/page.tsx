import Link from "next/link";
import { Music2 } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Entrar — Gym Music IA",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
      {/* Ambient orange glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316] opacity-[0.05] blur-[120px]"
      />

      {/* Diagonal accent — top right */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-px w-1/2 origin-right -rotate-[10deg] bg-gradient-to-l from-[#F97316]/15 to-transparent" />
      </div>

      <div className="hero-fade-up relative z-10 w-full max-w-sm" style={{ animationDelay: "0.05s" }}>
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-75"
        >
          <Music2 size={22} className="text-[#F97316]" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight">
            Gym Music <span className="text-[#F97316]">IA</span>
          </span>
        </Link>

        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-[#222222] bg-[#0F0F0F] shadow-[0_0_60px_rgba(249,115,22,0.06)]">
          {/* Orange top border */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#F97316]/40 via-[#F97316] to-[#F97316]/40" />

          <div className="p-7">
            {/* Heading */}
            <div className="mb-7">
              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white">
                Entrar
              </h1>
              <p className="mt-1 text-sm text-[#555555]">
                Acesse o painel da sua academia
              </p>
            </div>

            <LoginForm next={next} />
          </div>
        </div>

        {/* Back to landing */}
        <p className="mt-6 text-center text-xs text-[#333333]">
          <Link href="/" className="transition-colors hover:text-[#999999]">
            ← Voltar para o início
          </Link>
        </p>
      </div>
    </main>
  );
}
