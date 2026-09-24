'use client';

import { useEffect, useRef } from 'react';
import { initTerminal } from '@/lib/terminal';
import { getTheme, setTheme } from '@/lib/theme';

const SUGGESTIONS = ['help', 'whoami', 'projects', 'papers', 'cat recall-ai.md', 'ping mohit', 'sudo hire mohit', 'matrix'];

export default function Terminal() {
  const body = useRef<HTMLDivElement>(null);
  const out = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const prompt = useRef<HTMLLabelElement>(null);
  const suggest = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!body.current || !out.current || !form.current || !input.current || !prompt.current || !suggest.current) return;
    return initTerminal({
      body: body.current,
      out: out.current,
      form: form.current,
      input: input.current,
      prompt: prompt.current,
      suggest: suggest.current,
      getTheme,
      setTheme,
      navigate(id) {
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        if (id === 'top') window.scrollTo({ top: 0, behavior });
        else document.getElementById(id)?.scrollIntoView({ behavior });
      },
    });
  }, []);

  return (
    <>
      <div className="terminal reveal" id="terminal">
        <div className="terminal__bar">
          <span /><span /><span />
          <p>visitor@mohit: ~ (mohit-sh)</p>
        </div>
        <div className="terminal__body" ref={body}>
          <div className="terminal__out" ref={out} aria-live="polite" />
          <form className="terminal__line" ref={form} autoComplete="off">
            <label className="terminal__prompt" ref={prompt} htmlFor="term-input">visitor@mohit:~$</label>
            <input
              className="terminal__input"
              id="term-input"
              ref={input}
              type="text"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              enterKeyHint="send"
            />
          </form>
        </div>
      </div>

      <div className="term-suggest reveal" ref={suggest} aria-label="Suggested commands">
        {SUGGESTIONS.map((cmd) => (
          <button key={cmd} type="button" data-cmd={cmd}>{cmd}</button>
        ))}
      </div>
    </>
  );
}
