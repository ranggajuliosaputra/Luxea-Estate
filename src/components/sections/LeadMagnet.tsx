"use client";

import { useMemo, useState } from "react";
import { LottiePlayer } from "@/components/motion/LottiePlayer";
import { Reveal } from "@/components/motion/Reveal";
import { DownloadIcon, WhatsAppIcon } from "@/components/ui/icons";
import { errorAnimation, successAnimation } from "@/lib/lottie";
import { needs, validateLead, type Need } from "@/lib/lead";

type Status = { state: "idle" } | { state: "sending" } | { state: "error"; message: string } | { state: "success"; whatsappUrl: string; pdfUrl: string | null };

const checklist = [
  { text: "Sertifikat asli dicek ke BPN", done: true },
  { text: "Zonasi ITR/KKPR sesuai rencana bangunan", done: true },
  { text: "Akses jalan legal, bukan sekadar jalan setapak", done: true },
  { text: "PBB lunas dan tidak ada sengketa", done: false },
  { text: "Identitas penjual cocok dengan sertifikat", done: false },
  { text: "Transaksi melalui notaris/PPAT", done: false },
];

export function LeadMagnet() {
  const [need, setNeed] = useState<Need>("Investasi sewa");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const success = useMemo(() => successAnimation("#5B6B3A"), []);
  const error = useMemo(() => errorAnimation("#A8452C"), []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = { name: String(form.get("name") ?? ""), phone: String(form.get("whatsapp") ?? ""), need };

    const local = validateLead(payload);
    if (!local.ok) {
      setStatus({ state: "error", message: local.error });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Gagal mengirim.");
      setStatus({ state: "success", whatsappUrl: data.whatsappUrl, pdfUrl: data.pdfUrl });
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "Gagal mengirim. Coba lagi." });
    }
  }

  return (
    <section id="contact" className="section-pad scroll-mt-20 pt-20 sm:pt-32">
      <Reveal className="container-lux flex flex-wrap items-center gap-12 overflow-hidden rounded-[28px] bg-olive-700 p-5 pt-7 text-sand-100 sm:rounded-[var(--radius-panel)] sm:p-12 lg:p-16">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
          <span className="eyebrow text-olive-200">Panduan gratis · PDF</span>
          <h2 className="max-w-[14ch] text-h2 font-medium">
            Checklist Aman Membeli Tanah di <span className="accent text-[#E4D9A8]">Bali</span>
          </h2>
          <p className="max-w-[480px] text-[17px] leading-relaxed text-[#DCDCC8]">
            Daftar periksa yang kami pakai sendiri sebelum menawarkan lahan. Bawa ke notaris, ke lokasi, atau ke pertemuan dengan penjual.
          </p>
          <div className="max-w-[440px] -rotate-[2.5deg] rounded-[18px] bg-sand-50 p-6 text-charcoal shadow-[0_40px_70px_-40px_rgb(0_0_0/0.6)] transition-transform duration-700 ease-[var(--ease-lux)] hover:rotate-0 sm:p-7">
            <div className="flex justify-between text-[11px] tracking-[0.14em] text-ink-3 uppercase">
              <span>Luxea Estate</span>
              <span>Checklist · PDF</span>
            </div>
            <p className="mt-3.5 mb-4 text-[22px] leading-tight font-medium tracking-[-0.02em]">
              Sebelum tanda tangan, <span className="accent">pastikan</span>:
            </p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {checklist.map((item) => (
                <li key={item.text} className="flex items-start gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="flex-none">
                    {item.done ? (
                      <>
                        <rect x="1" y="1" width="16" height="16" rx="5" fill="#5B6B3A" />
                        <path d="M5 9.5l2.5 2.5 5-6" fill="none" stroke="#F7F3EC" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ) : (
                      <rect x="1.5" y="1.5" width="15" height="15" rx="4.5" fill="none" stroke="#5B6B3A" strokeWidth="1.3" />
                    )}
                  </svg>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0 flex-[1_1_380px] rounded-[26px] bg-sand-50 p-6 text-charcoal sm:p-8">
          {status.state === "success" ? (
            <div role="status" className="flex flex-col items-start gap-4 py-2">
              <LottiePlayer animationData={success} size={80} loop={false} label="Berhasil terkirim" />
              <p className="text-[28px] leading-tight font-medium tracking-[-0.02em]">
                Terkirim. <span className="accent text-olive-600">Cek WhatsApp Anda.</span>
              </p>
              <p className="leading-relaxed text-ink-2">
                Kebutuhan Anda tercatat sebagai <strong className="text-charcoal">{need}</strong>. Ryan atau tim akan menyapa Anda di WhatsApp
                bersama tautan PDF checklist.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {status.pdfUrl && (
                  <a href={status.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-charcoal px-6 font-medium text-sand-50">
                    <DownloadIcon /> Unduh PDF sekarang
                  </a>
                )}
                <a href={status.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-olive-600 px-6 font-medium text-sand-50">
                  <WhatsAppIcon /> Buka WhatsApp
                </a>
                <button type="button" onClick={() => setStatus({ state: "idle" })} className="min-h-12 rounded-full border border-charcoal/25 px-6">
                  Isi ulang
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate aria-label="Form unduh checklist" className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-[22px] font-medium tracking-[-0.02em]">Kirim checklist ke WhatsApp saya</span>
                <span className="text-sm text-ink-3">Gratis. Tautan PDF dikirim ke nomor yang Anda isi.</span>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lead-name" className="text-[13px] font-semibold">
                  Nama
                </label>
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Nama lengkap"
                  className="min-h-13 rounded-[14px] border border-charcoal/20 bg-white px-4 text-base placeholder:text-[#8A8374] focus:border-olive-600 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lead-wa" className="text-[13px] font-semibold">
                  Nomor WhatsApp
                </label>
                <div className="flex overflow-hidden rounded-[14px] border border-charcoal/20 bg-white focus-within:border-olive-600">
                  <span className="grid place-items-center bg-[#F1ECE2] px-3.5 text-[15px] text-ink-2">+62</span>
                  <input
                    id="lead-wa"
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel-national"
                    placeholder="812 3456 7890"
                    className="min-h-13 min-w-0 flex-1 bg-transparent px-4 text-base placeholder:text-[#8A8374] focus:outline-none"
                  />
                </div>
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-[13px] font-semibold">Kategori kebutuhan</legend>
                <div className="flex flex-wrap gap-1.5">
                  {needs.map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={need === n}
                      onClick={() => setNeed(n)}
                      className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
                        need === n ? "border-charcoal bg-charcoal text-sand-50" : "border-charcoal/18 bg-white hover:border-charcoal/40"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </fieldset>

              {status.state === "error" && (
                <div role="alert" className="flex items-center gap-3 rounded-2xl bg-[#F6E3DC] p-3 text-sm text-[#5A1F10]">
                  <LottiePlayer animationData={error} size={36} loop={false} />
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={status.state === "sending"}
                className="inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-full bg-charcoal font-medium text-sand-50 transition-colors hover:bg-olive-700 disabled:opacity-60"
              >
                <DownloadIcon />
                {status.state === "sending" ? "Mengirim…" : "Kirim & Unduh Checklist"}
              </button>
              <span className="text-xs leading-normal text-ink-3">
                Data Anda hanya dipakai untuk mengirim panduan dan menindaklanjuti kebutuhan Anda. Tidak dibagikan ke pihak lain.
              </span>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
