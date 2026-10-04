"use client";

import { useId, useState } from "react";
import { LottiePlayer } from "@/components/motion/LottiePlayer";
import { ChevronDown } from "@/components/ui/icons";
import { checkAnimation, clockAnimation } from "@/lib/lottie";
import type { LegalCheck } from "@/lib/data";

const verifiedAnim = checkAnimation("#F7F3EC");
const pendingAnim = clockAnimation("#4A3A0E");

export function LegalAccordion({ items }: { items: LegalCheck[] }) {
  const [open, setOpen] = useState<number | null>(1);
  const baseId = useId();

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-sand-50">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-${i}`;
        return (
          <div key={item.title} className="border-b border-charcoal/8 last:border-b-0">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex min-h-16 w-full items-center gap-3.5 px-5 text-left sm:px-6"
            >
              <span className={`grid h-7 w-7 flex-none place-items-center rounded-full ${item.verified ? "bg-olive-600" : "bg-itr-bg"}`}>
                <LottiePlayer animationData={item.verified ? verifiedAnim : pendingAnim} size={16} />
              </span>
              <span className="flex-1 font-medium">{item.title}</span>
              <span className={`hidden text-[13px] sm:inline ${item.verified ? "text-olive-800" : "text-[#7A5A12]"}`}>
                {item.verified ? "Terverifikasi" : "Dalam proses"}
              </span>
              <ChevronDown className={`flex-none transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div id={panelId} hidden={!isOpen} className="px-5 pb-5 pl-[62px] text-[15px] leading-relaxed text-ink-2 sm:px-6 sm:pl-16">
              <span className={`mb-1 block text-[13px] sm:hidden ${item.verified ? "text-olive-800" : "text-[#7A5A12]"}`}>
                {item.verified ? "Terverifikasi" : "Dalam proses"}
              </span>
              {item.detail}
            </div>
          </div>
        );
      })}
    </div>
  );
}
