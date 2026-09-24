// Tiny shared flag so page effects can wait for the intro to finish.

type Listener = (completed: boolean) => void;

let done = false;
let completed = false;
const listeners = new Set<Listener>();

/** Mark the intro as finished. `watched` is true when the visitor didn't skip it. */
export function markIntroDone(watched: boolean) {
  if (done) return;
  done = true;
  completed = watched;
  listeners.forEach((l) => l(watched));
  listeners.clear();
}

/** Run `cb` once the intro is done (immediately if it already is). Returns an unsubscribe. */
export function onIntroDone(cb: Listener) {
  if (done) {
    cb(completed);
    return () => {};
  }
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function replayIntro() {
  try { sessionStorage.removeItem('booted'); } catch { /* storage blocked */ }
  window.scrollTo(0, 0);
  window.location.reload();
}
