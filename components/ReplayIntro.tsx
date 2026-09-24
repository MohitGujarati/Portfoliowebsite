'use client';

import { replayIntro } from '@/lib/intro-state';

export default function ReplayIntro() {
  return (
    <button className="linkish" type="button" onClick={replayIntro}>↻ replay intro</button>
  );
}
