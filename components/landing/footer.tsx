import Link from "next/link";
import { Music2 } from "lucide-react";

const NAV_LINKS = [
  { label: "Planos", href: "/#planos" },
  { label: "Demo", href: "/#demo" },
  { label: "FAQ", href: "/#faq" },
  { label: "Entrar", href: "/login" },
  { label: "Cadastrar", href: "/cadastro" },
] as const;

const LEGAL_LINKS = [
  { label: "Política de privacidade", href: "/privacidade" },
  { label: "Termos de uso", href: "/termos" },
  { label: "Validar licença", href: "/validar/00000000000000" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#151515] bg-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex w-fit items-center gap-2 text-white transition-opacity hover:opacity-75"
            >
              <Music2 size={20} className="text-[#F97316]" aria-hidden="true" />
              <span className="text-base font-bold tracking-tight">
                Gym Music <span className="text-[#F97316]">IA</span>
              </span>
            </Link>
            <p className="max-w-[220px] text-xs leading-relaxed text-[#444444]">
              Música licenciada para academias, gerada por inteligência
              artificial. Sem ECAD. Sem burocracia.
            </p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#F97316]" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#333333]">
                Licença direta do autor
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Links do rodapé">
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#333333]">
              Navegação
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#555555] transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Links legais">
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#333333]">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[#555555] transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-[#111111] pt-6 sm:flex-row">
          <p className="text-[11px] text-[#2A2A2A]">
            © {year} Gym Music IA. Todos os direitos reservados.
          </p>
          <p className="text-[11px] text-[#2A2A2A]">
            Licença musical direta do autor · CNPJ documentado · Sem ECAD
          </p>
        </div>
      </div>
    </footer>
  );
}
