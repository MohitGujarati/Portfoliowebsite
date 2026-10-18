import Link from 'next/link';
import { ViewTransition } from 'react';
import HeroName from '@/components/HeroName';
import JsonLd from '@/components/JsonLd';
import MagneticLink from '@/components/MagneticLink';
import WorkList from '@/components/WorkList';
import { buildJsonLd } from '@/lib/jsonld';
import { capabilities, experience, profile } from '@/lib/site';

export default function Home() {
  return (
    <>
      <JsonLd data={buildJsonLd()} />
      <main id="main">
        <section className="home-hero container" aria-labelledby="hero-name">
          <div className="hero-meta">
            <p>Full-stack software engineer</p>
            <p>Phoenix, Arizona</p>
          </div>
          <HeroName />
          <div className="hero-bottom">
            <p>
              Mobile. Web. <span>AI.</span>
            </p>
            <MagneticLink href="#projects">Explore selected work</MagneticLink>
          </div>
        </section>

        <section className="home-about container editorial-grid reveal" id="about" aria-labelledby="about-title">
          <h2 className="section-title" id="about-title">
            About.
          </h2>
          <div>
            <p className="body-copy">{profile.summary}</p>
            <Link className="text-link" href="/about">
              More about me <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="home-career container section-block" id="experience" aria-labelledby="career-title">
          <div className="career-heading reveal">
            <h2 className="section-title" id="career-title">
              Experience.
            </h2>
            <p className="career-note">From Android applications to full-stack products and AI.</p>
            <Link href="/experience" className="text-link">
              The full story <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="career-preview">
            {experience.map((job) => (
              <Link key={job.hash} href={`/experience#role-${job.hash}`} className="career-preview-row reveal">
                <span className="meta">{job.dates}</span>
                <ViewTransition name={`job-${job.hash}`} share="morph" default="none">
                  <h3>{job.company}</h3>
                </ViewTransition>
                <p>{job.role}</p>
                <span className="career-row-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-skills container editorial-grid reveal" id="skills" aria-labelledby="skills-title">
          <h2 className="section-title" id="skills-title">
            Skills.
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

        <section className="home-work container section-block" id="projects" aria-labelledby="work-title">
          <div className="section-title-row reveal">
            <h2 className="section-title" id="work-title">
              Selected work
            </h2>
            <Link href="/work" className="text-link">
              Project index <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <WorkList heading="h3" description="tagline" />
        </section>
      </main>
    </>
  );
}
