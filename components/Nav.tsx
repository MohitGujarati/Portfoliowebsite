'use client';

import { useEffect, useState } from 'react';
import { asset, profile } from '@/lib/site';
import { getTheme, setTheme } from '@/lib/theme';
import { useActiveSection } from '@/lib/use-active-section';

const LINKS = [
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['research', 'Research'],
  ['skills', 'Skills'],
  ['education', 'Education'],
  ['shell', 'Terminal'],
  ['contact', 'Contact'],
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`} id="top">
      <div className="nav__inner container">
        <a href="#top" className="nav__logo" aria-label={`${profile.name}, back to top`}>
          <span className="logo-mark" aria-hidden="true">MG</span>
          <span className="logo-path" aria-hidden="true">~/mohit</span>
        </a>

        <nav className={`nav__links${open ? ' is-open' : ''}`} id="nav-links" aria-label="Primary">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : undefined} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            className="icon-btn"
            id="theme-toggle"
            type="button"
            aria-label="Toggle color theme"
            onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')}
          >
            <svg className="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            <svg className="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
          </button>
          <a className="btn btn--small" href={asset(profile.resume)} target="_blank" rel="noopener">Resume</a>
          <button
            className="icon-btn nav__menu"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
