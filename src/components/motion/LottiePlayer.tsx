"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// lottie-web touches `document` on import, so it only loads in the browser.
const LottieInner = dynamic(() => import("./LottieInner"), { ssr: false });

type Props = {
  animationData: object;
  size: number;
  loop?: boolean;
  className?: string;
  label?: string;
};

export function LottiePlayer({ animationData, size, loop = true, className, label }: Props) {
  const reduced = useReducedMotion();
  return (
    <span
      className={className}
      style={{ width: size, height: size, display: "inline-block", flex: "none" }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <LottieInner src={animationData} size={size} loop={loop} reduced={reduced} />
    </span>
  );
}
