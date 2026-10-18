'use client';

import { useEffect, useState } from 'react';

export default function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState('Copy email');
  useEffect(() => {
    if (status === 'Copy email') return;
    const timer = window.setTimeout(() => setStatus('Copy email'), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('Email copied');
    } catch {
      setStatus('Use the email link above');
    }
  }
  return (
    <button className="text-link copy-email" type="button" onClick={copy}>
      <span aria-live="polite">{status}</span>
      <span aria-hidden="true">{status === 'Email copied' ? '✓' : '+'}</span>
    </button>
  );
}
