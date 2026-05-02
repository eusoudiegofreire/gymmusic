import Link from "next/link";
import { Music2, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  razaoSocial: string;
}

export function DashboardHeader({ razaoSocial }: DashboardHeaderProps) {
  return (
    <header className="w-full border-b border-[#333333] bg-[#0A0A0A]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <Music2 size={22} className="text-[#F97316]" />
          <span className="text-lg font-bold tracking-tight">
            Gym Music <span className="text-[#F97316]">IA</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-[#999999] truncate max-w-[200px]">
            {razaoSocial}
          </span>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-[#333333] px-3 py-1.5 text-sm text-[#999999] hover:border-[#F97316] hover:text-white transition-colors"
          >
            <LogOut size={15} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
