'use client';

import { useEffect, useRef } from 'react';

type Cell = { x: number; y: number; seed: number; energy: number };

const STEP = 15;
const SIZE = 11;
/** The idle wave is ambient, so it renders at a lower frame rate than the pointer reveal. */
const IDLE_FPS = 30;
/** Seconds for the wave's hue to travel the colour wheel, starting at red. */
const HUE_CYCLE = 90;

/**
 * A pixel field drawn in code: no image, texture or WebGL. At rest a faint wave of muted
 * colour drifts across it; under the pointer it gives way to the green reveal.
 */
export default function PixelField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !host || !context) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let cells: Cell[] = [];
    let frame: number | null = null;
    let previousTime = 0;
    let startTime = 0;
    let onScreen = true;
    let pointer = { x: -1000, y: -1000, active: false };
    let light = false;
    // Strength of the idle wave: fades out while the pointer is over the field.
    let idle = 0;

    const readTheme = () => {
      light = getComputedStyle(document.documentElement).colorScheme === 'light';
      start();
    };

    function draw(time: number) {
      frame = null;
      if (!onScreen) {
        previousTime = 0;
        return;
      }
      if (!pointer.active && previousTime && time - previousTime < 1000 / IDLE_FPS) {
        frame = requestAnimationFrame(draw);
        return;
      }
      if (!startTime) startTime = time;
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      const rise = 1 - Math.exp(-elapsed / 60);
      const fall = 1 - Math.exp(-elapsed / 240);
      const radius = width < 768 ? 120 : 215;
      let changing = false;

      const idleTarget = pointer.active || motion.matches ? 0 : 1;
      idle += (idleTarget - idle) * (1 - Math.exp(-elapsed / (idleTarget ? 900 : 180)));
      if (Math.abs(idleTarget - idle) < 0.002) idle = idleTarget;
      const waving = idle > 0;
      const seconds = (time - startTime) / 1000;
      const hue = ((seconds / HUE_CYCLE) * 360) % 360;
      const waveColor = light ? `hsl(${hue} 38% 44%)` : `hsl(${hue} 42% 56%)`;
      // Accents inside the field (the period after the name) follow the wave; hovering restores the theme accent.
      if (idle > 0.5) host!.style.setProperty('--wave-color', light ? `hsl(${hue} 42% 40%)` : `hsl(${hue} 48% 64%)`);
      else host!.style.removeProperty('--wave-color');

      context!.clearRect(0, 0, width, height);

      for (const cell of cells) {
        const distance = Math.hypot(cell.x - pointer.x, cell.y - pointer.y);
        const proximity = pointer.active ? Math.max(0, 1 - distance / radius) : 0;
        const target = proximity * proximity;
        const difference = target - cell.energy;
        cell.energy = motion.matches ? target : cell.energy + difference * (difference > 0 ? rise : fall);
        if (Math.abs(target - cell.energy) > 0.002) changing = true;
        else cell.energy = target;

        // Two slow, crossing sine waves; only their crests light up, so the field stays sparse.
        let wave = 0;
        if (waving) {
          const swell =
            Math.sin(cell.x * 0.011 + cell.y * 0.006 - seconds * 0.55) * 0.6 +
            Math.sin(cell.x * 0.004 - cell.y * 0.009 + seconds * 0.35) * 0.4;
          const crest = Math.max(0, swell - 0.2) / 0.8;
          wave = crest * crest * (0.35 + cell.seed * 0.65) * idle * (1 - cell.energy);
        }
        if (cell.energy < 0.003 && wave < 0.004) continue;

        const edge = Math.max(0, Math.min(1, cell.x / 48, (width - cell.x) / 48, cell.y / 36, (height - cell.y) / 36));
        context!.beginPath();
        context!.roundRect(cell.x - SIZE / 2, cell.y - SIZE / 2, SIZE, SIZE, 2);

        if (wave >= 0.004) {
          context!.globalAlpha = wave * edge * (light ? 0.45 : 0.55);
          context!.fillStyle = waveColor;
          context!.fill();
        }
        if (cell.energy >= 0.003) {
          // Stable varied cells reproduce the small, irregular lights in the reference.
          const bright = cell.seed > 0.79;
          const strength = (0.2 + cell.seed * 0.8) * cell.energy * edge;
          context!.globalAlpha = strength * (light ? 0.8 : 1);
          context!.fillStyle = light
            ? bright
              ? '#397538'
              : '#6d9465'
            : bright
              ? '#b4ed8b'
              : cell.seed > 0.37
                ? '#679d53'
                : '#354b3b';
          context!.fill();
        }
      }
      context!.globalAlpha = 1;
      // The wave keeps the loop alive at rest; otherwise frames stop once the reveal settles.
      if ((changing || waving || idle !== idleTarget) && !motion.matches) frame = requestAnimationFrame(draw);
      else previousTime = 0;
    }

    function start() {
      if (frame === null && !document.hidden && onScreen) frame = requestAnimationFrame(draw);
    }

    function resize() {
      const bounds = host!.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      cells = [];
      const columns = Math.ceil(width / STEP);
      const rows = Math.ceil(height / STEP);
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const hash = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
          cells.push({
            x: column * STEP + STEP / 2,
            y: row * STEP + STEP / 2,
            seed: hash - Math.floor(hash),
            energy: 0,
          });
        }
      }
      start();
    }

    function move(event: PointerEvent) {
      const bounds = host!.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
      start();
    }

    function leave() {
      pointer.active = false;
      start();
    }
    function release(event: PointerEvent) {
      if (event.pointerType !== 'mouse') leave();
    }
    function visibility() {
      if (document.hidden) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        previousTime = 0;
        pointer.active = false;
      } else start();
    }

    const resizeObserver = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(readTheme);
    // Pause the continuous wave while the field is scrolled out of view.
    const viewObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });
    resizeObserver.observe(host);
    viewObserver.observe(host);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerdown', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    host.addEventListener('pointerup', release);
    host.addEventListener('pointercancel', leave);
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', start);
    readTheme();
    resize();

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      host.style.removeProperty('--wave-color');
      resizeObserver.disconnect();
      viewObserver.disconnect();
      themeObserver.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerdown', move);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointerup', release);
      host.removeEventListener('pointercancel', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={ref} className="pixel-field" aria-hidden="true" />;
}
