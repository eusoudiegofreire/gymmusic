"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Music2, Users, Music, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Visão Geral", href: "/admin", icon: LayoutDashboard },
  { label: "Músicas", href: "/admin/musicas", icon: Music2 },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
] as const;

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
        active
          ? "bg-[#F97316]/10 text-[#F97316]"
          : "text-[#555555] hover:bg-[#141414] hover:text-[#CCCCCC]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        size={16}
        className={`shrink-0 ${active ? "text-[#F97316]" : "text-[#444444]"}`}
        aria-hidden="true"
      />
      {label}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const navLinks = (onClick?: () => void) =>
    NAV_ITEMS.map((item) => (
      <NavLink
        key={item.href}
        href={item.href}
        icon={item.icon}
        label={item.label}
        active={isActive(item.href)}
        onClick={onClick}
      />
    ));

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-[#1A1A1A] bg-[#0A0A0A] lg:flex">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-[#1A1A1A] px-4">
          <Music size={18} className="text-[#F97316]" aria-hidden="true" />
          <span className="text-sm font-bold tracking-tight text-white">
            Gym Music <span className="text-[#F97316]">IA</span>
          </span>
          <span className="ml-auto rounded bg-[#F97316]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#F97316]">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav aria-label="Navegação admin" className="flex flex-col gap-1 p-3">
          {navLinks()}
        </nav>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="flex h-14 items-center justify-between border-b border-[#1A1A1A] bg-[#0A0A0A] px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Music size={18} className="text-[#F97316]" aria-hidden="true" />
          <span className="text-sm font-bold tracking-tight text-white">
            Gym Music <span className="text-[#F97316]">IA</span>
          </span>
          <span className="rounded bg-[#F97316]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#F97316]">
            Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[#222222] text-[#666666] transition-colors hover:border-[#333333] hover:text-white"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-[#1A1A1A] bg-[#0A0A0A]">
            <div className="flex h-14 items-center justify-between border-b border-[#1A1A1A] px-4">
              <div className="flex items-center gap-2">
                <Music size={18} className="text-[#F97316]" aria-hidden="true" />
                <span className="text-sm font-bold tracking-tight text-white">
                  Gym Music <span className="text-[#F97316]">IA</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="flex h-8 w-8 items-center justify-center rounded-md text-[#555555] transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <nav aria-label="Navegação admin" className="flex flex-col gap-1 p-3">
              {navLinks(() => setMobileOpen(false))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
