import ExternalLink from '@/components/ExternalLink';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import { breadcrumbJsonLd, researchPageJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { asset, papers, profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/research',
  'Research',
  `Academic projects, literature surveys and technical reviews by ${profile.name}, exploring machine learning and distributed systems at LIU Brooklyn.`,
);

export default function ResearchPage() {
  return (
    <main id="main" className="page-shell container">
      <JsonLd data={breadcrumbJsonLd(['Research', '/research'])} />
      <JsonLd data={researchPageJsonLd()} />

      <PageHeader
        eyebrow="Research"
        title="A closer look."
        intro="Academic work exploring how intelligent systems learn, recommend and scale. Written during my master's at LIU Brooklyn."
      />

      <section className="section-block" aria-label="Papers and technical reviews">
        <div className="paper-list">
          {papers.map((paper) => (
            <details className="paper-entry reveal" id={`paper-${paper.slug}`} key={paper.slug}>
              <summary>
                <span className="meta">
                  {paper.year} · {paper.kind === 'ieee' ? 'Course project' : paper.badge}
                </span>
                <h2>{paper.shortTitle}</h2>
                <span className="disclosure-mark" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="paper-body">
                <h3 className="paper-full-title">{paper.title}</h3>
                <p className="meta">
                  {paper.venue}
                  {paper.coAuthored ? ' · Co-authored' : ''}
                </p>
                <p className="body-copy">{paper.abstract}</p>
                {paper.note && <p className="body-copy">{paper.note}</p>}
                <p className="meta">{paper.tags.join(' / ')}</p>
                <ExternalLink className="text-link" href={asset(paper.file)}>
                  Read the paper <span className="meta">PDF</span> <span aria-hidden="true">↗</span>
                </ExternalLink>
              </div>
            </details>
          ))}
        </div>
        <p className="body-copy reveal">
          These are course projects, surveys and reviews. Papers in IEEE format follow its document style; they are not
          presented as IEEE publications.
        </p>
      </section>
    </main>
  );
}
