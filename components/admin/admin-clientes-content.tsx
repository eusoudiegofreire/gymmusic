"use client";

import { useState } from "react";
import { ClientesTable, type Cliente } from "@/components/admin/clientes-table";
import { ClienteDetailsDrawer } from "@/components/admin/cliente-details-drawer";

interface RecentPlay {
  id: string;
  musica: string;
  tocadoEm: string;
}

interface AdminClientesContentProps {
  clientes: Cliente[];
  playsByClienteId: Record<string, RecentPlay[]>;
}

export function AdminClientesContent({
  clientes,
  playsByClienteId,
}: AdminClientesContentProps) {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  return (
    <main className="flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#555555]">
          Gestão
        </p>
        <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
          Clientes
        </h1>
      </div>

      <ClientesTable clientes={clientes} onVerDetalhes={setSelectedCliente} />

      <ClienteDetailsDrawer
        cliente={selectedCliente}
        recentPlays={selectedCliente ? (playsByClienteId[selectedCliente.id] ?? []) : []}
        onClose={() => setSelectedCliente(null)}
      />
    </main>
  );
}
