"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ParcelPreview3D, ShaderBackground } from "@/components/three/lazy";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowRight, DownloadIcon, SearchIcon } from "@/components/ui/icons";
import { gsap, useGSAP } from "@/lib/gsap";
import { applyListingFilter } from "@/lib/events";
import type { LegalStatus, PropertyType, RegionId } from "@/lib/data";

const locations: Array<{ id: RegionId; label: string }> = [
  { id: "badung", label: "Badung" },
  { id: "tabanan", label: "Tabanan" },
  { id: "denpasar", label: "Denpasar" },
];
const types: PropertyType[] = ["Tanah", "Rumah", "Villa", "Ruko"];
const statuses: LegalStatus[] = ["Freehold SHM", "Leasehold"];

function Pill({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 flex-none rounded-full border px-4 text-[15px] transition-colors duration-300 sm:px-[18px] ${
        pressed ? "border-charcoal bg-charcoal text-sand-50" : "border-charcoal/18 bg-white/60 text-charcoal hover:border-charcoal/40"
      }`}
    >
      {children}
    </button>
  );
}

export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const [loc, setLoc] = useState<RegionId>("badung");
  const [type, setType] = useState<PropertyType | undefined>("Tanah");
  const [status, setStatus] = useState<LegalStatus | undefined>(undefined);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
        tl.from("[data-hero='chip']", { y: 20, autoAlpha: 0, duration: 0.8 })
          .from("[data-hero='line']", { yPercent: 110, stagger: 0.09 }, "-=0.5")
          .from("[data-hero='copy']", { y: 24, autoAlpha: 0, stagger: 0.1 }, "-=0.8")
          .from("[data-hero='parcel']", { y: 60, autoAlpha: 0, rotate: 2 }, "-=1")
          .from("[data-hero='filter']", { y: 40, autoAlpha: 0 }, "-=0.9");

        // Parallax: the parcel card drifts up as the hero scrolls away
        gsap.to("[data-hero='parcel']", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  const headline = ["Tanah Bali dengan", "legalitas yang", "terang, sebelum", "Anda membayar."];

  return (
    <section ref={scope} id="top" className="section-pad pt-4 sm:pt-6">
      <div className="container-lux relative overflow-hidden rounded-[28px] bg-sand-50 p-5 pt-8 sm:rounded-[var(--radius-panel)] sm:p-12 lg:p-[72px]">
        <ShaderBackground />

        <div className="relative flex flex-wrap items-end gap-12">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-7">
            <span data-hero="chip" className="inline-flex items-center gap-2.5 self-start rounded-full bg-sand-200 px-3.5 py-2 text-[13px] tracking-[0.02em] text-olive-800">
              <span className="lx-dot text-olive-600" />
              Investasi Tanah &amp; Properti Transparan di Bali
            </span>

            <h1 className="max-w-[13ch] text-[clamp(2.6rem,6.2vw,5.75rem)] leading-[0.98] font-medium tracking-[-0.035em]">
              {headline.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <span data-hero="line" className="block">
                    {line.includes("terang") ? (
                      <>
                        <span className="accent text-olive-600">terang</span>
                        {line.replace("terang", "")}
                      </>
                    ) : (
                      line
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <p data-hero="copy" className="max-w-[540px] text-[17px] leading-relaxed text-ink-2 sm:text-lg">
              Kami mendampingi pembelian tanah dan properti siap bangun di Badung, Tabanan, dan Denpasar. Sertifikat diperiksa, zonasi ITR
              dibaca, dan lokasi dikunjungi bersama Ryan &amp; tim sebelum Anda mengambil keputusan.
            </p>

            <div data-hero="copy" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/#listings"
                className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-charcoal px-7 font-medium text-sand-50 transition-colors hover:bg-olive-700"
              >
                Lihat Listing <ArrowRight />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full border border-charcoal/25 px-7 font-medium transition-colors hover:border-charcoal"
              >
                <DownloadIcon /> Unduh Checklist Gratis
              </Link>
            </div>
          </div>

          <aside data-hero="parcel" aria-label="Simulasi bidang tanah 3D" className="glass flex max-w-[520px] flex-[1_1_380px] flex-col gap-3.5 rounded-[28px] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="eyebrow">Parcel preview · 3D</span>
                <span className="text-[17px] font-medium">Contoh: Pererenan, Badung</span>
              </div>
              <StatusBadge variant="itr">ITR Zona Kuning</StatusBadge>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#E9E3D4]">
              <ParcelPreview3D width={20} depth={25} roadWidth={6} />
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-paper/85 px-3 py-1 text-xs text-ink-2">Seret untuk memutar</span>
            </div>
            <dl className="grid grid-cols-3 gap-2">
              {[
                ["Luas tanah", "5,0 are"],
                ["Lebar jalan", "6 m"],
                ["Status", "Leasehold"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[14px] bg-sand-50 px-3 py-2.5">
                  <dt className="text-xs text-ink-3">{k}</dt>
                  <dd className="text-base font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <form
          data-hero="filter"
          aria-label="Filter cepat listing"
          onSubmit={(e) => {
            e.preventDefault();
            applyListingFilter({ region: loc, type, status });
          }}
          className="glass relative mt-10 flex flex-col gap-5 rounded-3xl p-4 sm:mt-14 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-7 sm:p-6"
        >
          <fieldset className="min-w-0">
            <legend className="eyebrow mb-2.5">Lokasi</legend>
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
              {locations.map((l) => (
                <Pill key={l.id} pressed={loc === l.id} onClick={() => setLoc(l.id)}>
                  {l.label}
                </Pill>
              ))}
            </div>
          </fieldset>
          <fieldset className="min-w-0">
            <legend className="eyebrow mb-2.5">Tipe</legend>
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
              {types.map((t) => (
                <Pill key={t} pressed={type === t} onClick={() => setType(type === t ? undefined : t)}>
                  {t}
                </Pill>
              ))}
            </div>
          </fieldset>
          <fieldset className="min-w-0">
            <legend className="eyebrow mb-2.5">Status</legend>
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
              {statuses.map((s) => (
                <Pill key={s} pressed={status === s} onClick={() => setStatus(status === s ? undefined : s)}>
                  {s}
                </Pill>
              ))}
            </div>
          </fieldset>
          <button
            type="submit"
            className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-olive-600 px-7 font-medium text-sand-50 transition-colors hover:bg-olive-700 sm:ml-auto"
          >
            <SearchIcon /> Cari Lahan
          </button>
        </form>
      </div>
    </section>
  );
}
