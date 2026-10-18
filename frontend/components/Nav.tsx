'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import ExternalLink from '@/components/ExternalLink';
import { openPalette, usePaletteShortcut } from '@/lib/palette';
import { pages, profile } from '@/lib/site';
import { getTheme, setTheme } from '@/lib/theme';
import { motion, useReducedMotion } from 'motion/react';

export default function Nav() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const shortcut = usePaletteShortcut();
  const selected = pages
    .slice(1, 5)
    .find(([href]) => pathname.startsWith(href) || (href === '/work' && pathname.startsWith('/projects')))?.[0];
  const active = hovered ?? selected;
  const closing = useRef<Animation | null>(null);
  const closeMenu = () => {
    const element = dialog.current;
    if (!element?.open || closing.current) return;
    if (reduced) {
      element.close();
      setOpen(false);
      return;
    }
    const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 160,
      easing: 'ease-out',
      fill: 'forwards',
    });
    closing.current = animation;
    void animation.finished
      .then(() => {
        element.close();
        animation.cancel();
        closing.current = null;
        setOpen(false);
      })
      .catch(() => {
        closing.current = null;
      });
  };

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(
    () => () => {
      closing.current?.cancel();
    },
    [],
  );

  return (
    <>
      {/* Named so page transitions leave the header in place while content changes beneath it. */}
      <header className="site-header" style={{ viewTransitionName: 'site-header' }}>
        <div className="header-inner container">
          <Link href="/" className="wordmark" aria-label={`${profile.name}, home`}>
            mohit<span className="wordmark-dot">.</span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation" onPointerLeave={() => setHovered(null)}>
            {pages.slice(1, 5).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onPointerEnter={() => setHovered(href)}
                onFocus={() => setHovered(href)}
                onBlur={() => setHovered(null)}
                onClick={() => setHovered(null)}
                aria-current={selected === href ? 'page' : undefined}
              >
                {label}
                {active === href && (
                  <motion.span
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="header-contact" href="/contact">
              Let&apos;s talk <span aria-hidden="true">↗</span>
            </Link>
            <button className="palette-trigger" type="button" aria-haspopup="dialog" onClick={openPalette}>
              Search <kbd>{shortcut}</kbd>
            </button>
            <button
              className="theme-toggle"
              onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')}
              type="button"
              aria-label="Switch color theme"
            >
              <span aria-hidden="true" />
            </button>
            <button
              ref={trigger}
              className="menu-toggle"
              type="button"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => {
                dialog.current?.showModal();
                setOpen(true);
              }}
            >
              <span>Menu</span>
              <span className="menu-bars" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="site-menu"
        className="menu-dialog"
        data-lenis-prevent
        aria-label="Site navigation"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      >
        <div className="menu-top container">
          <Link href="/" className="wordmark" onClick={closeMenu}>
            mohit.
          </Link>
          <button autoFocus className="menu-close" type="button" onClick={closeMenu}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="menu-links container" aria-label="All pages">
          {pages.map(([href, label], index) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              style={{ '--order': index } as CSSProperties}
              aria-current={
                pathname.replace(/\/$/, '') === href.replace(/\/$/, '') ||
                (href === '/work' && pathname.startsWith('/projects'))
                  ? 'page'
                  : undefined
              }
            >
              {label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <div className="menu-bottom container">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <ExternalLink href={profile.github}>GitHub ↗</ExternalLink>
        </div>
      </dialog>
    </>
  );
}
