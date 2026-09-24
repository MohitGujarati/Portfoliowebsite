import type { Metadata } from 'next';
import DetailPage from '@/components/DetailPage';
import Rich from '@/components/Rich';
import { breadcrumbJsonLd, experiencePageJsonLd, serializeJsonLd } from '@/lib/jsonld';
import { absolute, experience, profile } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Experience',
  description: `Professional experience of ${profile.name}: ${experience.map((job) => `${job.role} at ${job.company}`).join(', ')}.`,
  alternates: { canonical: absolute('/experience') },
};

export default function ExperiencePage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: absolute('/') },
    { name: 'Experience', url: absolute('/experience') },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(experiencePageJsonLd()) }} />
      <DetailPage eyebrow="git log --graph experience" title="Where I&apos;ve worked" description="A record of building mobile, web and AI products across product engineering, data layers and integrations.">
        <div className="timeline detail-timeline">
        <div className="timeline__track" aria-hidden="true" />
        <ol className="commits">
          {experience.map((job) => (
            <li className="commit" id={`role-${job.hash}`} key={job.hash}>
              <span className="commit__dot" aria-hidden="true" />
              <div className="commit__meta">
                <p className="commit__hash">commit {job.hash}</p>
                <p className={`commit__ref${job.head ? ' ref--head' : ''}`}>{job.ref}</p>
                <p className="commit__date">{job.dates}</p>
              </div>
              <div className="commit__body">
                <h2>{job.role} <span className="at">@ {job.company}</span></h2>
                <ul className="points">{job.points.map((point) => <li key={point}><Rich text={point} /></li>)}</ul>
                <ul className="tags">{job.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </div>
            </li>
          ))}
        </ol>
        </div>
      </DetailPage>
    </>
  );
}