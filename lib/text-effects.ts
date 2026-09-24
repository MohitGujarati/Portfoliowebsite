const GLYPHS = '!<>-_\\/[]{}=+*^?#01$%&';
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** "Decrypt" text: random glyphs resolve left to right into the real string. */
export function scramble(el: HTMLElement, duration = 900) {
  const final = el.dataset.text || el.textContent || '';
  el.dataset.text = final;
  const start = performance.now();
  return new Promise<void>((resolve) => {
    function frame(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const settled = Math.floor(p * final.length);
      let out = '';
      for (let i = 0; i < final.length; i++) {
        const c = final[i];
        out += i < settled || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame);
      else { el.textContent = final; resolve(); }
    }
    requestAnimationFrame(frame);
  });
}

/** Type a string into an element one character at a time, with a block caret. */
export async function typeInto(el: HTMLElement, text: string, speed = 38) {
  el.classList.add('is-typing');
  el.textContent = '';
  for (const ch of text) {
    el.textContent += ch;
    await sleep(speed);
  }
  await sleep(700);
  el.classList.remove('is-typing');
}

/** Type out syntax-highlighted code without losing the highlighting spans. */
export function typeCode(code: HTMLElement, pre: HTMLElement, posEl: HTMLElement) {
  const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
  const parts: { node: Text; text: string }[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.textContent) parts.push({ node, text: node.textContent });
  }
  pre.style.minHeight = pre.offsetHeight + 'px'; // no layout jump while typing
  parts.forEach((p) => { p.node.textContent = ''; });

  let pi = 0;
  let ci = 0;
  let line = 1;
  let col = 1;
  let timer = 0;
  function tick() {
    for (let k = 0; k < 3 && pi < parts.length; k++) {
      const p = parts[pi];
      const ch = p.text[ci++];
      p.node.textContent += ch;
      if (ch === '\n') { line++; col = 1; } else { col++; }
      if (ci >= p.text.length) { pi++; ci = 0; }
    }
    posEl.textContent = `Ln ${line}, Col ${col}`;
    if (pi < parts.length) timer = window.setTimeout(tick, 16);
  }
  tick();
  // cancel: restore the full text immediately
  return () => {
    clearTimeout(timer);
    parts.forEach((p) => { p.node.textContent = p.text; });
  };
}
