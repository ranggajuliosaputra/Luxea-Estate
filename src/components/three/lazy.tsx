"use client";

import dynamic from "next/dynamic";

const Loading = ({ dark = false }: { dark?: boolean }) => (
  <div className={`absolute inset-0 grid place-items-center text-sm ${dark ? "text-ink-dark-3" : "text-ink-3"}`}>Memuat 3D…</div>
);

// WebGL components render only in the browser.
export const ShaderBackground = dynamic(() => import("./ShaderBackground").then((m) => m.ShaderBackground), { ssr: false });
export const ParcelPreview3D = dynamic(() => import("./ParcelPreview3D").then((m) => m.ParcelPreview3D), {
  ssr: false,
  loading: () => <Loading />,
});
export const RegionMap3D = dynamic(() => import("./RegionMap3D").then((m) => m.RegionMap3D), {
  ssr: false,
  loading: () => <Loading dark />,
});
