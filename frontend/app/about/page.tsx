import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { awards, capabilities, education, profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/about',
  'About',
  `Meet ${profile.name}, a full-stack software engineer in Phoenix building mobile apps, web platforms and AI products.`,
);

export default function AboutPage() {
  return (
    <main id="main" className="page-shell container">
      <JsonLd data={breadcrumbJsonLd(['About', '/about'])} />
      <PageHeader
        eyebrow="About"
        title="Behind the work."
        intro={<>I&apos;m Mohit Gujarati, a full-stack engineer based in Phoenix and currently at {profile.company}.</>}
      />

      <section className="section-block editorial-grid reveal" aria-labelledby="background-title">
        <h2 id="background-title" className="section-title">
          From Android onward.
        </h2>
        <div>
          <p className="body-copy">
            I started in Android, working with Kotlin, offline data and battery-efficient services. It taught me to
            think beyond the screen: how software handles a slow connection, a busy device, or a long day of use.
          </p>
          <p className="body-copy">
            Today, I bring that perspective to websites, dashboards, back-end APIs and AI voice workflows. I work from
            the interface through to the systems that support it.
          </p>
          <Link className="text-link" href="/experience">
            Explore my experience <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section id="skills" className="section-block editorial-grid reveal" aria-labelledby="capabilities-title">
        <h2 id="capabilities-title" className="section-title">
          What I work with.
        </h2>
        <ul className="text-list">
          {capabilities.map(({ title, body }) => (
            <li key={title}>
              <h3>{title}</h3>
              <p className="body-copy">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="education" className="section-block editorial-grid reveal" aria-labelledby="education-title">
        <h2 id="education-title" className="section-title">
          Education &amp; recognition.
        </h2>
        <div>
          <ul className="text-list">
            {education.map((item) => (
              <li key={item.degree}>
                <p className="meta">{item.dates}</p>
                <h3>{item.degree}</h3>
                <p className="body-copy">
                  {item.school}
                  <br />
                  {item.place}
                </p>
                {item.note && <p className="meta">{item.note}</p>}
              </li>
            ))}
            <li>
              <h3>Recognition &amp; community</h3>
              <ul className="text-list">
                {awards.map((award) => (
                  <li key={award}>{award}</li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
