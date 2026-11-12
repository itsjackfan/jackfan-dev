'use client';

import { useEffect, useRef } from 'react';
import { build, renderDynamic, renderStatic, type Geom, type Put, type Scene } from './scene';

const FONT_PX = 7;
const FPS = 24;

export function AsciiSky({ scene }: { scene: Scene }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const back = document.createElement('canvas');
    const bctx = back.getContext('2d')!;
    const styles = getComputedStyle(document.documentElement);
    const ink = `rgb(${styles.getPropertyValue('--ink')})`;
    const ember = `rgb(${styles.getPropertyValue('--ember')})`;
    const font = `${FONT_PX}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    let g: Geom, layer: ReturnType<typeof build>;

    const putter = (c: CanvasRenderingContext2D): Put => (x, y, ch, v, color) => {
      if (ch === '') return c.clearRect(x * g.cw, y * g.ch, g.cw, g.ch);
      c.globalAlpha = 0.25 + 0.75 * Math.min(1, v);
      c.fillStyle = color ? ember : ink;
      c.fillText(ch, x * g.cw, y * g.ch);
    };
    const setup = (c: CanvasRenderingContext2D, dpr: number) => {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.font = font;
      c.textBaseline = 'top';
      c.fillStyle = ink;
    };
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = window.innerWidth, H = window.innerHeight;
      for (const c of [canvas, back]) {
        c.width = W * dpr;
        c.height = H * dpr;
      }
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      setup(ctx, dpr);
      setup(bctx, dpr);
      const cw = ctx.measureText('M').width, ch = FONT_PX;
      g = { W, H, cw, ch, cols: Math.ceil(W / cw), rows: Math.ceil(H / ch) };
      layer = build(g, scene);
      renderStatic(layer, putter(bctx));
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0, last = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 1000 / FPS) return;
      last = now;
      ctx.clearRect(0, 0, g.W, g.H);
      ctx.globalAlpha = 1;
      ctx.drawImage(back, 0, 0, g.W, g.H);
      renderDynamic(now / 1000, layer, putter(ctx));
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [scene]);

  return <canvas ref={ref} aria-hidden className={scene === 'home' ? 'ascii-sky' : 'ascii-sky ascii-sky-calm'} />;
}
