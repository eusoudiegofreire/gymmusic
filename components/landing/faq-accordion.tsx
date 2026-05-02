"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-[#222222]">
      {items.map(({ q, a }, i) => {
        const isOpen = openIdx === i;
        const triggerId = `faq-trigger-${i}`;
        const panelId = `faq-panel-${i}`;
        const isLast = i === items.length - 1;

        return (
          <div
            key={i}
            className={`transition-colors duration-200 ${
              isLast ? "" : "border-b border-[#1A1A1A]"
            } ${isOpen ? "bg-[#131313]" : "bg-[#0D0D0D] hover:bg-[#101010]"}`}
          >
            {/* Trigger */}
            <button
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="flex min-h-[56px] w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span
                className={`text-sm font-semibold leading-snug transition-colors duration-200 ${
                  isOpen ? "text-[#F97316]" : "text-white"
                }`}
              >
                {q}
              </span>

              {/* Icon: + rotates 45° → × on open */}
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  isOpen
                    ? "rotate-45 border-[#F97316]/40 bg-[#F97316]/10 text-[#F97316]"
                    : "border-[#2A2A2A] text-[#444444]"
                }`}
              >
                <Plus size={13} strokeWidth={2.5} />
              </span>
            </button>

            {/* Panel — grid-rows trick: 0fr → 1fr for smooth height */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="faq-content grid"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 pt-1 text-sm leading-relaxed text-[#777777]">
                  {a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
