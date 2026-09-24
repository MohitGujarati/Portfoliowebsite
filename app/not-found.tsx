import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404: command not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="notfound container">
      <div className="terminal">
        <div className="terminal__bar">
          <span /><span /><span />
          <p>visitor@mohit: ~</p>
        </div>
        <div className="terminal__body notfound__body">
          <p className="t-row"><span className="t-prompt">visitor@mohit:~$ </span>cd this-page</p>
          <p className="t-row t-err">mohit-sh: 404: no such file or directory</p>
          <p className="t-row t-muted">The page you&apos;re looking for doesn&apos;t exist, or it moved.</p>
          <p className="t-row">&nbsp;</p>
          <p className="t-row"><span className="t-prompt">visitor@mohit:~$ </span><Link className="t-link" href="/">cd ~</Link></p>
        </div>
      </div>
    </main>
  );
}
