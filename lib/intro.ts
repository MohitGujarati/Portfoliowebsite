// Particle intro: a swarm of points morphs through "hello" in different
// languages, ends on the programmer's "hello, world", then bursts outward to
// reveal the page. Plain 2D canvas, no WebGL needed.

export type Greeting = { word: string; lang: string; label: string; mono?: boolean };

export const GREETINGS: Greeting[] = [
  { word: 'Hello', lang: 'en', label: 'English' },
  { word: 'Hola', lang: 'es', label: 'Español' },
  { word: 'Bonjour', lang: 'fr', label: 'Français' },
  { word: 'नमस्ते', lang: 'hi', label: 'हिन्दी · Hindi' },
  { word: 'કેમ છો', lang: 'gu', label: 'ગુજરાતી · Gujarati' },
  { word: 'こんにちは', lang: 'ja', label: '日本語 · Japanese' },
  { word: '你好', lang: 'zh', label: '中文 · Chinese' },
  { word: '안녕하세요', lang: 'ko', label: '한국어 · Korean' },
  { word: 'hello, world', lang: 'en', label: 'printf("hello, world\\n");', mono: true },
];

const FIRST_MS = 1100;
const WORD_MS = 650;
const LAST_MS = 1700;
const BURST_MS = 1200;
const COLORS = ['#c8f560', '#8ecbff', '#ffffff'];

// x/y ease toward the target; ox/oy is a separate offset from the cursor push that springs back.
type Particle = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; tx: number; ty: number; rate: number; size: number; color: number };

type Options = {
  canvas: HTMLCanvasElement;
  overlay: HTMLElement;
  label: HTMLElement;
  fonts: { sans: string; mono: string };
  /** Called when the burst starts; `completed` is false if the visitor skipped. */
  onReveal: (completed: boolean) => void;
  /** Called when the last particle is gone and the overlay can be removed. */
  onFinished: () => void;
};

export function runIntro({ canvas, overlay, label, fonts, onReveal, onFinished }: Options) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    onReveal(false);
    onFinished();
    return () => {};
  }

  const W = window.innerWidth;
  const H = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // ---------- sample each greeting into target points ----------
  const N = W < 700 ? 1500 : 2800;
  const sampler = document.createElement('canvas');
  sampler.width = W;
  sampler.height = H;
  const sctx = sampler.getContext('2d', { willReadFrequently: true })!;

  function sample(g: Greeting): [number, number][] {
    const family = g.mono ? fonts.mono : fonts.sans;
    let size = Math.min(H * 0.26, 220);
    sctx.font = `700 ${size}px ${family}`;
    const measured = sctx.measureText(g.word).width;
    if (measured > W * 0.84) size *= (W * 0.84) / measured;
    sctx.clearRect(0, 0, W, H);
    sctx.font = `700 ${size}px ${family}`;
    sctx.fillStyle = '#fff';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.fillText(g.word, W / 2, H * 0.45);

    const data = sctx.getImageData(0, 0, W, H).data;
    const step = W < 700 ? 3 : 4;
    const pts: [number, number][] = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
      }
    }
    for (let i = pts.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }
    return pts.length ? pts : [[W / 2, H / 2]];
  }

  const targets = GREETINGS.map(sample);

  const particles: Particle[] = Array.from({ length: N }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    ox: 0,
    oy: 0,
    vx: 0,
    vy: 0,
    tx: 0,
    ty: 0,
    rate: 9 + Math.random() * 9,
    size: 1.2 + Math.random() * 1.3,
    color: Math.random() < 0.62 ? 0 : Math.random() < 0.85 ? 1 : 2,
  }));

  // ---------- timeline ----------
  const starts: number[] = [];
  let acc = 0;
  GREETINGS.forEach((_, i) => {
    starts.push(acc);
    acc += i === 0 ? FIRST_MS : i === GREETINGS.length - 1 ? LAST_MS : WORD_MS;
  });
  let burstAt = acc;
  let current = -1;
  let bursting = false;
  let finished = false;
  let skipped = false;
  let raf = 0;
  const mouse = { x: -1e4, y: -1e4 };
  const t0 = performance.now();
  let last = t0;

  function showWord(i: number) {
    current = i;
    const pts = targets[i];
    particles.forEach((p, k) => {
      const [x, y] = pts[k % pts.length];
      p.tx = x + (Math.random() - 0.5) * 1.5;
      p.ty = y + (Math.random() - 0.5) * 1.5;
    });
    const g = GREETINGS[i];
    label.classList.remove('is-in');
    label.lang = g.lang;
    label.textContent = g.label;
    label.classList.toggle('is-code', !!g.mono);
    requestAnimationFrame(() => label.classList.add('is-in'));
  }

  function startBurst() {
    if (bursting) return;
    bursting = true;
    burstAt = performance.now() - t0;
    overlay.classList.add('is-leaving');
    particles.forEach((p) => {
      p.x += p.ox;
      p.y += p.oy;
      const dx = p.x - W / 2;
      const dy = p.y - H * 0.45;
      const d = Math.hypot(dx, dy) || 1;
      const speed = 360 + Math.random() * 960; // px per second
      p.vx = (dx / d) * speed;
      p.vy = (dy / d) * speed;
    });
    setTimeout(() => onReveal(!skipped), 120);
  }

  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    detach();
    if (!bursting) onReveal(false);
    onFinished();
  }

  function frame() {
    const now = performance.now();
    const t = now - t0;
    const dt = Math.min(now - last, 50) / 1000; // seconds; capped so a stalled tab doesn't teleport
    last = now;

    if (!bursting) {
      let next = current;
      while (next + 1 < GREETINGS.length && t >= starts[next + 1]) next++;
      if (next !== current) showWord(next);
      if (t >= burstAt) startBurst();
    }

    ctx!.clearRect(0, 0, W, H);
    ctx!.globalCompositeOperation = 'lighter';

    if (!bursting) {
      const spring = Math.exp(-dt * 7);
      for (const p of particles) {
        // time-based easing: same speed at 30, 60 or 120 fps
        const k = 1 - Math.exp(-dt * p.rate);
        p.x += (p.tx - p.x) * k;
        p.y += (p.ty - p.y) * k;

        const dx = p.x + p.ox - mouse.x;
        const dy = p.y + p.oy - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 9000) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 95) * 240 * dt;
          p.ox += (dx / d) * f;
          p.oy += (dy / d) * f;
        }
        p.ox *= spring;
        p.oy *= spring;
      }
      ctx!.globalAlpha = 1;
    } else {
      const e = Math.min((t - burstAt) / BURST_MS, 1);
      const accel = Math.exp(dt * 3.5);
      const grow = Math.exp(dt * 2.1);
      for (const p of particles) {
        p.vx *= accel;
        p.vy *= accel;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.size *= grow;
      }
      ctx!.globalAlpha = 1 - e * e;
      if (e >= 1) { finish(); return; }
    }

    for (let c = 0; c < COLORS.length; c++) {
      ctx!.fillStyle = current === GREETINGS.length - 1 && c !== 2 ? COLORS[0] : COLORS[c];
      for (const p of particles) {
        if (p.color === c) ctx!.fillRect(p.x + p.ox, p.y + p.oy, p.size, p.size);
      }
    }

    raf = requestAnimationFrame(frame);
  }

  // ---------- input ----------
  const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  const onSkip = () => {
    if (finished) return;
    if (bursting) { finish(); return; }
    skipped = true;
    startBurst();
  };
  // The words were laid out for this width; only a real width change (rotation,
  // window resize) ends the intro early. Mobile URL-bar height changes don't.
  const onResize = () => { if (Math.abs(window.innerWidth - W) > 80) onSkip(); };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('keydown', onSkip);
  window.addEventListener('wheel', onSkip, { passive: true });
  window.addEventListener('touchmove', onSkip, { passive: true });
  window.addEventListener('resize', onResize);
  overlay.addEventListener('pointerdown', onSkip);

  function detach() {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('keydown', onSkip);
    window.removeEventListener('wheel', onSkip);
    window.removeEventListener('touchmove', onSkip);
    window.removeEventListener('resize', onResize);
    overlay.removeEventListener('pointerdown', onSkip);
  }

  raf = requestAnimationFrame(frame);

  // Stop without reporting anything (component unmounted).
  return () => {
    finished = true;
    cancelAnimationFrame(raf);
    detach();
  };
}
