"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { formatAre, type Listing } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export function PriceCard({ listing }: { listing: Listing }) {
  const lease = listing.status === "Leasehold" && listing.leaseYears;
  const perUnit = listing.priceNote.toLowerCase().includes("per are");
  const [mode, setMode] = useState<"unit" | "total">("unit");
  const showToggle = perUnit;

  const note =
    mode === "unit" || !showToggle
      ? listing.priceNote
      : lease
        ? `Total sewa ${formatAre(listing.landAre)} selama ${listing.leaseYears} tahun`
        : `Total ${formatAre(listing.landAre)}`;
  const sub =
    mode === "unit" && showToggle
      ? `× ${formatAre(listing.landAre)}${lease ? ` × ${listing.leaseYears} tahun` : ""}`
      : "Belum termasuk biaya notaris & pajak";

  return (
    <div className="flex flex-col gap-[18px] rounded-[28px] border border-charcoal/8 bg-paper p-6 shadow-[0_30px_60px_-40px_rgb(35_36_31/0.4)] sm:p-7">
      {showToggle && (
        <div role="group" aria-label="Tampilan harga" className="grid grid-cols-2 gap-1 rounded-full bg-sand-100 p-1">
          {(
            [
              ["unit", lease ? "Per are / tahun" : "Per are"],
              ["total", lease ? `Total ${listing.leaseYears} tahun` : "Total"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
              className={`min-h-10 rounded-full text-sm transition-[background,box-shadow] ${mode === id ? "bg-paper shadow-[0_6px_16px_-8px_rgb(35_36_31/0.35)]" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1" aria-live="polite">
        <span className="text-[13px] text-ink-3">{note}</span>
        <span className="text-[40px] leading-none font-semibold tracking-[-0.03em]">{mode === "unit" ? listing.price : "Rp [TOTAL]"}</span>
        <span className="text-[13px] text-ink-3">{sub}</span>
      </div>

      <dl className="flex flex-col gap-2.5 border-y border-charcoal/8 py-4 text-sm">
        {[
          ["Kode listing", listing.code],
          ["Status", `${listing.status}${lease ? ` · ${listing.leaseYears} thn` : ""}`],
          ["Zona", listing.zone.replace("ITR ", "")],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-ink-3">{k}</dt>
            <dd className="text-right">{v}</dd>
          </div>
        ))}
        <div className="flex justify-between">
          <dt className="text-ink-3">Ketersediaan</dt>
          <dd className="inline-flex items-center gap-1.5">
            <span className="lx-dot text-olive-600" /> Tersedia
          </dd>
        </div>
      </dl>

      <a
        href={whatsappLink(`Halo Luxea Estate, saya ingin jadwalkan site visit untuk ${listing.code} (${listing.title}).`)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[54px] items-center justify-center gap-2.5 rounded-full bg-olive-600 font-medium text-sand-50 transition-colors hover:bg-olive-700"
      >
        <WhatsAppIcon /> Jadwalkan Site Visit
      </a>
      <a
        href={whatsappLink(`Halo Luxea Estate, mohon kirim dokumen legal untuk ${listing.code}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[50px] items-center justify-center rounded-full border border-charcoal/25 font-medium transition-colors hover:border-charcoal"
      >
        Minta dokumen legal
      </a>
    </div>
  );
}
