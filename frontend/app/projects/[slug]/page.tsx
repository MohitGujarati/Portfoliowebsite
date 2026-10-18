import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ViewTransition } from 'react';
import ExternalLink from '@/components/ExternalLink';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import Rich from '@/components/Rich';
import { breadcrumbJsonLd, projectJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { absolute, profile, projects } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

const findProject = async ({ params }: Props) => {
  const { slug } = await params;
  return projects.find((item) => item.slug === slug);
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const project = await findProject(props);
  if (!project) return { title: 'Project not found', robots: { index: false } };
  return pageMetadata(`/projects/${project.slug}`, project.name, project.pitch);
}

export default async function ProjectPage(props: Props) {
  const project = await findProject(props);
  if (!project) notFound();

  // Every other project, starting with the next one and wrapping around.
  const position = projects.indexOf(project);
  const otherProjects = projects.map((_, step) => projects[(position + step) % projects.length]).slice(1);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          ...projectJsonLd(project, { '@type': 'Person', name: profile.name, url: absolute('/') }),
        }}
      />
      <JsonLd data={breadcrumbJsonLd(['Work', '/work'], [project.name, `/projects/${project.slug}`])} />
      <main id="main" className="page-shell container">
        <Link className="text-link" href="/work">
          <span aria-hidden="true">←</span> All work
        </Link>

        <PageHeader
          meta
          eyebrow={
            <>
              {project.kind} · {project.dates}
            </>
          }
          title={<>{project.name}.</>}
          transitionName={`project-${project.slug}`}
          intro={project.pitch}
        />

        <dl className="project-facts reveal">
          <div>
            <dt>Platform</dt>
            <dd>{project.platform}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>{project.dates}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.tags.join(', ')}</dd>
          </div>
        </dl>

        <article className="case-content">
          <section className="editorial-grid section-block reveal">
            <h2 className="section-title">What I built.</h2>
            <div className="body-copy">
              {project.points.map((point) => (
                <p key={point}>
                  <Rich text={point} />
                </p>
              ))}
            </div>
          </section>

          <section className="editorial-grid section-block reveal">
            <h2 className="section-title">Technical decisions.</h2>
            <div className="body-copy">
              {project.decisions.map((decision) => (
                <p key={decision}>{decision}</p>
              ))}
              <ExternalLink className="text-link" href={project.repository}>
                View source <span aria-hidden="true">↗</span>
              </ExternalLink>
            </div>
          </section>
        </article>

        <nav aria-label="More projects">
          {otherProjects.map((other, index) => (
            <Link className="next-project reveal" href={`/projects/${other.slug}`} key={other.slug}>
              <div>
                <p className="meta">{index === 0 ? 'Next project' : 'Also see'}</p>
                <ViewTransition name={`project-${other.slug}`} share="morph" default="none">
                  <h2>{other.name}</h2>
                </ViewTransition>
              </div>
              <span className="work-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </>
  );
}
