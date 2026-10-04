"use client";

import { useMemo } from "react";
import { LottiePlayer } from "@/components/motion/LottiePlayer";
import { checkAnimation, clockAnimation, pulseAnimation } from "@/lib/lottie";
import type { BadgeVariant as Variant } from "@/lib/data";

const styles: Record<Variant, { box: string; ink: string }> = {
  freehold: { box: "bg-olive-600 text-sand-50 border-olive-600", ink: "#F7F3EC" },
  leasehold: { box: "bg-sand-50 text-charcoal border-charcoal/25", ink: "#23241F" },
  itr: { box: "bg-itr-bg text-itr-ink border-itr-bg", ink: "#B88A2A" },
  commercial: { box: "bg-[#F3D9CF] text-[#5A1F10] border-[#F3D9CF]", ink: "#A8452C" },
};

/** Legal-status pill with a Lottie micro-animation (check, clock or pulse). */
export function StatusBadge({ variant, children, size = "md" }: { variant: Variant; children: React.ReactNode; size?: "sm" | "md" }) {
  const { box, ink } = styles[variant];
  const animation = useMemo(() => {
    if (variant === "freehold") return checkAnimation(ink);
    if (variant === "leasehold") return clockAnimation(ink);
    return pulseAnimation(ink);
  }, [variant, ink]);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap ${box} ${
        size === "sm" ? "h-[26px] px-2.5 text-[11px]" : "h-7 px-3 text-xs"
      }`}
    >
      <LottiePlayer animationData={animation} size={size === "sm" ? 14 : 16} />
      {children}
    </span>
  );
}
