"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Music2, SkipForward } from "lucide-react";

const DEMO_TRACKS = [
  {
    id: "1",
    nome: "Energia Total",
    estilo: "Funk Workout",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    nome: "Eletro Power",
    estilo: "Eletrônico",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
] as const;

// Deterministic visualizer bars
const VIZ_BARS = 20;
const vizBars = Array.from({ length: VIZ_BARS }, (_, i) => {
  const p = (i / VIZ_BARS) * Math.PI * 5;
  const h = Math.abs(Math.sin(p) * 55 + Math.cos(p * 0.6) * 45) + 10;
  const dur = (0.5 + Math.abs(Math.sin(i * 0.45)) * 0.8).toFixed(2);
  const delay = (Math.abs(Math.cos(i * 0.32)) * 0.5).toFixed(2);
  return { h, dur, delay };
});

function formatTime(s: number) {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function DemoPlayer() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = DEMO_TRACKS[trackIdx];

  // Sync audio src when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (playing) audio.play().catch(() => setPlaying(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }, []);

  const onEnded = useCallback(() => {
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const val = Number(e.target.value);
    audio.currentTime = (val / 100) * audio.duration;
    setProgress(val);
  };

  const nextTrack = () => {
    setPlaying(false);
    setTrackIdx((i) => (i + 1) % DEMO_TRACKS.length);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        preload="metadata"
      />

      {/* Player card */}
      <div
        className={`relative overflow-hidden rounded-xl border bg-[#111111] p-6 transition-all duration-500 ${
          playing
            ? "border-[#F97316]/40 shadow-[0_0_48px_rgba(249,115,22,0.12)]"
            : "border-[#333333]"
        }`}
      >
        {/* Orange top accent */}
        <div
          className={`absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#F97316]/50 via-[#F97316] to-[#F97316]/50 transition-opacity duration-500 ${
            playing ? "opacity-100" : "opacity-50"
          }`}
        />

        {/* DEMO badge */}
        <span className="absolute right-4 top-4 rounded-sm bg-[#F97316]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#F97316]">
          Demo
        </span>

        {/* Cover + visualizer */}
        <div className="mb-5 flex items-center gap-4">
          {/* Cover art */}
          <div
            className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#0A0A0A] transition-all duration-500 ${
              playing ? "ring-2 ring-[#F97316]/50 ring-offset-2 ring-offset-[#111111]" : "ring-1 ring-[#333333]"
            }`}
          >
            <Music2
              size={26}
              className={`transition-colors duration-300 ${playing ? "text-[#F97316]" : "text-[#444444]"}`}
              aria-hidden="true"
            />
            {/* Pulse ring when playing */}
            {playing && (
              <span className="absolute inset-0 animate-ping rounded-lg bg-[#F97316] opacity-10" />
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-white">{track.nome}</p>
            <p className="text-xs text-[#999999]">{track.estilo}</p>

            {/* EQ visualizer */}
            <div
              className={`mt-2 flex h-6 items-end gap-[2px] ${playing ? "visualizer-playing" : ""}`}
              aria-hidden="true"
            >
              {vizBars.map(({ h, dur, delay }, i) => (
                <div
                  key={i}
                  className="eq-mini-bar w-[3px] rounded-t-[1px] bg-[#F97316]"
                  style={
                    {
                      height: `${h}%`,
                      "--eq-dur": `${dur}s`,
                      "--eq-delay": `${delay}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="relative mb-1.5 h-1 rounded-full bg-[#2A2A2A]">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#F97316] transition-none"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={seek}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Progresso da faixa de demonstração"
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#555555]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={nextTrack}
            className="text-[#555555] transition-colors hover:text-white"
            aria-label="Próxima faixa de demonstração"
          >
            <SkipForward size={18} />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F97316] text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-200 hover:bg-[#EA6E0A] hover:shadow-[0_0_28px_rgba(249,115,22,0.5)] active:scale-95"
            aria-label={playing ? "Pausar demonstração" : "Reproduzir demonstração"}
          >
            {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          {/* Track selector dots */}
          <div className="flex gap-1.5" role="tablist" aria-label="Faixas de demonstração">
            {DEMO_TRACKS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={trackIdx === i}
                aria-label={`Faixa ${i + 1}: ${t.nome}`}
                onClick={() => { setPlaying(false); setTrackIdx(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  trackIdx === i ? "w-5 bg-[#F97316]" : "w-1.5 bg-[#333333] hover:bg-[#555555]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="mt-3 overflow-hidden rounded-lg border border-[#222222] bg-[#0D0D0D]">
        {DEMO_TRACKS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setPlaying(false); setTrackIdx(i); }}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${
              i < DEMO_TRACKS.length - 1 ? "border-b border-[#1A1A1A]" : ""
            } ${
              trackIdx === i
                ? "bg-[#F97316]/08 text-[#F97316]"
                : "text-[#777777] hover:bg-[#1A1A1A] hover:text-white"
            }`}
          >
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                trackIdx === i ? "bg-[#F97316]/20 text-[#F97316]" : "bg-[#1A1A1A] text-[#555555]"
              }`}
            >
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{t.nome}</p>
              <p className="text-[10px] text-[#555555]">{t.estilo}</p>
            </div>
            {trackIdx === i && playing && (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#F97316]">
                ▶ ao vivo
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
