'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { initGraph } from '@/lib/graph';

/** Wraps the hero with the interactive BFS graph canvas behind it. */
export default function HeroStage({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!wrap.current || !canvas.current) return;
    return initGraph(canvas.current, wrap.current);
  }, []);

  return (
    <div className="hero-wrap" ref={wrap}>
      <canvas className="hero__graph" ref={canvas} aria-hidden="true" />
      {children}
    </div>
  );
}
