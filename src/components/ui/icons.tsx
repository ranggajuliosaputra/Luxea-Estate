type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export function WhatsAppIcon({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} className={className} {...base(size)}>
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
      <path d="M9 9.2c.3 2.6 2.2 4.7 4.9 5.6l1.3-1.3 2 1-.4 1.6c-3.9.3-8.4-3.6-8.6-7.6l1.6-.5 1 2z" />
    </svg>
  );
}

export function ArrowRight({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" strokeWidth={1.6} className={className} {...base(size)}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowUpRight({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" strokeWidth={1.6} className={className} {...base(size)}>
      <path d="M4 12L12 4M6 4h6v6" />
    </svg>
  );
}

export function DownloadIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" strokeWidth={1.6} className={className} {...base(size)}>
      <path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M3 13.5h10" />
    </svg>
  );
}

export function SearchIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" strokeWidth={1.6} className={className} {...base(size)}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  );
}

export function PinIcon({ size = 14, className }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" strokeWidth={1.3} className={className} {...base(size)}>
      <path d="M7 12.5s4-3.6 4-6.8a4 4 0 0 0-8 0c0 3.2 4 6.8 4 6.8z" />
      <circle cx="7" cy="5.6" r="1.4" />
    </svg>
  );
}

export function PlayIcon({ size = 10, className }: IconProps) {
  return (
    <svg viewBox="0 0 10 10" width={size} height={size} className={className} aria-hidden="true">
      <path d="M2 1.2v7.6L8.5 5z" fill="currentColor" />
    </svg>
  );
}

export function InstagramIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" strokeWidth={1.4} className={className} {...base(size)}>
      <rect x="1.5" y="1.5" width="13" height="13" rx="4" />
      <circle cx="8" cy="8" r="3" />
      <circle cx="11.8" cy="4.2" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function MapIcon({ size = 28, className }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" strokeWidth={1.5} className={className} {...base(size)}>
      <path d="M4 7l6-3 8 3 6-3v17l-6 3-8-3-6 3z" />
      <path d="M10 4v17M18 7v17" />
    </svg>
  );
}

export function PeopleIcon({ size = 28, className }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" strokeWidth={1.5} className={className} {...base(size)}>
      <circle cx="10" cy="9" r="4" />
      <path d="M3 23c0-4 3-7 7-7s7 3 7 7" />
      <circle cx="20" cy="10" r="3" />
      <path d="M19 16c3.5 0 6 2.6 6 6" />
    </svg>
  );
}

export function LocationIcon({ size = 28, className }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" strokeWidth={1.5} className={className} {...base(size)}>
      <path d="M14 25s8-7.5 8-13.5a8 8 0 0 0-16 0C6 17.5 14 25 14 25z" />
      <circle cx="14" cy="11.5" r="3" />
    </svg>
  );
}

export function ChevronDown({ size = 14, className }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" strokeWidth={1.5} className={className} {...base(size)}>
      <path d="M3 5l4 4 4-4" />
    </svg>
  );
}

export function MenuIcon({ open, size = 18 }: { open: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 18 18" strokeWidth={1.6} {...base(size)}>
      {open ? <path d="M4 4l10 10M14 4L4 14" /> : <path d="M3 6h12M3 12h12" />}
    </svg>
  );
}
