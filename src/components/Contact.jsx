import Reveal from './Reveal.jsx'
import { profile } from '../data.js'

export default function Contact() {
  return (
    <section className="section section--contact" id="contact">
      <Reveal>
        <p className="section__kicker mono">07 / contact</p>
        <h2 className="section__title">
          Let&apos;s build something <span className="gradient-text">together</span>.
        </h2>
        <p className="contact__blurb">
          {profile.availability}. If you&apos;re looking for an Android engineer who is just as
          comfortable in Compose as in an AI pipeline — my inbox is open.
        </p>
        <div className="contact__actions">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">
            Download resume
          </a>
        </div>
        <div className="contact__links mono">
          <a href={profile.github} target="_blank" rel="noreferrer" className="link">
            GitHub
          </a>
          <span className="dot">·</span>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link">
            LinkedIn
          </a>
          <span className="dot">·</span>
          <span>{profile.location}</span>
        </div>
      </Reveal>
    </section>
  )
}
