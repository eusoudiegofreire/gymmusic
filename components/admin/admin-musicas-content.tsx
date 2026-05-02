"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { MusicasTable, type AdminMusica } from "@/components/admin/musicas-table";
import { MusicaFormModal, type MusicaFormData } from "@/components/admin/musica-form-modal";
import { excluirMusica } from "@/app/actions/admin-musicas";

interface AdminMusicasContentProps {
  musicas: AdminMusica[];
}

export function AdminMusicasContent({ musicas }: AdminMusicasContentProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMusica, setEditingMusica] = useState<MusicaFormData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingMusica(null);
    setModalOpen(true);
  };

  const openEdit = (musica: MusicaFormData) => {
    setEditingMusica(musica);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMusica(null);
  };

  const handleDelete = async (musica: AdminMusica) => {
    if (!window.confirm(`Excluir "${musica.nome}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(musica.id);
    await excluirMusica(musica.id);
    setDeletingId(null);
    router.refresh();
  };

  return (
    <main className="flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#555555]">
            Catálogo
          </p>
          <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            Músicas
          </h1>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-[#F97316] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#EA6E0A] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-[0.98]"
        >
          <Plus size={16} aria-hidden="true" />
          Adicionar Música
        </button>
      </div>

      <MusicasTable
        musicas={musicas}
        onEdit={openEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <MusicaFormModal
        isOpen={modalOpen}
        musica={editingMusica}
        onClose={closeModal}
      />
    </main>
  );
}
