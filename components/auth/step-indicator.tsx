import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <nav aria-label="Progresso do cadastro">
      <ol className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isDone = step < currentStep;
          const isActive = step === currentStep;
          const isLast = i === totalSteps - 1;

          return (
            <li key={step} className="flex items-center">
              {/* Circle + label */}
              <div className="flex flex-col items-center gap-2">
                <div
                  aria-current={isActive ? "step" : undefined}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    isDone
                      ? "bg-[#F97316] text-white"
                      : isActive
                      ? "bg-[#F97316] text-white ring-4 ring-[#F97316]/20"
                      : "border border-[#252525] bg-[#0A0A0A] text-[#3A3A3A]"
                  }`}
                >
                  {isDone ? (
                    <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{step}</span>
                  )}
                  <span className="sr-only">
                    Passo {step}: {labels[i]}{" "}
                    {isDone ? "(concluído)" : isActive ? "(atual)" : "(pendente)"}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    isActive
                      ? "text-[#F97316]"
                      : isDone
                      ? "text-[#555555]"
                      : "text-[#2A2A2A]"
                  }`}
                >
                  {labels[i]}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={`mx-3 mb-5 h-px w-10 transition-all duration-500 ${
                    isDone ? "bg-[#F97316]/50" : "bg-[#1A1A1A]"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
