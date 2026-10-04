export const site = {
  name: "Luxea Estate",
  tagline: "Investasi Tanah & Properti Transparan di Bali",
  instagram: "luxea.estate",
  instagramUrl: "https://instagram.com/luxea.estate",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  checklistPdfUrl: process.env.NEXT_PUBLIC_CHECKLIST_PDF_URL ?? "",
};

export const navLinks = [
  { href: "/#listings", label: "Listings" },
  { href: "/#region", label: "Region" },
  { href: "/#legal", label: "Legal Guide" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Builds a wa.me deep link with a prefilled message. */
export function whatsappLink(message?: string): string {
  const base = site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}` : "https://wa.me/";
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
