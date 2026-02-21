'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Types ───────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  label: string;
  tags: string[];
  color: string;
  path: string;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  legend?: Array<{ tag: string; color: string }>;
}

interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  z: number;
  connections: number;
  radius: number;
  displayColor: string;
  emissiveIntensity: number;
  phaseOffset: number;
  isMe: boolean;
}

interface ResolvedLink {
  si: number;
  ti: number;
}

interface Ripple {
  x: number;
  y: number;
  z: number;
  time: number;
}

interface LayoutResult {
  nodes: PositionedNode[];
  resolvedLinks: ResolvedLink[];
  linksPerNode: Map<string, number[]>;
}

const ME_NODE_ID = 'the main planter/Me.';
const RIPPLE_SPEED = 15;
const RIPPLE_LIFETIME = 3;
const RIPPLE_WIDTH = 4;

// ─── Helpers ─────────────────────────────────────────────────────────

// Wash color toward white — produces soft pastel tints with just a whisper of hue
function toPastel(hex: string, colorAmount = 0.3): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const nr = r * colorAmount + 1.0 * (1 - colorAmount);
  const ng = g * colorAmount + 1.0 * (1 - colorAmount);
  const nb = b * colorAmount + 1.0 * (1 - colorAmount);
  return `#${Math.round(nr * 255)
    .toString(16)
    .padStart(2, '0')}${Math.round(ng * 255)
    .toString(16)
    .padStart(2, '0')}${Math.round(nb * 255)
    .toString(16)
    .padStart(2, '0')}`;
}

function getAnimatedPosition(
  node: PositionedNode,
  t: number
): [number, number, number] {
  const p = node.phaseOffset;
  return [
    node.x + Math.cos(t * 0.15 + p) * 0.12,
    node.y + Math.sin(t * 0.2 + p * 1.3) * 0.15,
    node.z + Math.sin(t * 0.18 + p * 0.7) * 0.1,
  ];
}

// ─── Layout ──────────────────────────────────────────────────────────

function computeLayout(data: GraphData): LayoutResult {
  const { nodes, links } = data;
  const n = nodes.length;

  const idxMap = new Map<string, number>();
  nodes.forEach((node, i) => idxMap.set(node.id, i));

  const connectionCounts = new Array(n).fill(0);
  const resolvedLinks: ResolvedLink[] = [];
  for (const link of links) {
    const si = idxMap.get(link.source);
    const ti = idxMap.get(link.target);
    if (si !== undefined && ti !== undefined) {
      connectionCounts[si]++;
      connectionCounts[ti]++;
      resolvedLinks.push({ si, ti });
    }
  }

  // Find "Me." node
  const meIndex = nodes.findIndex((nd) => nd.id === ME_NODE_ID);

  // Initialize positions — pin Me. at origin
  const pos = nodes.map((_, i) => ({
    x: i === meIndex ? 0 : (Math.random() - 0.5) * 60,
    y: i === meIndex ? 0 : (Math.random() - 0.5) * 60,
    z: i === meIndex ? 0 : (Math.random() - 0.5) * 60,
    vx: 0,
    vy: 0,
    vz: 0,
  }));

  const iterations = 300;

  for (let iter = 0; iter < iterations; iter++) {
    const alpha = 1 - iter / iterations;
    const decay = alpha * alpha;

    // Repulsion between all pairs
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[j].x - pos[i].x;
        const dy = pos[j].y - pos[i].y;
        const dz = pos[j].z - pos[i].z;
        const distSq = dx * dx + dy * dy + dz * dz + 1;
        const dist = Math.sqrt(distSq);
        const force = (decay * 150) / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;
        pos[i].vx -= fx;
        pos[i].vy -= fy;
        pos[i].vz -= fz;
        pos[j].vx += fx;
        pos[j].vy += fy;
        pos[j].vz += fz;
      }
    }

    // Attraction along links — heavier nodes move less
    for (const { si, ti } of resolvedLinks) {
      const dx = pos[ti].x - pos[si].x;
      const dy = pos[ti].y - pos[si].y;
      const dz = pos[ti].z - pos[si].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;
      const force = decay * 0.04 * dist;
      const massI = 1 + connectionCounts[si] * 0.5;
      const massJ = 1 + connectionCounts[ti] * 0.5;
      pos[si].vx += (dx / dist) * (force / massI);
      pos[si].vy += (dy / dist) * (force / massI);
      pos[si].vz += (dz / dist) * (force / massI);
      pos[ti].vx -= (dx / dist) * (force / massJ);
      pos[ti].vy -= (dy / dist) * (force / massJ);
      pos[ti].vz -= (dz / dist) * (force / massJ);
    }

    // Center gravity — pulls everything toward origin (where Me. lives)
    for (let i = 0; i < n; i++) {
      pos[i].vx -= pos[i].x * 0.01 * decay;
      pos[i].vy -= pos[i].y * 0.01 * decay;
      pos[i].vz -= pos[i].z * 0.01 * decay;
    }

    // Apply velocity with damping
    for (let i = 0; i < n; i++) {
      pos[i].x += pos[i].vx;
      pos[i].y += pos[i].vy;
      pos[i].z += pos[i].vz;
      pos[i].vx *= 0.55;
      pos[i].vy *= 0.55;
      pos[i].vz *= 0.55;
    }

    // Pin Me. at origin every iteration
    if (meIndex >= 0) {
      pos[meIndex].x = 0;
      pos[meIndex].y = 0;
      pos[meIndex].z = 0;
      pos[meIndex].vx = 0;
      pos[meIndex].vy = 0;
      pos[meIndex].vz = 0;
    }
  }

  // Build links-per-node lookup
  const linksPerNode = new Map<string, number[]>();
  resolvedLinks.forEach((link, i) => {
    const sid = nodes[link.si].id;
    const tid = nodes[link.ti].id;
    if (!linksPerNode.has(sid)) linksPerNode.set(sid, []);
    if (!linksPerNode.has(tid)) linksPerNode.set(tid, []);
    linksPerNode.get(sid)!.push(i);
    linksPerNode.get(tid)!.push(i);
  });

  const positionedNodes = nodes.map((node, i) => {
    const conn = connectionCounts[i];
    const isMe = node.id === ME_NODE_ID;
    return {
      ...node,
      x: pos[i].x,
      y: pos[i].y,
      z: pos[i].z,
      connections: conn,
      radius: isMe ? 0.8 : 0.2 + Math.sqrt(conn) * 0.22,
      displayColor: toPastel(node.color),
      emissiveIntensity: isMe ? 1.0 : 0.6 + conn * 0.025,
      phaseOffset: Math.random() * Math.PI * 2,
      isMe,
    };
  });

  return { nodes: positionedNodes, resolvedLinks, linksPerNode };
}

// ─── Connection Threads ──────────────────────────────────────────────

function ConnectionThreads({
  nodes,
  resolvedLinks,
  linksPerNode,
  hoveredId,
}: {
  nodes: PositionedNode[];
  resolvedLinks: ResolvedLink[];
  linksPerNode: Map<string, number[]>;
  hoveredId: string | null;
}) {
  const baseRef = useRef<THREE.LineSegments>(null);
  const hoverRef = useRef<THREE.LineSegments>(null);

  const basePositions = useMemo(
    () => new Float32Array(resolvedLinks.length * 6),
    [resolvedLinks.length]
  );
  const hoverPositions = useMemo(() => new Float32Array(300), []);

  const hoveredIdRef = useRef(hoveredId);
  hoveredIdRef.current = hoveredId;

  useEffect(() => {
    if (baseRef.current) {
      baseRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(basePositions, 3)
      );
    }
    if (hoverRef.current) {
      hoverRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(hoverPositions, 3)
      );
      hoverRef.current.geometry.setDrawRange(0, 0);
    }
  }, [basePositions, hoverPositions]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (baseRef.current) {
      for (let i = 0; i < resolvedLinks.length; i++) {
        const { si, ti } = resolvedLinks[i];
        const [sx, sy, sz] = getAnimatedPosition(nodes[si], t);
        const [ex, ey, ez] = getAnimatedPosition(nodes[ti], t);
        const o = i * 6;
        basePositions[o] = sx;
        basePositions[o + 1] = sy;
        basePositions[o + 2] = sz;
        basePositions[o + 3] = ex;
        basePositions[o + 4] = ey;
        basePositions[o + 5] = ez;
      }
      const attr = baseRef.current.geometry.getAttribute('position');
      if (attr) (attr as THREE.BufferAttribute).needsUpdate = true;
    }

    if (hoverRef.current) {
      const hid = hoveredIdRef.current;
      if (hid) {
        const linkIndices = linksPerNode.get(hid) || [];
        let count = 0;
        for (const li of linkIndices) {
          if (count >= 50) break;
          const { si, ti } = resolvedLinks[li];
          const [sx, sy, sz] = getAnimatedPosition(nodes[si], t);
          const [ex, ey, ez] = getAnimatedPosition(nodes[ti], t);
          const o = count * 6;
          hoverPositions[o] = sx;
          hoverPositions[o + 1] = sy;
          hoverPositions[o + 2] = sz;
          hoverPositions[o + 3] = ex;
          hoverPositions[o + 4] = ey;
          hoverPositions[o + 5] = ez;
          count++;
        }
        hoverRef.current.geometry.setDrawRange(0, count * 2);
      } else {
        hoverRef.current.geometry.setDrawRange(0, 0);
      }
      const attr = hoverRef.current.geometry.getAttribute('position');
      if (attr) (attr as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <group>
      <lineSegments ref={baseRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.025} />
      </lineSegments>

      <lineSegments ref={hoverRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

// ─── Node Sphere ─────────────────────────────────────────────────────

function NodeSphere({
  node,
  isHovered,
  isNeighborOfHovered,
  ripplesRef,
  onHover,
  onUnhover,
}: {
  node: PositionedNode;
  isHovered: boolean;
  isNeighborOfHovered: boolean;
  ripplesRef: React.RefObject<Ripple[]>;
  onHover: () => void;
  onUnhover: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) return;
    const t = state.clock.elapsedTime;
    const now = performance.now();

    // 1. Base floating position
    let [x, y, z] = getAnimatedPosition(node, t);

    // 2. Ripple effects
    let rippleGlow = 0;
    for (const ripple of ripplesRef.current!) {
      const age = (now - ripple.time) / 1000;
      if (age > RIPPLE_LIFETIME) continue;
      const waveRadius = age * RIPPLE_SPEED;
      const dx = x - ripple.x;
      const dy = y - ripple.y;
      const dz = z - ripple.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
      const distToWave = Math.abs(dist - waveRadius);
      const waveIntensity = Math.max(0, 1 - distToWave / RIPPLE_WIDTH);
      const ageDecay = 1 - age / RIPPLE_LIFETIME;
      rippleGlow += waveIntensity * ageDecay * 0.4;
      const disp = waveIntensity * ageDecay * 0.2;
      x += (dx / dist) * disp;
      y += (dy / dist) * disp;
      z += (dz / dist) * disp;
    }

    // 3. Cursor proximity glow
    tempVec.set(x, y, z).project(state.camera);
    const screenDist = Math.sqrt(
      (tempVec.x - state.pointer.x) ** 2 +
        (tempVec.y - state.pointer.y) ** 2
    );
    const proximityGlow = Math.max(0, 1 - screenDist / 0.25) * 0.15;

    // 4. Apply position
    groupRef.current.position.set(x, y, z);

    // 5. Emissive intensity
    let intensity = node.emissiveIntensity;
    if (isHovered) intensity *= 1.6;
    else if (isNeighborOfHovered) intensity += 0.25;
    intensity += rippleGlow + proximityGlow;
    materialRef.current.emissiveIntensity = intensity;

    // 6. Scale
    if (node.isMe) {
      const pulse = 1 + Math.sin(t * 0.8) * 0.08;
      groupRef.current.scale.setScalar(isHovered ? 1.15 : pulse);
    } else {
      groupRef.current.scale.setScalar(isHovered ? 1.1 : 1);
    }

    // 7. Opacity
    materialRef.current.opacity = isHovered
      ? 0.9
      : isNeighborOfHovered
        ? 0.7
        : 0.6;
  });

  return (
    <group ref={groupRef} position={[node.x, node.y, node.z]}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          onHover();
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          onUnhover();
        }}
      >
        <sphereGeometry args={[node.radius, 24, 24]} />
        <meshStandardMaterial
          ref={materialRef}
          color={node.displayColor}
          emissive={node.displayColor}
          emissiveIntensity={node.emissiveIntensity}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>
      {isHovered && (
        <Html
          position={[0, node.radius + 1, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '11px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            <div>{node.label}</div>
            {node.tags.length > 0 && (
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginTop: '3px',
                }}
              >
                {node.tags.join(' \u00b7 ')}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────

function ManifoldScene({
  data,
  onLegendData,
}: {
  data: GraphData;
  onLegendData?: (legend: Array<{ tag: string; color: string }>) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const prevHoveredRef = useRef<string | null>(null);

  const layout = useMemo(() => computeLayout(data), [data]);

  const neighborIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const ids = new Set<string>();
    const linkIndices = layout.linksPerNode.get(hoveredId) || [];
    for (const li of linkIndices) {
      const { si, ti } = layout.resolvedLinks[li];
      const sid = layout.nodes[si].id;
      const tid = layout.nodes[ti].id;
      if (sid === hoveredId) ids.add(tid);
      else ids.add(sid);
    }
    return ids;
  }, [hoveredId, layout]);

  useEffect(() => {
    if (hoveredId && hoveredId !== prevHoveredRef.current) {
      const node = layout.nodes.find((nd) => nd.id === hoveredId);
      if (node) {
        ripplesRef.current.push({
          x: node.x,
          y: node.y,
          z: node.z,
          time: performance.now(),
        });
        if (ripplesRef.current.length > 5) ripplesRef.current.shift();
      }
    }
    prevHoveredRef.current = hoveredId;
  }, [hoveredId, layout.nodes]);

  useEffect(() => {
    if (data.legend && onLegendData) {
      onLegendData(data.legend);
    }
  }, [data.legend, onLegendData]);

  useFrame(() => {
    const now = performance.now();
    ripplesRef.current = ripplesRef.current.filter(
      (r) => (now - r.time) / 1000 < RIPPLE_LIFETIME + 0.5
    );
  });

  return (
    <>
      <ambientLight intensity={0.03} />
      <pointLight position={[0, 0, 0]} intensity={0.15} color="#ffffff" />

      <Stars
        radius={300}
        depth={100}
        count={1500}
        factor={1.2}
        saturation={0}
        fade
        speed={0.2}
      />

      <ConnectionThreads
        nodes={layout.nodes}
        resolvedLinks={layout.resolvedLinks}
        linksPerNode={layout.linksPerNode}
        hoveredId={hoveredId}
      />

      {layout.nodes.map((node) => (
        <NodeSphere
          key={node.id}
          node={node}
          isHovered={hoveredId === node.id}
          isNeighborOfHovered={neighborIds.has(node.id)}
          ripplesRef={ripplesRef}
          onHover={() => setHoveredId(node.id)}
          onUnhover={() => setHoveredId(null)}
        />
      ))}

      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={0.2}
        enableDamping
        dampingFactor={0.05}
        minDistance={10}
        maxDistance={250}
        target={[0, 0, 0]}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.95}
          intensity={1.2}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────

interface ManifoldGraphProps {
  onLegendData?: (legend: Array<{ tag: string; color: string }>) => void;
}

export function ManifoldGraph({ onLegendData }: ManifoldGraphProps) {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/graph-data');
        if (!response.ok) throw new Error('Failed to fetch graph data');
        const graphData: GraphData = await response.json();
        setData(graphData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (mounted && data) {
      const timer = setTimeout(() => setSceneReady(true), 300);
      return () => clearTimeout(timer);
    }
  }, [mounted, data]);

  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-sm font-light tracking-widest text-white/30">
          loading
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-sm text-red-400/60">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-sm text-white/30">no data</div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full bg-black transition-opacity duration-[1500ms]"
      style={{ opacity: sceneReady ? 1 : 0 }}
    >
      <Canvas
        camera={{ position: [0, 15, 65], fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        <ManifoldScene data={data} onLegendData={onLegendData} />
      </Canvas>
    </div>
  );
}
