'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PET_ACTIONS, PET_FACTS, SOFTWARE_PET_ENABLED, type PetAction, type PetMood } from '@/lib/software-pet';
import { trackPetClick } from '@/lib/analytics';

/** Must match --pet-size in the .software-pet CSS. */
const PET_SIZE = 37;

const EDGE_MARGIN = 16;
const NAV_CLEARANCE = 84; // keeps clear of the sticky nav
const BOTTOM_CLEARANCE = 96; // keeps clear of the vim statusline + a little air

const LOOK_RADIUS = 170; // px — cursor distance at which the pet starts "noticing" it
const LOOK_WAKE_RADIUS = 95; // px — close enough that it wakes the pet up
const LOOK_MAX_OFFSET = 2.4; // px — how far the face nudges toward the cursor
const DRAG_THRESHOLD = 5; // px of movement before a press counts as a drag, not a click

const SLEEPY_AFTER_MS = 50_000;
const ASLEEP_AFTER_MS = 78_000;
const FACT_VISIBLE_MS = 4_200;
const LANDING_MS = 420;
const WAKE_SETTLE_MS = 900;

const DISMISS_KEY = 'softwarePetDismissed';

type Point = { x: number; y: number };
type Bounds = { minX: number; maxX: number; minY: number; maxY: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getBounds(): Bounds {
  const maxX = Math.max(EDGE_MARGIN, window.innerWidth - PET_SIZE - EDGE_MARGIN);
  const maxY = Math.max(NAV_CLEARANCE, window.innerHeight - PET_SIZE - BOTTOM_CLEARANCE);
  return { minX: EDGE_MARGIN, maxX, minY: NAV_CLEARANCE, maxY };
}

function randomPointIn(bounds: Bounds): Point {
  return {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
  };
}

/** Usually a short hop from `from`; occasionally a longer scurry across the screen. */
function pickHopTarget(from: Point, bounds: Bounds): Point & { longHop: boolean } {
  const longHop = Math.random() < 0.22;
  const reachX = longHop ? bounds.maxX - bounds.minX : Math.min(260, bounds.maxX - bounds.minX);
  const reachY = longHop ? bounds.maxY - bounds.minY : Math.min(170, bounds.maxY - bounds.minY);
  const x = clamp(from.x + (Math.random() * 2 - 1) * reachX, bounds.minX, bounds.maxX);
  const y = clamp(from.y + (Math.random() * 2 - 1) * reachY, bounds.minY, bounds.maxY);
  return { x, y, longHop };
}

export default function SoftwarePet() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const faceRef = useRef<HTMLSpanElement | null>(null);

  const [mood, setMood] = useState<PetMood>('idle');
  const [action, setAction] = useState<PetAction | null>(null);
  const [fact, setFact] = useState<string | null>(null);
  const [bubbleSide, setBubbleSide] = useState<'left' | 'right'>('right');
  const [dragging, setDragging] = useState(false);
  const [landing, setLanding] = useState(false);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Position lives outside React state — it changes far too often (drags, cursor
  // sampling) to justify a re-render, so the DOM is written to directly and this
  // ref is just the single source of truth those writers agree on.
  const posRef = useRef<Point>({ x: 24, y: 120 });
  const moodRef = useRef<PetMood>('idle');
  const lastInteraction = useRef(0);
  const lastFactIndex = useRef(-1);
  const suppressClick = useRef(false);

  const dragInfo = useRef<{ startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null);
  const pendingPointer = useRef<Point | null>(null);
  const lookRaf = useRef<number | null>(null);

  const hopTimeout = useRef<number | null>(null);
  const sleepInterval = useRef<number | null>(null);
  const factTimeout = useRef<number | null>(null);
  const landingTimeout = useRef<number | null>(null);
  const wakeTimeout = useRef<number | null>(null);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  const applyPosition = useCallback((x: number, y: number) => {
    const el = rootRef.current;
    if (!el) return;
    posRef.current = { x, y };
    el.style.setProperty('translate', `${x}px ${y}px`);
  }, []);

  const hop = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const bounds = getBounds();
    const target = pickHopTarget(posRef.current, bounds);
    const dist = Math.hypot(target.x - posRef.current.x, target.y - posRef.current.y);
    const speed = 85 + Math.random() * 95; // px/s — keeps hops feeling one consistent "walk speed"
    const duration = clamp(dist / speed, 1.1, 4.6);
    const ease =
      Math.random() < 0.7
        ? 'cubic-bezier(0.33, 0.94, 0.38, 1)' // snappy hop, gentle overshoot on landing
        : 'cubic-bezier(0.22, 0.61, 0.36, 1)'; // slower drift

    el.style.setProperty('--hop-duration', `${duration.toFixed(2)}s`);
    el.style.setProperty('--hop-ease', ease);
    applyPosition(target.x, target.y);

    if (!['asleep', 'held', 'happy'].includes(moodRef.current)) {
      setMood(target.longHop ? 'curious' : 'idle');
    }
  }, [applyPosition]);

  const scheduleHop = useCallback(() => {
    const delay = 4_200 + Math.random() * 4_800;
    hopTimeout.current = window.setTimeout(() => {
      if (!document.hidden && !dragInfo.current?.moved && moodRef.current !== 'asleep') {
        hop();
      }
      scheduleHop();
    }, delay);
  }, [hop]);

  const checkSleep = useCallback(() => {
    if (dragInfo.current?.moved) return;
    const idleFor = performance.now() - lastInteraction.current;
    if (moodRef.current === 'asleep') return;
    if (idleFor > ASLEEP_AFTER_MS) {
      setMood('asleep');
    } else if (idleFor > SLEEPY_AFTER_MS && moodRef.current !== 'sleepy') {
      setMood('sleepy');
    }
  }, []);

  const wake = useCallback(() => {
    lastInteraction.current = performance.now();
    if (moodRef.current === 'asleep' || moodRef.current === 'sleepy') {
      setMood('curious');
      if (wakeTimeout.current) window.clearTimeout(wakeTimeout.current);
      wakeTimeout.current = window.setTimeout(() => {
        if (moodRef.current === 'curious') setMood('idle');
      }, WAKE_SETTLE_MS);
    }
  }, []);

  // Cursor-awareness: the face nudges toward a nearby pointer, and a pointer that
  // lingers close enough will wake the pet. Sampling is rAF-throttled and writes
  // straight to the DOM so a fast mouse doesn't cost a React render.
  const sampleLook = useCallback(() => {
    lookRaf.current = null;
    const p = pendingPointer.current;
    const face = faceRef.current;
    if (!p || !face) return;
    const cx = posRef.current.x + PET_SIZE / 2;
    const cy = posRef.current.y + PET_SIZE / 2;
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < LOOK_RADIUS) {
      const reach = Math.min(1, (LOOK_RADIUS - dist) / LOOK_RADIUS) * LOOK_MAX_OFFSET;
      const angle = Math.atan2(dy, dx);
      face.style.setProperty('translate', `${(Math.cos(angle) * reach).toFixed(2)}px ${(Math.sin(angle) * reach).toFixed(2)}px`);
      if (dist < LOOK_WAKE_RADIUS) wake();
    } else {
      face.style.setProperty('translate', '0px 0px');
    }
  }, [wake]);

  const runGreet = useCallback(() => {
    lastInteraction.current = performance.now();
    let index = Math.floor(Math.random() * PET_FACTS.length);
    if (PET_FACTS.length > 1 && index === lastFactIndex.current) {
      index = (index + 1) % PET_FACTS.length;
    }
    lastFactIndex.current = index;
    const nextAction = PET_ACTIONS[Math.floor(Math.random() * PET_ACTIONS.length)];

    setBubbleSide(posRef.current.x > window.innerWidth / 2 ? 'left' : 'right');
    setMood('happy');
    setAction(nextAction);
    setFact(PET_FACTS[index]);

    if (factTimeout.current) window.clearTimeout(factTimeout.current);
    factTimeout.current = window.setTimeout(() => {
      setMood((m) => (m === 'happy' ? 'idle' : m));
      setAction(null);
      setFact(null);
    }, FACT_VISIBLE_MS);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: posRef.current.x,
      originY: posRef.current.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const info = dragInfo.current;
    if (!info) return;
    const dx = e.clientX - info.startX;
    const dy = e.clientY - info.startY;

    if (!info.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      info.moved = true;
      lastInteraction.current = performance.now();
      setDragging(true);
      setMood('held');
    }

    const bounds = getBounds();
    applyPosition(clamp(info.originX + dx, bounds.minX, bounds.maxX), clamp(info.originY + dy, bounds.minY, bounds.maxY));
  }, [applyPosition]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const info = dragInfo.current;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (info?.moved) {
      suppressClick.current = true;
      lastInteraction.current = performance.now();
      setDragging(false);
      setLanding(true);
      setMood('happy');
      if (landingTimeout.current) window.clearTimeout(landingTimeout.current);
      landingTimeout.current = window.setTimeout(() => {
        setLanding(false);
        setMood((m) => (m === 'happy' ? 'idle' : m));
      }, LANDING_MS);
    }
    dragInfo.current = null;
  }, []);

  const onClick = useCallback(() => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    trackPetClick();
    runGreet();
  }, [runGreet]);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // storage unavailable (private browsing, etc.) — hide for this visit only
    }
    setHidden(true);
  }, []);

  const summon = useCallback(() => {
    try {
      window.localStorage.removeItem(DISMISS_KEY);
    } catch {
      // ignore
    }
    setHidden(false);
  }, []);

  // Both read client-only state that decides *what* renders (reduced motion skips
  // autonomous movement; a dismissal flag swaps the whole branch to the re-summon
  // nub). useLayoutEffect settles them before the browser paints, so a returning
  // visitor who dismissed the pet never sees it flash in for a frame first.
  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useLayoutEffect(() => {
    try {
      setHidden(window.localStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      // storage unavailable — default to visible
    }
  }, []);

  // Placement + autonomous wandering + the sleep clock.
  useEffect(() => {
    if (!SOFTWARE_PET_ENABLED || hidden) return;

    const bounds = getBounds();
    const start = randomPointIn(bounds);
    applyPosition(start.x, start.y);
    lastInteraction.current = performance.now();
    setReady(true);

    if (reducedMotion) return; // stays put, stays interactive, no autonomous movement

    scheduleHop();
    sleepInterval.current = window.setInterval(checkSleep, 5_000);

    const onResize = () => {
      const b = getBounds();
      applyPosition(clamp(posRef.current.x, b.minX, b.maxX), clamp(posRef.current.y, b.minY, b.maxY));
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (hopTimeout.current) window.clearTimeout(hopTimeout.current);
      if (sleepInterval.current) window.clearInterval(sleepInterval.current);
      window.removeEventListener('resize', onResize);
    };
  }, [hidden, reducedMotion, applyPosition, scheduleHop, checkSleep]);

  // Cursor-proximity look tracking.
  useEffect(() => {
    if (!SOFTWARE_PET_ENABLED || hidden || reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pendingPointer.current = { x: e.clientX, y: e.clientY };
      if (lookRaf.current == null) {
        lookRaf.current = requestAnimationFrame(sampleLook);
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (lookRaf.current != null) cancelAnimationFrame(lookRaf.current);
    };
  }, [hidden, reducedMotion, sampleLook]);

  // Final cleanup for the timers not already covered above.
  useEffect(
    () => () => {
      if (factTimeout.current) window.clearTimeout(factTimeout.current);
      if (landingTimeout.current) window.clearTimeout(landingTimeout.current);
      if (wakeTimeout.current) window.clearTimeout(wakeTimeout.current);
    },
    [],
  );

  if (!SOFTWARE_PET_ENABLED) return null;

  if (hidden) {
    return (
      <button type="button" className="software-pet-summon" onClick={summon} aria-label="Show the portfolio pet">
        <span className="software-pet-summon__dot" aria-hidden="true" />
      </button>
    );
  }

  const label =
    mood === 'asleep'
      ? 'Portfolio pet, asleep — click to wake it up'
      : mood === 'sleepy'
        ? 'Portfolio pet, getting sleepy — click to say hi'
        : 'Portfolio pet — click for a fact, or drag it around';

  const className = [
    'software-pet',
    `software-pet--${mood}`,
    action ? `software-pet--${action}` : '',
    dragging ? 'software-pet--dragging' : '',
    landing ? 'software-pet--landing' : '',
    ready ? 'software-pet--ready' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={className}>
      <span className="software-pet__hint" aria-hidden="true">click me</span>
      {fact && (
        <div className={`software-pet__fact software-pet__fact--${bubbleSide}`} role="status">
          {fact}
        </div>
      )}

      <button type="button" className="software-pet__dismiss" onClick={dismiss} aria-label="Hide the portfolio pet">
        ×
      </button>

      <button
        type="button"
        className="software-pet__button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onClick}
        aria-label={label}
      >
        <span className="software-pet__body" aria-hidden="true">
          <span className="software-pet__face" ref={faceRef}>
            <span className="software-pet__eye software-pet__eye--left" />
            <span className="software-pet__eye software-pet__eye--right" />
            <span className="software-pet__mouth" />
          </span>
          <span className="software-pet__tentacle software-pet__tentacle--1" />
          <span className="software-pet__tentacle software-pet__tentacle--2" />
          <span className="software-pet__tentacle software-pet__tentacle--3" />
          <span className="software-pet__tentacle software-pet__tentacle--4" />
          {action === 'bounce' && <span className="software-pet__ball" aria-hidden="true" />}
        </span>
        <span className="software-pet__zzz" aria-hidden="true">
          <span>z</span>
          <span>z</span>
          <span>z</span>
        </span>
      </button>
    </div>
  );
}