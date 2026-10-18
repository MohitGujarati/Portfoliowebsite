'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import PixelField from '@/components/PixelField';
import { notifySlack, slackText } from '@/lib/notify';
import { onPaletteOpen, usePaletteShortcut } from '@/lib/palette';
import { navigateTo } from '@/lib/scroll';
import { asset, experience, pages, papers, profile, projects } from '@/lib/site';
import { getTheme, setTheme } from '@/lib/theme';

type Command = { id: string; group: string; title: string; hint: string; keywords?: string; run: () => void };

const openTab = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

/** Research entries are collapsed; open the chosen one once it is on the page. */
function revealPaper(slug: string) {
  const started = performance.now();
  const tick = () => {
    const entry = document.getElementById(`paper-${slug}`);
    if (entry instanceof HTMLDetailsElement) entry.open = true;
    else if (performance.now() - started < 2000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Rank by title prefix, then title, then any other text; an empty query keeps the natural order. */
function search(commands: Command[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return commands;
  return commands
    .map((command) => {
      const title = command.title.toLowerCase();
      const rest = `${command.hint} ${command.keywords ?? ''} ${command.group}`.toLowerCase();
      return { command, score: title.startsWith(q) ? 3 : title.includes(q) ? 2 : rest.includes(q) ? 1 : 0 };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.command);
}

/** ⌘K / Ctrl+K / "/" command palette for jumping anywhere on the site. */
export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const shortcut = usePaletteShortcut();
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState('');

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => navigateTo(href, router.push);
    return [
      ...[...pages, ['/blog', 'Notes'] as const].map(([href, title]) => ({
        id: `page:${href}`,
        group: 'Page',
        title,
        hint: href,
        run: go(href),
      })),
      ...projects.map((project) => ({
        id: `project:${project.slug}`,
        group: 'Project',
        title: project.name,
        hint: project.kind,
        keywords: `${project.tags.join(' ')} ${project.summary}`,
        run: go(`/projects/${project.slug}`),
      })),
      ...experience.map((job) => ({
        id: `job:${job.hash}`,
        group: 'Experience',
        title: job.company,
        hint: `${job.role} · ${job.dates}`,
        keywords: job.tags.join(' '),
        run: go(`/experience#role-${job.hash}`),
      })),
      ...papers.map((paper) => ({
        id: `paper:${paper.slug}`,
        group: 'Research',
        title: paper.shortTitle,
        hint: `${paper.year} · ${paper.badge}`,
        keywords: `${paper.title} ${paper.tags.join(' ')}`,
        run: () => {
          navigateTo(`/research#paper-${paper.slug}`, router.push);
          revealPaper(paper.slug);
        },
      })),
      {
        id: 'copy-email',
        group: 'Action',
        title: 'Copy email',
        hint: profile.email,
        run: () => void navigator.clipboard?.writeText(profile.email).catch(() => {}),
      },
      {
        id: 'email',
        group: 'Action',
        title: 'Write an email',
        hint: profile.email,
        run: () => window.location.assign(`mailto:${profile.email}`),
      },
      {
        id: 'resume',
        group: 'Action',
        title: 'Open résumé',
        hint: 'PDF',
        keywords: 'resume cv',
        run: () => openTab(asset(profile.resume)),
      },
      {
        id: 'theme',
        group: 'Action',
        title: 'Switch theme',
        hint: 'Light / dark',
        keywords: 'mode color',
        run: () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'),
      },
      {
        id: 'github',
        group: 'Link',
        title: 'GitHub',
        hint: profile.github.replace('https://', ''),
        run: () => openTab(profile.github),
      },
      {
        id: 'linkedin',
        group: 'Link',
        title: 'LinkedIn',
        hint: profile.linkedin.replace('https://www.', ''),
        run: () => openTab(profile.linkedin),
      },
    ];
  }, [router]);

  const results = useMemo(() => search(commands, query), [commands, query]);
  const current = results[Math.min(active, results.length - 1)];

  // Keyboard shortcuts open the palette from anywhere, except while typing in a field.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]');
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    const offOpen = onPaletteOpen(() => setOpen(true));
    return () => {
      window.removeEventListener('keydown', onKey);
      offOpen();
    };
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      setQuery('');
      setActive(0);
      setStatus('');
      element.showModal();
    } else if (!open && element.open) element.close();
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, query]);

  function select(command: Command | undefined) {
    if (!command) return;
    notifySlack(
      `🔎 *Command palette* on \`${pathname}\`: "${slackText(command.title)}" (${command.group.toLowerCase()})`,
    );
    if (command.id === 'copy-email') {
      command.run();
      setStatus('Email copied to clipboard');
      window.setTimeout(() => setOpen(false), 700);
      return;
    }
    setOpen(false);
    command.run();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const count = results.length;
    if (!count) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((value) => (Math.min(value, count - 1) + step + count) % count);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setActive(event.key === 'Home' ? 0 : count - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      select(current);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="palette"
      data-lenis-prevent
      aria-label="Search the site"
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      {open && (
        <div className="palette-panel">
          <div className="palette-search">
            <PixelField />
            <span className="palette-prompt" aria-hidden="true">
              ⌕
            </span>
            <input
              autoFocus
              className="palette-input"
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-results"
              aria-activedescendant={current ? `palette-${current.id}` : undefined}
              aria-autocomplete="list"
              placeholder="Search projects, experience, research…"
              spellCheck={false}
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
            <kbd className="palette-esc">esc</kbd>
          </div>

          {results.length ? (
            <ul className="palette-list" id="palette-results" role="listbox" aria-label="Results" ref={list}>
              {results.map((command) => (
                <li
                  key={command.id}
                  id={`palette-${command.id}`}
                  className="palette-option"
                  role="option"
                  aria-selected={command === current}
                  onPointerMove={() => setActive(results.indexOf(command))}
                  onClick={() => select(command)}
                >
                  <span className="palette-title">{command.title}</span>
                  <span className="palette-hint">{command.hint}</span>
                  <span className="palette-group">{command.group}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="palette-empty">No results for “{query.trim()}”.</p>
          )}

          <div className="palette-footer" aria-live="polite">
            {status ? (
              <span className="palette-status">✓ {status}</span>
            ) : (
              <span>
                <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>↵</kbd> to open
              </span>
            )}
            <span>
              <kbd>{shortcut}</kbd> anywhere
            </span>
          </div>
        </div>
      )}
    </dialog>
  );
}
