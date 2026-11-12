'use client';

import { useEffect, useState } from 'react';
import { Map } from 'lucide-react';
import { BackLink } from '@/components/ui/BackLink';
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
      {/* Transition overlay — fades from the site surface (matching main page) to transparent */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] bg-surface transition-opacity duration-[1200ms] ease-in-out"
        style={{ opacity: transitioned ? 0 : 1 }}
      />

      <ManifoldGraph onLegendData={setLegendData} />

      {/* Back to home */}
      <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <BackLink />
      </div>

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
