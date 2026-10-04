"use client";

import { useRef } from "react";
import { LottieLight, type LottieHandle } from "lottie-react";

export type LottieInnerProps = { src: object; size: number; loop: boolean; reduced: boolean };

/** Browser-only Lottie renderer (svg, no expressions needed for our files). */
export default function LottieInner({ src, size, loop, reduced }: LottieInnerProps) {
  const ref = useRef<LottieHandle>(null);
  return (
    <LottieLight
      lottieRef={ref}
      src={src}
      loop={reduced ? false : loop}
      autoplay={!reduced}
      subscriptions={{
        // Reduced motion: show the finished state, no movement.
        ready: () => {
          if (reduced) ref.current?.seek({ percent: 100 });
        },
      }}
      style={{ width: size, height: size }}
    />
  );
}
