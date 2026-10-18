import { ViewTransition, type ReactNode } from 'react';
import PixelField from '@/components/PixelField';

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** Use the smaller meta style for the eyebrow, as on case studies. */
  meta?: boolean;
  reveal?: boolean;
  /** Morph the title from the element with the same transition name on the previous page. */
  transitionName?: string;
  children?: ReactNode;
};

/** The heading block shared by every secondary page, over the same pixel field as the home hero. */
export default function PageHeader({ eyebrow, title, intro, meta, reveal, transitionName, children }: Props) {
  const heading = <h1 className="display-title">{title}</h1>;
  return (
    <header className={reveal ? 'page-heading reveal' : 'page-heading'}>
      <PixelField />
      <p className={meta ? 'meta' : 'eyebrow'}>{eyebrow}</p>
      {transitionName ? (
        <ViewTransition name={transitionName} share="morph" default="none">
          {heading}
        </ViewTransition>
      ) : (
        heading
      )}
      {intro && <p className="page-intro">{intro}</p>}
      {children}
    </header>
  );
}
