'use client';

import { useEffect } from 'react';
import { describeClick, notifySlack } from '@/lib/notify';

/** Repeated clicks on the same control within this window send one message. */
const REPEAT_MS = 5000;

/** Sends a Slack message for each click on a link, button or expandable section. */
export default function ClickNotifier() {
  useEffect(() => {
    let last = { message: '', time: 0 };
    const onClick = (event: MouseEvent) => {
      const element = (event.target as Element | null)?.closest('a, button, summary');
      if (!element) return;
      const message = describeClick(element, window.location.pathname);
      const now = Date.now();
      if (message === last.message && now - last.time < REPEAT_MS) return;
      last = { message, time: now };
      notifySlack(message);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
