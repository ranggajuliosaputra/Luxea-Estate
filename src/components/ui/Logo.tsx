import Link from "next/link";

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <rect width="34" height="34" rx="10" fill="#5B6B3A" />
      <path d="M7 23c4.5-6.5 15.5-6.5 20 0" fill="none" stroke="#EFE8DC" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10.5 18c3.4-4.6 9.6-4.6 13 0" fill="none" stroke="#EFE8DC" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="11.5" r="1.8" fill="#EFE8DC" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link href="/" aria-label="Luxea Estate, ke beranda" className={`flex items-center gap-2.5 ${tone === "dark" ? "text-charcoal" : "text-sand-100"}`}>
      <LogoMark />
      <span className="text-xl font-semibold tracking-[-0.02em]">
        Luxea <span className="accent text-[23px]">Estate</span>
      </span>
    </Link>
  );
}
