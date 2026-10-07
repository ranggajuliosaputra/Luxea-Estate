# Luxea Estate

Website for **Luxea Estate**, an independent land and property agency in Bali (Badung, Tabanan, Denpasar). Its pitch: *Investasi Tanah & Properti Transparan di Bali*.

Built with **Next.js 16 (App Router) + React 19 + Tailwind CSS v4**, using Three.js, GSAP and Lottie for motion.

## Run on localhost

Requirements: **Node.js 20.9+** (22 LTS recommended) and npm.

```bash
npm install
cp .env.example .env.local   # optional; fill in the WhatsApp number etc.
npm run dev                  # http://localhost:3000
```

Production mode:

```bash
npm run build
npm run start                # http://localhost:3000
```

Use another port: `npm run dev -- -p 4000`.

### Windows: "Turbopack is not supported on this platform … only WASM bindings"

This means Next.js couldn't load its native compiler (`@next/swc-win32-x64-msvc`).

- **Quick workaround:** use webpack instead of Turbopack, with `npm run dev:webpack` and `npm run build:webpack`.
- **Permanent fix:**
  1. Close any running dev server.
  2. Delete the `node_modules` folder, but keep `package-lock.json`.
  3. Run `npm install` again.
  4. If it still fails, install the [Microsoft Visual C++ Redistributable (x64)](https://aka.ms/vs/17/release/vc_redist.x64.exe), restart the terminal, and try again.
- **Also check:** use 64-bit Node.js 20.9+ (`node -p "process.arch"` should print `x64`). Avoid running from a OneDrive-synced folder, because sync or antivirus software can lock the `.node` binary.

Other scripts: `npm run typecheck`.

## Environment variables (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format without `+` (e.g. `6281234567890`). Used by every WhatsApp button. |
| `CRM_WEBHOOK_URL` | Optional. The checklist form POSTs JSON `{ name, phone, need, source, createdAt }` here (Make, Zapier, HubSpot…). |
| `NEXT_PUBLIC_CHECKLIST_PDF_URL` | Optional. Link to the "Checklist Aman Membeli Tanah di Bali" PDF, shown after the form is submitted. |
| `INSTAGRAM_ACCESS_TOKEN` | Optional. Long-lived Instagram Graph API token. When set, the About section shows the live @luxea.estate feed (cached 30 minutes); otherwise it shows placeholder tiles. |

## Page structure

| Section | File | Notes |
| --- | --- | --- |
| 1. Header & Hero | `src/components/layout/Header.tsx`, `src/components/sections/Hero.tsx` | Sticky glass navbar with a WhatsApp CTA; GSAP intro timeline; WebGL contour shader background; 3D plot preview; quick filter for location, type and status |
| 2. Value proposition & legal trust | `src/components/sections/ValueProps.tsx` | 3 pillars; Lottie badges for Freehold, Leasehold and ITR Yellow Zone |
| 3. 3D region showcase | `src/components/sections/RegionShowcase.tsx`, `src/components/three/RegionMap3D.tsx` | Extruded 3D map of Bali; click or hover a regency; drag to rotate |
| 4. Listing grid | `src/components/sections/Listings.tsx` | Region tabs with GSAP Flip transitions; receives filters from the hero and the map |
| 5. Lead magnet | `src/components/sections/LeadMagnet.tsx`, `src/app/api/lead/route.ts` | Validates input, forwards to the CRM webhook and opens WhatsApp; Lottie success/error animations |
| 6. About & social proof | `src/components/sections/About.tsx` | Team story plus the Instagram feed |
| 7. Footer & floating CTA | `src/components/layout/Footer.tsx`, `FloatingWhatsApp.tsx` | "Tanya Stok Tanah" button: a pill on desktop, a bottom bar on mobile |
| Listing detail | `src/app/listings/[slug]/page.tsx` | Media tabs (drone video, photos, 3D plot, ITR map), legal checklist accordion, price toggle, similar listings |

### Design DNA

Brand tokens (colours, type, radius, shadows, easing) live in `src/app/globals.css` under `@theme`:

- **Colours:** sand (`sand-50…400`), olive (`olive-200…800`), charcoal, ITR ochre (`itr`).
- **Fonts:** Instrument Sans for structure; Instrument Serif italic (`.accent` class) for one accent word per heading.

### Motion & 3D

- **GSAP** (`src/lib/gsap.ts`): ScrollTrigger reveals (`Reveal`), hero parallax, Flip on the listing grid, page transitions (`src/app/template.tsx`).
- **Three.js** (`src/components/three/`): the region map, the 3D plot preview and the shader background. All three load only in the browser and pause when off-screen.
- **Lottie** (`src/lib/lottie.ts`): animations are generated in code so they always match the brand colours; rendered with `lottie-react`.
- **Genjutsu cursor** (`src/components/motion/CustomCursor.tsx`): a glass ring that grows over links. It is disabled on touch devices.
- **Reduced motion:** every animation honours `prefers-reduced-motion`.

## Content still needed

Listing titles and sizes in `src/lib/data.ts` are sample data. Prices are still placeholders (`[HARGA]`, `[KISARAN]`, `[TOTAL]`), as are distances (`[X] menit`) and legal-check dates (`[TANGGAL]`). To show real photos, put files in `public/listings/` and set the `image` field on each listing. The Bali outline in `src/lib/bali.ts` is a simplified illustration; swap in GeoJSON for accurate boundaries.
