import { Reveal } from "@/components/motion/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LocationIcon, MapIcon, PeopleIcon } from "@/components/ui/icons";

export function ValueProps() {
  return (
    <section id="legal" className="section-pad scroll-mt-20 pt-20 sm:pt-32">
      <div className="container-lux flex flex-col gap-12">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-4">
            <span className="eyebrow">Legal Guide</span>
            <h2 className="max-w-[16ch] text-h2 font-medium">
              Tiga hal yang kami pastikan <span className="accent text-olive-600">sebelum</span> bicara harga.
            </h2>
          </div>
          <p className="flex-[0_1_400px] text-[17px] leading-relaxed text-ink-2">
            Di Bali, tanah yang tampak ideal bisa saja berada di jalur hijau, tidak punya akses jalan legal, atau sertifikatnya bermasalah.
            Karena itu, pemeriksaan kami selalu dimulai dari dokumen dan peta.
          </p>
        </Reveal>

        <Reveal stagger className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5">
          <article className="flex flex-col gap-5 rounded-[28px] bg-sand-50 p-7 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="accent text-[40px] text-olive-600">01</span>
              <MapIcon />
            </div>
            <h3 className="text-2xl font-medium tracking-[-0.02em]">Transparansi ITR &amp; zonasi</h3>
            <p className="leading-relaxed text-ink-2">
              Setiap lahan kami cocokkan dengan peta tata ruang (ITR/KKPR) sebelum ditawarkan, supaya Anda tahu apa yang boleh dibangun di
              atasnya.
            </p>
            <div className="mt-auto flex flex-col gap-2 border-t border-charcoal/10 pt-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2">
                  <span className="lx-dot text-itr" /> Zona Kuning
                </span>
                <span className="text-ink-3">Permukiman · bisa dibangun hunian</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#5E8A4E]" /> Zona Hijau
                </span>
                <span className="text-ink-3">Pertanian · tidak untuk bangunan</span>
              </div>
            </div>
          </article>

          <article className="flex flex-col gap-5 rounded-[28px] bg-sand-50 p-7 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="accent text-[40px] text-olive-600">02</span>
              <LocationIcon />
            </div>
            <h3 className="text-2xl font-medium tracking-[-0.02em]">Fokus tiga wilayah</h3>
            <p className="leading-relaxed text-ink-2">
              Kami hanya bekerja di Badung, Tabanan, dan Denpasar. Wilayah yang sempit membuat kami paham harga pasar, akses jalan, dan aturan
              banjar setempat.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 border-t border-charcoal/10 pt-5">
              {["Badung", "Tabanan", "Denpasar"].map((r) => (
                <span key={r} className="rounded-full bg-sand-200 px-3.5 py-1.5 text-sm">
                  {r}
                </span>
              ))}
            </div>
          </article>

          <article className="flex flex-col gap-5 rounded-[28px] bg-charcoal p-7 text-sand-100 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="accent text-[40px] text-olive-400">03</span>
              <PeopleIcon />
            </div>
            <h3 className="text-2xl font-medium tracking-[-0.02em]">Site visit bersama Ryan &amp; tim</h3>
            <p className="leading-relaxed text-ink-dark-2">
              Kami datang bersama Anda ke lokasi: cek patok batas, lebar jalan, arah matahari, dan kondisi sekitar. Untuk investor luar negeri,
              kunjungan bisa dilakukan lewat video call.
            </p>
            <div className="mt-auto flex items-center gap-3 border-t border-sand-100/15 pt-5">
              <div className="flex">
                <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-charcoal bg-olive-400 font-semibold text-charcoal">R</span>
                <span className="-ml-2.5 grid h-10 w-10 place-items-center rounded-full border-2 border-charcoal bg-sand-300 text-[13px] font-semibold text-charcoal">
                  tim
                </span>
              </div>
              <span className="text-sm text-ink-dark-2">Didampingi langsung, bukan oleh pihak ketiga</span>
            </div>
          </article>
        </Reveal>

        <Reveal className="flex flex-wrap items-center gap-x-10 gap-y-4 rounded-3xl border border-charcoal/12 px-6 py-5 sm:px-7">
          <span className="eyebrow">Arti badge di setiap listing</span>
          <div className="flex flex-[1_1_260px] items-center gap-3">
            <StatusBadge variant="freehold">Freehold SHM</StatusBadge>
            <span className="text-sm text-ink-2">Hak milik penuh, khusus WNI</span>
          </div>
          <div className="flex flex-[1_1_260px] items-center gap-3">
            <StatusBadge variant="leasehold">Leasehold</StatusBadge>
            <span className="text-sm text-ink-2">Hak sewa berjangka, sesuai akta</span>
          </div>
          <div className="flex flex-[1_1_260px] items-center gap-3">
            <StatusBadge variant="itr">ITR Zona Kuning</StatusBadge>
            <span className="text-sm text-ink-2">Permukiman pada peta tata ruang</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
