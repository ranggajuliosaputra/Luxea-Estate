import Link from "next/link";
import { DownloadIcon, WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/site";

const message = "Halo Luxea Estate, saya ingin tanya stok tanah yang tersedia.";

/** Persistent "Tanya Stok Tanah" CTA: a pill on desktop, a bottom bar on phones. */
export function FloatingWhatsApp() {
  return (
    <>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 z-40 hidden min-h-14 items-center gap-2.5 rounded-full bg-olive-600 py-2 pr-6 pl-2 font-medium text-sand-50 shadow-[0_20px_40px_-16px_rgb(35_36_31/0.55)] transition-transform duration-500 ease-[var(--ease-lux)] hover:-translate-y-1 sm:inline-flex"
      >
        <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-sand-50 text-olive-800">
          <WhatsAppIcon size={20} />
        </span>
        Tanya Stok Tanah
      </a>

      <div className="fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-full bg-charcoal/92 p-2 shadow-[0_20px_40px_-16px_rgb(35_36_31/0.55)] backdrop-blur-md sm:hidden">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-olive-600 font-medium text-sand-50"
        >
          <WhatsAppIcon />
          Tanya Stok Tanah
        </a>
        <Link href="/#contact" aria-label="Unduh checklist" className="grid h-12 w-12 place-items-center rounded-full bg-sand-100 text-charcoal">
          <DownloadIcon />
        </Link>
      </div>
    </>
  );
}
