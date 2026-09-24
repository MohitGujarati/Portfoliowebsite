import type { ReactNode } from 'react';
import Link from 'next/link';
import DetailLinks from '@/components/DetailLinks';
import { profile } from '@/lib/site';

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function DetailPage({ eyebrow, title, description, children }: Props) {
  return (
    <>
      <div className="bg-grid" aria-hidden="true" />
      <header className="detail-nav container">
        <Link className="detail-nav__brand" href="/" aria-label={`${profile.name}, back to home`}>
          <span className="logo-mark" aria-hidden="true">MG</span>
          <span>{profile.name}</span>
        </Link>
        <nav className="detail-nav__links" aria-label="Page navigation">
          <Link href="/about">About</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/#projects">Projects</Link>
          <Link href="/research">Research</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </header>

      <main className="detail-page container">
        <header className="detail-hero">
          <p className="eyebrow"><span className="eyebrow__cmd">{eyebrow}</span></p>
          <h1>{title}</h1>
          <p className="detail-hero__description">{description}</p>
        </header>
        {children}
        <DetailLinks />
      </main>

      <footer className="footer container detail-footer">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="mono"><Link href="/">Back to portfolio</Link> · <Link href="/llms-full.txt">AI profile</Link></p>
      </footer>
    </>
  );
}