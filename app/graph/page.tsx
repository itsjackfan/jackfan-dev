'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Map } from 'lucide-react';
import { ManifoldGraph } from '@/components/graph/ManifoldGraph';

export default function GraphPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [legendData, setLegendData] = useState<
    Array<{ tag: string; color: string }>
  >([]);
  const [transitioned, setTransitioned] = useState(false);

  // Smooth white-to-black page transition
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitioned(true);
      });
    });
  }, []);

  // Delay UI chrome until scene has settled
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Transition overlay — fades from white (matching main page) to transparent */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] bg-white transition-opacity duration-[1200ms] ease-in-out"
        style={{ opacity: transitioned ? 0 : 1 }}
      />

      <ManifoldGraph onLegendData={setLegendData} />

      {/* Back to home */}
      <Link
        href="/"
        className={`group absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-light tracking-wide text-white/60 backdrop-blur-md transition-all duration-500 hover:text-white/90 ${
          isVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-2 opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span>back</span>
      </Link>

      {/* Legend */}
      {legendData.length > 0 && (
        <div
          className={`absolute bottom-4 right-4 z-50 rounded-xl p-4 backdrop-blur-md transition-all duration-500 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0 pointer-events-none'
          }`}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            maxWidth: '220px',
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Map className="h-3.5 w-3.5 text-white/30" />
            <h3 className="text-[10px] font-light uppercase tracking-widest text-white/30">
              Legend
            </h3>
          </div>
          <div className="space-y-2">
            {legendData.map((item) => (
              <div
                key={item.tag}
                className="flex items-center gap-3 text-[11px] font-light text-white/50"
              >
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 6px ${item.color}40`,
                  }}
                />
                <span className="capitalize tracking-wide">{item.tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
