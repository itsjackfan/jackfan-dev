// Night landscape in ASCII: stars, waning gibbous moon, ink-wash mountains, river,
// Suzhou garden, and a crane flying toward the moon.
// (px, py): viewport pixels. (x, y): cell indices. v: brightness 0..1 → RAMP + alpha.

export type Geom = { W: number; H: number; cw: number; ch: number; cols: number; rows: number };
export type Put = (x: number, y: number, c: string, v: number, color?: 'ember') => void; // c === '' clears the cell

const RAMP = ' ·:;-=+*#%@█';
export const shade = (v: number) => RAMP[Math.round(Math.min(1, Math.max(0, v)) * (RAMP.length - 1))];

const MOON = { x: 0.84, y: 0.07, r: 0.25 }; // fractions of W, H, H
const HORIZON = 0.68; // mountains fill 0.15H..0.68H as a dark mass behind the hero text
const SKY = 0, LAND = 1, RIVER = 2, MOONM = 3;

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
};
// 1D fbm in roughly [-1, 1]
const fbm = (x: number, seed: number) =>
  Math.sin(x + seed) * 0.5 + Math.sin(x * 2.3 + seed * 1.7) * 0.25 + Math.sin(x * 5.1 + seed * 2.9) * 0.125 + Math.sin(x * 11.7 + seed * 4.1) * 0.0625;

type Cell = number | [number, string?, number?] | null; // v | [v, char, mask]
export type Scene = 'home' | 'timeline' | 'planter' | 'reading';
export type Layer = { v: Float32Array; c: (string | null)[]; m: Uint8Array; g: Geom; scene: Scene; stars: number[][]; water: number[]; lantern: number[] };

const paint = (L: Layer, x0: number, y0: number, x1: number, y1: number, fn: (px: number, py: number, x: number, y: number) => Cell, m?: number) => {
  const { g } = L;
  for (let y = Math.max(0, Math.floor(y0 / g.ch)); y <= Math.min(g.rows - 1, Math.ceil(y1 / g.ch)); y++)
    for (let x = Math.max(0, Math.floor(x0 / g.cw)); x <= Math.min(g.cols - 1, Math.ceil(x1 / g.cw)); x++) {
      const r = fn((x + 0.5) * g.cw, (y + 0.5) * g.ch, x, y);
      if (r === null) continue;
      const k = y * g.cols + x;
      const [v, c, mm] = typeof r === 'number' ? [r] : r;
      L.v[k] = v;
      L.c[k] = c ?? null;
      if (mm ?? m) L.m[k] = (mm ?? m)!;
    }
};
const disc = (L: Layer, px: number, py: number, r: number, v: number) => {
  r = Math.max(r, 0.55 * L.g.ch);
  paint(L, px - r, py - r, px + r, py + r, (qx, qy) => (Math.hypot(qx - px, qy - py) <= r ? v : null));
};
const stroke = (L: Layer, pts: number[][], w0: number, w1: number, v: number) => {
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let s = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const d = Math.hypot(bx - ax, by - ay), n = Math.ceil(d / (0.5 * L.g.cw));
    for (let k = 0; k <= n; k++) {
      const u = (s + (d * k) / n) / len;
      disc(L, ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n, w0 + (w1 - w0) * u, v);
    }
    s += d;
  }
};
const quad = (p0: number[], p1: number[], p2: number[], n = 24) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
    return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
  });
const inside = (pts: number[][], px: number, py: number) => {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};
const poly = (L: Layer, pts: number[][], v: number | ((px: number, py: number, x: number, y: number) => Cell)) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  paint(L, Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), (px, py, x, y) =>
    inside(pts, px, py) ? (typeof v === 'number' ? v : v(px, py, x, y)) : null,
  );
};
const tex = (x: number, y: number, amp: number) => (hash(x, y) - 0.5) * amp * 0.6; // grain

// ---------- static scene ----------

const moon = (L: Layer) => {
  const { W, H } = L.g;
  const cx = MOON.x * W, cy = MOON.y * H, R = MOON.r * H;
  const craters: number[][] = [[0.2, -0.3, 0.2, 0.3], [-0.4, 0.15, 0.16, 0.3], [0.05, 0.5, 0.13, 0.25]];
  paint(L, cx - 1.8 * R, 0, cx + 1.8 * R, cy + 1.8 * R, (px, py) => {
    const dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy);
    if (d > 1.8 * R) return null;
    if (d > R) return [0.13 * (1 - (d - R) / (0.8 * R)) ** 2, undefined, SKY];
    const term = 0.42 * Math.sqrt(R * R - dy * dy) - dx; // >0 on the lit side; dark sliver on the right
    if (term < 0) return [0.06, undefined, MOONM];
    let v = 1 - 0.3 * Math.hypot(dx + 0.3 * R, dy + 0.3 * R) / (1.6 * R);
    for (const [ux, uy, ur, depth] of craters) {
      const cd = Math.hypot(dx - ux * R, dy - uy * R) / (ur * R);
      if (cd < 1) v -= depth * (1 - cd * cd);
    }
    v -= 0.35 * Math.max(0, 1 - term / (0.3 * R));
    return [Math.round(v * 5) / 5, undefined, MOONM];
  });
};

const mountains = (L: Layer) => {
  const { W, H } = L.g;
  const layers = [[0.52, 0.28, 0.1, 1], [0.6, 0.2, 0.14, 2], [HORIZON, 0.12, 0.18, 3]]; // base, amp, v, seed
  for (const [b, a, v, s] of layers) {
    const ridge = (px: number) => H * (b - a * (1 - Math.abs(fbm((px / W) * 3, s * 7))) ** 1.5 - a * 0.3 * (1 - Math.abs(fbm((px / W) * 8, s * 3))));
    paint(L, 0, H * (b - 1.6 * a), W, H * b, (px, py, x, y) => {
      const r = ridge(px);
      if (py < r) return null;
      const t = (py - r) / (H * b - r);
      const slope = Math.tanh((ridge(px + 6) - ridge(px - 6)) / 8); // faces right → lit by the moon
      const fold = 0.55 + 0.6 * fbm((px / W) * 28 + 0.5 * t, s * 11); // vertical gullies
      return v * (1 + 0.2 * slope) * fold * (1 - 0.5 * t) + (t < 0.04 ? 0.1 : 0) + tex(x, y, 0.05) * (1 - t);
    }, LAND);
  }
};

const plain = (L: Layer) => {
  const { W, H } = L.g;
  paint(L, 0, HORIZON * H, W, H, (px, py, x, y) => {
    const t = (py - HORIZON * H) / ((1 - HORIZON) * H), h = hash(x, y);
    const p = 0.01 + 0.08 * t * t;
    if (h < p) return [0.14 + 0.12 * t, "'`,\""[Math.floor((h / p) * 4)]];
    return 0.02 + 0.05 * t;
  }, LAND);
};

const riverT = (py: number, g: Geom) => Math.max(0, (py - 0.66 * g.H) / (0.34 * g.H));
const riverX = (py: number, g: Geom) => {
  const t = riverT(py, g);
  return g.W * (0.6 + 0.1 * Math.sin(t * 7.5 + 1) - 0.36 * t ** 1.2);
};
const riverW = (py: number, g: Geom) => g.H * (0.003 + 0.085 * riverT(py, g) ** 1.6);
const river = (L: Layer) => {
  const { W, H, cw } = L.g;
  paint(L, 0, 0.66 * H, W, H, (px, py, x, y) => {
    const d = Math.abs(px - riverX(py, L.g)), w = riverW(py, L.g);
    if (d > w + 1.5 * cw) return null;
    if (d > w) return [0.38, undefined, LAND];
    const h = hash(x, y);
    return [0.12 + 0.14 * h + 0.1 * riverT(py, L.g), '~≈-  ~'[Math.floor(h * 6)]];
  }, RIVER);
};

const roof = (L: Layer, cx: number, ey: number, half: number, rise: number, lift: number, dim: number) => {
  const top = [...quad([cx - 1.1 * half, ey - lift], [cx - 0.5 * half, ey - 0.2 * rise], [cx - 0.3 * half, ey - rise], 10),
    ...quad([cx + 0.3 * half, ey - rise], [cx + 0.5 * half, ey - 0.2 * rise], [cx + 1.1 * half, ey - lift], 10)];
  poly(L, [...top, [cx + 1.05 * half, ey - 0.15 * rise], [cx - 1.05 * half, ey - 0.15 * rise]], (px, py) => dim * (0.42 + 0.25 * ((ey - py) / rise)));
  stroke(L, top, 0.3 * L.g.ch, 0.3 * L.g.ch, 0.92 * dim); // eave/ridge line
  stroke(L, [[cx - 0.3 * half, ey - rise], [cx + 0.3 * half, ey - rise]], 0.5 * L.g.ch, 0.5 * L.g.ch, dim);
};
// Distant hint of a Suzhou garden: cloud wall, moon gate, two-tier pavilion.
// The Reading List: two still lakes and a small boat with a lantern.
const lakes = (L: Layer) => {
  const { W, H, cols } = L.g;
  for (const [ux, uy, rx, ry] of [[0.3, 0.82, 0.2, 0.035], [0.72, 0.9, 0.14, 0.025]]) {
    const cx = ux * W, cy = uy * H, ax = rx * W, ay = ry * H;
    paint(L, cx - ax, cy - ay, cx + ax, cy + ay, (px, py, x, y) => {
      const d = Math.hypot((px - cx) / ax, (py - cy) / ay);
      if (d > 1) return null;
      if (d > 0.93) return [0.22, undefined, LAND];
      return [0.08 + 0.08 * hash(x, y), '~  -  ~'[Math.floor(hash(x, y) * 7)]];
    }, RIVER);
  }
  const bx = 0.36 * W, by = 0.815 * H, bl = 0.03 * W;
  stroke(L, quad([bx - bl, by - 0.006 * H], [bx, by + 0.012 * H], [bx + bl, by - 0.008 * H]), 0.3 * L.g.ch, 0.3 * L.g.ch, 0.4);
  stroke(L, [[bx + 0.2 * bl, by], [bx + 0.2 * bl, by - 0.025 * H]], 0.3 * L.g.cw, 0.3 * L.g.cw, 0.35);
  paint(L, bx + 0.2 * bl - L.g.cw, by - 0.03 * H, bx + 0.2 * bl + L.g.cw, by - 0.025 * H, (px, py, x, y) => (L.lantern.push(y * cols + x), 0.5), LAND);
};
// The Timeline: a road winding from the viewer to the mountains, with milestone stones.
const road = (L: Layer) => {
  const { W, H, cw, ch } = L.g;
  const t = (py: number) => Math.max(0, (py - 0.66 * H) / (0.34 * H));
  const rx = (py: number) => W * (0.5 + 0.12 * Math.sin(t(py) * 6 + 2) - 0.1 * t(py));
  const rw = (py: number) => H * (0.002 + 0.06 * t(py) ** 1.5);
  paint(L, 0, 0.66 * H, W, H, (px, py, x, y) => {
    const d = Math.abs(px - rx(py)), w = rw(py);
    if (d > w + cw) return null;
    if (d > w) return 0.2;
    return [0.06 + 0.06 * hash(x, y), '-=  - '[Math.floor(hash(x, y) * 6)]];
  }, LAND);
  for (let k = 0; k < 9; k++) {
    const u = (k / 9) ** 1.6, py = H * (0.68 + 0.3 * u), h = H * (0.006 + 0.02 * u);
    const px = rx(py) + (k % 2 ? 1 : -1) * (rw(py) + 0.01 * W);
    stroke(L, [[px, py], [px, py - h]], 0.3 * cw, 0.3 * cw + 0.1 * h, 0.35);
    stroke(L, [[px - 0.3 * h, py - h], [px + 0.3 * h, py - h]], 0.3 * ch, 0.3 * ch, 0.45);
  }
};
// The Main Planter: terraced paddies stepping down to the viewer, water catching the moon.
const terraces = (L: Layer) => {
  const { W, H, ch } = L.g;
  const edge = (k: number, px: number) => H * (0.69 + 0.31 * (k / 7) ** 1.4 + 0.012 * Math.sin((px / W) * 5 + k));
  paint(L, 0, 0.68 * H, W, H, (px, py, x, y) => {
    for (let k = 0; k < 8; k++) {
      const e = edge(k, px);
      if (py < e) return null;
      if (py < e + 0.8 * ch) return [0.2 + 0.03 * k, undefined, LAND];
      if (k === 7 || py < edge(k + 1, px)) return [0.05 + 0.05 * hash(x, y) + 0.01 * k, '~    -   '[Math.floor(hash(x, y) * 10)], RIVER];
    }
    return null;
  });
};
const garden = (L: Layer) => {
  const { W, H, cw, ch, cols } = L.g;
  const gx = 0.56 * W, G = 0.14 * W, gy = 0.8 * H, wh = 0.025 * H, dim = 0.6;
  const pcx = gx + 0.64 * G, pw = 0.45 * G, y1b = gy - wh, y1t = y1b - 0.032 * H;
  paint(L, pcx - 0.42 * pw, y1t, pcx + 0.42 * pw, y1b, () => 0.1, LAND);
  for (const s of [-0.4, 0.4]) stroke(L, [[pcx + s * pw, y1b], [pcx + s * pw, y1t]], 0.4 * cw, 0.4 * cw, 0.5 * dim);
  L.lantern = [];
  paint(L, pcx - 0.12 * pw, y1t + 0.008 * H, pcx + 0.12 * pw, y1b - 0.006 * H, (px, py, x, y) => (L.lantern.push(y * cols + x), 0.3), LAND);
  roof(L, pcx, y1t, 0.5 * pw, 0.018 * H, 0.009 * H, dim);
  const y2b = y1t - 0.018 * H, y2t = y2b - 0.02 * H;
  paint(L, pcx - 0.25 * pw, y2t, pcx + 0.25 * pw, y2b, () => 0.1, LAND);
  roof(L, pcx, y2t, 0.3 * pw, 0.016 * H, 0.007 * H, dim);
  stroke(L, [[pcx, y2t - 0.016 * H], [pcx, y2t - 0.026 * H]], 0.4 * cw, 0.4 * cw, dim);
  paint(L, gx, gy - 1.3 * wh, gx + G, gy, (px, py) => {
    const t = gy - wh - 0.15 * wh * Math.sin((px - gx) / (0.03 * W));
    return py < t ? null : py < t + 0.8 * ch ? 0.5 : 0.22;
  }, LAND);
  const mx = gx + 0.3 * G, my = gy - 0.5 * wh, mr = 0.45 * wh;
  paint(L, mx - mr - cw, my - mr - ch, mx + mr + cw, my + mr + ch, (px, py) => {
    const d = Math.hypot(px - mx, py - my);
    return d > mr + 0.8 * ch ? null : d > mr ? 0.55 : 0.06;
  }, LAND);
};


const GROUND: Record<Scene, (L: Layer) => void> = {
  home: (L) => (plain(L), river(L), garden(L)),
  timeline: road,
  planter: terraces,
  reading: lakes,
};

export const build = (g: Geom, scene: Scene): Layer => {
  const n = g.cols * g.rows;
  const L: Layer = { v: new Float32Array(n), c: Array(n).fill(null), m: new Uint8Array(n), g, scene, stars: [], water: [], lantern: [] };
  moon(L);
  mountains(L);
  GROUND[scene](L);
  for (let y = 0; y < g.rows; y++)
    for (let x = 0; x < g.cols; x++) {
      const k = y * g.cols + x;
      if (L.m[k] === RIVER) L.water.push(k);
      else if (L.m[k] === SKY && L.v[k] < 0.02 && hash(x + 7, y + 3) < 0.008) L.stars.push([x, y, hash(x, y)]);
    }
  return L;
};

export const renderStatic = (L: Layer, put: Put) => {
  for (let k = 0; k < L.v.length; k++)
    if (L.v[k] > 0.015) put(k % L.g.cols, Math.floor(k / L.g.cols), L.c[k] ?? shade(L.v[k]), L.v[k]);
};

// ---------- dynamic ----------

const crane = (t: number, L: Layer, put: Put) => {
  const { W, H, cw, ch, cols, rows } = L.g;
  // one flight per slot; each flight has its own delay, duration, route, flap rate, and glide rhythm
  const slot = 75, n = Math.floor(t / slot), tau = t - n * slot;
  const delay = 10 * hash(n, 1), dur = 38 + 25 * hash(n, 2);
  const u = (tau - delay) / dur;
  if (u < 0 || u > 1) return;
  const x0 = -0.12 * W, y0 = H * (0.2 + 0.25 * hash(n, 3));
  const x1 = W * (0.75 + 0.35 * hash(n, 4)), y1 = H * (0.02 + 0.18 * hash(n, 5));
  const ph = 20 * hash(n, 6);
  const ease = u + 0.04 * Math.sin(u * 9 + ph); // uneven pace
  const wander = 0.03 * H * (Math.sin(t * 0.31 + ph) + 0.5 * Math.sin(t * 0.83 + 2 * ph));
  const bx = x0 + (x1 - x0) * ease, by = y0 + (y1 - y0) * ease + wander;
  const S = W * (0.12 - 0.07 * Math.min(1, u));
  const glide = Math.max(0, Math.min(1, 1.5 - 3 * Math.sin(t * 0.19 + 3 * ph))); // 1 = flapping, 0 = gliding
  const f = glide * Math.sin(t * (2.6 + 0.9 * hash(n, 7))) + (1 - glide) * 0.3;
  const fu = (f + 1) / 2, fl = (1 - f) / 2;
  const cells = new Map<number, number>();
  const stamp = (px: number, py: number, r: number, v: number) => {
    r = Math.max(r, 0.55 * ch);
    for (let y = Math.floor((py - r) / ch); y <= Math.ceil((py + r) / ch); y++)
      for (let x = Math.floor((px - r) / cw); x <= Math.ceil((px + r) / cw); x++) {
        const d = Math.hypot((x + 0.5) * cw - px, (y + 0.5) * ch - py) / r;
        if (d > 1 || x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const k = y * cols + x, vv = d < 0.65 ? v : v * 0.55;
        cells.set(k, Math.max(cells.get(k) ?? 0, vv));
      }
  };
  const line = (pts: number[][], w0: number, w1: number, v: number | ((u: number) => number)) => {
    const P = pts.map(([a, b]) => [bx + a * S, by + b * S]);
    let len = 0;
    for (let i = 1; i < P.length; i++) len += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
    let s = 0;
    for (let i = 1; i < P.length; i++) {
      const [ax, ay] = P[i - 1], [qx, qy] = P[i], d = Math.hypot(qx - ax, qy - ay), n = Math.ceil(d / (0.4 * cw));
      for (let k = 0; k <= n; k++) {
        const uu = (s + (d * k) / n) / len;
        stamp(ax + ((qx - ax) * k) / n, ay + ((qy - ay) * k) / n, (w0 + (w1 - w0) * uu) * S, typeof v === 'number' ? v : v(uu));
      }
      s += d;
    }
  };
  const tips = (u: number) => (u < 0.72 ? 0.95 : 0.3); // black primaries
  line(quad([0, -0.03], [-0.28, -0.1 - 0.25 * fu], [-0.52, -0.12 - 0.5 * fu]), 0.06, 0.02, tips);
  line(quad([0, -0.01], [-0.26, 0.08 + 0.2 * fl], [-0.5, 0.1 + 0.42 * fl]), 0.055, 0.02, tips);
  for (const s of [-1, 0, 1]) {
    line([[-0.42, -0.11 - 0.4 * fu], [-0.56 + 0.03 * s, -0.12 - 0.5 * fu + 0.07 * s]], 0.012, 0.004, 0.3);
    line([[-0.4, 0.09 + 0.33 * fl], [-0.54 + 0.03 * s, 0.1 + 0.42 * fl + 0.07 * s]], 0.012, 0.004, 0.3);
  }
  line([[-0.16, 0], [0.14, -0.01]], 0.07, 0.045, 0.95); // body
  line([[-0.16, 0.0], [-0.33, 0.035]], 0.045, 0.012, (u) => (u > 0.6 ? 0.3 : 0.9)); // tail
  line(quad([0.12, -0.02], [0.3, -0.1], [0.46, -0.1]), 0.03, 0.022, 0.9); // neck
  stamp(bx + 0.475 * S, by - 0.105 * S, 0.035 * S, 0.9); // head
  stamp(bx + 0.47 * S, by - 0.135 * S, 0.012 * S, 1); // red crown
  line([[0.5, -0.1], [0.63, -0.092]], 0.014, 0.004, 0.8); // beak
  for (const o of [0, 0.025]) line([[-0.12, 0.03 + o], [-0.3, 0.06 + o], [-0.5, 0.1 + o]], 0.012, 0.008, 0.45); // legs
  for (const [k, v] of cells) {
    const x = k % cols, y = Math.floor(k / cols);
    put(x, y, L.m[k] === MOONM ? '' : shade(v), v);
  }
};

export const renderDynamic = (t: number, L: Layer, put: Put) => {
  const { cols } = L.g;
  for (const [x, y, h] of L.stars) {
    const tw = 0.5 + 0.5 * Math.sin(t * (0.6 + 2.5 * h) + h * 6000);
    if (tw > 0.2) put(x, y, tw < 0.55 ? '·' : tw < 0.82 ? '+' : '*', 0.3 + 0.7 * tw);
  }
  const phase = Math.floor(t * 5);
  for (const k of L.water) {
    const x = k % cols, y = Math.floor(k / cols);
    if (hash(x + phase, y) < 0.018) put(x, y, hash(x, y + phase) < 0.3 ? '*' : '·', 0.75);
  }
  const lv = 0.38 + 0.1 * Math.sin(t * 6.3) + 0.06 * Math.sin(t * 17.1);
  for (const k of L.lantern) put(k % cols, Math.floor(k / cols), shade(lv), lv);
  if (L.scene !== 'home') return;
  const p = (t % 19) / 19; // shooting star; 1 in 20 is a big red one
  if (p < 0.07) {
    const n = Math.floor(t / 19), sx = (0.1 + 0.6 * hash(n, 1)) * cols, sy = (0.05 + 0.2 * hash(n, 2)) * L.g.rows;
    const dx = hash(n, 3) < 0.5 ? 1 : -1, u = p / 0.07, red = hash(n, 4) < 0.05;
    const len = red ? 28 : 14, color = red ? 'ember' : undefined;
    for (let k = 0; k < len; k++)
      for (const dy of red ? [0, 1] : [0]) {
        const x = Math.round(sx + dx * (u * 90 - k * 2.2)), y = Math.round(sy + (u * 30 - k * 0.75)) + dy;
        if (x >= 0 && x < cols && y >= 0 && L.m[y * cols + x] === SKY) put(x, y, k < 2 ? (red ? '█' : '*') : red ? '*' : '-', 1 - k / len, color);
      }
  }
  crane(t, L, put);
};
