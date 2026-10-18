'use client';
import { useEffect, useRef } from 'react';

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (initialized.current || !key || !host) return;
    initialized.current = true;
    // Analytics loads independently of the interface and initializes once in Strict Mode.
    void import('posthog-js')
      .then(({ default: posthog }) => {
        posthog.init(key, {
          api_host: host,
          person_profiles: 'identified_only',
          capture_pageview: true, // Enable automatic pageview capture
        });
      })
      .catch(() => {
        initialized.current = false;
      });
  }, []);

  return <>{children}</>;
}
