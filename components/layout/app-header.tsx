import Link from "next/link";
import { Music2 } from "lucide-react";

interface AppHeaderProps {
  ctaHref?: string;
  ctaLabel?: string;
}

export function AppHeader({
  ctaHref = "/cadastro",
  ctaLabel = "Começar agora",
}: AppHeaderProps) {
  return (
    <header className="w-full border-b border-[#333333] bg-[#0A0A0A]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <Music2 size={22} className="text-[#F97316]" />
          <span className="text-lg font-bold tracking-tight">
            Gym Music <span className="text-[#F97316]">IA</span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-[#999999]">
          <Link href="/#planos" className="hover:text-white transition-colors">
            Planos
          </Link>
          <Link href="/#faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            Entrar
          </Link>
        </nav>

        <Link
          href={ctaHref}
          className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA6E0A] transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
