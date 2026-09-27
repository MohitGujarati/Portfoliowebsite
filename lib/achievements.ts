// Hidden achievements, saved in this browser so there's a reason to come back.
// A tiny external store so React components (via useSyncExternalStore) and plain
// modules like the terminal can share it.

export type Achievement = { id: string; icon: string; name: string; hint: string };

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'hello', icon: '👋', name: 'hello, world', hint: 'Visit the site.' },
  { id: 'polyglot', icon: '🌍', name: 'polyglot', hint: 'Watch the intro say hello in every language without skipping.' },
  { id: 'return', icon: '🔁', name: 'while (true) visit()', hint: 'Come back on a different day.' },
  { id: 'bfs', icon: '🕸️', name: 'graph theorist', hint: 'Click the graph behind the hero to run a BFS.' },
  { id: 'bookworm', icon: '📄', name: 'peer reviewer', hint: 'Open the abstract of a research paper.' },
  { id: 'sudo', icon: '🔑', name: 'root access', hint: 'Find the right sudo command in the terminal.' },
  { id: 'matrix', icon: '💊', name: 'red pill', hint: 'Follow the white rabbit in the terminal.' },
  { id: 'konami', icon: '🎮', name: '↑↑↓↓←→←→BA', hint: 'An old cheat code still works here.' },
];

const KEY = 'achievements';
const EMPTY: string[] = [];
let snapshot: string[] | null = null;
const subscribers = new Set<() => void>();

function load(): string[] {
  if (snapshot) return snapshot;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
    snapshot = Array.isArray(saved) ? saved.filter((id) => ACHIEVEMENTS.some((a) => a.id === id)) : [];
  } catch {
    snapshot = [];
  }
  return snapshot!;
}

export const achievementsStore = {
  subscribe(cb: () => void) {
    subscribers.add(cb);
    return () => { subscribers.delete(cb); };
  },
  getSnapshot: () => load(),
  getServerSnapshot: () => EMPTY,
  has: (id: string) => load().includes(id),
  /** Returns the achievement if this call unlocked it, otherwise null. */
  unlock(id: string): Achievement | null {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a || load().includes(id)) return null;
    snapshot = [...load(), id];
    try { localStorage.setItem(KEY, JSON.stringify(snapshot)); } catch { /* storage blocked */ }
    subscribers.forEach((cb) => cb());
    return a;
  },
};
