import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead";

/**
 * Lead capture for the "Checklist Aman Membeli Tanah di Bali" form.
 * Validates the input, forwards it to CRM_WEBHOOK_URL when configured,
 * and returns a prefilled WhatsApp link plus the PDF link.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Format data tidak valid." }, { status: 400 });
  }

  const result = validateLead(body);
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 422 });
  const lead = result.lead;

  const webhook = process.env.CRM_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, source: "checklist-download", createdAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) console.error(`[lead] CRM webhook responded ${res.status}`);
    } catch (err) {
      console.error("[lead] CRM webhook failed", err);
    }
  } else {
    console.info("[lead] New checklist request (set CRM_WEBHOOK_URL to forward):", { name: lead.name, need: lead.need });
  }

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const text = `Halo Luxea Estate, saya ${lead.name} (+${lead.phone}). Kebutuhan: ${lead.need}. Mohon kirim Checklist Aman Membeli Tanah di Bali.`;
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return NextResponse.json({
    ok: true,
    whatsappUrl,
    pdfUrl: process.env.NEXT_PUBLIC_CHECKLIST_PDF_URL || null,
  });
}
