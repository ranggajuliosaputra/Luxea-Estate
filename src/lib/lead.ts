export const needs = ["Investasi sewa", "Hunian pribadi", "Pengembangan proyek"] as const;
export type Need = (typeof needs)[number];

export type Lead = { name: string; phone: string; need: Need };

/** Normalises an Indonesian WhatsApp number to 62XXXXXXXXX. */
export function normalisePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (!digits.startsWith("62")) digits = `62${digits}`;
  return digits;
}

export function validateLead(input: unknown): { ok: true; lead: Lead } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Data kosong." };
  const { name, phone, need } = input as Record<string, unknown>;

  const cleanName = typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
  if (cleanName.length < 2 || cleanName.length > 80) return { ok: false, error: "Mohon isi nama Anda (2–80 karakter)." };

  const cleanPhone = typeof phone === "string" ? normalisePhone(phone) : "";
  if (cleanPhone.length < 10 || cleanPhone.length > 15) return { ok: false, error: "Nomor WhatsApp belum valid. Contoh: 812 3456 7890." };

  if (typeof need !== "string" || !needs.includes(need as Need)) return { ok: false, error: "Pilih kategori kebutuhan." };

  return { ok: true, lead: { name: cleanName, phone: cleanPhone, need: need as Need } };
}
