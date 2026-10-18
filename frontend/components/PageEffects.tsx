'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Progressive enhancement: content stays readable without JavaScript. */
export default function PageEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || reduce.matches) return;
          animations.push(
            (entry.target as HTMLElement).animate(
              [
                { opacity: 0, transform: 'translateY(14px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
            ),
          );
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    );
    document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
      // Above-the-fold content already has the route entrance; never restart it.
      if (el.getBoundingClientRect().top >= window.innerHeight) observer.observe(el);
    });
    const onReduced = () => {
      if (reduce.matches) {
        observer.disconnect();
        animations.forEach((animation) => animation.finish());
      }
    };
    reduce.addEventListener('change', onReduced);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      reduce.removeEventListener('change', onReduced);
    };
  }, [pathname]);
  return null;
}
