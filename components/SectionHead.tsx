import type { ReactNode } from 'react';

type Props = { id: string; num: string; cmd: string; title: string; children?: ReactNode };

/** Section header: a typed shell command as the eyebrow, then the h2. */
export default function SectionHead({ id, num, cmd, title, children }: Props) {
  return (
    <header className="section__head reveal">
      <p className="eyebrow" aria-hidden="true">
        <span className="eyebrow__num">{num}</span>
        <span className="eyebrow__cmd" data-type>{cmd}</span>
      </p>
      <h2 id={`${id}-title`} data-scramble>{title}</h2>
      {children}
    </header>
  );
}
