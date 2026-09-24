// Hero background: a drifting undirected graph. Edges exist between nodes that
// are close together, and every few seconds a breadth-first search runs from a
// random node, lighting up the BFS tree level by level. Click to pick the start.
const LINK = 135; // max edge length (px)
const LINK2 = LINK * LINK;
const POINTER = 170; // pointer influence radius (px)
const STEP = 150; // ms per BFS level
const MAX_DEPTH = 9;

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { start: number; depth: Map<number, number>; parent: Map<number, number>; maxDepth: number };

export function initGraph(canvas: HTMLCanvasElement, area: HTMLElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0;
  let h = 0;
  const nodes: Node[] = [];
  let pulse: Pulse | null = null;
  let nextPulse = performance.now() + 1800;
  let running = false;
  let visible = true;
  let raf = 0;
  let ink = '236, 238, 242';
  let accent = '200, 245, 96';
  const pointer = { x: -1e4, y: -1e4 };

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    ink = cs.getPropertyValue('--ink-rgb').trim() || ink;
    accent = cs.getPropertyValue('--accent-rgb').trim() || accent;
    if (reduce) draw(0);
  }

  const makeNode = (): Node => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: 1.1 + Math.random() * 1.5,
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = Math.round(Math.max(26, Math.min(95, (w * h) / 14000)));
    while (nodes.length < target) nodes.push(makeNode());
    nodes.length = target;
    nodes.forEach((n) => { n.x = Math.min(n.x, w); n.y = Math.min(n.y, h); });
    pulse = null;

    if (reduce) draw(0);
  }

  function neighbors(i: number) {
    const a = nodes[i];
    const out: number[] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      const dx = a.x - nodes[j].x;
      const dy = a.y - nodes[j].y;
      if (dx * dx + dy * dy < LINK2) out.push(j);
    }
    return out;
  }

  function bfs(start: number, now: number) {
    const depth = new Map([[start, 0]]);
    const parent = new Map<number, number>();
    const queue = [start];
    let maxDepth = 0;
    while (queue.length) {
      const u = queue.shift()!;
      const d = depth.get(u)!;
      if (d >= MAX_DEPTH) continue;
      for (const v of neighbors(u)) {
        if (depth.has(v)) continue;
        depth.set(v, d + 1);
        parent.set(v, u);
        maxDepth = Math.max(maxDepth, d + 1);
        queue.push(v);
      }
    }
    pulse = { start: now, depth, parent, maxDepth };
  }

  function nearest(x: number, y: number) {
    let best = 0;
    let bestD = Infinity;
    nodes.forEach((n, i) => {
      const d = (n.x - x) ** 2 + (n.y - y) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function step() {
    for (const n of nodes) {
      const dx = n.x - pointer.x;
      const dy = n.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < POINTER * POINTER && d2 > 1) {
        const d = Math.sqrt(d2);
        const f = (1 - d / POINTER) * 0.6;
        n.x += (dx / d) * f;
        n.y += (dy / d) * f;
      }
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) { n.vx *= -1; n.x = Math.max(0, Math.min(w, n.x)); }
      if (n.y < 0 || n.y > h) { n.vy *= -1; n.y = Math.max(0, Math.min(h, n.y)); }
    }
  }

  function draw(now: number) {
    if (!w) return;
    const c = ctx!;
    c.clearRect(0, 0, w, h);

    // proximity edges
    c.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= LINK2) continue;
        c.strokeStyle = `rgba(${ink}, ${((1 - Math.sqrt(d2) / LINK) * 0.2).toFixed(3)})`;
        c.beginPath();
        c.moveTo(a.x, a.y);
        c.lineTo(b.x, b.y);
        c.stroke();
      }
    }

    // pointer links
    for (const n of nodes) {
      const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
      if (d >= POINTER) continue;
      c.strokeStyle = `rgba(${accent}, ${((1 - d / POINTER) * 0.45).toFixed(3)})`;
      c.beginPath();
      c.moveTo(pointer.x, pointer.y);
      c.lineTo(n.x, n.y);
      c.stroke();
    }

    // BFS tree edges, growing level by level
    let elapsed = -1;
    let fade = 1;
    if (pulse) {
      const p = pulse;
      elapsed = now - p.start;
      const total = (p.maxDepth + 1) * STEP;
      fade = 1 - Math.min(Math.max((elapsed - total - 600) / 900, 0), 1);
      if (fade <= 0) {
        pulse = null;
        elapsed = -1;
        nextPulse = now + 1400;
      } else {
        c.lineWidth = 1.6;
        c.strokeStyle = `rgba(${accent}, ${(0.85 * fade).toFixed(3)})`;
        p.parent.forEach((par, v) => {
          const d = p.depth.get(v)!;
          const prog = Math.min(Math.max((elapsed - (d - 1) * STEP) / STEP, 0), 1);
          if (prog <= 0) return;
          const a = nodes[par];
          const b = nodes[v];
          c.beginPath();
          c.moveTo(a.x, a.y);
          c.lineTo(a.x + (b.x - a.x) * prog, a.y + (b.y - a.y) * prog);
          c.stroke();
        });
      }
    }

    // nodes
    nodes.forEach((n, i) => {
      const d = pulse ? pulse.depth.get(i) : undefined;
      const visited = elapsed >= 0 && d !== undefined && elapsed >= d * STEP;
      c.beginPath();
      if (visited) {
        c.fillStyle = `rgba(${accent}, ${fade.toFixed(3)})`;
        c.arc(n.x, n.y, n.r + (d === 0 ? 2.6 : 1.4), 0, Math.PI * 2);
        c.fill();
        const t = (elapsed - d! * STEP) / 500;
        if (t < 1) {
          c.beginPath();
          c.lineWidth = 1.2;
          c.strokeStyle = `rgba(${accent}, ${((1 - t) * 0.6 * fade).toFixed(3)})`;
          c.arc(n.x, n.y, n.r + 2 + t * 14, 0, Math.PI * 2);
          c.stroke();
        }
      } else {
        c.fillStyle = `rgba(${ink}, 0.45)`;
        c.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        c.fill();
      }
    });
  }

  function loop() {
    const now = performance.now();
    raf = 0;
    if (!running) return;
    step();
    if (!pulse && now > nextPulse && nodes.length) bfs(Math.floor(Math.random() * nodes.length), now);
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  function setRunning() {
    const should = visible && !document.hidden && !reduce;
    if (should && !running) {
      running = true;
      raf = requestAnimationFrame(loop);
    } else if (!should && running) {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  // ---- wiring ----
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  };
  const onLeave = () => { pointer.x = pointer.y = -1e4; };
  const onClick = (e: MouseEvent) => {
    if (reduce || (e.target as Element).closest('a, button, input, .code-card')) return;
    if (String(window.getSelection() || '').length) return;
    const r = canvas.getBoundingClientRect();
    bfs(nearest(e.clientX - r.left, e.clientY - r.top), performance.now());
  };
  area.addEventListener('pointermove', onMove);
  area.addEventListener('pointerleave', onLeave);
  area.addEventListener('click', onClick);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; setRunning(); });
  io.observe(canvas);
  document.addEventListener('visibilitychange', setRunning);
  const mo = new MutationObserver(readColors);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  mq.addEventListener('change', readColors);

  readColors();
  resize();
  setRunning();

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    area.removeEventListener('pointermove', onMove);
    area.removeEventListener('pointerleave', onLeave);
    area.removeEventListener('click', onClick);
    ro.disconnect();
    io.disconnect();
    mo.disconnect();
    mq.removeEventListener('change', readColors);
    document.removeEventListener('visibilitychange', setRunning);
  };
}
