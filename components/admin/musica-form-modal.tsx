"use client";

import { useState, useRef, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2, AlertCircle } from "lucide-react";
import { adicionarMusica, editarMusica } from "@/app/actions/admin-musicas";

const ESTILOS = ["Funk", "Eletrônico", "Hip-Hop", "Pop", "Rock"] as const;

export interface MusicaFormData {
  id?: string;
  nome: string;
  estilo: string;
}

interface MusicaFormModalProps {
  isOpen: boolean;
  musica?: MusicaFormData | null;
  onClose: () => void;
}

export function MusicaFormModal({ isOpen, musica, onClose }: MusicaFormModalProps) {
  const router = useRouter();
  const isEdit = !!musica?.id;

  const [nome, setNome] = useState("");
  const [estilo, setEstilo] = useState<string>(ESTILOS[0]);
  const [letra, setLetra] = useState("");
  const [prompt, setPrompt] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const nomeId = useId();
  const estiloId = useId();
  const letraId = useId();
  const promptId = useId();
  const arquivoId = useId();

  useEffect(() => {
    if (musica) {
      setNome(musica.nome);
      setEstilo(musica.estilo ?? ESTILOS[0]);
    } else {
      setNome("");
      setEstilo(ESTILOS[0]);
      setLetra("");
      setPrompt("");
      setArquivo(null);
    }
    setServerError(null);
  }, [musica, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("estilo", estilo);
    formData.append("letra", letra);
    formData.append("prompt", prompt);
    if (arquivo) formData.append("arquivo", arquivo);

    const result = isEdit && musica?.id
      ? await editarMusica(musica.id, formData)
      : await adicionarMusica(formData);

    setLoading(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    router.refresh();
    onClose();
  };

  if (!isOpen) return null;

  const labelClass = "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#666666]";
  const inputClass =
    "w-full rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder-[#444444] outline-none transition-all duration-200 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[#222222] bg-[#0F0F0F] shadow-[0_0_80px_rgba(249,115,22,0.1)]">
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#F97316]/40 via-[#F97316] to-[#F97316]/40" />

        <div className="flex items-center justify-between border-b border-[#1A1A1A] px-6 py-4">
          <h2
            id="modal-title"
            className="font-display text-lg font-black uppercase tracking-tight text-white"
          >
            {isEdit ? "Editar Música" : "Adicionar Música"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#555555] transition-colors hover:bg-[#1A1A1A] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <form
          id="musica-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 overflow-y-auto px-6 py-6"
          style={{ maxHeight: "calc(100dvh - 200px)" }}
        >
          {serverError && (
            <div role="alert" className="flex items-start gap-2.5 rounded-md border border-[#EF4444]/20 bg-[#EF4444]/10 px-3.5 py-3">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#EF4444]" aria-hidden="true" />
              <p className="text-sm text-[#FCA5A5]">{serverError}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor={nomeId} className={labelClass}>
              Nome da música <span aria-hidden="true" className="text-[#EF4444]">*</span>
            </label>
            <input
              id={nomeId}
              type="text"
              required
              placeholder="Ex: Energia Total"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={estiloId} className={labelClass}>
              Estilo <span aria-hidden="true" className="text-[#EF4444]">*</span>
            </label>
            <select
              id={estiloId}
              required
              value={estilo}
              onChange={(e) => setEstilo(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              {ESTILOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={letraId} className={labelClass}>Letra</label>
            <textarea
              id={letraId}
              rows={5}
              placeholder="Cole aqui a letra completa da música..."
              value={letra}
              onChange={(e) => setLetra(e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={promptId} className={labelClass}>Prompt de geração</label>
            <textarea
              id={promptId}
              rows={3}
              placeholder="Prompt enviado à IA para gerar esta faixa..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`${inputClass} resize-y`}
            />
            <p className="text-[11px] text-[#3A3A3A]">
              Registre o prompt original para fins de prova de autoria.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={labelClass} id={arquivoId}>
              Arquivo de áudio {!isEdit && <span aria-hidden="true" className="text-[#EF4444]">*</span>}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              aria-labelledby={arquivoId}
              onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 rounded-md border border-dashed border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3 text-left transition-colors hover:border-[#F97316]/40 hover:bg-[#0F0F0F]"
            >
              <Upload size={16} className="shrink-0 text-[#555555]" aria-hidden="true" />
              <span className="text-sm text-[#555555]">
                {arquivo ? (
                  <span className="text-[#CCCCCC]">{arquivo.name}</span>
                ) : (
                  "Clique para selecionar um arquivo de áudio"
                )}
              </span>
            </button>
            {arquivo && (
              <p className="text-[11px] text-[#444444]">
                {(arquivo.size / 1_048_576).toFixed(1)} MB · {arquivo.type}
              </p>
            )}
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-[#1A1A1A] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-10 items-center rounded-md border border-[#2A2A2A] px-4 text-sm font-semibold text-[#666666] transition-colors hover:border-[#444444] hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="musica-form"
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-md bg-[#F97316] px-5 text-sm font-bold text-white transition-all hover:bg-[#EA6E0A] hover:shadow-[0_0_20px_rgba(249,115,22,0.35)] disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                Salvando…
              </>
            ) : (
              isEdit ? "Salvar alterações" : "Adicionar música"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
