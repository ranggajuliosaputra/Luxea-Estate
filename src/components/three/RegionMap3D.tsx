"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { island, regionAnchors, regionShapes, MAP_H, MAP_W } from "@/lib/bali";
import type { RegionId } from "@/lib/data";

const SCALE = 0.1;
const toShape = (pts: Array<[number, number]>) => {
  const shape = new THREE.Shape();
  pts.forEach(([x, y], i) => {
    const X = (x - MAP_W / 2) * SCALE;
    const Y = -(y - MAP_H / 2) * SCALE;
    if (i === 0) shape.moveTo(X, Y);
    else shape.lineTo(X, Y);
  });
  shape.closePath();
  return shape;
};

const COLORS = {
  island: new THREE.Color("#B9AD93"),
  region: new THREE.Color("#E6DCC6"),
  regionHover: new THREE.Color("#F2EADA"),
  active: new THREE.Color("#A7B675"),
};

type Props = {
  active: RegionId;
  onSelect: (id: RegionId) => void;
  names: Record<RegionId, string>;
};

/**
 * Interactive 3D Bali (Three.js): extruded island with Badung, Tabanan and
 * Denpasar raised as separate meshes. Hover highlights, click selects, drag
 * tilts the camera. The selected regency lifts with a GSAP tween.
 */
export function RegionMap3D({ active, onSelect, names }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Partial<Record<RegionId, HTMLButtonElement | null>>>({});
  const activeRef = useRef(active);
  const meshesRef = useRef<Partial<Record<RegionId, THREE.Mesh>>>({});
  const paintRef = useRef<() => void>(() => {});
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Scene setup (once)
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      host.dataset.fallback = "true";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y";
    host.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 1, 400);
    const orbit = { theta: -0.18, phi: 0.92, radius: 92 };
    const placeCamera = () => {
      camera.position.set(
        orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta),
        orbit.radius * Math.cos(orbit.phi),
        orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta),
      );
      camera.lookAt(0, 0, 2);
    };
    placeCamera();

    scene.add(new THREE.HemisphereLight("#FFF8EA", "#2C2D27", 1.6));
    const sun = new THREE.DirectionalLight("#FFF1D6", 2.2);
    sun.position.set(-30, 60, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 35, bottom: -35 });
    scene.add(sun);

    const root = new THREE.Group();
    root.rotation.x = -Math.PI / 2;
    scene.add(root);

    // Sea plane with faint contour rings
    const sea = new THREE.Mesh(new THREE.CircleGeometry(70, 64), new THREE.MeshStandardMaterial({ color: "#2C2D27", roughness: 1 }));
    sea.position.z = -0.01;
    sea.receiveShadow = true;
    root.add(sea);
    for (let r = 40; r <= 66; r += 6.5) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r, r + 0.08, 96),
        new THREE.MeshBasicMaterial({ color: "#EFE8DC", transparent: true, opacity: 0.06 }),
      );
      root.add(ring);
    }

    const extrude = (pts: Array<[number, number]>, depth: number) =>
      new THREE.ExtrudeGeometry(toShape(pts), { depth, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.2, bevelSegments: 2 });

    const islandMesh = new THREE.Mesh(extrude(island, 1.6), new THREE.MeshStandardMaterial({ color: COLORS.island, roughness: 0.9 }));
    islandMesh.castShadow = true;
    islandMesh.receiveShadow = true;
    root.add(islandMesh);

    // Volcano cones (Agung, Batur) for orientation
    const coneMat = new THREE.MeshStandardMaterial({ color: "#9C8F74", roughness: 1 });
    ([[545, 158, 2.8], [490, 116, 2]] as const).forEach(([x, y, s]) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(s * 1.6, s * 1.8, 24), coneMat);
      cone.rotation.x = Math.PI / 2;
      cone.position.set((x - MAP_W / 2) * SCALE, -(y - MAP_H / 2) * SCALE, 1.8 + s * 0.9);
      cone.castShadow = true;
      root.add(cone);
    });

    const regionIds = Object.keys(regionShapes) as RegionId[];
    regionIds.forEach((id) => {
      const mesh = new THREE.Mesh(
        extrude(regionShapes[id], 2.2),
        new THREE.MeshStandardMaterial({ color: COLORS.region.clone(), roughness: 0.75 }),
      );
      mesh.userData.id = id;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      root.add(mesh);
      meshesRef.current[id] = mesh;
    });

    // Interaction: hover, click, drag-to-orbit
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered: RegionId | null = null;
    let drag: { x: number; y: number; theta: number; phi: number; moved: boolean } | null = null;

    const pick = (e: PointerEvent): RegionId | null => {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(Object.values(meshesRef.current) as THREE.Mesh[])[0];
      return (hit?.object.userData.id as RegionId | undefined) ?? null;
    };

    const paint = () => {
      regionIds.forEach((id) => {
        const mesh = meshesRef.current[id];
        if (!mesh) return;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const color = id === activeRef.current ? COLORS.active : id === hovered ? COLORS.regionHover : COLORS.region;
        gsap.to(mat.color, { r: color.r, g: color.g, b: color.b, duration: 0.45, overwrite: true });
      });
    };
    paintRef.current = paint;

    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, theta: orbit.theta, phi: orbit.phi, moved: false };
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (drag) {
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
        orbit.theta = THREE.MathUtils.clamp(drag.theta - dx * 0.005, -0.9, 0.9);
        orbit.phi = THREE.MathUtils.clamp(drag.phi - dy * 0.004, 0.45, 1.15);
        placeCamera();
        return;
      }
      const id = pick(e);
      if (id !== hovered) {
        hovered = id;
        renderer.domElement.style.cursor = id ? "pointer" : "grab";
        paint();
      }
    };
    const onUp = (e: PointerEvent) => {
      if (drag && !drag.moved) {
        const id = pick(e);
        if (id) onSelectRef.current(id);
      }
      drag = null;
    };
    const onLeave = () => {
      hovered = null;
      paint();
    };
    const el = renderer.domElement;
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Fit the island's width (~68 units) to the horizontal field of view
      const halfV = THREE.MathUtils.degToRad(camera.fov / 2);
      const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
      orbit.radius = Math.max(34 / Math.tan(halfH), 64);
      camera.updateProjectionMatrix();
      placeCamera();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);

    const anchor = new THREE.Vector3();
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!reduced) root.position.y = Math.sin(t * 0.9) * 0.35;
      renderer.render(scene, camera);

      // Keep the HTML labels pinned to their regions
      const { clientWidth: w, clientHeight: h } = host;
      regionIds.forEach((id) => {
        const label = labelRefs.current[id];
        const mesh = meshesRef.current[id];
        if (!label || !mesh) return;
        const [ax, ay] = regionAnchors[id];
        anchor.set((ax - MAP_W / 2) * SCALE, -(ay - MAP_H / 2) * SCALE, 2.6 + mesh.position.z);
        root.localToWorld(anchor);
        anchor.project(camera);
        label.style.transform = `translate(${((anchor.x + 1) / 2) * w}px, ${((1 - anchor.y) / 2) * h}px) translate(-50%, -130%)`;
      });
    };
    tick();
    paint();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      el.remove();
      meshesRef.current = {};
    };
  }, []);

  // React to selection changes: lift the active regency, lower the others
  useEffect(() => {
    activeRef.current = active;
    (Object.keys(meshesRef.current) as RegionId[]).forEach((id) => {
      const mesh = meshesRef.current[id];
      if (mesh) gsap.to(mesh.position, { z: id === active ? 1.6 : 0, duration: 0.7, ease: "power3.out" });
    });
    paintRef.current();
  }, [active]);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {(Object.keys(regionShapes) as RegionId[]).map((id) => (
        <button
          key={id}
          ref={(node) => {
            labelRefs.current[id] = node;
          }}
          type="button"
          onClick={() => onSelect(id)}
          aria-pressed={active === id}
          className={`absolute top-0 left-0 hidden min-h-9 sm:inline-flex items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold whitespace-nowrap shadow-lg transition-colors ${
            active === id ? "bg-sand-100 text-charcoal" : "bg-charcoal/80 text-sand-100 hover:bg-charcoal"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${active === id ? "bg-olive-600" : "bg-olive-400"}`} />
          {names[id]}
        </button>
      ))}
    </div>
  );
}
