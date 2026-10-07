"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Genjutsu cursor: a soft glass ring that trails the pointer and grows over links. */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    gsap.set(el, { autoAlpha: 0 });

    const move = (e: PointerEvent) => {
      gsap.to(el, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target as Element | null;
      el.dataset.hover = target?.closest("a, button, [data-cursor='grow']") ? "true" : "false";
    };
    const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <div ref={ref} className="lx-cursor" aria-hidden="true" />;
}
