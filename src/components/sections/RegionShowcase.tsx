"use client";

import { useCallback, useRef, useState } from "react";
import { RegionMap3D } from "@/components/three/lazy";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRight } from "@/components/ui/icons";
import { gsap, useGSAP } from "@/lib/gsap";
import { applyListingFilter } from "@/lib/events";
import { regions, type RegionId } from "@/lib/data";

const names = Object.fromEntries(regions.map((r) => [r.id, r.name])) as Record<RegionId, string>;

export function RegionShowcase() {
  const [active, setActive] = useState<RegionId>("badung");
  const panel = useRef<HTMLDivElement>(null);
  const region = regions.find((r) => r.id === active) ?? regions[0];
  const select = useCallback((id: RegionId) => setActive(id), []);

  // Crossfade the detail panel when the region changes
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-region-detail]", { y: 18, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { scope: panel, dependencies: [active] },
  );

  return (
    <section id="region" className="section-pad scroll-mt-20 pt-20 sm:pt-32">
      <Reveal className="container-lux flex flex-col gap-10 overflow-hidden rounded-[28px] bg-charcoal p-5 pt-7 text-sand-100 sm:rounded-[var(--radius-panel)] sm:p-12 lg:p-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
            <span className="eyebrow text-ink-dark-3">Region · Peta 3D</span>
            <h2 className="max-w-[15ch] text-h2 font-medium">
              Pilih wilayah, lalu kenali <span className="accent text-olive-400">karakter</span> lahannya.
            </h2>
          </div>
          <div role="group" aria-label="Pilih wilayah" className="grid w-full grid-cols-3 gap-1 rounded-full bg-sand-100/8 p-1 sm:flex sm:w-auto sm:bg-transparent sm:p-0">
            {regions.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={active === r.id}
                onClick={() => setActive(r.id)}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] transition-colors duration-300 sm:border ${
                  active === r.id ? "border-sand-100 bg-sand-100 text-charcoal" : "border-sand-100/30 text-sand-100 hover:border-sand-100/60"
                }`}
              >
                <span className={`hidden h-2 w-2 rounded-full sm:inline ${active === r.id ? "bg-olive-600" : "bg-olive-400"}`} />
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-stretch gap-8">
          <div className="relative min-h-[360px] min-w-0 flex-[999_1_600px] overflow-hidden rounded-3xl bg-charcoal-soft sm:min-h-[500px]">
            <RegionMap3D active={active} onSelect={select} names={names} />
            <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-2 text-[13px] text-ink-dark-2">
              <span className="rounded-full border border-sand-100/12 bg-sand-100/8 px-3 py-2">Seret untuk memutar</span>
              <span className="rounded-full border border-sand-100/12 bg-sand-100/8 px-3 py-2">Klik wilayah</span>
            </div>
          </div>

          <div ref={panel} className="flex min-w-0 flex-[1_1_340px] flex-col gap-5 rounded-3xl border border-sand-100/12 bg-sand-100/6 p-6 sm:p-8" aria-live="polite">
            <span data-region-detail className="eyebrow text-olive-400">
              {region.kicker}
            </span>
            <h3 data-region-detail className="text-[clamp(40px,4vw,56px)] leading-none font-medium tracking-[-0.03em]">
              {region.name}
            </h3>
            <p data-region-detail className="leading-relaxed text-ink-dark-2">
              {region.description}
            </p>
            <div data-region-detail className="flex flex-col gap-2.5">
              <span className="eyebrow text-ink-dark-3">Area utama</span>
              <div className="flex flex-wrap gap-1.5">
                {region.areas.map((a) => (
                  <span key={a} className="rounded-full bg-sand-100/10 px-3 py-1.5 text-sm">
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <dl data-region-detail className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-sand-100/6 p-3.5">
                <dt className="text-xs text-ink-dark-3">Cocok untuk</dt>
                <dd className="mt-1 text-[15px]">{region.profile}</dd>
              </div>
              <div className="rounded-2xl bg-sand-100/6 p-3.5">
                <dt className="text-xs text-ink-dark-3">Harga indikatif</dt>
                <dd className="mt-1 text-[15px]">Rp [KISARAN] / are</dd>
              </div>
            </dl>
            <button
              data-region-detail
              type="button"
              onClick={() => applyListingFilter({ region: region.id })}
              className="mt-auto inline-flex min-h-12 items-center gap-2.5 self-start rounded-full bg-sand-100 px-6 font-medium text-charcoal transition-colors hover:bg-olive-400"
            >
              Lihat listing di {region.name} <ArrowRight />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
