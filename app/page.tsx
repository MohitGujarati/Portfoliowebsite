import CodeCard from '@/components/CodeCard';
import CopyEmail from '@/components/CopyEmail';
import HeroStage from '@/components/HeroStage';
import Intro from '@/components/Intro';
import Nav from '@/components/Nav';
import PageEffects from '@/components/PageEffects';
import ReplayIntro from '@/components/ReplayIntro';
import Research from '@/components/Research';
import Rich from '@/components/Rich';
import SectionHead from '@/components/SectionHead';
import StatusLine from '@/components/StatusLine';
import SoftwarePet from '@/components/SoftwarePet';
import Terminal from '@/components/Terminal';
import TypedWords from '@/components/TypedWords';
import { jsonLdString } from '@/lib/jsonld';
import { asset, awards, education, experience, papers, profile, projects, skills } from '@/lib/site';

const ROLES = ['mobile apps', 'web platforms', 'AI agents', 'real-time voice AI', 'offline-first apps'];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString() }} />
      <Intro />
      <div className="bg-grid" aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />

      <main id="main">
        {/* ============ HERO ============ */}
        <HeroStage>
          <section className="hero container" aria-labelledby="hero-name">
            <div className="hero__copy">
              <p className="status">
                <span className="status__dot" aria-hidden="true" />
                {profile.role.replace('Software ', '')} at {profile.company} · {profile.location}
              </p>
              <h1 className="hero__title">
                <span className="hero__name" id="hero-name">{profile.name}</span>
                <span className="accent" aria-hidden="true">.</span>
                <span className="hero__sub">
                  I build <TypedWords words={ROLES} />
                  <br /> that ship.
                </span>
              </h1>
              <p className="hero__lede">
                Full-stack software engineer with 2 years of professional experience building apps in Kotlin,
                React Native, React and Next.js. I work on data layers (Room, AWS, Supabase, Firebase),
                REST APIs, and AI features, from streaming Gemini pipelines to voice calling workflows.
              </p>
              <div className="hero__cta">
                <a className="btn" href="#projects" data-magnetic>See my work</a>
                <a className="btn btn--ghost" href="#shell" data-magnetic><span className="mono" aria-hidden="true">&gt;_</span> Open terminal</a>
              </div>
              <ul className="socials" aria-label="Profiles">
                <li><a href={profile.github} target="_blank" rel="noopener me">GitHub ↗</a></li>
                <li><a href={profile.linkedin} target="_blank" rel="noopener me">LinkedIn ↗</a></li>
                <li><a href={`mailto:${profile.email}`}>Email ↗</a></li>
              </ul>
            </div>
            <div className="hero__card">
              <CodeCard />
            </div>
          </section>
        </HeroStage>

        {/* ============ EXPERIENCE ============ */}
        <section className="section container" id="experience" aria-labelledby="experience-title">
          <SectionHead id="experience" num="01" cmd="git log --graph experience" title="Where I've worked" />
          <div className="timeline" id="timeline">
            <div className="timeline__track" aria-hidden="true"><span className="timeline__fill" id="timeline-fill" /></div>
            <ol className="commits">
              {experience.map((job) => (
                <li className="commit reveal" key={job.hash}>
                  <span className="commit__dot" aria-hidden="true" />
                  <div className="commit__meta">
                    <p className="commit__hash" aria-hidden="true"><span className="hash">commit {job.hash}</span></p>
                    <p className={`commit__ref${job.head ? ' ref--head' : ''}`} aria-hidden="true">{job.ref}</p>
                    <p className="commit__date">
                      <time dateTime={job.start}>{job.dates.split(' – ')[0]}</time> – {job.end ? <time dateTime={job.end}>{job.dates.split(' – ')[1]}</time> : 'Present'}
                    </p>
                  </div>
                  <div className="commit__body">
                    <h3>{job.role} <span className="at">@ {job.company}</span></h3>
                    <ul className="points">
                      {job.points.map((pt) => <li key={pt}><Rich text={pt} /></li>)}
                    </ul>
                    <ul className="tags">{job.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                  </div>
                </li>
              ))}
            </ol>
            <p className="timeline__root" aria-hidden="true"><span className="hash">(root)</span> git init career</p>
          </div>
        </section>

        {/* ============ PROJECTS ============ */}
        <section className="section container" id="projects" aria-labelledby="projects-title">
          <SectionHead id="projects" num="02" cmd="ls ~/projects" title="Things I've built" />
          <div className="projects">
            {projects.map((p, i) => (
              <article className="project reveal" id={`project-${p.slug}`} key={p.slug}>
                <div className="project__top">
                  <p className="project__kind"><span className="idx">projects[{i}]</span> {p.kind}</p>
                  <p className="project__date">{p.dates}</p>
                </div>
                <h3>{p.name}</h3>
                <p className="project__pitch">{p.pitch}</p>
                <ul className="project__points">
                  {p.points.map((pt) => <li key={pt}><Rich text={pt} /></li>)}
                </ul>
                <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </article>
            ))}
            <a className="project project--more reveal" href={profile.github} target="_blank" rel="noopener me">
              <p className="project__kind"><span className="idx">projects[...]</span> Open source</p>
              <h3>More on GitHub <span aria-hidden="true">↗</span></h3>
              <p className="project__pitch">Experiments, coursework and side projects in Kotlin, JavaScript and Python.</p>
            </a>
          </div>
        </section>

        {/* ============ RESEARCH ============ */}
        <section className="section container" id="research" aria-labelledby="research-title">
          <SectionHead id="research" num="03" cmd={'grep -rl "abstract" ~/research'} title="Research & writing">
            <p className="section__lede">Papers from my M.S. at LIU Brooklyn: two IEEE-format research papers and three technical reviews.</p>
          </SectionHead>
          <Research papers={papers} />
        </section>

        {/* ============ SKILLS ============ */}
        <section className="section container" id="skills" aria-labelledby="skills-title">
          <SectionHead id="skills" num="04" cmd="cat package.json | jq .skills" title="My toolbox" />
          <div className="skills">
            {skills.map((s) => (
              <div className="skill-group reveal" key={s.group}>
                <h3>./{s.group}</h3>
                <ul className="chips">{s.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        {/* ============ EDUCATION ============ */}
        <section className="section container" id="education" aria-labelledby="education-title">
          <SectionHead id="education" num="05" cmd="cat /etc/education" title="Education & awards" />
          <div className="edu">
            {education.map((e) => (
              <article className="edu__item reveal" key={e.degree}>
                <p className="edu__date">{e.dates}</p>
                <h3>{e.degree}</h3>
                <p className="edu__school">{e.school}, {e.place}</p>
                {e.note && <p className="edu__badge">{e.note}</p>}
              </article>
            ))}
            <article className="edu__item edu__item--awards reveal">
              <p className="edu__date">Recognition</p>
              <ul className="awards">
                {awards.map((a) => (
                  <li key={a}><span className="award__icon" aria-hidden="true">★</span> {a}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* ============ TERMINAL ============ */}
        <section className="section container" id="shell" aria-labelledby="shell-title">
          <SectionHead id="shell" num="06" cmd="./mohit-sh --interactive" title="Try the terminal">
            <p className="section__lede">
              A small shell that knows everything on this page. Type <kbd>help</kbd> to start, tap a command below,
              or press <kbd>/</kbd> anywhere to jump here.
            </p>
          </SectionHead>
          <Terminal />
        </section>

        {/* ============ CONTACT ============ */}
        <section className="contact container" id="contact" aria-labelledby="contact-title">
          <div className="contact__inner reveal">
            <p className="eyebrow eyebrow--center" aria-hidden="true">
              <span className="eyebrow__num">07</span>
              <span className="eyebrow__cmd" data-type>ssh hello@mohit</span>
            </p>
            <h2 className="contact__title" id="contact-title">Let&apos;s build something <em>together.</em></h2>
            <p className="contact__lede">I&apos;m open to full-stack, mobile and AI engineering roles, and I&apos;m always happy to talk shop.</p>
            <div className="contact__actions">
              <a className="btn btn--big" href={`mailto:${profile.email}`} data-magnetic>{profile.email}</a>
              <CopyEmail email={profile.email} />
            </div>
            <ul className="socials socials--center">
              <li><a href={profile.linkedin} target="_blank" rel="noopener me">LinkedIn ↗</a></li>
              <li><a href={profile.github} target="_blank" rel="noopener me">GitHub ↗</a></li>
              <li><a href={asset(profile.resume)} target="_blank" rel="noopener">Resume (PDF) ↗</a></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer container">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="mono">
          built with Next.js · <a href={asset('/llms.txt')}>llms.txt</a> · <ReplayIntro />
        </p>
      </footer>

      <StatusLine />
      <PageEffects />
      <SoftwarePet />
    </>
  );
}
