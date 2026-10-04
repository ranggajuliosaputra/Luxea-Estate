import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalAccordion } from "@/components/listing/LegalAccordion";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingMedia } from "@/components/listing/ListingMedia";
import { PriceCard } from "@/components/listing/PriceCard";
import { Reveal } from "@/components/motion/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PinIcon } from "@/components/ui/icons";
import { formatAre, getListing, listings, regions, variantForStatus } from "@/lib/data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const listing = getListing((await params).slug);
  if (!listing) return { title: "Listing tidak ditemukan" };
  return { title: listing.title, description: `${listing.place} · ${formatAre(listing.landAre)} · ${listing.status} · ${listing.zone}` };
}

export default async function ListingPage({ params }: { params: Promise<Params> }) {
  const listing = getListing((await params).slug);
  if (!listing) notFound();

  const region = regions.find((r) => r.id === listing.region);
  const similar = listings.filter((l) => l.slug !== listing.slug && (l.region === listing.region || l.type === listing.type)).slice(0, 3);
  const verifiedCount = listing.legal.filter((c) => c.verified).length;

  const facts: Array<[string, string, string]> = [
    ["Luas tanah", formatAre(listing.landAre), `± ${Math.round(listing.landAre * 100)} m²`],
    listing.buildingM2 ? ["Bangunan", `${listing.buildingM2} m²`, listing.type] : ["Dimensi", listing.dimensions ?? "[CEK]", "Kontur [CEK]"],
    ["Akses jalan", listing.roadWidthM ? `${listing.roadWidthM} m` : "[CEK]", "Jalan umum"],
    listing.leaseYears ? ["Masa sewa", `${listing.leaseYears} tahun`, "Opsi perpanjangan [CEK]"] : ["Sertifikat", "SHM", "Hak milik · WNI"],
  ];

  return (
    <div className="section-pad pt-6">
      <div className="container-lux flex flex-col gap-7">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-ink-3">
          <Link href="/" className="hover:text-charcoal">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/#listings" className="hover:text-charcoal">
            Listings
          </Link>
          <span aria-hidden="true">/</span>
          <span>{region?.name}</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-charcoal">
            {listing.code}
          </span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <div className="flex min-w-0 flex-[1_1_640px] flex-col gap-3.5">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex h-7 items-center rounded-full bg-sand-50 px-3 text-xs font-semibold tracking-[0.06em] uppercase">{listing.type}</span>
              <StatusBadge variant={variantForStatus(listing.status)}>
                {listing.status}
                {listing.leaseYears ? ` ${listing.leaseYears} tahun` : ""}
              </StatusBadge>
              <StatusBadge variant={listing.zoneTone === "yellow" ? "itr" : "commercial"}>{listing.zone.split(" · ")[0]}</StatusBadge>
            </div>
            <h1 className="max-w-[18ch] text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] font-medium tracking-[-0.035em]">{listing.title}</h1>
            <span className="inline-flex items-center gap-2 text-ink-2">
              <PinIcon size={16} /> {listing.place} · Lokasi persis dibagikan saat site visit
            </span>
          </div>
        </div>

        <ListingMedia listing={listing} />

        <div className="flex flex-wrap items-start gap-10">
          <div className="flex min-w-0 flex-[999_1_640px] flex-col gap-12">
            <Reveal className="flex flex-col gap-4">
              <h2 className="text-[32px] font-medium tracking-[-0.03em]">Ringkasan</h2>
              <p className="max-w-[720px] text-lg leading-[1.65] text-ink-2">
                {listing.summary} Lokasi persis, kondisi tetangga, dan arah matahari kami tunjukkan langsung saat site visit.
              </p>
              <dl className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
                {facts.map(([k, v, s]) => (
                  <div key={k} className="rounded-[20px] bg-sand-50 p-[18px]">
                    <dt className="text-[13px] text-ink-3">{k}</dt>
                    <dd className="text-2xl font-semibold tracking-[-0.02em]">{v}</dd>
                    <dd className="text-[13px] text-ink-3">{s}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-[32px] font-medium tracking-[-0.03em]">
                  Status <span className="accent text-olive-600">legal</span>
                </h2>
                <span className="text-sm text-ink-3">
                  {verifiedCount} dari {listing.legal.length} terverifikasi · diperiksa [TANGGAL]
                </span>
              </div>
              <LegalAccordion items={listing.legal} />
            </Reveal>

            <Reveal className="flex flex-col gap-4">
              <h2 className="text-[32px] font-medium tracking-[-0.03em]">Lokasi &amp; jarak</h2>
              <div className="flex flex-col divide-y divide-charcoal/8 rounded-3xl bg-sand-50 px-6">
                {["Pantai terdekat", "Pusat aktivitas terdekat", "Sekolah internasional terdekat", "Bandara Ngurah Rai"].map((p) => (
                  <div key={p} className="flex justify-between py-3.5">
                    <span>{p}</span>
                    <span className="text-ink-3">[X] menit</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <aside aria-label="Ringkasan harga dan kontak" className="flex min-w-0 flex-[1_1_340px] flex-col gap-4 lg:sticky lg:top-24">
            <PriceCard listing={listing} />
            <div className="flex items-center gap-3.5 rounded-3xl bg-charcoal p-[18px] text-sand-100">
              <span className="grid h-13 w-13 flex-none place-items-center rounded-full bg-olive-400 text-lg font-semibold text-charcoal">R</span>
              <div className="flex flex-col">
                <span className="font-semibold">Ryan · Luxea Estate</span>
                <span className="text-[13px] text-ink-dark-2">Mendampingi listing ini dari site visit sampai notaris</span>
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section aria-labelledby="serupa" className="flex flex-col gap-5 pt-12">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="serupa" className="text-[32px] font-medium tracking-[-0.03em]">
                Lahan <span className="accent text-olive-600">serupa</span>
              </h2>
              <Link href="/#listings" className="text-[15px] underline-offset-4 hover:underline">
                Semua listing →
              </Link>
            </div>
            <Reveal stagger className="grid grid-cols-[repeat(auto-fill,minmax(min(360px,100%),1fr))] gap-5">
              {similar.map((l) => (
                <ListingCard key={l.slug} listing={l} />
              ))}
            </Reveal>
          </section>
        )}
      </div>
    </div>
  );
}
