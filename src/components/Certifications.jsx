import Reveal from './Reveal.jsx'
import { certifications } from '../data.js'

function CertBody({ cert }) {
  return (
    <>
      <div className="cert-card__head">
        <span className="cert-card__authority mono">{cert.authority}</span>
        <span className="cert-card__date mono">{cert.date}</span>
      </div>
      <h3>{cert.name}</h3>
      <div className="chip-row">
        {cert.skills.map((s) => (
          <span className="chip chip--ghost" key={s}>
            {s}
          </span>
        ))}
      </div>
    </>
  )
}

export default function Certifications() {
  return (
    <section className="section" id="certifications">
      <Reveal>
        <p className="section__kicker mono">06 / certifications</p>
        <h2 className="section__title">
          Always <span className="gradient-text">learning</span>.
        </h2>
      </Reveal>

      <div className="certs__grid">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={(i % 3) * 80}>
            {c.url ? (
              <a className="cert-card" href={c.url} target="_blank" rel="noreferrer">
                <CertBody cert={c} />
              </a>
            ) : (
              <div className="cert-card">
                <CertBody cert={c} />
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  )
}
