'use client';

import { useEffect } from 'react';
import { onIntroDone } from '@/lib/intro-state';
import { scramble, typeInto } from '@/lib/text-effects';

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

/**
 * Page-wide behavior on top of the server-rendered markup: scroll reveals,
 * typed section commands, scrambled headings, the git-log timeline, card tilt,
 * magnetic buttons, the "/" shortcut and the Konami code. Renders nothing.
 */
export default function PageEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const $$ = <T extends HTMLElement = HTMLElement>(sel: string, ctx: ParentNode = document) => [...ctx.querySelectorAll<T>(sel)];
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(target: Window | Document | HTMLElement, type: K | string, fn: EventListener, opts?: AddEventListenerOptions) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };

    // ---------- prepare typed eyebrows + staggered chips ----------
    if (!reduce) {
      $$('[data-type]').forEach((t) => {
        if (!t.dataset.full) t.dataset.full = t.textContent || '';
        t.textContent = '';
      });
    }
    $$('.chips').forEach((ul) => [...ul.children].forEach((li, i) => (li as HTMLElement).style.setProperty('--i', String(i))));

    // ---------- reveal on scroll ----------
    let io: IntersectionObserver | null = null;
    function reveal(el: HTMLElement) {
      el.classList.add('is-visible');
      setTimeout(() => { el.style.transitionDelay = ''; }, 1200);
      if (reduce) return;
      $$('[data-type]', el).forEach((t) => typeInto(t, t.dataset.full || ''));
      $$('[data-scramble]', el).forEach((s) => scramble(s, 800));
    }
    function startReveal() {
      const els = $$('.reveal');
      if (reduce) { els.forEach((el) => el.classList.add('is-visible')); return; }
      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          io?.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      els.forEach((el) => {
        const siblings = [...(el.parentElement?.children || [])].filter((c) => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
        io!.observe(el);
      });
    }

    const offIntro = onIntroDone(() => {
      startReveal();
      const name = document.getElementById('hero-name');
      if (name && !reduce) scramble(name, 1200);
    });
    cleanups.push(offIntro, () => io?.disconnect());

    // ---------- git-log timeline fills as you scroll ----------
    const timeline = document.getElementById('timeline');
    const fill = document.getElementById('timeline-fill');
    const commits = $$('.commit');
    let ticking = false;
    const updateTimeline = () => {
      ticking = false;
      if (!timeline || !fill) return;
      const vh = window.innerHeight;
      const r = timeline.getBoundingClientRect();
      fill.style.transform = `scaleY(${Math.min(Math.max((vh * 0.6 - r.top) / r.height, 0), 1)})`;
      commits.forEach((c) => c.classList.toggle('is-lit', c.getBoundingClientRect().top < vh * 0.6));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateTimeline);
    };
    on(window, 'scroll', onScroll, { passive: true });
    on(window, 'resize', onScroll);
    updateTimeline();

    // ---------- project cards: spotlight + tilt ----------
    $$('.project').forEach((card) => {
      on(card, 'pointermove', ((e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        if (reduce || !finePointer) return;
        const rx = (y / r.height - 0.5) * -6;
        const ry = (x / r.width - 0.5) * 8;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      }) as EventListener);
      on(card, 'pointerleave', () => { card.style.transform = ''; });
    });

    // ---------- magnetic buttons ----------
    if (!reduce && finePointer) {
      $$('[data-magnetic]').forEach((btn) => {
        on(btn, 'pointermove', ((e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.3}px)`;
        }) as EventListener);
        on(btn, 'pointerleave', () => { btn.style.transform = ''; });
      });
    }

    // ---------- keyboard: "/" opens the terminal, Konami code ----------
    let konamiPos = 0;
    let crtTimer = 0;
    on(document, 'keydown', ((e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      konamiPos = k === KONAMI[konamiPos] ? konamiPos + 1 : k === KONAMI[0] ? 1 : 0;
      if (konamiPos === KONAMI.length) {
        konamiPos = 0;
        root.classList.add('crt');
        clearTimeout(crtTimer);
        crtTimer = window.setTimeout(() => root.classList.remove('crt'), 12000);
      }

      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as Element).closest('input, textarea, [contenteditable]')) return;
      if (root.classList.contains('booting')) return;
      e.preventDefault();
      document.getElementById('shell')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      document.getElementById('term-input')?.focus({ preventScroll: true });
    }) as EventListener);
    cleanups.push(() => clearTimeout(crtTimer));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
