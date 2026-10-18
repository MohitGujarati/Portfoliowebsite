import type { Metadata, Viewport } from 'next';
import { Manrope, JetBrains_Mono } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { absolute, profile, SITE_URL } from '@/lib/site';
import './globals.css';
import PostHogProvider from '@/components/PostHogProvider';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import PageEffects from '@/components/PageEffects';
import ClickNotifier from '@/components/ClickNotifier';
import CommandPalette from '@/components/CommandPalette';
import SmoothScroll from '@/components/SmoothScroll';

const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const title = `${profile.name} | ${profile.role}`;
const description =
  'Mohit Gujarati is a full-stack software engineer in Phoenix, AZ at Gabriel AI, building mobile, web and AI products with Kotlin, Jetpack Compose, React Native, React, Next.js and the Gemini API. M.S. in Computer Science, LIU Brooklyn.';

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: title, template: `%s | ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: absolute('/') }],
  creator: profile.name,
  keywords: [
    'Mohit Gujarati',
    'full-stack software engineer',
    'Android developer',
    'Kotlin',
    'Jetpack Compose',
    'React Native',
    'React',
    'Next.js',
    'TypeScript',
    'Gemini API',
    'AI engineer',
    'Supabase',
    'PostgreSQL',
    'Phoenix AZ software engineer',
    'Gabriel AI',
    'LIU Brooklyn computer science',
  ],
  alternates: {
    canonical: absolute('/'),
    types: {
      'text/markdown': [
        { url: absolute('/llms.txt'), title: 'llms.txt: profile summary for AI assistants' },
        { url: absolute('/llms-full.txt'), title: 'llms-full.txt: complete profile for AI assistants' },
      ],
      'application/json': [{ url: absolute('/profile.json'), title: 'profile.json: structured professional profile' }],
    },
  },
  openGraph: {
    type: 'profile',
    url: absolute('/'),
    siteName: profile.name,
    title,
    description,
    locale: 'en_US',
    firstName: 'Mohit',
    lastName: 'Gujarati',
    username: 'MohitGujarati',
  },
  twitter: { card: 'summary', title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  verification: {
    google: 'F8lAh4vgAKL29DoQfofjg_F2oWystJ6yphkvWWrQDxU',
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#111412',
  colorScheme: 'dark light',
};

// Apply the saved preference before first paint, without blocking the page.
const bootScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body suppressHydrationWarning>
        <PostHogProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <div id="top" />
          <Nav />
          {children}
          <SiteFooter />
          <PageEffects />
          <ClickNotifier />
          <CommandPalette />
          <SmoothScroll />
          <GoogleAnalytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
