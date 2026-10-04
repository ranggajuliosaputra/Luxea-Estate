import { Reveal } from "@/components/motion/Reveal";
import { InstagramIcon, PlayIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

type FeedItem = { id: string; caption: string; href: string; image?: string; video: boolean; tone: string; seed: number };

const placeholderFeed: FeedItem[] = [
  { caption: "Site visit pagi di Kedungu", tone: "#C7CCA8", video: false },
  { caption: "Drone: bidang 5 are, Pererenan", tone: "#D8CDB6", video: true },
  { caption: "Cek patok batas di Kerambitan", tone: "#CFC4AC", video: false },
  { caption: "Cara membaca peta ITR", tone: "#B9C09A", video: true },
  { caption: "Hari tanda tangan di notaris", tone: "#E0D2BC", video: false },
  { caption: "Senja dari lahan Nyanyi", tone: "#D3D6BC", video: true },
].map((x, i) => ({ ...x, id: `p${i}`, href: site.instagramUrl, seed: i }));

type GraphMedia = { id: string; caption?: string; media_type: string; media_url?: string; thumbnail_url?: string; permalink: string };

/**
 * Live feed from the Instagram Graph API when INSTAGRAM_ACCESS_TOKEN is set
 * (cached 30 min); otherwise placeholder tiles.
 */
async function getFeed(): Promise<{ items: FeedItem[]; live: boolean }> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return { items: placeholderFeed, live: false };
  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=6&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Instagram ${res.status}`);
    const json = (await res.json()) as { data: GraphMedia[] };
    const tones = placeholderFeed.map((p) => p.tone);
    return {
      live: true,
      items: json.data.slice(0, 6).map((m, i) => ({
        id: m.id,
        caption: (m.caption ?? "").split("\n")[0].slice(0, 80) || "Lihat di Instagram",
        href: m.permalink,
        image: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
        video: m.media_type === "VIDEO",
        tone: tones[i % tones.length],
        seed: i,
      })),
    };
  } catch (err) {
    console.error("[instagram] feed unavailable", err);
    return { items: placeholderFeed, live: false };
  }
}

const loop = "M-120,0 C-120,-70 -50,-105 10,-98 C80,-90 128,-48 122,8 C116,66 60,104 -4,100 C-70,96 -120,58 -120,0 Z";

export async function About() {
  const feed = await getFeed();

  return (
    <section id="about" className="section-pad scroll-mt-20 pt-20 sm:pt-32">
      <div className="container-lux flex flex-col gap-14">
        <div className="flex flex-wrap items-stretch gap-12">
          <Reveal className="relative min-h-[420px] min-w-0 flex-[1_1_380px] overflow-hidden rounded-[28px] bg-sand-400 sm:min-h-[520px]">
            <svg aria-hidden="true" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
              <g transform="translate(260,180)" fill="none" stroke="#fff" strokeOpacity="0.45">
                {[0.5, 1, 1.6, 2.3, 3.1, 4].map((s) => (
                  <path key={s} d={loop} transform={`scale(${s})`} vectorEffect="non-scaling-stroke" />
                ))}
              </g>
            </svg>
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 rounded-[18px] bg-sand-50/75 px-[18px] py-4 backdrop-blur-md">
              <div>
                <div className="font-semibold">Ryan &amp; tim</div>
                <div className="text-[13px] text-ink-2">[FOTO: site visit di lokasi]</div>
              </div>
              <span className="accent text-[22px] text-olive-600">Bali</span>
            </div>
          </Reveal>

          <Reveal className="flex min-w-0 flex-[999_1_520px] flex-col justify-center gap-7">
            <span className="eyebrow">About</span>
            <h2 className="max-w-[14ch] text-h2 font-medium">
              Agensi kecil yang <span className="accent text-olive-600">datang</span> ke lokasi.
            </h2>
            <p className="max-w-[620px] text-[17px] leading-[1.65] text-ink-2 sm:text-lg">
              Luxea Estate adalah agensi properti dan tanah independen yang dijalankan Ryan bersama tim kecil di Bali. Sebelum sebuah lahan kami
              tawarkan, kami datang ke lokasinya, mengukur akses jalan, membaca peta zonasi, dan memeriksa dokumennya. Apa yang kami temukan di
              lapangan, termasuk kekurangannya, kami sampaikan apa adanya.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
              {[
                ["i.", "Lokasi dulu", "Tidak ada listing tanpa kunjungan."],
                ["ii.", "Dokumen sebelum harga", "Legalitas dibuka di awal."],
                ["iii.", "Bicara apa adanya", "Termasuk saat jawabannya “jangan beli”."],
              ].map(([n, t, d]) => (
                <div key={n} className="rounded-[20px] bg-sand-50 p-5">
                  <span className="accent text-[26px] text-olive-600">{n}</span>
                  <div className="mt-1.5 font-semibold">{t}</div>
                  <div className="mt-1 text-sm text-ink-2">{d}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3.5">
              <span className="text-[clamp(24px,2.4vw,32px)] font-medium tracking-[-0.02em]">
                Dari lapangan <span className="accent text-olive-600">@{site.instagram}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-sand-200 px-3 py-1.5 text-[13px] text-olive-800">
                <span className="lx-dot text-signal" />
                {feed.live ? "Live feed Instagram" : "Feed Instagram"}
              </span>
            </div>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-charcoal/25 px-5 font-medium transition-colors hover:border-charcoal"
            >
              <InstagramIcon /> Ikuti di Instagram
            </a>
          </div>

          <Reveal stagger className="grid grid-cols-3 gap-1.5 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] sm:gap-3">
            {feed.items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.caption}
                className="group relative block aspect-square overflow-hidden rounded-[14px] sm:rounded-[20px]"
                style={{ background: item.tone }}
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Instagram CDN hosts vary
                  <img src={item.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105">
                    <g transform={`translate(${40 + item.seed * 24},90)`} fill="none" stroke="#fff" strokeOpacity="0.5">
                      {[0.3, 0.6, 0.95, 1.35].map((s) => (
                        <path key={s} d={loop} transform={`scale(${s})`} vectorEffect="non-scaling-stroke" />
                      ))}
                    </g>
                  </svg>
                )}
                {item.video && (
                  <span aria-hidden="true" className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-charcoal/75 text-sand-50 sm:top-3 sm:right-3 sm:h-[30px] sm:w-[30px]">
                    <PlayIcon />
                  </span>
                )}
                <span className="absolute inset-x-3 bottom-3 hidden text-[13px] leading-snug font-medium text-charcoal sm:block">{item.caption}</span>
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
