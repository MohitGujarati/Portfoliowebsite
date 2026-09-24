import type { Metadata, Viewport } from 'next';
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { absolute, profile, SITE_URL } from '@/lib/site';
import './globals.css';

const sans = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter-tight', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-jetbrains-mono', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument-serif', display: 'swap' });

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
    'Mohit Gujarati', 'full-stack software engineer', 'Android developer', 'Kotlin', 'Jetpack Compose',
    'React Native', 'React', 'Next.js', 'TypeScript', 'Gemini API', 'AI engineer', 'Supabase', 'PostgreSQL',
    'Phoenix AZ software engineer', 'Gabriel AI', 'LIU Brooklyn computer science',
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
    images: [{ url: absolute('/og.png'), width: 1200, height: 630, alt: `${profile.name}, ${profile.role}` }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [absolute('/og.png')] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0c0d10' },
    { media: '(prefers-color-scheme: light)', color: '#f6f5f0' },
  ],
  colorScheme: 'dark light',
};

// Runs before first paint: applies the saved theme, marks JS as available (for
// scroll reveals), and decides whether to play the intro. Crawlers, automated
// browsers and reduced-motion users never get the intro; add ?intro to force it.
const bootScript = `(function(){var r=document.documentElement;r.classList.add('js');
try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')r.dataset.theme=t}catch(e){}
try{var force=/[?&]intro\\b/.test(location.search);
var bot=/bot|crawl|spider|slurp|lighthouse|headless|preview|gptbot|claude|perplexity/i.test(navigator.userAgent)||navigator.webdriver;
if(force||(!bot&&!sessionStorage.getItem('booted')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)){
r.classList.add('booting');setTimeout(function(){r.classList.remove('booting')},9000)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
