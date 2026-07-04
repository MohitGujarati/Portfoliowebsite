import Reveal from './Reveal.jsx'
import { skillGroups } from '../data.js'

const icons = {
  android: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 16V10a7 7 0 0 1 14 0v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
      <path d="m7 5 1.5 2M17 5l-1.5 2" />
      <circle cx="9.5" cy="11" r="0.6" fill="currentColor" />
      <circle cx="14.5" cy="11" r="0.6" fill="currentColor" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5 19 19M19 5l-2.5 2.5M7.5 16.5 5 19" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />
    </svg>
  ),
}

export default function Skills() {
  return (
    <section className="section" id="skills">
      <Reveal>
        <p className="section__kicker mono">02 / skills</p>
        <h2 className="section__title">
          The <span className="gradient-text">toolbox</span>.
        </h2>
      </Reveal>

      <div className="skills__grid">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 80}>
            <div className="skill-card">
              <div className="skill-card__head">
                <span className="skill-card__icon">{icons[group.icon]}</span>
                <h3>{group.title}</h3>
              </div>
              <div className="chip-row">
                {group.skills.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
