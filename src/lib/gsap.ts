"use client";

import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export { gsap, Flip, ScrollTrigger, useGSAP };
