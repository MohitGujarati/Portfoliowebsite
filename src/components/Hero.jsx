import { profile } from '../data.js'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__content">
        <p className="hero__kicker mono">
          <span className="pulse-dot" aria-hidden="true" />
          {profile.availability}
        </p>
        <h1 className="hero__title">
          Hi, I&apos;m <span className="gradient-text">Mohit</span>.
          <br />
          I build Android apps that feel <span className="gradient-text">alive</span>.
        </h1>
        <p className="hero__tagline">{profile.tagline}</p>
        <div className="hero__actions">
          <a href="#projects" className="btn btn--primary">
            See my work
          </a>
          <a href="#contact" className="btn">
            Get in touch
          </a>
        </div>
        <div className="hero__meta mono">
          <span>Kotlin</span>
          <span className="dot">·</span>
          <span>Jetpack Compose</span>
          <span className="dot">·</span>
          <span>Gemini API</span>
          <span className="dot">·</span>
          <span>React Native</span>
        </div>
      </div>

      <div className="hero__visual">
        <div className="hero__orb" aria-hidden="true" />
        <span className="floater floater--1" aria-hidden="true" />
        <span className="floater floater--2" aria-hidden="true" />
        <span className="floater floater--3" aria-hidden="true" />
        <span className="floater floater--4" aria-hidden="true" />
        <video
          className="hero__video"
          src={`${import.meta.env.BASE_URL}neural-bot.mp4`}
          autoPlay
          loop
          muted
          playsInline
          aria-label="Animated iridescent Android bot"
        />
        <p className="hero__caption mono">// my neural android, saying hello</p>
      </div>

      <a href="#about" className="hero__scroll mono" aria-label="Scroll to about section">
        scroll ↓
      </a>
    </section>
  )
}
