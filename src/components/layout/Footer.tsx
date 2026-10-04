import Link from "next/link";
import { navLinks, site, whatsappLink } from "@/lib/site";
import { regions } from "@/lib/data";

export function Footer() {
  return (
    <footer className="section-pad mt-20 pb-28 sm:mt-32 sm:pb-6">
      <div className="container-lux flex flex-col gap-12 overflow-hidden rounded-[var(--radius-panel)] bg-charcoal p-7 text-sand-100 sm:p-12 lg:p-16">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex max-w-[420px] flex-col gap-4">
            <span className="text-[26px] font-semibold tracking-[-0.02em]">
              Luxea <span className="accent text-[30px]">Estate</span>
            </span>
            <p className="leading-relaxed text-ink-dark-2">{site.tagline}. Badung · Tabanan · Denpasar.</p>
          </div>

          <nav aria-label="Navigasi sekunder" className="flex flex-wrap gap-x-16 gap-y-10 text-[15px]">
            <div className="flex flex-col gap-1">
              <span className="mb-2 text-xs tracking-[0.14em] text-ink-dark-3 uppercase">Jelajahi</span>
              {navLinks.slice(0, 4).map((l) => (
                <Link key={l.href} href={l.href} className="py-1.5 hover:text-olive-400">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="mb-2 text-xs tracking-[0.14em] text-ink-dark-3 uppercase">Wilayah</span>
              {regions.map((r) => (
                <Link key={r.id} href="/#region" className="py-1.5 hover:text-olive-400">
                  {r.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="mb-2 text-xs tracking-[0.14em] text-ink-dark-3 uppercase">Kontak</span>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="py-1.5 hover:text-olive-400">
                WhatsApp
              </a>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="py-1.5 hover:text-olive-400">
                @{site.instagram}
              </a>
              <Link href="/#contact" className="py-1.5 hover:text-olive-400">
                Checklist gratis
              </Link>
            </div>
          </nav>
        </div>

        <div aria-hidden="true" className="text-[clamp(64px,15vw,220px)] leading-[0.85] font-medium tracking-[-0.05em] whitespace-nowrap opacity-[0.08]">
          Luxea <span className="accent">Estate</span>
        </div>

        <div className="flex flex-wrap justify-between gap-x-10 gap-y-4 border-t border-sand-100/15 pt-6 text-[13px] leading-relaxed text-ink-dark-3">
          <p className="max-w-[760px] flex-[1_1_520px]">
            Informasi listing bersifat indikatif dan dapat berubah sewaktu-waktu. Status hukum, zonasi, dan luas akhir mengikuti dokumen resmi
            (sertifikat BPN, KKPR/ITR) serta verifikasi notaris/PPAT. Luxea Estate bukan konsultan hukum; kami menyarankan pemeriksaan
            independen sebelum transaksi.
          </p>
          <span>© {new Date().getFullYear()} Luxea Estate. Hak cipta dilindungi.</span>
        </div>
      </div>
    </footer>
  );
}
