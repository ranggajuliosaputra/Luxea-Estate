"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Genjutsu ambient: slow-drifting topographic contour lines that swell
// around the pointer, like elevation lines on a land survey.
const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uBg;
  uniform vec3 uInk;
  uniform float uStrength;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.4;
    vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0) * 2.4;
    float d = length(p - m);

    float h = fbm(p * 0.85 + vec2(uTime * 0.018, -uTime * 0.012));
    h += 0.22 * exp(-d * d * 1.8);

    float levels = h * 16.0;
    float dist = abs(fract(levels - 0.5) - 0.5);
    float w = fwidth(levels);
    float line = 1.0 - smoothstep(0.0, w * 1.4, dist);

    // every fifth contour is an index line, slightly stronger
    float index = 1.0 - smoothstep(0.0, w * 1.8, abs(fract(levels / 5.0 - 0.5) - 0.5) * 5.0);
    float alpha = (line * 0.16 + index * 0.12) * uStrength;

    // fade towards the reading side (left) so text stays calm
    alpha *= smoothstep(-0.2, 0.9, vUv.x) * 0.85 + 0.15;

    gl_FragColor = vec4(mix(uBg, uInk, alpha), 1.0);
  }
`;

type Props = { background?: string; ink?: string; strength?: number; className?: string };

export function ShaderBackground({ background = "#F7F3EC", ink = "#5B6B3A", strength = 1, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "low-power" });
    } catch {
      return; // No WebGL: the CSS background of the parent stays visible.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.75, 0.6) },
      uBg: { value: new THREE.Color(background) },
      uInk: { value: new THREE.Color(ink) },
      uStrength: { value: strength },
    };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const target = new THREE.Vector2(0.75, 0.6);
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(target, 0.04);
      renderer.render(scene, camera);
    };
    if (reduced) {
      renderer.render(scene, camera);
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [background, ink, strength]);

  return <div ref={hostRef} aria-hidden="true" className={className ?? "pointer-events-none absolute inset-0"} />;
}
