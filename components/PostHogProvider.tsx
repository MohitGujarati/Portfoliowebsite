'use client';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('PostHog key:', process.env.NEXT_PUBLIC_POSTHOG_KEY);
    console.log('PostHog host:', process.env.NEXT_PUBLIC_POSTHOG_HOST);
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      console.log('Initializing PostHog...');
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: true // Enable automatic pageview capture
      });
    } else {
      console.warn('PostHog not initialized because keys are missing or window is undefined');
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
