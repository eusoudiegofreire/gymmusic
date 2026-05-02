"use client";

import { useState } from "react";
import { Play, Music } from "lucide-react";
import { EstiloFilter } from "./estilo-filter";

export interface DashboardTrack {
  id: string;
  nome: string;
  estilo: string;
  duracao?: string;
}

// Mantido apenas como fallback de desenvolvimento
export const MOCK_MUSICAS: DashboardTrack[] = [
  { id: "1", nome: "Energia Total", estilo: "Funk" },
  { id: "2", nome: "Power Up", estilo: "Eletrônico" },
  { id: "3", nome: "Beast Mode", estilo: "Hip-Hop" },
];

interface MusicaListProps {
  tracks?: DashboardTrack[];
  selectedId?: string;
  onTrackSelect?: (track: DashboardTrack) => void;
}

export function MusicaList({ tracks, selectedId, onTrackSelect }: MusicaListProps) {
  const [activeEstilo, setActiveEstilo] = useState("Todos");

  const musicas = tracks ?? MOCK_MUSICAS;
  const ESTILOS = [...new Set(musicas.map((m) => m.estilo))];

  const filtered =
    activeEstilo === "Todos"
      ? musicas
      : musicas.filter((m) => m.estilo === activeEstilo);

  return (
    <div className="flex flex-col gap-4">
      <EstiloFilter estilos={ESTILOS} active={activeEstilo} onChange={setActiveEstilo} />

      <div className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#1A1A1A]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Music size={24} className="text-[#2A2A2A]" aria-hidden="true" />
            <p className="text-sm text-[#333333]">Nenhuma música neste estilo ainda</p>
          </div>
        ) : (
          <ul role="list">
            {filtered.map((track, i) => {
              const isSelected = track.id === selectedId;
              const isLast = i === filtered.length - 1;
              return (
                <li key={track.id}>
                  <button
                    type="button"
                    onClick={() => onTrackSelect?.(track)}
                    aria-pressed={isSelected}
                    className={`group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all duration-150 ${
                      isSelected
                        ? "border-l-2 border-[#F97316] bg-[#F97316]/[0.07] pl-[14px]"
                        : "border-l-2 border-transparent hover:bg-[#222222]"
                    } ${!isLast ? "border-b border-b-[#1E1E1E]" : ""}`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isSelected
                          ? "bg-[#F97316] text-white"
                          : "bg-[#252525] text-[#444444] group-hover:bg-[#2E2E2E] group-hover:text-[#888888]"
                      }`}
                      aria-hidden="true"
                    >
                      <Play size={11} className="translate-x-px" />
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={`truncate text-sm font-semibold ${
                          isSelected ? "text-white" : "text-[#CCCCCC]"
                        }`}
                      >
                        {track.nome}
                      </span>
                      <span className="text-[11px] text-[#555555]">{track.estilo}</span>
                    </div>

                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#444444]">
                      {track.duracao}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-right text-[11px] text-[#2A2A2A]">
        {filtered.length} de {musicas.length} músicas
      </p>
    </div>
  );
}
