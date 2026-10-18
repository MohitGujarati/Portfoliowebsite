'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { registerLenis, resetScroll, samePageTarget, scrollToElement } from '@/lib/scroll';

/**
 * Momentum scrolling (Lenis) for wheel and trackpad, plus gliding navigation: links to a section on the same
 * page glide there, and arriving on a new page at a #section starts at the top and glides down to it.
 * Touch keeps native scrolling, and Lenis turns smoothing off under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, stopInertiaOnNavigate: true });
    registerLenis(lenis);

    // Runs before React's own click handling (document capture), so Next's Link does not jump first.
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element | null)?.closest('a[href*="#"]');
      if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return;
      const target = samePageTarget(link.href);
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      window.history.pushState(window.history.state, '', link.hash);
      scrollToElement(target);
    };
    document.addEventListener('click', onClick, { capture: true });

    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Leave the browser's restored position alone on the first load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    resetScroll();
    if (target) requestAnimationFrame(() => scrollToElement(target));
  }, [pathname]);

  return null;
}
