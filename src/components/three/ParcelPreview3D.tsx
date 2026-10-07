"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  /** Plot frontage in metres (along the road). */
  width: number;
  /** Plot depth in metres. */
  depth: number;
  roadWidth?: number;
  /** Show an example building mass on the plot. */
  showMass?: boolean;
  className?: string;
};

/**
 * Parcel preview (Three.js): the plot as a raised slab with survey stakes,
 * 5 m grid, access road and an example building mass. Drag to orbit; it
 * drifts slowly on its own unless reduced motion is on.
 */
export function ParcelPreview3D({ width, depth, roadWidth = 6, showMass = true, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widthLabel = useRef<HTMLSpanElement>(null);
  const depthLabel = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";
    host.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const size = Math.max(width, depth);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 600);
    const orbit = { theta: 0.75, phi: 0.95, radius: size * 3.1 };
    const place = () => {
      camera.position.set(
        orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta),
        orbit.radius * Math.cos(orbit.phi),
        orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta),
      );
      camera.lookAt(0, 0, 0);
    };
    place();

    scene.add(new THREE.HemisphereLight("#FFF8EA", "#8A7E66", 1.5));
    const sun = new THREE.DirectionalLight("#FFF1D6", 2.4);
    sun.position.set(size, size * 2, size * 0.8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    const s = size * 1.4;
    Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, far: size * 6 });
    scene.add(sun);

    const mat = (color: string, roughness = 0.9) => new THREE.MeshStandardMaterial({ color, roughness });

    // Ground with faint survey contours
    const ground = new THREE.Mesh(new THREE.CircleGeometry(size * 2.4, 72), mat("#E9E3D4", 1));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    for (let i = 1; i <= 4; i++) {
      const r = size * (0.85 + i * 0.32);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r, r + size * 0.006, 128),
        new THREE.MeshBasicMaterial({ color: "#5B6B3A", transparent: true, opacity: 0.18 }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      ring.scale.set(1, 0.72, 1);
      scene.add(ring);
    }

    // The plot: olive top, darker sides
    const slabH = size * 0.03;
    const side = mat("#4B5730");
    const plot = new THREE.Mesh(new THREE.BoxGeometry(width, slabH, depth), [side, side, mat("#A7B675", 0.8), side, side, side]);
    plot.position.y = slabH / 2;
    plot.castShadow = true;
    plot.receiveShadow = true;
    scene.add(plot);

    // 5 m survey grid on top of the plot
    const gridPts: number[] = [];
    for (let x = -width / 2 + 5; x < width / 2; x += 5) gridPts.push(x, slabH + 0.02, -depth / 2, x, slabH + 0.02, depth / 2);
    for (let z = -depth / 2 + 5; z < depth / 2; z += 5) gridPts.push(-width / 2, slabH + 0.02, z, width / 2, slabH + 0.02, z);
    const grid = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(gridPts, 3)),
      new THREE.LineBasicMaterial({ color: "#F7F3EC", transparent: true, opacity: 0.55 }),
    );
    scene.add(grid);

    // Boundary stakes (patok)
    const stakeGeo = new THREE.CylinderGeometry(size * 0.012, size * 0.012, size * 0.07, 12);
    const stakeMat = mat("#23241F", 0.6);
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sz]) => {
      const stake = new THREE.Mesh(stakeGeo, stakeMat);
      stake.position.set((sx * width) / 2, slabH + size * 0.035, (sz * depth) / 2);
      stake.castShadow = true;
      scene.add(stake);
    });

    // Access road along the front edge
    const roadLen = depth + size * 1.4;
    const road = new THREE.Mesh(new THREE.BoxGeometry(roadWidth, 0.12, roadLen), mat("#3A3B35", 0.95));
    road.position.set(-width / 2 - roadWidth / 2 - 0.6, 0.06, 0);
    road.receiveShadow = true;
    scene.add(road);
    const dashPts: number[] = [];
    for (let z = -roadLen / 2; z < roadLen / 2; z += 3) dashPts.push(road.position.x, 0.14, z, road.position.x, 0.14, z + 1.5);
    scene.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(dashPts, 3)),
        new THREE.LineBasicMaterial({ color: "#EFE8DC" }),
      ),
    );

    // Example building mass
    if (showMass) {
      const mw = Math.min(width * 0.5, 12);
      const md = Math.min(depth * 0.4, 10);
      const mh = 6.5;
      const mass = new THREE.Mesh(new THREE.BoxGeometry(mw, mh, md), mat("#F7F3EC", 0.7));
      mass.position.set(width * 0.08, slabH + mh / 2, -depth * 0.08);
      mass.castShadow = true;
      mass.receiveShadow = true;
      scene.add(mass);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(mw + 1.2, 0.35, md + 1.2), mat("#C4B89F", 0.8));
      roof.position.set(mass.position.x, slabH + mh + 0.17, mass.position.z);
      roof.castShadow = true;
      scene.add(roof);
      const pool = new THREE.Mesh(new THREE.BoxGeometry(mw * 0.7, 0.05, 3), new THREE.MeshStandardMaterial({ color: "#7FB3B0", roughness: 0.2 }));
      pool.position.set(mass.position.x, slabH + 0.03, mass.position.z + md / 2 + 2.6);
      scene.add(pool);
    }

    // A few trees around the plot
    const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.4, 8);
    const crownGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const trunkMat = mat("#6A604E");
    const crownMat = mat("#5B6B3A", 1);
    [[width / 2 + 5, depth / 2 - 2], [width / 2 + 8, depth / 2 - 6], [width / 2 + 4, -depth / 2 + 3], [-width / 4, -depth / 2 - 5], [width / 3, depth / 2 + 6]].forEach(
      ([x, z], i) => {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.2;
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.y = 3.4;
        crown.scale.setScalar(0.8 + (i % 3) * 0.2);
        trunk.castShadow = crown.castShadow = true;
        tree.add(trunk, crown);
        tree.position.set(x, 0, z);
        scene.add(tree);
      },
    );

    // Drag to orbit
    let drag: { x: number; y: number; theta: number; phi: number } | null = null;
    let idleAt = 0;
    const el = renderer.domElement;
    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, theta: orbit.theta, phi: orbit.phi };
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      orbit.theta = drag.theta - (e.clientX - drag.x) * 0.008;
      orbit.phi = THREE.MathUtils.clamp(drag.phi - (e.clientY - drag.y) * 0.005, 0.35, 1.3);
      place();
    };
    const up = () => {
      drag = null;
      idleAt = performance.now();
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);

    const v = new THREE.Vector3();
    const pin = (label: HTMLSpanElement | null, x: number, z: number) => {
      if (!label) return;
      v.set(x, slabH + 0.5, z).project(camera);
      label.style.transform = `translate(${((v.x + 1) / 2) * host.clientWidth}px, ${((1 - v.y) / 2) * host.clientHeight}px) translate(-50%, -50%)`;
    };

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = (now - last) / 1000;
      last = now;
      if (!visible) return;
      if (!reduced && !drag && now - idleAt > 2500) {
        orbit.theta += dt * 0.12;
        place();
      }
      renderer.render(scene, camera);
      pin(widthLabel.current, 0, depth / 2 + 1.5);
      pin(depthLabel.current, width / 2 + 1.5, 0);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          const m = obj.material;
          (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose());
        }
      });
      renderer.dispose();
      el.remove();
    };
  }, [width, depth, roadWidth, showMass]);

  const chip = "pointer-events-none absolute top-0 left-0 rounded-full bg-paper/90 px-2 py-0.5 text-[11px] font-semibold text-charcoal shadow";
  return (
    <div
      ref={hostRef}
      className={className ?? "relative h-full w-full"}
      role="img"
      aria-label={`Simulasi 3D bidang tanah ${width} × ${depth} meter dengan akses jalan ${roadWidth} meter`}
    >
      <span ref={widthLabel} className={chip}>
        {width} m
      </span>
      <span ref={depthLabel} className={chip}>
        {depth} m
      </span>
    </div>
  );
}
