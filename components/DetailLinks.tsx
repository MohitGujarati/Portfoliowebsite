import Link from 'next/link';

export default function DetailLinks() {
  return (
    <nav className="detail-links" aria-label="Explore portfolio">
      <span>Explore:</span>
      <Link href="/about">About</Link>
      <Link href="/experience">Experience</Link>
      <Link href="/#projects">Projects</Link>
      <Link href="/research">Research</Link>
      <Link href="/#contact">Contact</Link>
      <Link href="/profile.json">Profile JSON</Link>
    </nav>
  );
}