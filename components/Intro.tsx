'use client';

import { useEffect, useRef, useState } from 'react';
import { runIntro } from '@/lib/intro';
import { markIntroDone } from '@/lib/intro-state';

// Plays once per browser session (the inline script in layout.tsx decides by
// adding `booting` to <html>). Everything underneath is already rendered, so
// search engines and screen readers get the full page regardless.
export default function Intro() {
  const [show, setShow] = useState(true);
  const overlay = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const label = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reveal = (watched: boolean) => {
      try { sessionStorage.setItem('booted', '1'); } catch { /* storage blocked */ }
      root.classList.remove('booting');
      markIntroDone(watched);
    };

    if (!root.classList.contains('booting') || !overlay.current || !canvas.current || !label.current) {
      reveal(false);
      setShow(false);
      return;
    }

    const cs = getComputedStyle(root);
    const fonts = {
      sans: cs.getPropertyValue('--font-sans').trim() || 'system-ui, sans-serif',
      mono: cs.getPropertyValue('--font-mono').trim() || 'monospace',
    };
    overlay.current.classList.add('is-playing');
    window.scrollTo(0, 0);

    let stop = () => {};
    let cancelled = false;
    const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
    fontsReady.then(() => {
      if (cancelled || !overlay.current || !canvas.current || !label.current) return;
      stop = runIntro({
        canvas: canvas.current,
        overlay: overlay.current,
        label: label.current,
        fonts,
        onReveal: reveal,
        onFinished: () => setShow(false),
      });
    });

    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  if (!show) return null;

  return (
    <div className="intro" ref={overlay} aria-hidden="true">
      <canvas className="intro__canvas" ref={canvas} />
      <p className="intro__lang" ref={label} />
      <p className="intro__hint">press any key to skip</p>
    </div>
  );
}
