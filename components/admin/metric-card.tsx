import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  value: string;
  label: string;
  icon: React.ElementType;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: "text-[#22C55E]" },
  down: { icon: TrendingDown, color: "text-[#EF4444]" },
  neutral: { icon: Minus, color: "text-[#555555]" },
};

export function MetricCard({
  value,
  label,
  icon: Icon,
  sublabel,
  trend,
  trendValue,
}: MetricCardProps) {
  const trendConfig = trend ? TREND_CONFIG[trend] : null;
  const TrendIcon = trendConfig?.icon;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#555555]">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]/10">
          <Icon size={15} className="text-[#F97316]" aria-hidden="true" />
        </div>
      </div>

      <div>
        <p className="font-display text-[2.4rem] font-black leading-none tracking-tight text-white">
          {value}
        </p>
        {sublabel && (
          <p className="mt-1.5 text-[11px] text-[#444444]">{sublabel}</p>
        )}
      </div>

      {trendConfig && TrendIcon && trendValue && (
        <div className={`flex items-center gap-1 ${trendConfig.color}`}>
          <TrendIcon size={12} aria-hidden="true" />
          <span className="text-[11px] font-semibold">{trendValue}</span>
        </div>
      )}
    </div>
  );
}
