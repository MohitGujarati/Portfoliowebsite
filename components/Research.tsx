'use client';

import { useState } from 'react';
import { asset, type Paper } from '@/lib/site';

type Filter = 'all' | Paper['kind'];

export default function Research({ papers }: { papers: Paper[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  // Once a filter is used, show items directly instead of waiting for the scroll reveal.
  const [touched, setTouched] = useState(false);

  const counts = { all: papers.length, ieee: papers.filter((p) => p.kind === 'ieee').length, review: papers.filter((p) => p.kind === 'review').length };
  const labels: Record<Filter, string> = { all: 'all', ieee: 'ieee', review: 'reviews' };

  return (
    <>
      <div className="paper-filters reveal" role="group" aria-label="Filter papers">
        {(Object.keys(labels) as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={filter === f ? 'is-active' : undefined}
            aria-pressed={filter === f}
            onClick={() => { setFilter(f); setTouched(true); }}
          >
            {labels[f]} <span>{counts[f]}</span>
          </button>
        ))}
      </div>

      <ol className="papers">
        {papers.map((p, i) => {
          const hidden = filter !== 'all' && p.kind !== filter;
          return (
            <li
              key={p.slug}
              id={`paper-${p.slug}`}
              className={`paper reveal${p.kind === 'ieee' ? ' paper--featured' : ''}${hidden ? ' is-hidden' : ''}${touched ? ' is-visible' : ''}`}
            >
              <span className="paper__ref" aria-hidden="true">[{i + 1}]</span>
              <article className="paper__body">
                <p className="paper__meta">
                  <span className={`badge${p.kind === 'ieee' ? '' : ' badge--muted'}`}>{p.badge}</span>
                  {p.venue} · {p.year}{p.coAuthored ? ' · co-authored' : ''}
                </p>
                <h3>{p.title}</h3>
                {p.result && (
                  <p className="paper__result"><strong>{p.result.value}</strong>{p.result.label}</p>
                )}
                <details className="paper__abstract">
                  <summary>abstract</summary>
                  <p>{p.abstract}</p>
                </details>
                <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </article>
              <a className="paper__link" href={asset(p.file)} target="_blank" rel="noopener" aria-label={`Read “${p.title}” (PDF)`}>
                PDF ↗
              </a>
            </li>
          );
        })}
      </ol>
    </>
  );
}
