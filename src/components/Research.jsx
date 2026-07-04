import Reveal from './Reveal.jsx'
import { research } from '../data.js'

export default function Research() {
  return (
    <section className="section" id="research">
      <Reveal>
        <p className="section__kicker mono">05 / research</p>
        <h2 className="section__title">
          Published <span className="gradient-text">research</span>.
        </h2>
      </Reveal>

      <div className="research__grid">
        {research.map((p, i) => (
          <Reveal key={p.title} delay={i * 70}>
            <a className="paper-card" href={p.file} target="_blank" rel="noreferrer">
              <div className="paper-card__meta">
                <span className={`badge ${p.category === 'IEEE' ? 'badge--ieee' : ''}`}>
                  {p.category}
                </span>
                <span className="paper-card__year mono">{p.year}</span>
              </div>
              <h3>{p.title}</h3>
              <p className="paper-card__abstract">{p.abstract}</p>
              <div className="paper-card__foot">
                <div className="chip-row">
                  {p.tags.map((t) => (
                    <span className="chip chip--ghost" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <span className="paper-card__read mono">Read PDF →</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
