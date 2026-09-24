'use client';

import { useEffect, useRef } from 'react';
import { onIntroDone } from '@/lib/intro-state';
import { typeCode } from '@/lib/text-effects';

/** The hero's code card; types itself out once the intro is done. */
export default function CodeCard() {
  const pre = useRef<HTMLPreElement>(null);
  const code = useRef<HTMLElement>(null);
  const pos = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancel = () => {};
    const off = onIntroDone(() => {
      if (pre.current && code.current && pos.current) cancel = typeCode(code.current, pre.current, pos.current);
    });
    return () => { off(); cancel(); };
  }, []);

  return (
    <div className="code-card" aria-hidden="true">
      <div className="code-card__bar">
        <span /><span /><span />
        <p>mohit.ts</p>
      </div>
      <pre className="code" ref={pre}>
        <code ref={code}>
          <span className="c">{'// compiled from 2 years of shipping'}</span>{'\n'}
          <span className="k">const</span> <span className="v">mohit</span>: <span className="t">Engineer</span>{' = {\n'}
          {'  role: '}<span className="s">&quot;Full-Stack Engineer&quot;</span>{',\n'}
          {'  now: '}<span className="s">&quot;Gabriel AI&quot;</span>{',\n'}
          {'  based: '}<span className="s">&quot;Phoenix, AZ&quot;</span>{',\n'}
          {'  mobile: ['}<span className="s">&quot;Kotlin&quot;</span>, <span className="s">&quot;Compose&quot;</span>, <span className="s">&quot;React Native&quot;</span>{'],\n'}
          {'  web: ['}<span className="s">&quot;React&quot;</span>, <span className="s">&quot;Next.js&quot;</span>, <span className="s">&quot;Express&quot;</span>{'],\n'}
          {'  data: ['}<span className="s">&quot;Postgres&quot;</span>, <span className="s">&quot;Room&quot;</span>, <span className="s">&quot;Supabase&quot;</span>{'],\n'}
          {'  ai: ['}<span className="s">&quot;Gemini&quot;</span>, <span className="s">&quot;ReAct agents&quot;</span>, <span className="s">&quot;SSE&quot;</span>{'],\n'}
          {'  openToChat: '}<span className="k">true</span>{',\n};\n\n'}
          <span className="k">await</span> <span className="v">mohit</span>.<span className="f">ship</span>(<span className="s">&quot;next big thing&quot;</span>);
          <span className="caret" />
        </code>
      </pre>
      <div className="code-card__foot">
        <span><span className="foot-dot" />TypeScript</span>
        <span ref={pos}>Ln 13, Col 38</span>
      </div>
    </div>
  );
}
