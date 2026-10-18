import Link from 'next/link';
import ExternalLink from '@/components/ExternalLink';
import { asset, profile } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="site-footer container">
      <div className="footer-top">
        <p>Have something in mind?</p>
        <Link className="footer-contact" href="/contact">
          Let&apos;s talk<span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Mohit Gujarati</p>
        <div className="footer-links">
          <ExternalLink href={profile.github}>GitHub ↗</ExternalLink>
          <ExternalLink href={profile.linkedin}>LinkedIn ↗</ExternalLink>
          <ExternalLink href={asset(profile.resume)}>Résumé ↗</ExternalLink>
        </div>
        <a className="back-top" href="#top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
