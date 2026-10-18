import { serializeJsonLd } from '@/lib/jsonld';

/** Inline schema.org structured data for search engines and AI crawlers. */
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
