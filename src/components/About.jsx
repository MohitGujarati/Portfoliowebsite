import Reveal from './Reveal.jsx'
import CountUp from './CountUp.jsx'
import { profile, stats, education } from '../data.js'

export default function About() {
  return (
    <section className="section" id="about">
      <Reveal>
        <p className="section__kicker mono">01 / about</p>
        <h2 className="section__title">
          Engineer first, <span className="gradient-text">Android native</span> always.
        </h2>
      </Reveal>

      <div className="about__grid">
        <Reveal className="about__text">
          <div className="about__identity">
            <span className="avatar-ring">
              <video
                className="avatar"
                src={`${import.meta.env.BASE_URL}neural-bot.mp4`}
                autoPlay
                loop
                muted
                playsInline
                aria-label="Animated iridescent Android bot avatar"
              />
            </span>
            <div>
              <div className="about__identity-name">{profile.name}</div>
              <div className="about__identity-loc mono">{profile.location} · GMT-5</div>
            </div>
          </div>
          <p>{profile.summary}</p>
          <p>
            Right now I&apos;m finishing my Master&apos;s in Computer Science in Brooklyn while
            building <strong>Recall AI</strong>, a meeting assistant that streams live
            transcription and AI responses through Kotlin Flow — because the most interesting
            mobile work today happens where native craft meets AI.
          </p>
          <div className="about__education">
            {education.map((e) => (
              <div className="edu-card" key={e.school}>
                <div className="edu-card__degree">{e.degree}</div>
                <div className="edu-card__school">{e.school}</div>
                <div className="edu-card__meta mono">
                  {e.period} · {e.detail}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="about__stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="stat-card">
                <div className="stat-card__value gradient-text">
                  <CountUp value={s.value} />
                </div>
                <div className="stat-card__label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
