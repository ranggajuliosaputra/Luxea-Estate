import Link from "next/link";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowUpRight, PinIcon, PlayIcon } from "@/components/ui/icons";
import { formatAre, listings, variantForStatus, type Listing } from "@/lib/data";

export function ListingCard({ listing }: { listing: Listing }) {
  const seed = listings.findIndex((l) => l.slug === listing.slug) + 1;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-charcoal/8 bg-paper transition-[transform,box-shadow] duration-500 ease-[var(--ease-lux)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
      <div className="relative h-[220px] overflow-hidden sm:h-[240px]">
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.04]">
          <MediaPlaceholder tone={listing.tone} image={listing.image} alt={listing.title} seed={seed} />
        </div>
        <div className="absolute inset-x-3.5 top-3.5 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex h-7 items-center rounded-full bg-paper/90 px-3 text-xs font-semibold tracking-[0.06em] uppercase">{listing.type}</span>
            <StatusBadge variant={variantForStatus(listing.status)}>{listing.status}</StatusBadge>
          </div>
          <span className="inline-flex h-7 flex-none items-center gap-1.5 rounded-full bg-charcoal/78 px-3 text-xs text-sand-50">
            <PlayIcon /> {listing.media}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-5 sm:px-[22px]">
        <div className="flex flex-col gap-1">
          <h3 className="text-[19px] leading-snug font-medium tracking-[-0.01em]">
            <Link href={`/listings/${listing.slug}`} className="after:absolute after:inset-0">
              {listing.title}
            </Link>
          </h3>
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-3">
            <PinIcon /> {listing.place}
          </span>
        </div>

        <dl className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-[#F1ECE2] p-2.5">
            <dt className="text-[11px] text-ink-3">Tanah</dt>
            <dd className="text-sm font-semibold">{formatAre(listing.landAre)}</dd>
          </div>
          <div className="rounded-xl bg-[#F1ECE2] p-2.5">
            <dt className="text-[11px] text-ink-3">Bangunan</dt>
            <dd className="text-sm font-semibold">{listing.buildingM2 ? `${listing.buildingM2} m²` : "—"}</dd>
          </div>
          <div className="rounded-xl bg-[#F1ECE2] p-2.5">
            <dt className="text-[11px] text-ink-3">Status</dt>
            <dd className="text-sm font-semibold">{listing.statusNote}</dd>
          </div>
        </dl>

        <div className="flex items-center gap-2 text-[13px] text-itr-ink">
          <span className={`lx-dot ${listing.zoneTone === "yellow" ? "text-itr" : "text-signal"}`} />
          {listing.zone}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-charcoal/8 pt-3.5">
          <div>
            <div className="text-xs text-ink-3">{listing.priceNote}</div>
            <div className="text-xl font-semibold tracking-[-0.01em]">{listing.price}</div>
          </div>
          <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-charcoal text-sand-50 transition-colors group-hover:bg-olive-600" aria-hidden="true">
            <ArrowUpRight />
          </span>
        </div>
      </div>
    </article>
  );
}
