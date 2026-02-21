const WIDTH = 420;
const HEIGHT = 320;

// Hyperbolic boundary: y = y0 + A·tanh((x - x0)/B) + C·sinh((x - x1)/D) (S-shaped + extra bend)
const BOUNDARY = {
  y0: 155,
  x0: 200,
  A: 72,
  B: 55,
  x1: 220,
  C: -18,
  D: 45,
};

function boundaryY(x: number): number {
  const { y0, x0, A, B, x1, C, D } = BOUNDARY;
  return y0 + A * Math.tanh((x - x0) / B) + C * Math.sinh((x - x1) / D);
}

const GAP = 10; // min distance from points to boundary
const N_POINTS = 72;

// Deterministic jitter so points look irregular but stay static
function jitter(seed: number, scale: number): number {
  const t = Math.sin(seed * 12.9898) * 43758.5453;
  return (t - Math.floor(t)) * 2 * scale - scale;
}

function buildRedCluster(): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const xMin = 10, xMax = 200;
  const yMin = 28;
  let i = 0;
  while (points.length < N_POINTS && i < 500) {
    i++;
    const t = (i * 17) % 167 / 166;
    const u = (i * 11) % 89 / 88;
    const x = xMin + (xMax - xMin) * (t + jitter(i * 3, 0.22)) + jitter(i * 7 + 1, 18);
    const xClamp = Math.max(xMin + 2, Math.min(xMax - 2, x));
    const by = boundaryY(xClamp);
    const yMax = Math.min(HEIGHT - 14, by - GAP);
    if (yMax <= yMin) continue;
    const y = yMin + (yMax - yMin) * (u + jitter(i * 5, 0.15)) + jitter(i * 13, 6);
    const yClamp = Math.max(yMin + 2, Math.min(yMax - 2, y));
    if (yClamp >= by - GAP) continue;
    points.push({ x: Math.round(xClamp * 10) / 10, y: Math.round(yClamp * 10) / 10 });
  }
  return points;
}

function buildBlueCluster(): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const xMin = 200, xMax = 416;
  const yMax = HEIGHT - 14;
  let i = 0;
  while (points.length < N_POINTS && i < 500) {
    i++;
    const t = (i * 19) % 171 / 170;
    const u = (i * 13) % 89 / 88;
    const x = xMin + (xMax - xMin) * (t + jitter(i * 2, 0.22)) + jitter(i * 11, 20);
    const xClamp = Math.max(xMin + 2, Math.min(xMax - 2, x));
    const by = boundaryY(xClamp);
    const yMin = Math.max(28, by + GAP);
    if (yMin >= yMax) continue;
    const y = yMin + (yMax - yMin) * (u + jitter(i * 7, 0.12)) + jitter(i * 17, 7);
    const yClamp = Math.max(yMin + 2, Math.min(yMax - 2, y));
    if (yClamp <= by + GAP) continue;
    points.push({ x: Math.round(xClamp * 10) / 10, y: Math.round(yClamp * 10) / 10 });
  }
  return points;
}

const RED_CLUSTER = buildRedCluster();
const BLUE_CLUSTER = buildBlueCluster();

function classifyPoint(x: number, y: number): number {
  return y - boundaryY(x);
}

function getBoundaryPath(): string {
  const step = 3;
  const points: { x: number; y: number }[] = [];
  for (let x = 0; x <= WIDTH; x += step) {
    const y = boundaryY(x);
    if (y >= -5 && y <= HEIGHT + 5) points.push({ x, y });
  }
  if (points.length < 2) return "";
  return "M" + points.map((p) => `${p.x},${p.y}`).join(" L");
}

const BOUNDARY_PATH = getBoundaryPath();

function shadeMesh() {
  const rects = [];
  const step = 6;
  for (let x = 0; x < WIDTH; x += step) {
    for (let y = 0; y < HEIGHT; y += step) {
      const val = classifyPoint(x + step / 2, y + step / 2);
      rects.push(
        <rect
          key={`bg-${x}-${y}`}
          x={x}
          y={y}
          width={step}
          height={step}
          fill={val < 0 ? "#fee2e2" : "#bfdbfe"}
          fillOpacity={0.65}
          stroke="none"
        />
      );
    }
  }
  return rects;
}

export function DecisionBoundaryViz() {
  return (
    <div style={{ margin: "28px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{ border: "1px solid #ddd", borderRadius: 9, background: "#fff", display: "block" }}
      >
        {shadeMesh()}
        {RED_CLUSTER.map((p, i) => (
          <circle
            key={"r" + i}
            cx={p.x}
            cy={p.y}
            r={7}
            fill="#ef4444"
            fillOpacity={0.88}
            stroke="#991b1b"
            strokeWidth={1.3}
          />
        ))}
        {BLUE_CLUSTER.map((p, i) => (
          <circle
            key={"b" + i}
            cx={p.x}
            cy={p.y}
            r={7}
            fill="#2563eb"
            fillOpacity={0.88}
            stroke="#1e3a8a"
            strokeWidth={1.3}
          />
        ))}
        {BOUNDARY_PATH && (
          <path
            d={BOUNDARY_PATH}
            stroke="#222"
            strokeWidth={3}
            fill="none"
            strokeDasharray="7 7"
            opacity={0.7}
          />
        )}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 16,
          gap: 40,
          marginTop: 10,
        }}
      >
        <span style={{ color: "#b91c1c" }}>Red class</span>
        <span style={{ color: "#2563eb" }}>Blue class</span>
        <span style={{ color: "#222" }}>Decision boundary</span>
      </div>
    </div>
  );
}
