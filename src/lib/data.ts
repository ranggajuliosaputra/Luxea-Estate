// Sample content. Titles and sizes are examples; prices stay as [HARGA]
// placeholders until real listing data is connected.

export type RegionId = "badung" | "tabanan" | "denpasar";
export type LegalStatus = "Freehold SHM" | "Leasehold";
export type PropertyType = "Tanah" | "Rumah" | "Villa" | "Ruko";

export type Region = {
  id: RegionId;
  name: string;
  kicker: string;
  description: string;
  areas: string[];
  profile: string;
};

export type LegalCheck = {
  title: string;
  verified: boolean;
  detail: string;
};

export type Listing = {
  slug: string;
  code: string;
  region: RegionId;
  title: string;
  place: string;
  type: PropertyType;
  status: LegalStatus;
  statusNote: string;
  leaseYears?: number;
  landAre: number;
  dimensions?: string;
  buildingM2?: number;
  roadWidthM?: number;
  zone: string;
  zoneTone: "yellow" | "commercial";
  price: string;
  priceNote: string;
  media: "Video drone" | "Foto drone";
  tone: string;
  summary: string;
  legal: LegalCheck[];
  /** Optional real photo in /public, e.g. "/listings/pererenan.jpg" */
  image?: string;
};

export const regions: Region[] = [
  {
    id: "badung",
    name: "Badung",
    kicker: "Komersial · Hospitality · Yield sewa ekspat",
    description:
      "Pusat pariwisata Bali selatan dan rumah bagi komunitas ekspat. Lahan dan villa di sini umumnya dibeli untuk disewakan, harian, bulanan, maupun tahunan.",
    areas: ["Canggu", "Pererenan", "Seminyak", "Jimbaran", "Uluwatu"],
    profile: "Investor yang mengejar arus kas sewa",
  },
  {
    id: "tabanan",
    name: "Tabanan",
    kicker: "Tanah jangka panjang · Eco-living · Apresiasi kapital",
    description:
      "Tetangga barat Canggu dengan bentang sawah, pantai pasir hitam, dan bidang tanah yang lebih luas. Cocok untuk menahan aset beberapa tahun atau membangun hunian yang tenang.",
    areas: ["Kedungu", "Nyanyi", "Kerambitan", "Selemadeg"],
    profile: "Investor yang sabar menunggu kenaikan nilai",
  },
  {
    id: "denpasar",
    name: "Denpasar",
    kicker: "Residensial lokal · Ruko komersial · Pusat kota",
    description:
      "Ibu kota provinsi dengan sekolah, rumah sakit, dan perkantoran. Permintaan datang dari keluarga lokal dan pelaku usaha yang membutuhkan ruko di jalan utama.",
    areas: ["Renon", "Sanur", "Teuku Umar", "Panjer"],
    profile: "Hunian keluarga dan ruang usaha di kota",
  },
];

const baseLegal = (zone: string, extra: LegalCheck[] = []): LegalCheck[] => [
  {
    title: "Sertifikat induk dicek ke BPN",
    verified: true,
    detail:
      "Sertifikat Hak Milik atas nama pemilik tanah, nomor [NO. SHM]. Pengecekan resmi dilakukan melalui notaris/PPAT.",
  },
  {
    title: `Zonasi ITR: ${zone}`,
    verified: true,
    detail:
      "Peruntukan lahan sudah dicocokkan dengan peta tata ruang (ITR/KKPR). Tangkapan peta resmi kami lampirkan saat site visit.",
  },
  {
    title: "Akses jalan legal",
    verified: true,
    detail: "Lahan berbatasan langsung dengan jalan umum yang tercatat, bukan jalan pinjaman tetangga.",
  },
  {
    title: "Identitas pemilik cocok dengan sertifikat",
    verified: true,
    detail: "KTP dan KK pemilik sudah dicocokkan dengan nama di sertifikat. Persetujuan ahli waris: [CEK].",
  },
  ...extra,
];

export const listings: Listing[] = [
  {
    slug: "lahan-pererenan-5-are",
    code: "LX-BDG-014",
    region: "badung",
    title: "Lahan siap bangun dekat Pantai Pererenan",
    place: "Pererenan, Badung",
    type: "Tanah",
    status: "Leasehold",
    statusNote: "25 thn",
    leaseYears: 25,
    landAre: 5,
    dimensions: "20 × 25 m",
    roadWidthM: 6,
    zone: "ITR Zona Kuning · Permukiman",
    zoneTone: "yellow",
    price: "Rp [HARGA]",
    priceNote: "Per are / tahun",
    media: "Video drone",
    tone: "#D8CDB6",
    summary:
      "Bidang tanah rata berbentuk persegi panjang di jalan aspal, berada di zona permukiman. Cocok untuk satu villa dua sampai tiga kamar untuk disewakan.",
    legal: baseLegal("Kuning (permukiman)", [
      {
        title: "PBB tahun berjalan",
        verified: false,
        detail: "Bukti pembayaran PBB tahun ini sedang kami minta dari pemilik dan akan diperbarui sebelum akta ditandatangani.",
      },
      {
        title: "Draf akta sewa & opsi perpanjangan",
        verified: false,
        detail: "Draf akta sewa sedang disusun notaris. Klausul opsi perpanjangan akan dibagikan untuk Anda tinjau.",
      },
    ]),
  },
  {
    slug: "villa-canggu-3-kamar",
    code: "LX-BDG-021",
    region: "badung",
    title: "Villa tiga kamar dengan kolam pribadi",
    place: "Canggu, Badung",
    type: "Villa",
    status: "Freehold SHM",
    statusNote: "SHM",
    landAre: 3.2,
    buildingM2: 210,
    roadWidthM: 5,
    zone: "ITR Zona Kuning · Permukiman",
    zoneTone: "yellow",
    price: "Rp [HARGA]",
    priceNote: "Harga total",
    media: "Foto drone",
    tone: "#CBD0B4",
    summary: "Villa siap huni dengan tiga kamar tidur, kolam pribadi, dan akses mobil sampai depan pintu.",
    legal: baseLegal("Kuning (permukiman)", [
      { title: "PBG / IMB bangunan", verified: true, detail: "Persetujuan Bangunan Gedung tersedia dan sesuai dengan bangunan terpasang." },
    ]),
  },
  {
    slug: "lahan-kedungu-view-sawah",
    code: "LX-TBN-007",
    region: "tabanan",
    title: "Lahan view sawah, lima menit ke Pantai Kedungu",
    place: "Kedungu, Tabanan",
    type: "Tanah",
    status: "Freehold SHM",
    statusNote: "SHM",
    landAre: 12,
    dimensions: "30 × 40 m",
    roadWidthM: 4,
    zone: "ITR Zona Kuning · Permukiman",
    zoneTone: "yellow",
    price: "Rp [HARGA]",
    priceNote: "Per are",
    media: "Video drone",
    tone: "#C7CCA8",
    summary: "Bidang luas menghadap sawah terbuka. Cocok untuk ditahan jangka panjang atau dibangun hunian dengan lahan hijau.",
    legal: baseLegal("Kuning (permukiman)"),
  },
  {
    slug: "lahan-kerambitan-tepi-sungai",
    code: "LX-TBN-011",
    region: "tabanan",
    title: "Lahan tepi sungai untuk eco-retreat",
    place: "Kerambitan, Tabanan",
    type: "Tanah",
    status: "Leasehold",
    statusNote: "30 thn",
    leaseYears: 30,
    landAre: 20,
    roadWidthM: 4,
    zone: "ITR Zona Kuning · Permukiman",
    zoneTone: "yellow",
    price: "Rp [HARGA]",
    priceNote: "Per are / tahun",
    media: "Video drone",
    tone: "#D3D6BC",
    summary: "Lahan berkontur lembut di tepi sungai dengan pepohonan besar. Pas untuk konsep eco-retreat skala kecil.",
    legal: baseLegal("Kuning (permukiman)", [
      { title: "Sempadan sungai", verified: false, detail: "Batas sempadan sungai sedang diukur ulang bersama petugas untuk memastikan luas efektif." },
    ]),
  },
  {
    slug: "ruko-teuku-umar-3-lantai",
    code: "LX-DPS-003",
    region: "denpasar",
    title: "Ruko tiga lantai di jalan utama",
    place: "Teuku Umar, Denpasar",
    type: "Ruko",
    status: "Freehold SHM",
    statusNote: "SHM",
    landAre: 1.5,
    buildingM2: 240,
    roadWidthM: 12,
    zone: "ITR Zona Perdagangan & Jasa",
    zoneTone: "commercial",
    price: "Rp [HARGA]",
    priceNote: "Harga total",
    media: "Foto drone",
    tone: "#E0D2BC",
    summary: "Ruko di koridor komersial dengan arus lalu lintas tinggi, cocok untuk kantor, showroom, atau usaha F&B.",
    legal: baseLegal("Perdagangan & Jasa", [
      { title: "PBG / IMB bangunan", verified: true, detail: "Persetujuan Bangunan Gedung tersedia untuk fungsi usaha." },
    ]),
  },
  {
    slug: "rumah-renon-keluarga",
    code: "LX-DPS-009",
    region: "denpasar",
    title: "Rumah keluarga dekat Lapangan Renon",
    place: "Renon, Denpasar",
    type: "Rumah",
    status: "Freehold SHM",
    statusNote: "SHM",
    landAre: 2.5,
    buildingM2: 160,
    roadWidthM: 6,
    zone: "ITR Zona Kuning · Permukiman",
    zoneTone: "yellow",
    price: "Rp [HARGA]",
    priceNote: "Harga total",
    media: "Foto drone",
    tone: "#D9CDB5",
    summary: "Rumah dua lantai di lingkungan tenang, dekat sekolah dan kantor pemerintahan.",
    legal: baseLegal("Kuning (permukiman)"),
  },
];

export type BadgeVariant = "freehold" | "leasehold" | "itr" | "commercial";

export function variantForStatus(status: LegalStatus): BadgeVariant {
  return status === "Freehold SHM" ? "freehold" : "leasehold";
}

export function formatAre(value: number): string {
  return `${value.toLocaleString("id-ID", { minimumFractionDigits: value % 1 ? 1 : 0, maximumFractionDigits: 1 })} are`;
}

export function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}
