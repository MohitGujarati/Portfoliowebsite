import Link from 'next/link';
import ExternalLink from '@/components/ExternalLink';
import PageHeader from '@/components/PageHeader';
import { pageMetadata } from '@/lib/metadata';
import { profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/blog',
  'Notes',
  `A space for engineering notes by ${profile.name}. Explore his academic research and code.`,
);

export default function BlogPage() {
  return (
    <main id="main" className="page-shell container">
      <PageHeader
        reveal
        eyebrow="Writing"
        title="Notes."
        intro="A place for ideas from building software, studying systems and working through the details."
      />

      <section className="section-block editorial-grid reveal" aria-labelledby="notes-title">
        <h2 id="notes-title" className="section-title">
          Nothing published yet.
        </h2>
        <div>
          <p className="body-copy">
            There are no articles here yet. In the meantime, my research collection covers machine learning,
            recommendation systems and software architecture. My code lives on GitHub.
          </p>
          <ul className="text-list">
            <li>
              <Link className="text-link" href="/research">
                Read my research <span aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <ExternalLink className="text-link" href={profile.github}>
                Explore GitHub <span aria-hidden="true">↗</span>
              </ExternalLink>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
