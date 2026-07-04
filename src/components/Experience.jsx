import Reveal from './Reveal.jsx'
import { experience } from '../data.js'

export default function Experience() {
  return (
    <section className="section" id="experience">
      <Reveal>
        <p className="section__kicker mono">03 / experience</p>
        <h2 className="section__title">
          Where I&apos;ve <span className="gradient-text">shipped</span>.
        </h2>
      </Reveal>

      <div className="timeline">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 100}>
            <article className="timeline__item">
              <div className="timeline__marker" aria-hidden="true" />
              <header className="timeline__head">
                <h3>{job.role}</h3>
                <span className="timeline__company">{job.company}</span>
                <span className="timeline__period mono">{job.period}</span>
              </header>
              <ul className="timeline__points">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="chip-row">
                {job.tags.map((t) => (
                  <span className="chip chip--ghost" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
