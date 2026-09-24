import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DetailPage from '@/components/DetailPage';
import Rich from '@/components/Rich';
import { breadcrumbJsonLd, serializeJsonLd } from '@/lib/jsonld';
import { absolute, plain, profile, projects } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: 'Project not found', robots: { index: false } };
  return {
    title: project.name,
    description: project.pitch,
    alternates: { canonical: absolute(`/projects/${project.slug}`) },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': absolute(`/projects/${project.slug}`),
    name: project.name,
    genre: project.kind,
    description: `${project.pitch} ${project.points.map(plain).join(' ')}`,
    keywords: project.tags.join(', '),
    creator: { '@type': 'Person', name: profile.name, url: absolute('/') },
    url: absolute(`/projects/${project.slug}`),
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: absolute('/') },
    { name: 'Projects', url: absolute('/#projects') },
    { name: project.name, url: absolute(`/projects/${project.slug}`) },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <DetailPage eyebrow={`cat ~/projects/${project.slug}.md`} title={project.name} description={project.pitch}>
        <article className="project project--detail">
          <div className="project__top">
            <p className="project__kind">{project.kind}</p>
            <p className="project__date">{project.dates}</p>
          </div>
          <h2>What I built</h2>
          <ul className="project__points">{project.points.map((point) => <li key={point}><Rich text={point} /></li>)}</ul>
          <h2 className="detail-subheading">Technologies</h2>
          <ul className="tags">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          <nav className="project__related" aria-label="Related portfolio pages">
            <span>Continue:</span>
            <Link href="/experience">Experience</Link>
            <Link href="/research">Research</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
        </article>
      </DetailPage>
    </>
  );
}