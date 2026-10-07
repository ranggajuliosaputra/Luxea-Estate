import Image from "next/image";

const loop = "M-120,0 C-120,-70 -50,-105 10,-98 C80,-90 128,-48 122,8 C116,66 60,104 -4,100 C-70,96 -120,58 -120,0 Z";

type Props = {
  tone: string;
  image?: string;
  alt?: string;
  /** Seed that shifts the contour centre so cards don't look identical. */
  seed?: number;
  parcel?: boolean;
  label?: string;
  sizes?: string;
};

/**
 * Stand-in for drone photos until real media is added: tonal block with
 * survey contour lines and a dashed parcel outline. Pass `image` to show a
 * real photo from /public instead.
 */
export function MediaPlaceholder({ tone, image, alt = "", seed = 0, parcel = true, label = "[FOTO / VIDEO DRONE]", sizes = "(max-width: 768px) 100vw, 33vw" }: Props) {
  if (image) return <Image src={image} alt={alt} fill sizes={sizes} className="object-cover" />;

  const cx = 80 + ((seed * 97) % 260);
  const cy = 60 + ((seed * 53) % 120);
  const px = 140 + ((seed * 31) % 60);
  return (
    <div className="absolute inset-0" style={{ background: tone }}>
      <svg aria-hidden="true" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g transform={`translate(${cx},${cy})`} fill="none" stroke="#fff" strokeOpacity="0.5">
          {[0.35, 0.7, 1.1, 1.55, 2.05, 2.6, 3.2].map((s) => (
            <path key={s} d={loop} transform={`scale(${s})`} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        {parcel && (
          <polygon
            points={`${px},130 ${px + 85},100 ${px + 150},140 ${px + 62},175`}
            fill="rgba(35,36,31,0.12)"
            stroke="#23241F"
            strokeWidth="1.2"
            strokeDasharray="5 4"
          />
        )}
      </svg>
      {label && <span className="absolute bottom-3 left-3.5 text-xs text-charcoal/70">{label}</span>}
    </div>
  );
}
