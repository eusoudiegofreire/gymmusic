"use client";

interface EstiloFilterProps {
  estilos: string[];
  active: string;
  onChange: (estilo: string) => void;
}

export function EstiloFilter({ estilos, active, onChange }: EstiloFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Filtrar por estilo">
      {["Todos", ...estilos].map((estilo) => {
        const isActive = estilo === active;
        return (
          <button
            key={estilo}
            type="button"
            onClick={() => onChange(estilo)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
              isActive
                ? "bg-[#F97316] text-white shadow-[0_0_12px_rgba(249,115,22,0.3)]"
                : "border border-[#2A2A2A] text-[#555555] hover:border-[#F97316]/30 hover:text-[#999999]"
            }`}
          >
            {estilo}
          </button>
        );
      })}
    </div>
  );
}
