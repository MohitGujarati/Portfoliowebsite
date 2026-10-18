import Link from 'next/link';
import { ViewTransition } from 'react';
import { projects } from '@/lib/site';

type Props = {
  /** Heading level for project names, so the list nests under the page outline. */
  heading: 'h2' | 'h3';
  description: 'tagline' | 'summary';
};

/** Numbered project rows linking to each case study. */
export default function WorkList({ heading: Heading, description }: Props) {
  return (
    <div className="work-list">
      {projects.map((project, index) => (
        <Link className="work-row reveal" key={project.slug} href={`/projects/${project.slug}`}>
          <span className="work-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="work-info">
            <p className="meta">{project.kind}</p>
            <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
              <Heading>{project.name}</Heading>
            </ViewTransition>
            <p className="work-description">{project[description]}</p>
          </div>
          <span className="work-action">
            <span className="work-action-label">View project</span>
            <span className="work-arrow" aria-hidden="true">
              ↗
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
