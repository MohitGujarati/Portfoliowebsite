import ExternalLink from '@/components/ExternalLink';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import WorkList from '@/components/WorkList';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/work',
  'Selected work',
  `Mobile, web, and AI projects by ${profile.name}. Explore the implementation behind Shop Circle, Recall AI, and Lummina.`,
);

export default function WorkPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(['Work', '/work'])} />
      <main id="main" className="page-shell container">
        <PageHeader
          eyebrow="Work"
          title="Selected work."
          intro="Three projects across mobile, web, and AI. Each built from the interface to the data beneath it."
        />
        <WorkList heading="h2" description="summary" />
        <div className="section-block reveal">
          <ExternalLink className="text-link" href={profile.github}>
            More on GitHub <span aria-hidden="true">↗</span>
          </ExternalLink>
        </div>
      </main>
    </>
  );
}
