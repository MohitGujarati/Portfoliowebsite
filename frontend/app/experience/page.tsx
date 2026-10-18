import { ViewTransition } from 'react';
import ExternalLink from '@/components/ExternalLink';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import Rich from '@/components/Rich';
import { breadcrumbJsonLd, experiencePageJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { asset, experience, profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/experience',
  'Experience',
  'My work across Android, web platforms and AI products, from Tops Technology to Gabriel AI.',
);

export default function ExperiencePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(['Experience', '/experience'])} />
      <JsonLd data={experiencePageJsonLd()} />
      <main id="main" className="page-shell container">
        <PageHeader
          eyebrow="Experience"
          title={
            <>
              A body of work.
              <br />
              <span className="muted">A work in progress.</span>
            </>
          }
          intro="From Android foundations to full-stack products. Each role has widened the way I think about building software."
        >
          <ExternalLink href={asset(profile.resume)} className="text-link">
            Read my résumé <span aria-hidden="true">↗</span>
          </ExternalLink>
        </PageHeader>
        <div className="career-timeline" id="timeline">
          <div className="timeline-rail" aria-hidden="true">
            <span />
          </div>
          <ol>
            {experience.map((job) => (
              <li className="timeline-job reveal" key={job.hash} id={`role-${job.hash}`}>
                <div className="timeline-date">
                  <span className="timeline-node" aria-hidden="true" />
                  <p>{job.dates}</p>
                  {job.head ? (
                    <span className="current-role">Current role</span>
                  ) : (
                    <span className="meta">{job.stage}</span>
                  )}
                </div>
                <div className="timeline-content">
                  <p className="job-role">{job.role}</p>
                  <ViewTransition name={`job-${job.hash}`} share="morph" default="none">
                    <h2>{job.company}</h2>
                  </ViewTransition>
                  <ul className="job-points">
                    {job.points.map((point) => (
                      <li key={point}>
                        <Rich text={point} />
                      </li>
                    ))}
                  </ul>
                  <p className="job-stack">{job.tags.join(' / ')}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </>
  );
}
