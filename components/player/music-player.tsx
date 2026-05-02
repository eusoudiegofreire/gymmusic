"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music2,
  AlertCircle,
} from "lucide-react";

export interface Track {
  id: string;
  nome: string;
  estilo: string;
}

interface MusicPlayerProps {
  track: Track | null;
  onPrevious?: () => void;
  onNext?: () => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds) || seconds === 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer({ track, onPrevious, onNext }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [audioError, setAudioError] = useState(false);

  // Troca de faixa: recarrega src, reseta estado
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(false);

    if (track) {
      audio.src = `/api/audio/${track.id}`;
      audio.load();
    } else {
      audio.removeAttribute("src");
    }
  }, [track?.id]);

  // Sincroniza volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const handlePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    if (playing) {
      audio.pause();
    } else {
      setAudioError(false);
      try {
        await audio.play();
      } catch {
        setAudioError(true);
      }
    }
  }, [playing, track]);

  const handleSeek = useCallback((value: number) => {
    const audio = audioRef.current;
    setProgress(value);
    if (audio && isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (value / 100) * audio.duration;
    }
  }, []);

  return (
    <div className="w-full rounded-lg border border-[#333333] bg-[#1A1A1A] p-4 sm:p-6">
      {/* Elemento de áudio oculto */}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setCurrentTime(el.currentTime);
          if (el.duration > 0) setProgress((el.currentTime / el.duration) * 100);
        }}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          setCurrentTime(0);
          onNext?.();
        }}
        onError={() => {
          setAudioError(true);
          setPlaying(false);
        }}
      />

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Capa placeholder */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-[#0A0A0A] border border-[#333333]">
          <Music2 size={32} className="text-[#F97316]" />
        </div>

        {/* Info + controles */}
        <div className="flex flex-1 flex-col gap-3 w-full">
          {/* Nome e estilo */}
          <div className="text-center sm:text-left">
            {track ? (
              <>
                <p className="text-base font-semibold text-white truncate">{track.nome}</p>
                <p className="text-sm text-[#999999]">{track.estilo}</p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-[#999999]">Nenhuma faixa selecionada</p>
                <p className="text-sm text-[#333333]">—</p>
              </>
            )}
          </div>

          {/* Erro de áudio */}
          {audioError && (
            <div className="flex items-center gap-1.5 text-[#EF4444]">
              <AlertCircle size={13} aria-hidden="true" />
              <span className="text-xs">Erro ao carregar áudio. Tente novamente.</span>
            </div>
          )}

          {/* Barra de progresso */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#999999] w-8 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 h-1.5 rounded-full bg-[#333333]">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[#F97316] transition-all"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                aria-label="Progresso da música"
                disabled={!track}
              />
            </div>
            <span className="text-xs text-[#999999] w-8 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controles de reprodução */}
          <div className="flex items-center justify-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!onPrevious}
                className="text-[#999999] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Faixa anterior"
              >
                <SkipBack size={20} />
              </button>

              <button
                type="button"
                onClick={handlePlayPause}
                disabled={!track}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316] hover:bg-[#EA6E0A] text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label={playing ? "Pausar" : "Reproduzir"}
              >
                {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={onNext}
                disabled={!onNext}
                className="text-[#999999] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Próxima faixa"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2">
              <Volume2 size={16} className="text-[#999999]" aria-hidden="true" />
              <div className="relative w-20 h-1.5 rounded-full bg-[#333333]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-[#F97316]"
                  style={{ width: `${volume}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
