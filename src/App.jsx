import Nav from './components/Nav.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Research from './components/Research.jsx'
import Certifications from './components/Certifications.jsx'
import Contact from './components/Contact.jsx'

export default function App() {
  return (
    <>
      <div className="bg-glow" aria-hidden="true" />
      <Nav />
      <ScrollProgress />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Research />
        <Certifications />
        <Contact />
      </main>
      <footer className="footer">
        <p>
          Designed &amp; built by Mohit Gujarati · React + Vite ·{' '}
          <span className="mono">© {new Date().getFullYear()}</span>
        </p>
      </footer>
    </>
  )
}
