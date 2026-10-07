import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { CustomCursor } from "@/components/motion/CustomCursor";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument-sans", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument-serif", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Luxea Estate · Investasi Tanah & Properti Transparan di Bali",
    template: "%s · Luxea Estate",
  },
  description:
    "Agensi properti & tanah independen di Bali. Tanah dan properti siap bangun di Badung, Tabanan, dan Denpasar dengan pengecekan sertifikat, zonasi ITR, dan site visit bersama Ryan & tim.",
  openGraph: {
    title: "Luxea Estate",
    description: "Investasi Tanah & Properti Transparan di Bali",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#EFE8DC",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="sr-only z-50 rounded-full bg-charcoal px-4 py-2 text-sand-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Lewati ke konten
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <CustomCursor />
      </body>
    </html>
  );
}
