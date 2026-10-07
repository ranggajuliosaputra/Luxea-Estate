// Tiny Lottie (bodymovin) builders for the brand's micro-animations.
// Generated in code so colours stay in sync with the design tokens and
// no binary assets are needed. Rendered with lottie-react.

type Vec = number[];
type Keyframe = { t: number; s: Vec; i?: { x: number[]; y: number[] }; o?: { x: number[]; y: number[] } };
type Prop = { a: 0; k: number | Vec | object } | { a: 1; k: Keyframe[] };

const FPS = 60;

function rgba(hex: string): Vec {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
}

const still = (k: number | Vec | object): Prop => ({ a: 0, k });

/** Animated property: [[frame, value], ...] with an ease-in-out curve. */
function anim(frames: Array<[number, number | Vec]>, ease: [number, number, number, number] = [0.65, 0, 0.35, 1]): Prop {
  return {
    a: 1,
    k: frames.map(([t, v], idx) => {
      const s = Array.isArray(v) ? v : [v];
      const dims = s.length;
      const kf: Keyframe = { t, s };
      if (idx < frames.length - 1) {
        kf.o = { x: Array(dims).fill(ease[0]), y: Array(dims).fill(ease[1]) };
        kf.i = { x: Array(dims).fill(ease[2]), y: Array(dims).fill(ease[3]) };
      }
      return kf;
    }),
  };
}

const groupTransform = (p: Vec = [0, 0], r: Prop = still(0), s: Prop = still([100, 100]), o: Prop = still(100)) => ({
  ty: "tr",
  p: still(p),
  a: still([0, 0]),
  s,
  r,
  o,
  sk: still(0),
  sa: still(0),
});

const path = (points: Vec[], closed = false) => ({
  ty: "sh",
  ks: still({ i: points.map(() => [0, 0]), o: points.map(() => [0, 0]), v: points, c: closed }),
});

const ellipse = (d: number) => ({ ty: "el", p: still([0, 0]), s: still([d, d]) });

const stroke = (hex: string, width: number) => ({
  ty: "st",
  c: still(rgba(hex)),
  o: still(100),
  w: still(width),
  lc: 2,
  lj: 2,
  ml: 4,
});

const fill = (hex: string) => ({ ty: "fl", c: still(rgba(hex)), o: still(100), r: 1 });

const trim = (end: Prop) => ({ ty: "tm", s: still(0), e: end, o: still(0), m: 1 });

function layer(ind: number, shapes: object[], op: number, position: Vec) {
  return {
    ddd: 0,
    ind,
    ty: 4,
    nm: `layer-${ind}`,
    sr: 1,
    ks: { o: still(100), r: still(0), p: still([...position, 0]), a: still([0, 0, 0]), s: still([100, 100, 100]) },
    ao: 0,
    shapes,
    ip: 0,
    op,
    st: 0,
    bm: 0,
  };
}

function comp(name: string, size: number, op: number, layers: object[]) {
  return { v: "5.7.4", fr: FPS, ip: 0, op, w: size, h: size, nm: name, ddd: 0, assets: [], layers };
}

/** Freehold: a check mark that draws itself, holds, and redraws. */
export function checkAnimation(color: string) {
  const op = 156;
  return comp("freehold-check", 24, op, [
    layer(
      1,
      [
        {
          ty: "gr",
          it: [path([[-7, 0.5], [-2, 5.5], [7, -5]]), trim(anim([[20, 0], [80, 100]])), stroke(color, 2.4), groupTransform()],
        },
      ],
      op,
      [12, 12],
    ),
  ]);
}

/** Leasehold: a clock face whose hand sweeps once every 4 seconds. */
export function clockAnimation(color: string) {
  const op = 240;
  return comp("leasehold-clock", 24, op, [
    layer(1, [{ ty: "gr", it: [ellipse(17), stroke(color, 1.8), groupTransform()] }], op, [12, 12]),
    layer(
      2,
      [
        {
          ty: "gr",
          it: [path([[0, 0], [0, -5]]), stroke(color, 1.8), groupTransform([0, 0], anim([[0, 0], [op, 360]], [0, 0, 1, 1]))],
        },
      ],
      op,
      [12, 12],
    ),
  ]);
}

/** ITR zone: a dot with an expanding, fading ring. */
export function pulseAnimation(color: string) {
  const op = 108;
  return comp("itr-pulse", 24, op, [
    layer(1, [{ ty: "gr", it: [ellipse(8), fill(color), groupTransform()] }], op, [12, 12]),
    layer(
      2,
      [
        {
          ty: "gr",
          it: [
            ellipse(8),
            fill(color),
            groupTransform([0, 0], still(0), anim([[0, [100, 100]], [op, [280, 280]]], [0, 0, 0.4, 1]), anim([[0, 60], [op, 0]], [0, 0, 0.4, 1])),
          ],
        },
      ],
      op,
      [12, 12],
    ),
  ]);
}

/** Form success: the circle draws, then the check. Plays once. */
export function successAnimation(color: string) {
  const op = 90;
  return comp("form-success", 88, op, [
    layer(1, [{ ty: "gr", it: [ellipse(76), trim(anim([[0, 0], [54, 100]])), stroke(color, 4), groupTransform()] }], op, [44, 44]),
    layer(
      2,
      [{ ty: "gr", it: [path([[-17, 1], [-5, 13], [17, -13]]), trim(anim([[36, 0], [78, 100]])), stroke(color, 4.4), groupTransform()] }],
      op,
      [44, 44],
    ),
  ]);
}

/** Form error: a short horizontal shake of an exclamation mark. */
export function errorAnimation(color: string) {
  const op = 60;
  return comp("form-error", 88, op, [
    layer(1, [{ ty: "gr", it: [ellipse(76), stroke(color, 4), groupTransform()] }], op, [44, 44]),
    layer(
      2,
      [
        {
          ty: "gr",
          it: [
            { ty: "gr", it: [path([[0, -16], [0, 4]]), stroke(color, 4.4), groupTransform()] },
            { ty: "gr", it: [ellipse(5), fill(color), groupTransform([0, 15])] },
            {
              ty: "tr",
              p: anim([[0, [0, 0]], [8, [-5, 0]], [16, [5, 0]], [24, [-3, 0]], [32, [0, 0]]]),
              a: still([0, 0]),
              s: still([100, 100]),
              r: still(0),
              o: still(100),
              sk: still(0),
              sa: still(0),
            },
          ],
        },
      ],
      op,
      [44, 44],
    ),
  ]);
}
