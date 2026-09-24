'use client';

import { useEffect, useState } from 'react';
import { useActiveSection } from '@/lib/use-active-section';

type Mode = 'NORMAL' | 'INSERT' | 'VISUAL';

/** Vim-style status line: mode, current "path" and scroll position. */
export default function StatusLine() {
  const active = useActiveSection();
  const [mode, setMode] = useState<Mode>('NORMAL');
  const [pos, setPos] = useState('Top');

  useEffect(() => {
    const isTerm = (t: EventTarget | null) => (t as Element | null)?.id === 'term-input';
    const onFocusIn = (e: FocusEvent) => { if (isTerm(e.target)) setMode('INSERT'); };
    const onFocusOut = (e: FocusEvent) => { if (isTerm(e.target)) setMode('NORMAL'); };
    const onSelection = () => {
      if (isTerm(document.activeElement)) return;
      const sel = window.getSelection();
      setMode(sel && !sel.isCollapsed && String(sel).trim() ? 'VISUAL' : 'NORMAL');
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
        setPos(pct <= 0 ? 'Top' : pct >= 100 ? 'Bot' : `${pct}%`);
      });
    };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    document.addEventListener('selectionchange', onSelection);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('selectionchange', onSelection);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="statusline">
      <span className={`sl__mode${mode === 'INSERT' ? ' is-insert' : mode === 'VISUAL' ? ' is-visual' : ''}`} aria-hidden="true">{mode}</span>
      <span className="sl__branch" aria-hidden="true">⎇ main</span>
      <span className="sl__path" aria-hidden="true">{active ? `~/mohit/${active}` : '~/mohit'}</span>
      <span className="sl__spacer" aria-hidden="true" />
      <span className="sl__meta" aria-hidden="true">utf-8</span>
      <span className="sl__meta" aria-hidden="true">tsx</span>
      <span className="sl__pos" aria-hidden="true">{pos}</span>
    </div>
  );
}
