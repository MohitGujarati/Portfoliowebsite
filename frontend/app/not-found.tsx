import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This page could not be found. Return to Mohit Gujarati’s portfolio.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="page-shell container">
      <PageHeader eyebrow="404" title="A wrong turn." intro="This page has moved, or it never existed.">
        <Link className="text-link" href="/">
          Back to the portfolio <span aria-hidden="true">→</span>
        </Link>
      </PageHeader>
    </main>
  );
}
