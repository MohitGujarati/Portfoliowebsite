import type { Metadata } from 'next';
import DetailPage from '@/components/DetailPage';
import { breadcrumbJsonLd, contactPageJsonLd, serializeJsonLd } from '@/lib/jsonld';
import { absolute, awards, education, profile, skills } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: profile.summary,
  alternates: { canonical: absolute('/about') },
};

export default function AboutPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: absolute('/') },
    { name: 'About', url: absolute('/about') },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(contactPageJsonLd()) }} />
      <DetailPage eyebrow="cat ~/about/profile.md" title={`About ${profile.name}`} description={profile.summary}>
        <div className="detail-columns">
          <section className="detail-block" id="contact" aria-labelledby="contact-title">
          <p className="detail-label">Contact</p>
          <h2 id="contact-title">Let&apos;s build something useful.</h2>
          <ul className="detail-list">
            <li><strong>Email</strong> <a href={`mailto:${profile.email}`}>{profile.email}</a></li>
            <li><strong>LinkedIn</strong> <a href={profile.linkedin}>{profile.linkedin.replace('https://www.', '')}</a></li>
            <li><strong>GitHub</strong> <a href={profile.github}>{profile.github.replace('https://', '')}</a></li>
            <li><strong>Location</strong> {profile.location}</li>
          </ul>
          </section>

          <section className="detail-block" aria-labelledby="skills-title">
          <p className="detail-label">Skills</p>
          <h2 id="skills-title">Tools I use.</h2>
          <div className="detail-skill-groups">
            {skills.map((group) => (
              <div key={group.group}>
                <h3>./{group.group}</h3>
                <ul className="tags">{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
          </section>
        </div>

        <section className="detail-section" aria-labelledby="education-title">
        <p className="detail-label">Education and recognition</p>
        <h2 id="education-title">Background.</h2>
        <div className="edu">
          {education.map((item) => (
            <article className="edu__item" key={item.degree}>
              <p className="edu__date">{item.dates}</p>
              <h3>{item.degree}</h3>
              <p className="edu__school">{item.school}, {item.place}</p>
              {item.note && <p className="edu__badge">{item.note}</p>}
            </article>
          ))}
          <article className="edu__item">
            <p className="edu__date">Awards and certificates</p>
            <ul className="points">{awards.map((award) => <li key={award}>{award}</li>)}</ul>
          </article>
        </div>
        </section>
      </DetailPage>
    </>
  );
}