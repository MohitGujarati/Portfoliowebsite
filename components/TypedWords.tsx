'use client';

import { useEffect, useState } from 'react';
import { onIntroDone } from '@/lib/intro-state';

/** Typewriter that cycles through phrases once the intro is done. */
export default function TypedWords({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let alive = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function run() {
      let i = 0;
      await sleep(1800);
      while (alive) {
        if (document.hidden) { await sleep(500); continue; }
        const current = words[i];
        for (let n = current.length; n >= 0 && alive; n--) { setText(current.slice(0, n)); await sleep(32); }
        i = (i + 1) % words.length;
        const next = words[i];
        await sleep(180);
        for (let n = 1; n <= next.length && alive; n++) { setText(next.slice(0, n)); await sleep(62); }
        await sleep(2000);
      }
    }

    const off = onIntroDone(() => { run(); });
    return () => { alive = false; off(); };
  }, [words]);

  return (
    <>
      <em className="typed">{text}</em>
      <span className="type-caret" aria-hidden="true" />
    </>
  );
}
