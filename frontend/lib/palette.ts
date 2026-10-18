import { useEffect, useState } from 'react';

const OPEN_EVENT = 'palette:open';

/** Open the command palette from anywhere, such as the header's Search button. */
export const openPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

export function onPaletteOpen(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

/** "⌘K" on Apple devices and "Ctrl K" elsewhere, resolved after hydration. */
export function usePaletteShortcut() {
  const [label, setLabel] = useState('⌘K');
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.userAgent)) setLabel('Ctrl K');
  }, []);
  return label;
}
