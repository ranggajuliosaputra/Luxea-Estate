import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-pad pt-24 pb-10">
      <div className="container-lux flex flex-col items-start gap-6 rounded-[var(--radius-panel)] bg-sand-50 p-8 sm:p-16">
        <span className="eyebrow">404</span>
        <h1 className="max-w-[14ch] text-h2 font-medium">
          Lahan ini <span className="accent text-olive-600">tidak</span> kami temukan.
        </h1>
        <p className="max-w-[480px] text-ink-2">Listing mungkin sudah terjual atau tautannya berubah.</p>
        <Link href="/#listings" className="inline-flex min-h-12 items-center rounded-full bg-charcoal px-6 font-medium text-sand-50">
          Lihat listing tersedia
        </Link>
      </div>
    </section>
  );
}
