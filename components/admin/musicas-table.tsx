"use client";

import { useState } from "react";
import { CheckCircle2, Pencil, Trash2, ChevronDown, Loader2 } from "lucide-react";
import type { MusicaFormData } from "./musica-form-modal";

export interface AdminMusica {
  id: string;
  nome: string;
  estilo: string;
  criadoEm: string;
  curadoPor: string | null;
  dataCuradoria: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface MusicasTableProps {
  musicas: AdminMusica[];
  onEdit?: (musica: MusicaFormData) => void;
  onDelete?: (musica: AdminMusica) => void;
  deletingId?: string | null;
}

export function MusicasTable({ musicas, onEdit, onDelete, deletingId }: MusicasTableProps) {
  const [activeEstilo, setActiveEstilo] = useState("Todos");

  const estilos = [...new Set(musicas.map((m) => m.estilo))].sort();
  const filtered =
    activeEstilo === "Todos"
      ? musicas
      : musicas.filter((m) => m.estilo === activeEstilo);

  const thClass =
    "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#555555]";
  const tdClass = "px-4 py-3.5 text-sm";

  return (
    <div className="flex flex-col gap-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={activeEstilo}
            onChange={(e) => setActiveEstilo(e.target.value)}
            className="appearance-none rounded-lg border border-[#2A2A2A] bg-[#141414] py-2 pl-3 pr-8 text-xs font-semibold text-[#999999] outline-none transition-colors focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30"
            aria-label="Filtrar por estilo"
          >
            <option value="Todos">Todos os estilos</option>
            {estilos.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#555555]"
            aria-hidden="true"
          />
        </div>

        <span className="text-[11px] text-[#333333]">
          {filtered.length} de {musicas.length} músicas
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#1A1A1A]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-sm text-[#333333]">Nenhuma música encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#222222] bg-[#141414]">
                  <th className={thClass}>Nome</th>
                  <th className={thClass}>Estilo</th>
                  <th className={thClass}>Criado em</th>
                  <th className={thClass}>Curadoria</th>
                  <th className={`${thClass} text-right`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((musica, i) => {
                  const isDeleting = deletingId === musica.id;
                  return (
                    <tr
                      key={musica.id}
                      className={`transition-colors hover:bg-[#1F1F1F] ${
                        isDeleting ? "opacity-40" : ""
                      } ${i < filtered.length - 1 ? "border-b border-[#1A1A1A]" : ""}`}
                    >
                      <td className={`${tdClass} font-semibold text-white`}>
                        {musica.nome}
                      </td>

                      <td className={tdClass}>
                        <span className="rounded-full border border-[#2A2A2A] bg-[#141414] px-2.5 py-0.5 text-[11px] font-semibold text-[#888888]">
                          {musica.estilo}
                        </span>
                      </td>

                      <td className={`${tdClass} text-[#555555]`}>
                        {formatDate(musica.criadoEm)}
                      </td>

                      <td className={tdClass}>
                        {musica.curadoPor ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-2.5 py-0.5">
                            <CheckCircle2 size={11} className="text-[#22C55E]" aria-hidden="true" />
                            <span className="text-[11px] font-semibold text-[#22C55E]">Curado</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#333333]">—</span>
                        )}
                      </td>

                      <td className={`${tdClass} text-right`}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit?.({ id: musica.id, nome: musica.nome, estilo: musica.estilo })}
                            disabled={isDeleting}
                            aria-label={`Editar ${musica.nome}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#2A2A2A] text-[#555555] transition-colors hover:border-[#F97316]/40 hover:text-[#F97316] disabled:pointer-events-none disabled:opacity-40"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete?.(musica)}
                            disabled={isDeleting}
                            aria-label={`Excluir ${musica.nome}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#2A2A2A] text-[#555555] transition-colors hover:border-[#EF4444]/40 hover:text-[#EF4444] disabled:pointer-events-none disabled:opacity-40"
                          >
                            {isDeleting ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
