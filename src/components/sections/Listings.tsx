"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ListingCard } from "@/components/listing/ListingCard";
import { Reveal } from "@/components/motion/Reveal";
import { Flip, gsap } from "@/lib/gsap";
import { onListingFilter, type ListingFilter } from "@/lib/events";
import { listings, regions } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

const tabs = [{ id: "all" as const, label: "Semua" }, ...regions.map((r) => ({ id: r.id, label: r.name }))];

function matches(l: (typeof listings)[number], f: ListingFilter) {
  return (f.region === "all" || l.region === f.region) && (!f.type || l.type === f.type) && (!f.status || l.status === f.status);
}

export function Listings() {
  const [filter, setFilter] = useState<ListingFilter>({ region: "all" });
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  // Snapshot card positions before React applies the new filter...
  const update = (next: ListingFilter) => {
    const cards = gridRef.current?.querySelectorAll("[data-card]");
    if (cards?.length) flipState.current = Flip.getState(cards);
    setFilter(next);
  };

  useEffect(() => onListingFilter(update), []);

  // ...then animate from the old layout to the new one (GSAP Flip).
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !gridRef.current) return;
    flipState.current = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Flip.from(state, {
      targets: gridRef.current.querySelectorAll("[data-card]"),
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94, y: 24 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, delay: 0.1 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3 }),
    });
  }, [filter]);

  const shown = listings.filter((l) => matches(l, filter));
  const extra = [filter.type, filter.status].filter(Boolean) as string[];

  return (
    <section id="listings" className="section-pad scroll-mt-20 pt-20 sm:pt-32">
      <div className="container-lux flex flex-col gap-9">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
            <span className="eyebrow">Listings</span>
            <h2 className="max-w-[15ch] text-h2 font-medium">
              Lahan &amp; properti yang sudah kami <span className="accent text-olive-600">cek</span> di lapangan.
            </h2>
          </div>
          <div role="tablist" aria-label="Filter wilayah" className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-sand-200 p-1.5">
            {tabs.map((t) => {
              const selected = filter.region === t.id;
              const count = t.id === "all" ? listings.length : listings.filter((l) => l.region === t.id).length;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => update({ ...filter, region: t.id })}
                  className={`inline-flex min-h-11 flex-none items-center gap-2 rounded-full px-[18px] text-[15px] transition-[background,box-shadow] duration-300 ${
                    selected ? "bg-paper shadow-[0_6px_16px_-8px_rgb(35_36_31/0.35)]" : "hover:bg-sand-100"
                  }`}
                >
                  {t.label}
                  <span className="text-xs text-ink-3">{count}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {extra.length > 0 && (
          <div className="-mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink-3">Filter aktif:</span>
            {extra.map((x) => (
              <span key={x} className="rounded-full bg-sand-50 px-3 py-1.5">
                {x}
              </span>
            ))}
            <button type="button" onClick={() => update({ region: filter.region })} className="min-h-9 rounded-full px-3 underline underline-offset-4">
              Hapus filter
            </button>
          </div>
        )}

        <div ref={gridRef} className="relative grid grid-cols-[repeat(auto-fill,minmax(min(360px,100%),1fr))] gap-6">
          {listings.map((l) => (
            <div key={l.slug} data-card data-flip-id={l.slug} className={matches(l, filter) ? "" : "hidden"}>
              <ListingCard listing={l} />
            </div>
          ))}
          {shown.length === 0 && (
            <div className="col-span-full flex flex-col items-start gap-4 rounded-3xl bg-sand-50 p-8">
              <span className="text-2xl font-medium tracking-[-0.02em]">
                Belum ada listing yang <span className="accent text-olive-600">cocok</span>.
              </span>
              <p className="max-w-[520px] text-ink-2">Sebagian stok belum kami tayangkan. Ceritakan kebutuhan Anda, kami cek yang tersedia.</p>
              <a
                href={whatsappLink(`Halo Luxea Estate, saya mencari ${[filter.type ?? "properti", filter.status].filter(Boolean).join(" ")} di ${regions.find((r) => r.id === filter.region)?.name ?? "Bali"}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-full bg-charcoal px-6 font-medium text-sand-50"
              >
                Tanya Stok Tanah
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-sand-200 px-6 py-5">
          <span className="text-[15px] text-ink-2">
            Menampilkan {shown.length} dari {listings.length} listing. Stok tanah berganti cepat; sebagian belum kami tayangkan.
          </span>
          <a
            href={whatsappLink("Halo Luxea Estate, saya ingin tanya stok tanah yang belum tayang.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center rounded-full bg-charcoal px-6 font-medium text-sand-50 transition-colors hover:bg-olive-700"
          >
            Tanya Stok Tanah
          </a>
        </div>
      </div>
    </section>
  );
}
