"use client";

import { useRef, useState } from "react";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ParcelPreview3D } from "@/components/three/lazy";
import { PlayIcon } from "@/components/ui/icons";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Listing } from "@/lib/data";

type Tab = "video" | "photo" | "parcel" | "itr";
const tabs: Array<{ id: Tab; label: string }> = [
  { id: "video", label: "Video drone" },
  { id: "photo", label: "Foto" },
  { id: "parcel", label: "Parcel 3D" },
  { id: "itr", label: "Peta ITR" },
];

function plotSize(l: Listing): [number, number] {
  const m = l.dimensions?.match(/(\d+(?:[.,]\d+)?)\s*×\s*(\d+(?:[.,]\d+)?)/);
  if (m) return [parseFloat(m[1].replace(",", ".")), parseFloat(m[2].replace(",", "."))];
  const side = Math.round(Math.sqrt(l.landAre * 100));
  return [side, side];
}

export function ListingMedia({ listing }: { listing: Listing }) {
  const [tab, setTab] = useState<Tab>(listing.media === "Video drone" ? "video" : "photo");
  const stage = useRef<HTMLDivElement>(null);
  const [w, d] = plotSize(listing);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-stage]", { autoAlpha: 0, scale: 1.02 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { scope: stage, dependencies: [tab] },
  );

  return (
    <div className="flex flex-col gap-3">
      <div ref={stage} className="relative h-[clamp(320px,42vw,600px)] overflow-hidden rounded-[28px] sm:rounded-[var(--radius-panel)]">
        <div data-stage className="absolute inset-0">
          {(tab === "video" || tab === "photo") && (
            <>
              <MediaPlaceholder tone={listing.tone} image={listing.image} alt={listing.title} seed={3} label="" sizes="100vw" />
              {tab === "video" && (
                <button
                  type="button"
                  aria-label="Putar video drone"
                  className="absolute top-1/2 left-1/2 grid h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-sand-50/50 text-charcoal backdrop-blur-md transition-transform hover:scale-105"
                >
                  <PlayIcon size={26} />
                </button>
              )}
              <span className="absolute bottom-5 left-5 rounded-full bg-sand-50/85 px-3 py-2 text-[13px]">
                {tab === "video" ? "Video drone · [DURASI]" : "Foto 1 dari [N]"}
              </span>
            </>
          )}
          {tab === "parcel" && (
            <div className="absolute inset-0 bg-[#E9E3D4]">
              <ParcelPreview3D width={w} depth={d} roadWidth={listing.roadWidthM ?? 5} showMass={listing.type !== "Tanah" || listing.landAre <= 6} />
            </div>
          )}
          {tab === "itr" && (
            <div className="absolute inset-0 bg-[#E9E3D4]">
              <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustrasi peta zonasi ITR di sekitar lahan" className="absolute inset-0 h-full w-full">
                <rect width="1000" height="560" fill="#B7C79A" />
                <path d="M0 0H520L470 260L560 560H0Z" fill="#E9CF7A" />
                <path d="M520 0H760L700 220L470 260Z" fill="#E7B9B0" />
                <path d="M0 360L1000 300" stroke="#F7F3EC" strokeWidth="18" />
                <path d="M300 0L360 560" stroke="#F7F3EC" strokeWidth="10" />
                <polygon points="380,240 470,226 482,300 392,314" fill="none" stroke="#23241F" strokeWidth="3" strokeDasharray="8 6" />
                <circle cx="431" cy="270" r="7" fill="#23241F" />
              </svg>
              <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 text-[13px]">
                {[
                  ["#E9CF7A", "Kuning · Permukiman"],
                  ["#E7B9B0", "Merah muda · Pariwisata"],
                  ["#B7C79A", "Hijau · Pertanian"],
                ].map(([c, t]) => (
                  <span key={t} className="inline-flex items-center gap-2 rounded-full bg-sand-50/90 px-3 py-2">
                    <span className="h-3 w-3 rounded-[3px]" style={{ background: c }} />
                    {t}
                  </span>
                ))}
              </div>
              <span className="absolute right-5 bottom-5 hidden rounded-full bg-charcoal/80 px-3 py-2 text-xs text-sand-50 sm:block">Ilustrasi. Peta resmi: [SUMBER ITR / KKPR]</span>
            </div>
          )}
        </div>

        <div role="tablist" aria-label="Media listing" className="no-scrollbar absolute inset-x-4 top-4 flex gap-1 overflow-x-auto sm:right-auto">
          <div className="flex gap-1 rounded-full bg-sand-50/70 p-1.5 backdrop-blur-md">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`min-h-10 flex-none rounded-full px-4 text-sm transition-colors ${tab === t.id ? "bg-charcoal text-sand-50" : "hover:bg-sand-50"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
        {["#D8CDB6", "#CBD0B4", "#C7CCA8", "#E0D2BC"].map((tone, i) => (
          <button key={tone} type="button" onClick={() => setTab("photo")} aria-label={`Foto ${i + 1}`} className="h-20 rounded-[18px] sm:h-24" style={{ background: tone }} />
        ))}
        <button type="button" onClick={() => setTab("photo")} className="h-20 rounded-[18px] bg-charcoal text-sm text-sand-100 sm:h-24">
          + [N] foto
        </button>
      </div>
    </div>
  );
}
