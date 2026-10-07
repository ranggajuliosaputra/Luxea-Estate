"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { MenuIcon, WhatsAppIcon } from "@/components/ui/icons";
import { navLinks, whatsappLink } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="section-pad sticky top-0 z-40 border-b border-charcoal/8 bg-sand-100/80 py-3 backdrop-blur-lg">
      <nav aria-label="Navigasi utama" className="container-lux flex items-center justify-between gap-6">
        <Logo />

        <div className="hidden items-center gap-7 text-[15px] lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="py-3 text-charcoal transition-colors hover:text-olive-600">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink("Halo Luxea Estate, saya ingin bertanya tentang stok tanah.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-charcoal px-4 text-[15px] font-medium text-sand-50 transition-colors hover:bg-olive-700 sm:px-5"
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">Chat WhatsApp</span>
            <span className="sr-only sm:hidden">Chat WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-charcoal/20 lg:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-3 top-[68px] rounded-3xl bg-sand-50 p-2 shadow-[var(--shadow-lift)] lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex min-h-13 items-center rounded-2xl px-4 text-[22px] tracking-[-0.02em] hover:bg-sand-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
