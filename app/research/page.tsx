import type { Metadata } from 'next';
import DetailPage from '@/components/DetailPage';
import { breadcrumbJsonLd, researchPageJsonLd, serializeJsonLd } from '@/lib/jsonld';
import { absolute, asset, papers, profile } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Research',
  description: `Research papers and technical reviews by ${profile.name}, covering deep learning, NLP, recommender systems and distributed systems.`,
  alternates: { canonical: absolute('/research') },
};

export default function ResearchPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: absolute('/') },
    { name: 'Research', url: absolute('/research') },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(researchPageJsonLd()) }} />
      <DetailPage eyebrow={'grep -rl "abstract" ~/research'} title="Research and writing" description="Papers from my M.S. in Computer Science at LIU Brooklyn, including IEEE-format research and technical reviews.">
        <ol className="papers detail-papers">
        {papers.map((paper, index) => (
          <li className={`paper${paper.kind === 'ieee' ? ' paper--featured' : ''}`} id={`paper-${paper.slug}`} key={paper.slug}>
            <span className="paper__ref" aria-hidden="true">[{index + 1}]</span>
            <article className="paper__body">
              <p className="paper__meta"><span className={`badge${paper.kind === 'ieee' ? '' : ' badge--muted'}`}>{paper.badge}</span> {paper.venue} · {paper.year}{paper.coAuthored ? ' · co-authored' : ''}</p>
              <h2>{paper.title}</h2>
              {paper.result && <p className="paper__result"><strong>{paper.result.value}</strong>{paper.result.label}</p>}
              <p className="detail-abstract">{paper.abstract}</p>
              <ul className="tags">{paper.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </article>
            <a className="paper__link" href={asset(paper.file)} target="_blank" rel="noopener">PDF ↗</a>
          </li>
        ))}
        </ol>
      </DetailPage>
    </>
  );
}