'use client';

import Link from 'next/link';
import { useMotionValue, useReducedMotion, useSpring, motion } from 'motion/react';
import type { PointerEvent } from 'react';

/** The hit area stays fixed while the small arrow responds to a precise pointer. */
export default function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 230, damping: 24, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 230, damping: 24, mass: 0.35 });
  function move(event: PointerEvent<HTMLSpanElement>) {
    if (reduced || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - bounds.left - bounds.width / 2) * 0.15);
    rawY.set((event.clientY - bounds.top - bounds.height / 2) * 0.15);
  }
  function reset() {
    rawX.set(0);
    rawY.set(0);
  }
  return (
    <Link href={href} className="hero-work-link">
      <span>{children}</span>
      <span className="magnetic-target" onPointerMove={move} onPointerLeave={reset}>
        <motion.span className="circle-arrow" style={reduced ? undefined : { x, y }} aria-hidden="true">
          <span>↗</span>
        </motion.span>
      </span>
    </Link>
  );
}
