import CopyEmail from '@/components/CopyEmail';
import ExternalLink from '@/components/ExternalLink';
import PageHeader from '@/components/PageHeader';
import { pageMetadata } from '@/lib/metadata';
import { asset, profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/contact',
  'Contact',
  'Get in touch with Mohit Gujarati about engineering roles, products, and collaborations.',
);

export default function ContactPage() {
  return (
    <main id="main" className="page-shell contact-page container">
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            It starts with
            <br />
            <span className="muted">a conversation.</span>
          </>
        }
        intro="A product to build, a role to discuss, or an interesting problem. I'd love to hear about it."
      />
      <section className="contact-main reveal" aria-label="Email">
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
          <span aria-hidden="true">↗</span>
        </a>
        <CopyEmail email={profile.email} />
      </section>
      <div className="contact-details section-block reveal">
        <div>
          <h2>Elsewhere</h2>
          <ExternalLink className="text-link" href={profile.github}>
            GitHub <span aria-hidden="true">↗</span>
          </ExternalLink>
          <ExternalLink className="text-link" href={profile.linkedin}>
            LinkedIn <span aria-hidden="true">↗</span>
          </ExternalLink>
        </div>
        <div>
          <h2>Background</h2>
          <ExternalLink className="text-link" href={asset(profile.resume)}>
            Résumé (PDF) <span aria-hidden="true">↗</span>
          </ExternalLink>
          <p className="meta">{profile.location}</p>
        </div>
      </div>
    </main>
  );
}
