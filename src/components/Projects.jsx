import Reveal from './Reveal.jsx'
import useTilt from './useTilt.js'
import { projects, profile } from '../data.js'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

function ProjectCard({ p, featured = false }) {
  const tilt = useTilt(featured ? 4 : 6)

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className={`project-card ${featured ? 'project-card--featured' : ''} accent-${p.accent}`}
    >
      <div className="project-card__top">
        <span className="project-card__period mono">{p.period}</span>
        <a
          className="project-card__arrow"
          href={p.link}
          target="_blank"
          rel="noreferrer"
          aria-label={`${p.name} on GitHub`}
        >
          <ArrowIcon />
        </a>
      </div>
      <h3>{p.name}</h3>
      <p className="project-card__subtitle">{p.subtitle}</p>
      <p className="project-card__desc">{p.description}</p>
      <div className="chip-row">
        {p.stack &&
          p.stack.map((s) => (
            <span className="chip chip--ghost" key={s}>
              {s}
            </span>
          ))}
      </div>
      <div className="project-card__links mono">
        <a href={p.link} target="_blank" rel="noreferrer" className="link">
          Code →
        </a>
        {p.demo && (
          <a href={p.demo} target="_blank" rel="noreferrer" className="link link--demo">
            Live demo ↗
          </a>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section className="section" id="projects">
      <Reveal>
        <p className="section__kicker mono">04 / projects</p>
        <h2 className="section__title">
          Things I&apos;ve <span className="gradient-text">built</span>.
        </h2>
      </Reveal>

      <div className="projects__featured">
        {featured.map((p, i) => (
          <Reveal key={p.name} delay={i * 90}>
            <ProjectCard p={p} featured />
          </Reveal>
        ))}
      </div>

      <div className="projects__rest">
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={i * 80}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="projects__more">
          More experiments on{' '}
          <a href={profile.github} target="_blank" rel="noreferrer" className="link">
            github.com/MohitGujarati →
          </a>
        </p>
      </Reveal>
    </section>
  )
}
