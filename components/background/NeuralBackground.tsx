'use client';

import { useEffect, useMemo, useState } from 'react';

type Star = {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

type Edge = {
  id: number;
  from: Star;
  to: Star;
  duration: number;
  delay: number;
};

const STAR_COUNT = 48;

function NeuralStarField() {
  const { stars, edges } = useMemo(() => {
    const stars: Star[] = Array.from({ length: STAR_COUNT }, (_, id) => ({
      id,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 2.5 + Math.random() * 3.5,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 12,
    }));

    const edges: Edge[] = [];

    // Connect each star to up to 2 nearby neighbours for a sparse synapse graph.
    stars.forEach((star, index) => {
      const candidates = stars
        .filter((other) => other.id !== star.id)
        .map((other) => {
          const dx = other.left - star.left;
          const dy = other.top - star.top;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return { other, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3); // closest 3

      const connections = candidates.slice(0, 2);

      connections.forEach(({ other }, i) => {
        // Avoid duplicating edges (A->B and B->A)
        if (other.id < star.id) return;

        edges.push({
          id: index * 10 + i,
          from: star,
          to: other,
          duration: 3.5 + Math.random() * 5.5,
          delay: Math.random() * 9,
        });
      });
    });

    return { stars, edges };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Synaptic edges */}
      {edges.map((edge) => {
        const dx = edge.to.left - edge.from.left;
        const dy = edge.to.top - edge.from.top;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const midTop = (edge.from.top + edge.to.top) / 2;
        const midLeft = (edge.from.left + edge.to.left) / 2;

        return (
          <span
            key={`edge-${edge.id}`}
            className="animate-synapse absolute origin-center"
            style={{
              top: `${midTop}%`,
              left: `${midLeft}%`,
              width: `${length}%`,
              height: '1.5px',
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              animationDuration: `${edge.duration}s`,
              animationDelay: `${-edge.delay}s`,
              background:
                'linear-gradient(90deg, rgba(148,163,255,0) 0%, rgba(191,219,254,0.12) 30%, rgba(221,214,254,0.7) 50%, rgba(191,219,254,0.12) 70%, rgba(148,163,255,0) 100%)',
              boxShadow:
                '0 0 10px rgba(167,139,250,0.25), 0 0 18px rgba(129,140,248,0.18)',
            }}
          />
        );
      })}

      {stars.map((star) => (
        <span
          key={star.id}
          className="animate-neuron absolute rounded-full bg-white/70 shadow-[0_0_5px_1.5px_rgba(244,244,255,0.85),0_0_12px_2.5px_rgba(160,184,255,0.30),0_0_16px_3px_rgba(165,132,244,0.10)]"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${-star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function NeuralBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden transition-opacity duration-700 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Base cosmic wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#02041f] to-[#020617]" />

      {/* Nebula-like color fields */}
      <div className="absolute -top-1/3 -left-1/4 h-[55vh] w-[55vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.28),transparent_60%)] blur-3xl" />
      <div className="absolute -bottom-1/4 right-[-10%] h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(94,92,255,0.26),transparent_65%)] blur-3xl" />
      <div className="absolute top-1/4 left-1/2 h-[40vh] w-[40vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.32),transparent_60%)] blur-3xl" />

      {/* Fine grain vignette to push focus inward */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.6)_65%,rgba(15,23,42,0.95)_100%)]" />

      {/* Neuronal star field */}
      <NeuralStarField />
    </div>
  );
}


