# Rebuilding the website from this document

This file and `DESIGN.md` together are enough to recreate the portfolio website exactly, on any machine and with any host. This file covers architecture, behaviour, build and deployment, and its appendix contains **every source file verbatim**. `DESIGN.md` covers the visual system and contains the full stylesheet. Only the six PDF files are not embedded; see section 3.

Keep both documents current with `npm run docs:sync` from the repository root. It rewrites the appendices from the real files.

---

## 1. What you are building

An image-free, multipage personal portfolio for Mohit Gujarati.

- **Stack:** Next.js 16.4.2 (App Router), React 19.3.0, TypeScript 5.9, native CSS, Motion 14 (two small interactions), Lenis 1.3 (momentum scrolling), and optional PostHog and GA4.
- **No images or WebGL:** visual interest comes from typography and a Canvas 2D pixel field.
- **Content:** every word comes from one file, `lib/site.ts`. Pages, structured data, `llms.txt`, `profile.json` and the sitemap all read from it.
- **Two build targets from one codebase:** a full Next.js server for Vercel, and a static export for GitHub Pages or any static host.

---

## 2. Rebuild in eight steps

Requires Node.js 22+ and npm.

1. Create a folder (the repository uses `frontend/`) and recreate every file in **Appendix A** at the path shown. Paths are relative to the repository root; drop the `frontend/` prefix if the site is your whole repo.
2. Create `app/globals.css` from the stylesheet appendix in `DESIGN.md`.
3. Add the binary assets in **section 3** to `public/`, plus an empty `public/.nojekyll`.
4. Install dependencies: `npm install`. `package.json` uses caret ranges; for an identical build, pin `next@16.4.2`, `react@19.3.0` and `react-dom@19.3.0`.
5. Copy `.env.example` to `.env.local` and fill in what you need (section 7). Everything is optional for local work.
6. Run `npm run dev` and open http://localhost:3000.
7. Check with `npm run typecheck`, then `npm run build`. Expect 21 generated routes, with `/api/cron` as the only dynamic one.
8. Deploy: see `DEPLOYMENT_VERCEL.md`, or section 6 for a static host.

**To make it someone else's portfolio:** edit `lib/site.ts`; the description, keywords, Open Graph names and `verification.google` in `app/layout.tsx`; the hard-coded copy in `app/about/page.tsx`, `app/blog/page.tsx`, `app/page.tsx` (hero lines) and `app/research/page.tsx` (closing note); and the initials in `app/icon.svg`.

---

## 3. Binary assets (not embedded)

| Path in `public/` | Linked from |
| --- | --- |
| `Mohit_Gujarati_Resume.pdf` | `profile.resume`: footer, contact, experience, command palette |
| `papers/parkinsons-detection-handwriting.pdf` | `papers[].file` on the research page |
| `papers/bert-news-recommendation.pdf` | 〃 |
| `papers/pytorch-vs-tensorflow-survey.pdf` | 〃 |
| `papers/tensorflow-system-review.pdf` | 〃 |
| `papers/microservices-distributed-systems.pdf` | 〃 |

Get them from the repository's `frontend/public/`, or from the live site at the same paths (for example `https://mohitgujarati.vercel.app/papers/bert-news-recommendation.pdf`). To rebuild without them, the site still works, but those links return 404.

---

## 4. Architecture

### Routes

| URL | File | Notes |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hero over pixel field, then About, Experience, Skills and Selected work. Emits the full JSON-LD graph. |
| `/work` | `app/work/page.tsx` | Project index (`WorkList` with summaries). |
| `/projects` | `app/projects/page.tsx` | Redirects to `/work`. |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Case study; static params come from `projects`. |
| `/experience` | `app/experience/page.tsx` | Timeline; each role has an anchor `#role-<hash>`. |
| `/about` | `app/about/page.tsx` | Background, capabilities, education, awards. |
| `/research` | `app/research/page.tsx` | Expandable `<details>` per paper, anchor `#paper-<slug>`. |
| `/contact` | `app/contact/page.tsx` | Email, copy button, links. |
| `/blog` | `app/blog/page.tsx` | "Notes" placeholder. |
| 404 | `app/not-found.tsx` | |
| `/llms.txt`, `/llms-full.txt` | route handlers + `lib/llms.ts` | Plain-text profile for AI assistants (llmstxt.org). |
| `/profile.json` | route handler | Machine-readable profile. |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/icon.svg` | metadata files | `robots` explicitly welcomes AI crawlers. |
| `/api/cron` | `app/api/cron/route.ts` | Vercel only: daily keep-alive ping to the Express API. |

`app/template.tsx` wraps every route in `.route-enter`, which plays a short entrance animation on each navigation.

### Layout composition (`app/layout.tsx`)

The `<html>` element gets the font variables: Manrope as `--font-sans`, and JetBrains Mono (400/500/700) as `--font-jetbrains-mono`. An inline boot script applies the saved theme before first paint. `<body>` contains:

`PostHogProvider` › skip link › `#top` › `Nav` › page › `SiteFooter` › `PageEffects` › `ClickNotifier` › `CommandPalette` › `SmoothScroll` › `GoogleAnalytics`

### Content model (`lib/site.ts`)

`profile`, `pages` (navigation), `experience` (`Job[]`), `projects` (`Project[]`, with `tagline`, `summary`, `pitch`, `platform`, `repository`, `points`, `decisions` and `tags`), `papers` (`Paper[]`, with `shortTitle` and optional `note`), `skills`, `capabilities`, `education` and `awards`. Strings may contain `**bold**`; `<Rich>` renders it, and `plain()` strips it for metadata. `asset()` adds the deploy base path to `/public` files. `absolute()` builds canonical URLs from `SITE_URL`.

### Shared building blocks

| Component | Role |
| --- | --- |
| `PageHeader` | Heading block of every secondary page: pixel field, eyebrow, `h1.display-title`, intro. Optional `transitionName` morphs the title between pages. |
| `WorkList` | Numbered project rows. `heading` sets h2 or h3; `description` picks `tagline` or `summary`. |
| `ExternalLink` | `target="_blank" rel="noopener noreferrer"`. |
| `JsonLd` | Inline `application/ld+json`, with `<` escaped. |
| `pageMetadata()` | Title, description and canonical URL for a page. |

Client components ("islands"): `Nav`, `PixelField`, `MagneticLink`, `CopyEmail`, `PageEffects`, `PostHogProvider`, `ClickNotifier`, `CommandPalette`, `SmoothScroll`. Everything else renders on the server and works without JavaScript.

---

## 5. Behaviour specifications

### Pixel field (`components/PixelField.tsx`)

A `<canvas>` absolutely filling its parent: `.hero-heading-row` on the home page, and `.page-heading` on other pages. Pointer events are tracked on the parent, so links stay clickable.

- **Grid:** cells every 15 px; each cell is an 11 px rounded square with 2 px radius. Each cell gets a stable seed: `fract(sin(col·127.1 + row·311.7)·43758.5453)`. Device pixel ratio is capped at 2.
- **Pointer reveal (hover):** each cell's target is `max(0, 1 − distance/radius)²`. The radius is 215 px, or 120 px when the field is narrower than 768 px. Energy rises with a 60 ms time constant and falls with 240 ms. Opacity is `(0.2 + seed·0.8)·energy·edge`, where `edge` fades within 48 px of the sides and 36 px of the top and bottom.
  - Dark-theme colours: `#b4ed8b` (seed > 0.79), `#679d53` (> 0.37), `#354b3b` otherwise.
  - Light-theme colours: `#397538` / `#6d9465`, at 0.8 opacity.
- **Idle wave (no pointer):** the sum of two slow sine waves: `sin(x·0.011 + y·0.006 − t·0.55)·0.6 + sin(x·0.004 − y·0.009 + t·0.35)·0.4`, with `t` in seconds. Only crests show: `crest = max(0, swell − 0.2)/0.8`, and `wave = crest²·(0.35 + seed·0.65)·idle·(1 − energy)`. Opacity is `wave·edge·0.55` in dark mode and `0.45` in light mode.
  - Colour: `hsl(hue 42% 56%)` in dark mode and `hsl(hue 38% 44%)` in light mode. The hue starts at 0 (red) and travels the full wheel every 90 seconds.
  - `idle` fades in over about 900 ms, and out over about 180 ms when the pointer arrives.
- **Accent sync:** while `idle > 0.5`, the field sets `--wave-color` on its parent, `hsl(hue 48% 64%)` dark or `hsl(hue 42% 40%)` light. `.name-period` (the square after the name) uses it, and falls back to `--accent` on hover.
- **Performance:** while idle, frames render at 30 fps. The pointer reveal renders every frame. Rendering stops when the field is off screen (IntersectionObserver), when the tab is hidden, or when nothing is changing.
- **Reduced motion:** with `prefers-reduced-motion`, there is no wave and the reveal snaps instantly.
- **Theme:** a MutationObserver on `data-theme` switches the palette.

### Command palette (`components/CommandPalette.tsx`, `lib/palette.ts`)

- **Opening:** ⌘K or Ctrl+K toggles it from anywhere. `/` opens it unless the user is typing in a field. The header's **Search** button dispatches a `palette:open` event. The shortcut label reads "⌘K" on Apple devices and "Ctrl K" elsewhere.
- **Container:** a native modal `<dialog>`. Esc or a click on the backdrop closes it; page scroll is locked while it's open; focus returns afterwards.
- **Commands,** in order:
  - pages (plus Notes)
  - projects → `/projects/<slug>`
  - jobs → `/experience#role-<hash>`
  - papers → `/research#paper-<slug>`, which then opens that paper's `<details>`
  - actions: copy email (shows "Email copied to clipboard", closes after 700 ms), write an email, open résumé, switch theme, GitHub, LinkedIn
- **Search:** case-insensitive. A title prefix scores 3, a title match 2, and a match in the hint, keywords or group 1. An empty query keeps the natural order.
- **Keyboard:** ↑/↓ wrap around, Home/End jump, Enter selects. Hovering moves the selection. The input uses the combobox pattern: `aria-activedescendant` on an `role="listbox"` list.
- **Look:** the pixel field sits behind the search row.
- **Slack:** each selection posts `🔎 Command palette on <path>: "<title>" (<group>)`.

### Page transitions

React `<ViewTransition name=… share="morph" default="none">` gives matching elements on two pages the same name, and the browser morphs between them in 450 ms, blurring 3 px at 30%.

- `project-<slug>`: the `WorkList` title, the case-study `h1`, and the two "Next project" / "Also see" links at the end of each case study.
- `job-<hash>`: the home-page experience row's company, and the experience page `h2`.
- The header is named `site-header` and doesn't animate.
- A name must be unique on a page.
- Browsers without support switch pages normally, and reduced motion makes the swap instant.

### Other interactions

| Feature | Behaviour |
| --- | --- |
| Theme | `data-theme="light"`/`"dark"` on `<html>`, saved in `localStorage.theme`. Dark is the default. The toggle is in the header. |
| Nav | Desktop shows Work, Experience, About and Research. A Motion `layoutId` underline follows hover and focus, with a spring (stiffness 380, damping 34). Below 768 px a full-screen `<dialog>` menu staggers its links in 45 ms steps and fades out over 160 ms. |
| Scroll reveal | `PageEffects`: `.reveal` elements below the fold fade and rise 14 px over 600 ms when 8% visible. Above-the-fold content is left alone. |
| Smooth scrolling | `SmoothScroll` runs Lenis (`lerp: 0.1`, `autoRaf`, `stopInertiaOnNavigate`) for wheel and trackpad momentum; touch stays native. Same-page `#section` links (also from the palette, via `lib/scroll.ts` `navigateTo`) are intercepted in the document capture phase and glide to the section. Arriving on a new page at a `#section` resets to the top, then glides down. Other page changes land at the top with no leftover momentum. Header clearance comes from `scroll-padding-top: 110px` (plus `scroll-margin-top` on timeline roles), which Lenis honours. Dialogs carry `data-lenis-prevent`, so they scroll natively. Under reduced motion, Lenis stops smoothing and all scrolls are instant. |
| Magnetic link | The hero's "Explore selected work" arrow follows the mouse at 15% of its offset, through a spring (stiffness 230, damping 24, mass 0.35). Mouse only. |
| Copy email | Clipboard write, then "Email copied" for 3 s. On failure: "Use the email link above". |
| Slack clicks | `ClickNotifier` posts `👀 Visitor click on <path>: "<label>" → <href>` for every `a`, `button` and `summary`. Card links are named by their heading, and repeats within 5 s are ignored. `lib/notify.ts` POSTs JSON with `keepalive` to `/api/notify/`. That route checks the Origin, allows only the two site message formats (400 characters max), escapes `<` `>` so no `@channel` pings are possible, and forwards to the server-only `SLACK_WEBHOOK_URL`. Static builds skip notifications. |
| Analytics | GA4 loads only if `NEXT_PUBLIC_GA_ID` is set. PostHog loads lazily only if its key and host are set. |
| Keep-alive | `/api/cron/` requests `${NEXT_PUBLIC_API_URL}/api/projects` and reports `projectsFound`. |

### SEO and machine-readable output

- **Metadata:** per-page titles use the template `%s | Mohit Gujarati`, with canonical URLs, Open Graph `profile`, a Twitter card, and Google verification.
- **JSON-LD:**
  - Home: WebSite, ProfilePage, Person (credentials, occupation, skills), one OrganizationRole per job, and one CreativeWork per project and paper.
  - Other pages: BreadcrumbList on each.
  - Experience and Research: a CollectionPage each.
  - Case studies: a CreativeWork.
- **AI crawlers:** `robots.txt` allows all agents and explicitly lists AI crawlers. `llms.txt` is a summary; `llms-full.txt` is everything as Markdown; `profile.json` is a structured document.

---

## 6. Build targets

| Target | Command | Output |
| --- | --- | --- |
| Server (Vercel, or `next start` anywhere) | `npm run build && npm start` | Includes `/api/cron`. |
| Static (GitHub Pages, S3, Netlify, nginx) | `rm -rf app/api && GITHUB_PAGES=true PAGES_BASE_PATH=/<sub-path> npm run build` | `out/`. Leave `PAGES_BASE_PATH` empty when serving from a domain root. Route handlers can't run on static hosts, so `app/api` must be removed first. |

`next.config.ts` sets `trailingSlash: true` and unoptimized images. It also exposes the base path as `NEXT_PUBLIC_BASE_PATH` for `asset()`. The GitHub Pages workflow is included in Appendix A (`.github/workflows/deploy.yml`).

---

## 7. Environment variables

| Variable | Used by |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Falls back to Vercel's production URL, then `VERCEL_URL`, then `https://mohitgujarati.vercel.app`. |
| `NEXT_PUBLIC_API_URL` | `/api/cron` keep-alive target. |
| `SLACK_WEBHOOK_URL` | Slack notifications, server-only, forwarded by `/api/notify`. Off on static hosts. |
| `CRON_SECRET` | Optional Bearer token required by `/api/cron`. |
| `NEXT_PUBLIC_GA_ID` | GA4. |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | PostHog. |
| `GITHUB_PAGES`, `PAGES_BASE_PATH` | Static-export build only. |

---

## 8. Verify the rebuild

- `npm run typecheck` and `npm run build` pass, with 21 routes.
- Every route in section 4 returns 200; `/projects/` redirects to `/work`.
- In both themes, the hero and page headings show the drifting wave at rest and the green reveal on hover.
- ⌘K opens the palette; selecting a project navigates and morphs its title.
- Reduced motion in the OS removes the wave and the animations, and content stays readable.
- At 390 px wide the page doesn't scroll sideways, and the menu dialog opens, closes with Esc, and returns focus.

---

## Appendix A: source files

Generated by `npm run docs:sync`; do not edit by hand. The stylesheet is in `DESIGN.md`.

<!-- source-files:start -->

### `frontend/package.json`

````json
{
  "name": "mohit-gujarati-portfolio",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "lenis": "^1.3.27",
    "motion": "^14.3.0",
    "next": "16.4.2",
    "posthog-js": "^1.434.15",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  },
  "devDependencies": {
    "@types/node": "^22.20.4",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "typescript": "^5.9.3"
  }
}
````

### `frontend/next.config.ts`

````ts
import type { NextConfig } from 'next';

// Vercel runs the full Next.js server, which keeps the /api routes. GitHub Pages only serves static
// files, so its workflow sets GITHUB_PAGES=true for a static export and passes the /<repo> prefix the
// project site is served from.
const staticExport = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.PAGES_BASE_PATH ?? '';

/** Defensive headers for every response. A static host cannot send these, so they apply on Vercel. */
const securityHeaders = [
  // No framing (clickjacking), no plugins, and no <base> or form hijacking. Scripts are left to the page.
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  // HSTS is already sent by Vercel for its domains.
];

const nextConfig: NextConfig = {
  output: staticExport ? 'export' : undefined,
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: staticExport ? 'true' : '',
  },
  ...(staticExport ? {} : { headers: async () => [{ source: '/:path*', headers: securityHeaders }] }),
};

export default nextConfig;
````

### `frontend/tsconfig.json`

````json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "next.config.ts",
    "app/**/*.ts",
    "app/**/*.tsx",
    "components/**/*.ts",
    "components/**/*.tsx",
    "lib/**/*.ts",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", ".design-backup", "out"]
}
````

### `frontend/vercel.json`

````json
{
  "crons": [
    {
      "path": "/api/cron/",
      "schedule": "0 12 * * *"
    }
  ]
}
````

### `frontend/.env.example`

````
# Google Analytics 4 Measurement ID, for example G-XXXXXXXXXX
NEXT_PUBLIC_GA_ID=
# PostHog analytics (both required to enable)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
# Server-only: Slack incoming webhook for visitor click notifications (sent via /api/notify). Never prefix with NEXT_PUBLIC_.
SLACK_WEBHOOK_URL=
# Express API base URL, pinged daily by /api/cron to keep the API and database awake
NEXT_PUBLIC_API_URL=
# Optional: protects /api/cron; Vercel sends it automatically as a Bearer token
CRON_SECRET=
# Optional: canonical origin (defaults to the Vercel production URL)
NEXT_PUBLIC_SITE_URL=
````

### `frontend/app/about/page.tsx`

````tsx
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { awards, capabilities, education, profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/about',
  'About',
  `Meet ${profile.name}, a full-stack software engineer in Phoenix building mobile apps, web platforms and AI products.`,
);

export default function AboutPage() {
  return (
    <main id="main" className="page-shell container">
      <JsonLd data={breadcrumbJsonLd(['About', '/about'])} />
      <PageHeader
        eyebrow="About"
        title="Behind the work."
        intro={<>I&apos;m Mohit Gujarati, a full-stack engineer based in Phoenix and currently at {profile.company}.</>}
      />

      <section className="section-block editorial-grid reveal" aria-labelledby="background-title">
        <h2 id="background-title" className="section-title">
          From Android onward.
        </h2>
        <div>
          <p className="body-copy">
            I started in Android, working with Kotlin, offline data and battery-efficient services. It taught me to
            think beyond the screen: how software handles a slow connection, a busy device, or a long day of use.
          </p>
          <p className="body-copy">
            Today, I bring that perspective to websites, dashboards, back-end APIs and AI voice workflows. I work from
            the interface through to the systems that support it.
          </p>
          <Link className="text-link" href="/experience">
            Explore my experience <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section id="skills" className="section-block editorial-grid reveal" aria-labelledby="capabilities-title">
        <h2 id="capabilities-title" className="section-title">
          What I work with.
        </h2>
        <ul className="text-list">
          {capabilities.map(({ title, body }) => (
            <li key={title}>
              <h3>{title}</h3>
              <p className="body-copy">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="education" className="section-block editorial-grid reveal" aria-labelledby="education-title">
        <h2 id="education-title" className="section-title">
          Education &amp; recognition.
        </h2>
        <div>
          <ul className="text-list">
            {education.map((item) => (
              <li key={item.degree}>
                <p className="meta">{item.dates}</p>
                <h3>{item.degree}</h3>
                <p className="body-copy">
                  {item.school}
                  <br />
                  {item.place}
                </p>
                {item.note && <p className="meta">{item.note}</p>}
              </li>
            ))}
            <li>
              <h3>Recognition &amp; community</h3>
              <ul className="text-list">
                {awards.map((award) => (
                  <li key={award}>{award}</li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
````

### `frontend/app/api/cron/route.ts`

````ts
import { NextResponse } from 'next/server';

/**
 * Daily keep-alive (scheduled in vercel.json): requesting the Express API's projects wakes the Render server,
 * and its query keeps the Supabase project from pausing. Vercel sends `Authorization: Bearer $CRON_SECRET` when
 * CRON_SECRET is set, which stops anyone else from triggering it.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`)
    return NextResponse.json({ success: false }, { status: 401 });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const response = await fetch(`${apiUrl}/api/projects`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`API responded with status ${response.status}`);
    const data = await response.json();
    return NextResponse.json({ success: true, projectsFound: Array.isArray(data) ? data.length : 0 });
  } catch (error) {
    // Details stay in the Vercel logs, not in the public response.
    console.error('Keep-alive failed:', error);
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
````

### `frontend/app/api/notify/route.ts`

````ts
import { NextResponse } from 'next/server';

const MAX_LENGTH = 400;
/** Only the two message formats the site sends (lib/notify.ts and the command palette). */
const SITE_MESSAGE = /^(👀 \*Visitor click\*|🔎 \*Command palette\*) on `\/[^`]{0,120}`: /u;

/**
 * Forwards visitor notifications to Slack. The webhook URL stays in the server-only SLACK_WEBHOOK_URL,
 * so it never reaches the browser and cannot be copied from the page.
 */
export async function POST(request: Request) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return new NextResponse(null, { status: 204 });

  // Browsers always send Origin on POST: accept only requests from this site's own pages.
  const origin = request.headers.get('origin');
  if (!origin || new URL(origin).host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });

  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (typeof text !== 'string' || text.length > MAX_LENGTH || !SITE_MESSAGE.test(text))
    return new NextResponse(null, { status: 400 });

  // Raw < > could form Slack mentions such as <!channel>; the site's own text is already escaped.
  const safe = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: safe }),
  });
  return new NextResponse(null, { status: response.ok ? 204 : 502 });
}
````

### `frontend/app/blog/page.tsx`

````tsx
import Link from 'next/link';
import ExternalLink from '@/components/ExternalLink';
import PageHeader from '@/components/PageHeader';
import { pageMetadata } from '@/lib/metadata';
import { profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/blog',
  'Notes',
  `A space for engineering notes by ${profile.name}. Explore his academic research and code.`,
);

export default function BlogPage() {
  return (
    <main id="main" className="page-shell container">
      <PageHeader
        reveal
        eyebrow="Writing"
        title="Notes."
        intro="A place for ideas from building software, studying systems and working through the details."
      />

      <section className="section-block editorial-grid reveal" aria-labelledby="notes-title">
        <h2 id="notes-title" className="section-title">
          Nothing published yet.
        </h2>
        <div>
          <p className="body-copy">
            There are no articles here yet. In the meantime, my research collection covers machine learning,
            recommendation systems and software architecture. My code lives on GitHub.
          </p>
          <ul className="text-list">
            <li>
              <Link className="text-link" href="/research">
                Read my research <span aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <ExternalLink className="text-link" href={profile.github}>
                Explore GitHub <span aria-hidden="true">↗</span>
              </ExternalLink>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
````

### `frontend/app/contact/page.tsx`

````tsx
import CopyEmail from '@/components/CopyEmail';
import ExternalLink from '@/components/ExternalLink';
import PageHeader from '@/components/PageHeader';
import { pageMetadata } from '@/lib/metadata';
import { asset, profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/contact',
  'Contact',
  'Get in touch with Mohit Gujarati about engineering roles, products, and collaborations.',
);

export default function ContactPage() {
  return (
    <main id="main" className="page-shell contact-page container">
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            It starts with
            <br />
            <span className="muted">a conversation.</span>
          </>
        }
        intro="A product to build, a role to discuss, or an interesting problem. I'd love to hear about it."
      />
      <section className="contact-main reveal" aria-label="Email">
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
          <span aria-hidden="true">↗</span>
        </a>
        <CopyEmail email={profile.email} />
      </section>
      <div className="contact-details section-block reveal">
        <div>
          <h2>Elsewhere</h2>
          <ExternalLink className="text-link" href={profile.github}>
            GitHub <span aria-hidden="true">↗</span>
          </ExternalLink>
          <ExternalLink className="text-link" href={profile.linkedin}>
            LinkedIn <span aria-hidden="true">↗</span>
          </ExternalLink>
        </div>
        <div>
          <h2>Background</h2>
          <ExternalLink className="text-link" href={asset(profile.resume)}>
            Résumé (PDF) <span aria-hidden="true">↗</span>
          </ExternalLink>
          <p className="meta">{profile.location}</p>
        </div>
      </div>
    </main>
  );
}
````

### `frontend/app/experience/page.tsx`

````tsx
import { ViewTransition } from 'react';
import ExternalLink from '@/components/ExternalLink';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import Rich from '@/components/Rich';
import { breadcrumbJsonLd, experiencePageJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { asset, experience, profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/experience',
  'Experience',
  'My work across Android, web platforms and AI products, from Tops Technology to Gabriel AI.',
);

export default function ExperiencePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(['Experience', '/experience'])} />
      <JsonLd data={experiencePageJsonLd()} />
      <main id="main" className="page-shell container">
        <PageHeader
          eyebrow="Experience"
          title={
            <>
              A body of work.
              <br />
              <span className="muted">A work in progress.</span>
            </>
          }
          intro="From Android foundations to full-stack products. Each role has widened the way I think about building software."
        >
          <ExternalLink href={asset(profile.resume)} className="text-link">
            Read my résumé <span aria-hidden="true">↗</span>
          </ExternalLink>
        </PageHeader>
        <div className="career-timeline" id="timeline">
          <div className="timeline-rail" aria-hidden="true">
            <span />
          </div>
          <ol>
            {experience.map((job) => (
              <li className="timeline-job reveal" key={job.hash} id={`role-${job.hash}`}>
                <div className="timeline-date">
                  <span className="timeline-node" aria-hidden="true" />
                  <p>{job.dates}</p>
                  {job.head ? (
                    <span className="current-role">Current role</span>
                  ) : (
                    <span className="meta">{job.stage}</span>
                  )}
                </div>
                <div className="timeline-content">
                  <p className="job-role">{job.role}</p>
                  <ViewTransition name={`job-${job.hash}`} share="morph" default="none">
                    <h2>{job.company}</h2>
                  </ViewTransition>
                  <ul className="job-points">
                    {job.points.map((point) => (
                      <li key={point}>
                        <Rich text={point} />
                      </li>
                    ))}
                  </ul>
                  <p className="job-stack">{job.tags.join(' / ')}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </>
  );
}
````

### `frontend/app/icon.svg`

````svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0c0d10"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-weight="700" font-size="28" fill="#c8f560">MG</text></svg>
````

### `frontend/app/layout.tsx`

````tsx
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
````

### `frontend/app/llms-full.txt/route.ts`

````ts
import { llmsFullTxt } from '@/lib/llms';

export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsFullTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
````

### `frontend/app/llms.txt/route.ts`

````ts
import { llmsTxt } from '@/lib/llms';

export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
````

### `frontend/app/manifest.ts`

````ts
import type { MetadataRoute } from 'next';
import { BASE_PATH, profile } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} | ${profile.role}`,
    short_name: profile.name,
    description: profile.short,
    start_url: `${BASE_PATH}/`,
    display: 'standalone',
    background_color: '#111412',
    theme_color: '#111412',
    icons: [{ src: `${BASE_PATH}/icon.svg`, sizes: 'any', type: 'image/svg+xml' }],
  };
}
````

### `frontend/app/not-found.tsx`

````tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This page could not be found. Return to Mohit Gujarati’s portfolio.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="page-shell container">
      <PageHeader eyebrow="404" title="A wrong turn." intro="This page has moved, or it never existed.">
        <Link className="text-link" href="/">
          Back to the portfolio <span aria-hidden="true">→</span>
        </Link>
      </PageHeader>
    </main>
  );
}
````

### `frontend/app/page.tsx`

````tsx
import Link from 'next/link';
import { ViewTransition } from 'react';
import HeroName from '@/components/HeroName';
import JsonLd from '@/components/JsonLd';
import MagneticLink from '@/components/MagneticLink';
import WorkList from '@/components/WorkList';
import { buildJsonLd } from '@/lib/jsonld';
import { capabilities, experience, profile } from '@/lib/site';

export default function Home() {
  return (
    <>
      <JsonLd data={buildJsonLd()} />
      <main id="main">
        <section className="home-hero container" aria-labelledby="hero-name">
          <div className="hero-meta">
            <p>Full-stack software engineer</p>
            <p>Phoenix, Arizona</p>
          </div>
          <HeroName />
          <div className="hero-bottom">
            <p>
              Mobile. Web. <span>AI.</span>
            </p>
            <MagneticLink href="#projects">Explore selected work</MagneticLink>
          </div>
        </section>

        <section className="home-about container editorial-grid reveal" id="about" aria-labelledby="about-title">
          <h2 className="section-title" id="about-title">
            About.
          </h2>
          <div>
            <p className="body-copy">{profile.summary}</p>
            <Link className="text-link" href="/about">
              More about me <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="home-career container section-block" id="experience" aria-labelledby="career-title">
          <div className="career-heading reveal">
            <h2 className="section-title" id="career-title">
              Experience.
            </h2>
            <p className="career-note">From Android applications to full-stack products and AI.</p>
            <Link href="/experience" className="text-link">
              The full story <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="career-preview">
            {experience.map((job) => (
              <Link key={job.hash} href={`/experience#role-${job.hash}`} className="career-preview-row reveal">
                <span className="meta">{job.dates}</span>
                <ViewTransition name={`job-${job.hash}`} share="morph" default="none">
                  <h3>{job.company}</h3>
                </ViewTransition>
                <p>{job.role}</p>
                <span className="career-row-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-skills container editorial-grid reveal" id="skills" aria-labelledby="skills-title">
          <h2 className="section-title" id="skills-title">
            Skills.
          </h2>
          <ul className="text-list">
            {capabilities.map(({ title, body }) => (
              <li key={title}>
                <h3>{title}</h3>
                <p className="body-copy">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-work container section-block" id="projects" aria-labelledby="work-title">
          <div className="section-title-row reveal">
            <h2 className="section-title" id="work-title">
              Selected work
            </h2>
            <Link href="/work" className="text-link">
              Project index <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <WorkList heading="h3" description="tagline" />
        </section>
      </main>
    </>
  );
}
````

### `frontend/app/profile.json/route.ts`

````ts
import { absolute, awards, education, experience, papers, plain, profile, projects, skills } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const document = {
    schemaVersion: '1.0',
    type: 'professional-profile',
    name: profile.name,
    role: profile.role,
    company: profile.company,
    location: profile.location,
    summary: profile.summary,
    contact: {
      email: profile.email,
      linkedin: profile.linkedin,
      github: profile.github,
      portfolio: absolute('/'),
      resume: absolute(profile.resume),
    },
    skills: Object.fromEntries(skills.map((group) => [group.group, group.items])),
    experience: experience.map((job) => ({
      id: job.hash,
      role: job.role,
      company: job.company,
      startDate: job.start,
      endDate: job.end || null,
      dates: job.dates,
      summary: job.points.map(plain),
      technologies: job.tags,
      url: absolute(`/experience#role-${job.hash}`),
    })),
    projects: projects.map((project) => ({
      slug: project.slug,
      name: project.name,
      category: project.kind,
      dates: project.dates,
      summary: project.pitch,
      details: project.points.map(plain),
      technologies: project.tags,
      url: absolute(`/projects/${project.slug}`),
    })),
    research: papers.map((paper) => ({
      slug: paper.slug,
      title: paper.title,
      type: paper.kind,
      venue: paper.venue,
      year: paper.year,
      coAuthored: Boolean(paper.coAuthored),
      result: paper.result || null,
      abstract: paper.abstract,
      topics: paper.tags,
      page: absolute(`/research#paper-${paper.slug}`),
      pdf: absolute(paper.file),
    })),
    education,
    awards,
    machineReadableSources: {
      summary: absolute('/llms.txt'),
      full: absolute('/llms-full.txt'),
    },
  };

  return new Response(JSON.stringify(document, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
````

### `frontend/app/projects/[slug]/page.tsx`

````tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ViewTransition } from 'react';
import ExternalLink from '@/components/ExternalLink';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import Rich from '@/components/Rich';
import { breadcrumbJsonLd, projectJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { absolute, profile, projects } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

const findProject = async ({ params }: Props) => {
  const { slug } = await params;
  return projects.find((item) => item.slug === slug);
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const project = await findProject(props);
  if (!project) return { title: 'Project not found', robots: { index: false } };
  return pageMetadata(`/projects/${project.slug}`, project.name, project.pitch);
}

export default async function ProjectPage(props: Props) {
  const project = await findProject(props);
  if (!project) notFound();

  // Every other project, starting with the next one and wrapping around.
  const position = projects.indexOf(project);
  const otherProjects = projects.map((_, step) => projects[(position + step) % projects.length]).slice(1);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          ...projectJsonLd(project, { '@type': 'Person', name: profile.name, url: absolute('/') }),
        }}
      />
      <JsonLd data={breadcrumbJsonLd(['Work', '/work'], [project.name, `/projects/${project.slug}`])} />
      <main id="main" className="page-shell container">
        <Link className="text-link" href="/work">
          <span aria-hidden="true">←</span> All work
        </Link>

        <PageHeader
          meta
          eyebrow={
            <>
              {project.kind} · {project.dates}
            </>
          }
          title={<>{project.name}.</>}
          transitionName={`project-${project.slug}`}
          intro={project.pitch}
        />

        <dl className="project-facts reveal">
          <div>
            <dt>Platform</dt>
            <dd>{project.platform}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>{project.dates}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.tags.join(', ')}</dd>
          </div>
        </dl>

        <article className="case-content">
          <section className="editorial-grid section-block reveal">
            <h2 className="section-title">What I built.</h2>
            <div className="body-copy">
              {project.points.map((point) => (
                <p key={point}>
                  <Rich text={point} />
                </p>
              ))}
            </div>
          </section>

          <section className="editorial-grid section-block reveal">
            <h2 className="section-title">Technical decisions.</h2>
            <div className="body-copy">
              {project.decisions.map((decision) => (
                <p key={decision}>{decision}</p>
              ))}
              <ExternalLink className="text-link" href={project.repository}>
                View source <span aria-hidden="true">↗</span>
              </ExternalLink>
            </div>
          </section>
        </article>

        <nav aria-label="More projects">
          {otherProjects.map((other, index) => (
            <Link className="next-project reveal" href={`/projects/${other.slug}`} key={other.slug}>
              <div>
                <p className="meta">{index === 0 ? 'Next project' : 'Also see'}</p>
                <ViewTransition name={`project-${other.slug}`} share="morph" default="none">
                  <h2>{other.name}</h2>
                </ViewTransition>
              </div>
              <span className="work-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </>
  );
}
````

### `frontend/app/projects/page.tsx`

````tsx
import { redirect } from 'next/navigation';

export default function ProjectsPage() {
  redirect('/work');
}
````

### `frontend/app/research/page.tsx`

````tsx
import ExternalLink from '@/components/ExternalLink';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import { breadcrumbJsonLd, researchPageJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { asset, papers, profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/research',
  'Research',
  `Academic projects, literature surveys and technical reviews by ${profile.name}, exploring machine learning and distributed systems at LIU Brooklyn.`,
);

export default function ResearchPage() {
  return (
    <main id="main" className="page-shell container">
      <JsonLd data={breadcrumbJsonLd(['Research', '/research'])} />
      <JsonLd data={researchPageJsonLd()} />

      <PageHeader
        eyebrow="Research"
        title="A closer look."
        intro="Academic work exploring how intelligent systems learn, recommend and scale. Written during my master's at LIU Brooklyn."
      />

      <section className="section-block" aria-label="Papers and technical reviews">
        <div className="paper-list">
          {papers.map((paper) => (
            <details className="paper-entry reveal" id={`paper-${paper.slug}`} key={paper.slug}>
              <summary>
                <span className="meta">
                  {paper.year} · {paper.kind === 'ieee' ? 'Course project' : paper.badge}
                </span>
                <h2>{paper.shortTitle}</h2>
                <span className="disclosure-mark" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="paper-body">
                <h3 className="paper-full-title">{paper.title}</h3>
                <p className="meta">
                  {paper.venue}
                  {paper.coAuthored ? ' · Co-authored' : ''}
                </p>
                <p className="body-copy">{paper.abstract}</p>
                {paper.note && <p className="body-copy">{paper.note}</p>}
                <p className="meta">{paper.tags.join(' / ')}</p>
                <ExternalLink className="text-link" href={asset(paper.file)}>
                  Read the paper <span className="meta">PDF</span> <span aria-hidden="true">↗</span>
                </ExternalLink>
              </div>
            </details>
          ))}
        </div>
        <p className="body-copy reveal">
          These are course projects, surveys and reviews. Papers in IEEE format follow its document style; they are not
          presented as IEEE publications.
        </p>
      </section>
    </main>
  );
}
````

### `frontend/app/robots.ts`

````ts
import type { MetadataRoute } from 'next';
import { absolute } from '@/lib/site';

export const dynamic = 'force-static';

// AI crawlers and AI search/answer engines, explicitly welcomed so this
// profile can be cited when someone asks an assistant about Mohit.
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'DuckAssistBot',
  'Amazonbot',
  'Meta-ExternalAgent',
  'MistralAI-User',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_AGENTS, allow: '/' },
    ],
    sitemap: absolute('/sitemap.xml'),
  };
}
````

### `frontend/app/sitemap.ts`

````ts
import type { MetadataRoute } from 'next';
import { absolute, papers, profile, projects } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absolute('/'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...['work', 'about', 'experience', 'research', 'contact', 'blog'].map((path) => ({
      url: absolute(`/${path}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...projects.map((p) => ({
      url: absolute(`/projects/${p.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: absolute('/profile.json'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: absolute(profile.resume), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...papers.map((p) => ({ url: absolute(p.file), changeFrequency: 'yearly' as const, priority: 0.6 })),
  ];
}
````

### `frontend/app/template.tsx`

````tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
````

### `frontend/app/work/page.tsx`

````tsx
import ExternalLink from '@/components/ExternalLink';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import WorkList from '@/components/WorkList';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { profile } from '@/lib/site';

export const metadata = pageMetadata(
  '/work',
  'Selected work',
  `Mobile, web, and AI projects by ${profile.name}. Explore the implementation behind Shop Circle, Recall AI, and Lummina.`,
);

export default function WorkPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(['Work', '/work'])} />
      <main id="main" className="page-shell container">
        <PageHeader
          eyebrow="Work"
          title="Selected work."
          intro="Three projects across mobile, web, and AI. Each built from the interface to the data beneath it."
        />
        <WorkList heading="h2" description="summary" />
        <div className="section-block reveal">
          <ExternalLink className="text-link" href={profile.github}>
            More on GitHub <span aria-hidden="true">↗</span>
          </ExternalLink>
        </div>
      </main>
    </>
  );
}
````

### `frontend/components/ClickNotifier.tsx`

````tsx
'use client';

import { useEffect } from 'react';
import { describeClick, notifySlack } from '@/lib/notify';

/** Repeated clicks on the same control within this window send one message. */
const REPEAT_MS = 5000;

/** Sends a Slack message for each click on a link, button or expandable section. */
export default function ClickNotifier() {
  useEffect(() => {
    let last = { message: '', time: 0 };
    const onClick = (event: MouseEvent) => {
      const element = (event.target as Element | null)?.closest('a, button, summary');
      if (!element) return;
      const message = describeClick(element, window.location.pathname);
      const now = Date.now();
      if (message === last.message && now - last.time < REPEAT_MS) return;
      last = { message, time: now };
      notifySlack(message);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
````

### `frontend/components/CommandPalette.tsx`

````tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import PixelField from '@/components/PixelField';
import { notifySlack, slackText } from '@/lib/notify';
import { onPaletteOpen, usePaletteShortcut } from '@/lib/palette';
import { navigateTo } from '@/lib/scroll';
import { asset, experience, pages, papers, profile, projects } from '@/lib/site';
import { getTheme, setTheme } from '@/lib/theme';

type Command = { id: string; group: string; title: string; hint: string; keywords?: string; run: () => void };

const openTab = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

/** Research entries are collapsed; open the chosen one once it is on the page. */
function revealPaper(slug: string) {
  const started = performance.now();
  const tick = () => {
    const entry = document.getElementById(`paper-${slug}`);
    if (entry instanceof HTMLDetailsElement) entry.open = true;
    else if (performance.now() - started < 2000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Rank by title prefix, then title, then any other text; an empty query keeps the natural order. */
function search(commands: Command[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return commands;
  return commands
    .map((command) => {
      const title = command.title.toLowerCase();
      const rest = `${command.hint} ${command.keywords ?? ''} ${command.group}`.toLowerCase();
      return { command, score: title.startsWith(q) ? 3 : title.includes(q) ? 2 : rest.includes(q) ? 1 : 0 };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.command);
}

/** ⌘K / Ctrl+K / "/" command palette for jumping anywhere on the site. */
export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const shortcut = usePaletteShortcut();
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState('');

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => navigateTo(href, router.push);
    return [
      ...[...pages, ['/blog', 'Notes'] as const].map(([href, title]) => ({
        id: `page:${href}`,
        group: 'Page',
        title,
        hint: href,
        run: go(href),
      })),
      ...projects.map((project) => ({
        id: `project:${project.slug}`,
        group: 'Project',
        title: project.name,
        hint: project.kind,
        keywords: `${project.tags.join(' ')} ${project.summary}`,
        run: go(`/projects/${project.slug}`),
      })),
      ...experience.map((job) => ({
        id: `job:${job.hash}`,
        group: 'Experience',
        title: job.company,
        hint: `${job.role} · ${job.dates}`,
        keywords: job.tags.join(' '),
        run: go(`/experience#role-${job.hash}`),
      })),
      ...papers.map((paper) => ({
        id: `paper:${paper.slug}`,
        group: 'Research',
        title: paper.shortTitle,
        hint: `${paper.year} · ${paper.badge}`,
        keywords: `${paper.title} ${paper.tags.join(' ')}`,
        run: () => {
          navigateTo(`/research#paper-${paper.slug}`, router.push);
          revealPaper(paper.slug);
        },
      })),
      {
        id: 'copy-email',
        group: 'Action',
        title: 'Copy email',
        hint: profile.email,
        run: () => void navigator.clipboard?.writeText(profile.email).catch(() => {}),
      },
      {
        id: 'email',
        group: 'Action',
        title: 'Write an email',
        hint: profile.email,
        run: () => window.location.assign(`mailto:${profile.email}`),
      },
      {
        id: 'resume',
        group: 'Action',
        title: 'Open résumé',
        hint: 'PDF',
        keywords: 'resume cv',
        run: () => openTab(asset(profile.resume)),
      },
      {
        id: 'theme',
        group: 'Action',
        title: 'Switch theme',
        hint: 'Light / dark',
        keywords: 'mode color',
        run: () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'),
      },
      {
        id: 'github',
        group: 'Link',
        title: 'GitHub',
        hint: profile.github.replace('https://', ''),
        run: () => openTab(profile.github),
      },
      {
        id: 'linkedin',
        group: 'Link',
        title: 'LinkedIn',
        hint: profile.linkedin.replace('https://www.', ''),
        run: () => openTab(profile.linkedin),
      },
    ];
  }, [router]);

  const results = useMemo(() => search(commands, query), [commands, query]);
  const current = results[Math.min(active, results.length - 1)];

  // Keyboard shortcuts open the palette from anywhere, except while typing in a field.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]');
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    const offOpen = onPaletteOpen(() => setOpen(true));
    return () => {
      window.removeEventListener('keydown', onKey);
      offOpen();
    };
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      setQuery('');
      setActive(0);
      setStatus('');
      element.showModal();
    } else if (!open && element.open) element.close();
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, query]);

  function select(command: Command | undefined) {
    if (!command) return;
    notifySlack(
      `🔎 *Command palette* on \`${pathname}\`: "${slackText(command.title)}" (${command.group.toLowerCase()})`,
    );
    if (command.id === 'copy-email') {
      command.run();
      setStatus('Email copied to clipboard');
      window.setTimeout(() => setOpen(false), 700);
      return;
    }
    setOpen(false);
    command.run();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const count = results.length;
    if (!count) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((value) => (Math.min(value, count - 1) + step + count) % count);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setActive(event.key === 'Home' ? 0 : count - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      select(current);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="palette"
      data-lenis-prevent
      aria-label="Search the site"
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      {open && (
        <div className="palette-panel">
          <div className="palette-search">
            <PixelField />
            <span className="palette-prompt" aria-hidden="true">
              ⌕
            </span>
            <input
              autoFocus
              className="palette-input"
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-results"
              aria-activedescendant={current ? `palette-${current.id}` : undefined}
              aria-autocomplete="list"
              placeholder="Search projects, experience, research…"
              spellCheck={false}
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
            <kbd className="palette-esc">esc</kbd>
          </div>

          {results.length ? (
            <ul className="palette-list" id="palette-results" role="listbox" aria-label="Results" ref={list}>
              {results.map((command) => (
                <li
                  key={command.id}
                  id={`palette-${command.id}`}
                  className="palette-option"
                  role="option"
                  aria-selected={command === current}
                  onPointerMove={() => setActive(results.indexOf(command))}
                  onClick={() => select(command)}
                >
                  <span className="palette-title">{command.title}</span>
                  <span className="palette-hint">{command.hint}</span>
                  <span className="palette-group">{command.group}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="palette-empty">No results for “{query.trim()}”.</p>
          )}

          <div className="palette-footer" aria-live="polite">
            {status ? (
              <span className="palette-status">✓ {status}</span>
            ) : (
              <span>
                <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>↵</kbd> to open
              </span>
            )}
            <span>
              <kbd>{shortcut}</kbd> anywhere
            </span>
          </div>
        </div>
      )}
    </dialog>
  );
}
````

### `frontend/components/CopyEmail.tsx`

````tsx
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
````

### `frontend/components/ExternalLink.tsx`

````tsx
import type { ReactNode } from 'react';

/** Opens an off-site page in a new tab without exposing window.opener. */
export default function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
````

### `frontend/components/GoogleAnalytics.tsx`

````tsx
import Script from 'next/script';

const measurementId = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  if (!measurementId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
````

### `frontend/components/HeroName.tsx`

````tsx
import PixelField from '@/components/PixelField';

/** The name stays readable and selectable above the pointer-lit pixel field. */
export default function HeroName() {
  return (
    <div className="hero-heading-row">
      <PixelField />
      <h1 className="hero-name" id="hero-name" aria-label="Mohit Gujarati">
        <span className="name-line">
          <span>Mohit</span>
        </span>{' '}
        <span className="name-line">
          <span>
            Gujarati<span className="name-period">.</span>
          </span>
        </span>
      </h1>
    </div>
  );
}
````

### `frontend/components/JsonLd.tsx`

````tsx
import { serializeJsonLd } from '@/lib/jsonld';

/** Inline schema.org structured data for search engines and AI crawlers. */
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
````

### `frontend/components/MagneticLink.tsx`

````tsx
'use client';

import Link from 'next/link';
import { useMotionValue, useReducedMotion, useSpring, motion } from 'motion/react';
import type { PointerEvent } from 'react';

/** The hit area stays fixed while the small arrow responds to a precise pointer. */
export default function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 230, damping: 24, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 230, damping: 24, mass: 0.35 });
  function move(event: PointerEvent<HTMLSpanElement>) {
    if (reduced || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - bounds.left - bounds.width / 2) * 0.15);
    rawY.set((event.clientY - bounds.top - bounds.height / 2) * 0.15);
  }
  function reset() {
    rawX.set(0);
    rawY.set(0);
  }
  return (
    <Link href={href} className="hero-work-link">
      <span>{children}</span>
      <span className="magnetic-target" onPointerMove={move} onPointerLeave={reset}>
        <motion.span className="circle-arrow" style={reduced ? undefined : { x, y }} aria-hidden="true">
          <span>↗</span>
        </motion.span>
      </span>
    </Link>
  );
}
````

### `frontend/components/Nav.tsx`

````tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import ExternalLink from '@/components/ExternalLink';
import { openPalette, usePaletteShortcut } from '@/lib/palette';
import { pages, profile } from '@/lib/site';
import { getTheme, setTheme } from '@/lib/theme';
import { motion, useReducedMotion } from 'motion/react';

export default function Nav() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const shortcut = usePaletteShortcut();
  const selected = pages
    .slice(1, 5)
    .find(([href]) => pathname.startsWith(href) || (href === '/work' && pathname.startsWith('/projects')))?.[0];
  const active = hovered ?? selected;
  const closing = useRef<Animation | null>(null);
  const closeMenu = () => {
    const element = dialog.current;
    if (!element?.open || closing.current) return;
    if (reduced) {
      element.close();
      setOpen(false);
      return;
    }
    const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 160,
      easing: 'ease-out',
      fill: 'forwards',
    });
    closing.current = animation;
    void animation.finished
      .then(() => {
        element.close();
        animation.cancel();
        closing.current = null;
        setOpen(false);
      })
      .catch(() => {
        closing.current = null;
      });
  };

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(
    () => () => {
      closing.current?.cancel();
    },
    [],
  );

  return (
    <>
      {/* Named so page transitions leave the header in place while content changes beneath it. */}
      <header className="site-header" style={{ viewTransitionName: 'site-header' }}>
        <div className="header-inner container">
          <Link href="/" className="wordmark" aria-label={`${profile.name}, home`}>
            mohit<span className="wordmark-dot">.</span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation" onPointerLeave={() => setHovered(null)}>
            {pages.slice(1, 5).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onPointerEnter={() => setHovered(href)}
                onFocus={() => setHovered(href)}
                onBlur={() => setHovered(null)}
                onClick={() => setHovered(null)}
                aria-current={selected === href ? 'page' : undefined}
              >
                {label}
                {active === href && (
                  <motion.span
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="header-contact" href="/contact">
              Let&apos;s talk <span aria-hidden="true">↗</span>
            </Link>
            <button className="palette-trigger" type="button" aria-haspopup="dialog" onClick={openPalette}>
              Search <kbd>{shortcut}</kbd>
            </button>
            <button
              className="theme-toggle"
              onClick={() => setTheme(getTheme() === 'dark' ? 'light' : 'dark')}
              type="button"
              aria-label="Switch color theme"
            >
              <span aria-hidden="true" />
            </button>
            <button
              ref={trigger}
              className="menu-toggle"
              type="button"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => {
                dialog.current?.showModal();
                setOpen(true);
              }}
            >
              <span>Menu</span>
              <span className="menu-bars" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="site-menu"
        className="menu-dialog"
        data-lenis-prevent
        aria-label="Site navigation"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      >
        <div className="menu-top container">
          <Link href="/" className="wordmark" onClick={closeMenu}>
            mohit.
          </Link>
          <button autoFocus className="menu-close" type="button" onClick={closeMenu}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="menu-links container" aria-label="All pages">
          {pages.map(([href, label], index) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              style={{ '--order': index } as CSSProperties}
              aria-current={
                pathname.replace(/\/$/, '') === href.replace(/\/$/, '') ||
                (href === '/work' && pathname.startsWith('/projects'))
                  ? 'page'
                  : undefined
              }
            >
              {label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <div className="menu-bottom container">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <ExternalLink href={profile.github}>GitHub ↗</ExternalLink>
        </div>
      </dialog>
    </>
  );
}
````

### `frontend/components/PageEffects.tsx`

````tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Progressive enhancement: content stays readable without JavaScript. */
export default function PageEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || reduce.matches) return;
          animations.push(
            (entry.target as HTMLElement).animate(
              [
                { opacity: 0, transform: 'translateY(14px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
            ),
          );
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    );
    document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
      // Above-the-fold content already has the route entrance; never restart it.
      if (el.getBoundingClientRect().top >= window.innerHeight) observer.observe(el);
    });
    const onReduced = () => {
      if (reduce.matches) {
        observer.disconnect();
        animations.forEach((animation) => animation.finish());
      }
    };
    reduce.addEventListener('change', onReduced);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      reduce.removeEventListener('change', onReduced);
    };
  }, [pathname]);
  return null;
}
````

### `frontend/components/PageHeader.tsx`

````tsx
import { ViewTransition, type ReactNode } from 'react';
import PixelField from '@/components/PixelField';

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** Use the smaller meta style for the eyebrow, as on case studies. */
  meta?: boolean;
  reveal?: boolean;
  /** Morph the title from the element with the same transition name on the previous page. */
  transitionName?: string;
  children?: ReactNode;
};

/** The heading block shared by every secondary page, over the same pixel field as the home hero. */
export default function PageHeader({ eyebrow, title, intro, meta, reveal, transitionName, children }: Props) {
  const heading = <h1 className="display-title">{title}</h1>;
  return (
    <header className={reveal ? 'page-heading reveal' : 'page-heading'}>
      <PixelField />
      <p className={meta ? 'meta' : 'eyebrow'}>{eyebrow}</p>
      {transitionName ? (
        <ViewTransition name={transitionName} share="morph" default="none">
          {heading}
        </ViewTransition>
      ) : (
        heading
      )}
      {intro && <p className="page-intro">{intro}</p>}
      {children}
    </header>
  );
}
````

### `frontend/components/PixelField.tsx`

````tsx
'use client';

import { useEffect, useRef } from 'react';

type Cell = { x: number; y: number; seed: number; energy: number };

const STEP = 15;
const SIZE = 11;
/** The idle wave is ambient, so it renders at a lower frame rate than the pointer reveal. */
const IDLE_FPS = 30;
/** Seconds for the wave's hue to travel the colour wheel, starting at red. */
const HUE_CYCLE = 90;

/**
 * A pixel field drawn in code: no image, texture or WebGL. At rest a faint wave of muted
 * colour drifts across it; under the pointer it gives way to the green reveal.
 */
export default function PixelField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !host || !context) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let cells: Cell[] = [];
    let frame: number | null = null;
    let previousTime = 0;
    let startTime = 0;
    let onScreen = true;
    let pointer = { x: -1000, y: -1000, active: false };
    let light = false;
    // Strength of the idle wave: fades out while the pointer is over the field.
    let idle = 0;

    const readTheme = () => {
      light = getComputedStyle(document.documentElement).colorScheme === 'light';
      start();
    };

    function draw(time: number) {
      frame = null;
      if (!onScreen) {
        previousTime = 0;
        return;
      }
      if (!pointer.active && previousTime && time - previousTime < 1000 / IDLE_FPS) {
        frame = requestAnimationFrame(draw);
        return;
      }
      if (!startTime) startTime = time;
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      const rise = 1 - Math.exp(-elapsed / 60);
      const fall = 1 - Math.exp(-elapsed / 240);
      const radius = width < 768 ? 120 : 215;
      let changing = false;

      const idleTarget = pointer.active || motion.matches ? 0 : 1;
      idle += (idleTarget - idle) * (1 - Math.exp(-elapsed / (idleTarget ? 900 : 180)));
      if (Math.abs(idleTarget - idle) < 0.002) idle = idleTarget;
      const waving = idle > 0;
      const seconds = (time - startTime) / 1000;
      const hue = ((seconds / HUE_CYCLE) * 360) % 360;
      const waveColor = light ? `hsl(${hue} 38% 44%)` : `hsl(${hue} 42% 56%)`;
      // Accents inside the field (the period after the name) follow the wave; hovering restores the theme accent.
      if (idle > 0.5) host!.style.setProperty('--wave-color', light ? `hsl(${hue} 42% 40%)` : `hsl(${hue} 48% 64%)`);
      else host!.style.removeProperty('--wave-color');

      context!.clearRect(0, 0, width, height);

      for (const cell of cells) {
        const distance = Math.hypot(cell.x - pointer.x, cell.y - pointer.y);
        const proximity = pointer.active ? Math.max(0, 1 - distance / radius) : 0;
        const target = proximity * proximity;
        const difference = target - cell.energy;
        cell.energy = motion.matches ? target : cell.energy + difference * (difference > 0 ? rise : fall);
        if (Math.abs(target - cell.energy) > 0.002) changing = true;
        else cell.energy = target;

        // Two slow, crossing sine waves; only their crests light up, so the field stays sparse.
        let wave = 0;
        if (waving) {
          const swell =
            Math.sin(cell.x * 0.011 + cell.y * 0.006 - seconds * 0.55) * 0.6 +
            Math.sin(cell.x * 0.004 - cell.y * 0.009 + seconds * 0.35) * 0.4;
          const crest = Math.max(0, swell - 0.2) / 0.8;
          wave = crest * crest * (0.35 + cell.seed * 0.65) * idle * (1 - cell.energy);
        }
        if (cell.energy < 0.003 && wave < 0.004) continue;

        const edge = Math.max(0, Math.min(1, cell.x / 48, (width - cell.x) / 48, cell.y / 36, (height - cell.y) / 36));
        context!.beginPath();
        context!.roundRect(cell.x - SIZE / 2, cell.y - SIZE / 2, SIZE, SIZE, 2);

        if (wave >= 0.004) {
          context!.globalAlpha = wave * edge * (light ? 0.45 : 0.55);
          context!.fillStyle = waveColor;
          context!.fill();
        }
        if (cell.energy >= 0.003) {
          // Stable varied cells reproduce the small, irregular lights in the reference.
          const bright = cell.seed > 0.79;
          const strength = (0.2 + cell.seed * 0.8) * cell.energy * edge;
          context!.globalAlpha = strength * (light ? 0.8 : 1);
          context!.fillStyle = light
            ? bright
              ? '#397538'
              : '#6d9465'
            : bright
              ? '#b4ed8b'
              : cell.seed > 0.37
                ? '#679d53'
                : '#354b3b';
          context!.fill();
        }
      }
      context!.globalAlpha = 1;
      // The wave keeps the loop alive at rest; otherwise frames stop once the reveal settles.
      if ((changing || waving || idle !== idleTarget) && !motion.matches) frame = requestAnimationFrame(draw);
      else previousTime = 0;
    }

    function start() {
      if (frame === null && !document.hidden && onScreen) frame = requestAnimationFrame(draw);
    }

    function resize() {
      const bounds = host!.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      cells = [];
      const columns = Math.ceil(width / STEP);
      const rows = Math.ceil(height / STEP);
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const hash = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
          cells.push({
            x: column * STEP + STEP / 2,
            y: row * STEP + STEP / 2,
            seed: hash - Math.floor(hash),
            energy: 0,
          });
        }
      }
      start();
    }

    function move(event: PointerEvent) {
      const bounds = host!.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
      start();
    }

    function leave() {
      pointer.active = false;
      start();
    }
    function release(event: PointerEvent) {
      if (event.pointerType !== 'mouse') leave();
    }
    function visibility() {
      if (document.hidden) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        previousTime = 0;
        pointer.active = false;
      } else start();
    }

    const resizeObserver = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(readTheme);
    // Pause the continuous wave while the field is scrolled out of view.
    const viewObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      start();
    });
    resizeObserver.observe(host);
    viewObserver.observe(host);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerdown', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    host.addEventListener('pointerup', release);
    host.addEventListener('pointercancel', leave);
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', start);
    readTheme();
    resize();

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      host.style.removeProperty('--wave-color');
      resizeObserver.disconnect();
      viewObserver.disconnect();
      themeObserver.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerdown', move);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointerup', release);
      host.removeEventListener('pointercancel', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={ref} className="pixel-field" aria-hidden="true" />;
}
````

### `frontend/components/PostHogProvider.tsx`

````tsx
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
````

### `frontend/components/Rich.tsx`

````tsx
/** Render a content string, turning **bold** markers into <strong>. */
export default function Rich({ text }: { text: string }) {
  return <>{text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}</>;
}
````

### `frontend/components/SiteFooter.tsx`

````tsx
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
````

### `frontend/components/SmoothScroll.tsx`

````tsx
'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { registerLenis, resetScroll, samePageTarget, scrollToElement } from '@/lib/scroll';

/**
 * Momentum scrolling (Lenis) for wheel and trackpad, plus gliding navigation: links to a section on the same
 * page glide there, and arriving on a new page at a #section starts at the top and glides down to it.
 * Touch keeps native scrolling, and Lenis turns smoothing off under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, stopInertiaOnNavigate: true });
    registerLenis(lenis);

    // Runs before React's own click handling (document capture), so Next's Link does not jump first.
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element | null)?.closest('a[href*="#"]');
      if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return;
      const target = samePageTarget(link.href);
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      window.history.pushState(window.history.state, '', link.hash);
      scrollToElement(target);
    };
    document.addEventListener('click', onClick, { capture: true });

    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Leave the browser's restored position alone on the first load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    resetScroll();
    if (target) requestAnimationFrame(() => scrollToElement(target));
  }, [pathname]);

  return null;
}
````

### `frontend/components/WorkList.tsx`

````tsx
import Link from 'next/link';
import { ViewTransition } from 'react';
import { projects } from '@/lib/site';

type Props = {
  /** Heading level for project names, so the list nests under the page outline. */
  heading: 'h2' | 'h3';
  description: 'tagline' | 'summary';
};

/** Numbered project rows linking to each case study. */
export default function WorkList({ heading: Heading, description }: Props) {
  return (
    <div className="work-list">
      {projects.map((project, index) => (
        <Link className="work-row reveal" key={project.slug} href={`/projects/${project.slug}`}>
          <span className="work-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="work-info">
            <p className="meta">{project.kind}</p>
            <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
              <Heading>{project.name}</Heading>
            </ViewTransition>
            <p className="work-description">{project[description]}</p>
          </div>
          <span className="work-action">
            <span className="work-action-label">View project</span>
            <span className="work-arrow" aria-hidden="true">
              ↗
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
````

### `frontend/lib/jsonld.ts`

````ts
// schema.org structured data (JSON-LD) for search engines and AI crawlers.
import {
  absolute,
  awards,
  education,
  experience,
  papers,
  plain,
  profile,
  projects,
  skills,
  type Project,
} from './site';

/** A project as a schema.org CreativeWork, credited to `creator`. */
export const projectJsonLd = (p: Project, creator: object) => ({
  '@type': 'CreativeWork',
  '@id': absolute(`/projects/${p.slug}`),
  name: p.name,
  genre: p.kind,
  description: `${p.pitch} ${p.points.map(plain).join(' ')}`,
  keywords: p.tags.join(', '),
  creator,
  url: absolute(`/projects/${p.slug}`),
});

export function buildJsonLd() {
  const personId = absolute('/#person');
  const siteId = absolute('/#website');
  const liu = { '@type': 'CollegeOrUniversity', name: 'Long Island University', address: 'Brooklyn, NY' };
  const svit = {
    '@type': 'CollegeOrUniversity',
    name: 'Shankersinh Vaghela Institute of Technology',
    address: 'Gujarat, India',
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': siteId,
        url: absolute('/'),
        name: profile.name,
        description: profile.short,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': absolute('/#profilepage'),
        url: absolute('/'),
        name: `${profile.name} | ${profile.role}`,
        isPartOf: { '@id': siteId },
        mainEntity: { '@id': personId },
        dateModified: new Date().toISOString(),
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: profile.name,
        givenName: 'Mohit',
        familyName: 'Gujarati',
        jobTitle: profile.role,
        description: profile.summary,
        url: absolute('/'),
        email: `mailto:${profile.email}`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'professional inquiries',
          email: profile.email,
          url: absolute('/contact'),
        },
        address: { '@type': 'PostalAddress', addressLocality: 'Phoenix', addressRegion: 'AZ', addressCountry: 'US' },
        worksFor: { '@type': 'Organization', name: profile.company },
        alumniOf: [liu, svit],
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'degree',
            name: education[0].degree,
            recognizedBy: liu,
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'degree',
            name: education[1].degree,
            recognizedBy: svit,
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'certificate',
            name: 'Kotlin Professional Certificate',
            recognizedBy: { '@type': 'Organization', name: 'JetBrains' },
          },
        ],
        award: awards,
        hasOccupation: {
          '@type': 'Occupation',
          name: profile.role,
          occupationLocation: { '@type': 'City', name: 'Phoenix, AZ' },
          skills: skills.flatMap((s) => s.items).join(', '),
        },
        knowsAbout: [
          'Full-stack web development',
          'Android development',
          'Mobile app development',
          'Artificial intelligence',
          'Large language models',
          'Search engine optimization',
          ...skills.flatMap((s) => s.items),
        ],
        sameAs: [profile.github, profile.linkedin],
      },
      ...experience.map((j) => ({
        '@type': 'OrganizationRole',
        '@id': absolute(`/experience#role-${j.hash}`),
        roleName: j.role,
        startDate: j.start,
        ...(j.end ? { endDate: j.end } : {}),
        description: j.points.map(plain).join(' '),
        memberOf: { '@id': personId },
        member: { '@type': 'Organization', name: j.company },
      })),
      ...projects.map((p) => projectJsonLd(p, { '@id': personId })),
      ...papers.map((p) => ({
        '@type': 'CreativeWork',
        '@id': absolute(`/research#paper-${p.slug}`),
        headline: p.title.length > 110 ? `${p.title.slice(0, 107)}…` : p.title,
        name: p.title,
        abstract: p.abstract,
        author: { '@id': personId },
        genre: p.kind === 'ieee' ? 'Academic course project (IEEE document format)' : p.badge,
        temporalCoverage: p.year,
        keywords: p.tags.join(', '),
        inLanguage: 'en',
        isAccessibleForFree: true,
        encodingFormat: 'application/pdf',
        url: absolute(p.file),
        sourceOrganization: liu,
      })),
    ],
  };
}

/** Serialize safely for an inline <script> tag. */
export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

/** BreadcrumbList from Home through each [name, path] step. */
export function breadcrumbJsonLd(...trail: [name: string, path: string][]) {
  const steps: [string, string][] = [['Home', '/'], ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: steps.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absolute(path),
    })),
  };
}

function collectionPageJsonLd(
  path: string,
  label: string,
  description: string,
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': absolute(path),
    url: absolute(path),
    name: `${profile.name} | ${label}`,
    description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absolute(item.path),
      })),
    },
  };
}

export const experiencePageJsonLd = () =>
  collectionPageJsonLd(
    '/experience',
    'Experience',
    `Professional experience of ${profile.name}.`,
    experience.map((job) => ({ name: `${job.role} at ${job.company}`, path: `/experience#role-${job.hash}` })),
  );

export const researchPageJsonLd = () =>
  collectionPageJsonLd(
    '/research',
    'Research',
    `Research papers and technical reviews by ${profile.name}.`,
    papers.map((paper) => ({ name: paper.title, path: `/research#paper-${paper.slug}` })),
  );
````

### `frontend/lib/llms.ts`

````ts
// Plain-text / Markdown versions of the portfolio for LLMs and AI search
// (https://llmstxt.org). Generated at build time from lib/site.ts.
import { absolute, awards, education, experience, papers, plain, profile, projects, skills } from './site';

const facts = () => [
  `- Name: ${profile.name}`,
  `- Role: ${profile.role} at ${profile.company}`,
  `- Location: ${profile.location}, USA`,
  `- Experience: 3+ years of professional software engineering across Android, web and AI`,
  `- Education: ${education.map((e) => `${e.degree}, ${e.school} (${e.dates}${e.note ? `, ${e.note}` : ''}${e.description ? `; ${e.description}` : ''})`).join(' | ')}`,
  `- Core stack: Kotlin, Jetpack Compose, React Native, React, Next.js, TypeScript, PostgreSQL/Supabase, Firebase, Gemini API`,
  `- Open to: full-stack, mobile and AI engineering roles`,
  `- Contact: ${profile.email} · ${profile.linkedin} · ${profile.github}`,
];

export function llmsTxt() {
  return [
    `# ${profile.name}`,
    '',
    `> ${profile.summary}`,
    '',
    ...facts(),
    '',
    '## Profile',
    '',
    `- [Portfolio](${absolute('/')}): experience, projects, research papers, skills and contact details`,
    `- [Structured profile JSON](${absolute('/profile.json')}): complete machine-readable profile`,
    `- [About](${absolute('/about')}): profile, skills, education, awards and contact details`,
    `- [Experience](${absolute('/experience')}): detailed professional work history`,
    `- [Research](${absolute('/research')}): papers, abstracts and PDF links`,
    `- [Full profile in Markdown](${absolute('/llms-full.txt')}): everything on the portfolio as plain text, for AI assistants`,
    `- [Resume (PDF)](${absolute(profile.resume)}): one-page resume`,
    `- [GitHub](${profile.github}): source code and side projects`,
    `- [LinkedIn](${profile.linkedin}): professional profile`,
    '',
    '## Experience',
    '',
    ...experience.map((j) => `- ${j.role}, ${j.company} (${j.dates}): ${plain(j.points[0])}`),
    '',
    '## Projects',
    '',
    ...projects.map(
      (p) => `- [${p.name}](${absolute(`/projects/${p.slug}`)}): ${p.pitch} Stack: ${p.tags.join(', ')}.`,
    ),
    '',
    '## Research',
    '',
    ...papers.map(
      (p) =>
        `- [${p.title}](${absolute(p.file)}): ${p.badge}, ${p.venue}, ${p.year}.${p.result ? ` ${p.result.value} ${p.result.label}.` : ''}`,
    ),
    '',
  ].join('\n');
}

export function llmsFullTxt() {
  return [
    `# ${profile.name}: ${profile.role}`,
    '',
    `> ${profile.summary}`,
    '',
    ...facts(),
    `- Portfolio: ${absolute('/')}`,
    `- Structured profile JSON: ${absolute('/profile.json')}`,
    `- About: ${absolute('/about')}`,
    `- Experience: ${absolute('/experience')}`,
    `- Research: ${absolute('/research')}`,
    `- Resume: ${absolute(profile.resume)}`,
    '',
    '## Contact',
    '',
    `- Email: ${profile.email}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- GitHub: ${profile.github}`,
    '',
    '## Experience',
    '',
    ...experience.flatMap((j) => [
      `### ${j.role}, ${j.company}`,
      '',
      `${j.dates}`,
      '',
      ...j.points.map((p) => `- ${plain(p)}`),
      '',
      `Technologies: ${j.tags.join(', ')}`,
      '',
    ]),
    '## Education',
    '',
    ...education.map(
      (e) =>
        `- ${e.degree}, ${e.school}, ${e.place} (${e.dates})${e.note ? `, ${e.note}` : ''}${e.subjects ? `, Coursework: ${e.subjects.join(', ')}` : ''}${e.description ? `\n  - ${e.description}` : ''}`,
    ),
    '',
    '## Awards and certificates',
    '',
    ...awards.map((a) => `- ${a}`),
    '',
    '## Skills',
    '',
    ...skills.map((s) => `- ${s.group}: ${s.items.join(', ')}`),
    '',
    '## Projects',
    '',
    ...projects.flatMap((p) => [
      `### ${p.name} (${p.kind})`,
      '',
      `${p.dates}`,
      '',
      p.pitch,
      `Page: ${absolute(`/projects/${p.slug}`)}`,
      '',
      ...p.points.map((pt) => `- ${plain(pt)}`),
      '',
      `Technologies: ${p.tags.join(', ')}`,
      '',
    ]),
    '## Research and writing',
    '',
    ...papers.flatMap((p) => [
      `### ${p.title}`,
      '',
      `${p.badge} · ${p.venue} · ${p.year}${p.coAuthored ? ' · co-authored' : ''}`,
      '',
      ...(p.result ? [`Key result: ${p.result.value} ${p.result.label}.`, ''] : []),
      `Abstract: ${p.abstract}`,
      '',
      `Topics: ${p.tags.join(', ')}`,
      '',
      `PDF: ${absolute(p.file)}`,
      '',
    ]),
  ].join('\n');
}
````

### `frontend/lib/metadata.ts`

````ts
import type { Metadata } from 'next';
import { absolute } from './site';

/** Title, description and canonical URL for a page; the layout supplies the rest. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return { title, description, alternates: { canonical: absolute(path) } };
}
````

### `frontend/lib/notify.ts`

````ts
// Slack notifications go through the site's own /api/notify route, which holds the webhook URL server-side.
// A static export (GitHub Pages) has no server, so notifications are off there.
const endpoint = process.env.NEXT_PUBLIC_STATIC_EXPORT
  ? null
  : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/notify/`;

/** Escape the characters Slack treats as markup in message text. */
export const slackText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Send a Slack message through the site's notify route. Fire-and-forget; keepalive lets it finish on navigation. */
export function notifySlack(text: string) {
  if (!endpoint) return;
  void fetch(endpoint, {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }).catch(() => {});
}

/** Describe a clicked link or button in one Slack line. */
export function describeClick(element: Element, page: string) {
  const label =
    // A card-style link (project or job row) is named by its heading, not all of its text.
    (element.getAttribute('aria-label') || element.querySelector('h2, h3')?.textContent || element.textContent || '')
      .replace(/[↗↑←→×✓+]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80) || element.tagName.toLowerCase();
  const href = element instanceof HTMLAnchorElement ? element.href.replace(window.location.origin, '') : '';
  return `👀 *Visitor click* on \`${page}\`: "${slackText(label)}"${href ? ` → ${slackText(href)}` : ''}`;
}
````

### `frontend/lib/palette.ts`

````ts
import { useEffect, useState } from 'react';

const OPEN_EVENT = 'palette:open';

/** Open the command palette from anywhere, such as the header's Search button. */
export const openPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

export function onPaletteOpen(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

/** "⌘K" on Apple devices and "Ctrl K" elsewhere, resolved after hydration. */
export function usePaletteShortcut() {
  const [label, setLabel] = useState('⌘K');
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.userAgent)) setLabel('Ctrl K');
  }, []);
  return label;
}
````

### `frontend/lib/scroll.ts`

````ts
import type Lenis from 'lenis';

// Header clearance comes from `scroll-padding-top` in globals.css, which both Lenis and native scrolling honour.
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Glide to an element, or jump with `immediate`. Falls back to native scrolling before Lenis starts. */
export function scrollToElement(element: HTMLElement, immediate = false) {
  if (lenis) lenis.scrollTo(element, { immediate, force: true });
  else element.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth', block: 'start' });
}

/** The element a same-page `#fragment` link points to, or null for any other link. */
export function samePageTarget(href: string) {
  const url = new URL(href, window.location.href);
  const path = (pathname: string) => pathname.replace(/\/$/, '');
  if (!url.hash || url.origin !== window.location.origin || path(url.pathname) !== path(window.location.pathname))
    return null;
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

/** Navigate within the site: glide when the target is on this page, otherwise hand over to the router. */
export function navigateTo(href: string, push: (href: string) => void) {
  const target = samePageTarget(href);
  if (!target) return push(href);
  window.history.pushState(window.history.state, '', new URL(href, window.location.href).hash);
  scrollToElement(target);
}

/** Jump to the top and drop any momentum left over from the previous page. */
export function resetScroll() {
  lenis?.scrollTo(0, { immediate: true, force: true });
}
````

### `frontend/lib/site.ts`

````ts
// Single source of truth for the portfolio's content. The page, the JSON-LD,
// llms.txt / llms-full.txt and the sitemap all read from here.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://mohitgujarati.vercel.app'
).replace(/\/$/, '');
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefix a path in /public with the deploy base path (for plain <a>/<img> tags). */
export const asset = (path: string) => `${BASE_PATH}${path}`;
/**
 * Absolute URL for a path, used in metadata, sitemap, JSON-LD and llms.txt. Page paths get the trailing slash the
 * site serves (`trailingSlash: true`), so search engines never see a redirecting URL; files keep their extension.
 */
export const absolute = (path = '/') => {
  const [pathname, hash] = path.split('#');
  const page = pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(pathname) ? pathname : `${pathname}/`;
  return `${SITE_URL}${page}${hash ? `#${hash}` : ''}`;
};

/** Primary pages, in navigation order. The desktop nav shows Work through Research. */
export const pages = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/experience', 'Experience'],
  ['/about', 'About'],
  ['/research', 'Research'],
  ['/contact', 'Contact'],
] as const;

export const profile = {
  name: 'Mohit Gujarati',
  role: 'Full-Stack Software Engineer',
  company: 'Gabriel AI',
  location: 'Phoenix, AZ',
  email: 'mohitgujarati11@gmail.com',
  github: 'https://github.com/MohitGujarati',
  linkedin: 'https://www.linkedin.com/in/mohitgujarati/',
  resume: '/Mohit_Gujarati_Resume.pdf',
  summary:
    'Full-stack software engineer building mobile and web apps with Kotlin, React Native, React and Next.js. I build data layers, integrate APIs, and develop AI products, from streaming Gemini pipelines to voice calling workflows.',
  short:
    'Full-stack software engineer building mobile, web and AI products with Kotlin, React Native, React and Next.js.',
};

export type Job = {
  hash: string;
  head?: boolean;
  /** Timeline label for past roles; the current role shows a badge instead. */
  stage?: string;
  role: string;
  company: string;
  start: string; // ISO yyyy-mm
  end?: string;
  dates: string;
  points: string[];
  tags: string[];
};

export const experience: Job[] = [
  {
    hash: 'a7c3e19',
    head: true,
    role: 'Full-Stack Engineer',
    company: 'Gabriel AI',
    start: '2026-08',
    dates: 'Aug 2026 - Present',
    points: [
      'Designed, developed, tested, and deployed a production full-stack feature using Django REST, React, TypeScript, and AWS ElastiCache (Redis/Valkey), implementing intelligent caller ID routing across a shared pool of **65 numbers**. Resolved a production retry-queue data integrity bug, developed **125 automated pytest unit tests**, and validated functionality through live-call testing before release.',
      'Implemented environment-specific ElevenLabs text-to-speech configuration with validated production fallbacks, preventing invalid settings from disrupting paid voicemail generation; added automated unit test coverage.',
      'Engineered technical SEO across the site with per-page metadata, Open Graph previews, JSON-LD structured data (FAQ, Breadcrumb, Article), and an auto-generated sitemap. Wrote an automated audit script that maintains **100% structured-data coverage**, built headless-Chrome checks for responsiveness and console errors, and fixed a Next.js static-export prefetch bug to restore instant client-side navigation.',
      'Migrated a production marketing site from Create React App to Next.js, rebuilding **60+ pages** as a static export on AWS Amplify. Built reusable, config-driven page templates so new industry and feature pages ship from a single content file, and added Contentful CMS blogs, GA4 event tracking, and a Cloudflare Turnstile-protected voice-demo flow.',
    ],
    tags: [
      'Django REST',
      'React',
      'TypeScript',
      'Next.js',
      'Redis/Valkey',
      'AWS Amplify',
      'ElevenLabs',
      'pytest',
      'Contentful',
      'GA4',
    ],
  },
  {
    hash: '4f2b8d0',
    stage: 'Product engineering',
    role: 'Software Engineer',
    company: 'TNM Software Solutions',
    start: '2023-05',
    end: '2024-06',
    dates: 'May 2023 - Jun 2024',
    points: [
      'Cut device power consumption by **30% fleet-wide** by building battery-efficient location services in Kotlin, using the Google Geofencing API and motion sensors to reduce GPS polling.',
      'Improved app performance by **50%** and removed UI-thread bottlenecks by refactoring the legacy codebase to MVVM with Kotlin Coroutines for non-blocking I/O.',
      'Shipped production Android and web apps from scratch, working in daily stand-ups and weekly sprints with the backend and QA teams.',
    ],
    tags: ['Kotlin', 'Android', 'Geofencing API', 'MVVM', 'Coroutines'],
  },
  {
    hash: 'e91c5a7',
    stage: 'The foundation',
    role: 'Android Developer Trainee',
    company: 'Tops Technology Inc.',
    start: '2022-05',
    end: '2023-05',
    dates: 'May 2022 - May 2023',
    points: [
      'Built and released user-facing features with Android UI components and Material Design in Kotlin, and published them to the Google Play Store.',
      'Designed normalized Room/SQLite schemas that sped up queries and made offline-first data sync reliable.',
      'Structured MVVM repositories with clear UI, domain and data layers, integrating REST APIs through Retrofit, Coroutines and LiveData.',
    ],
    tags: ['Kotlin', 'Room', 'SQLite', 'Retrofit', 'Material Design'],
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  dates: string;
  /** One-line description on the home page. */
  tagline: string;
  /** Short description in the project index. */
  summary: string;
  /** Full description on the case study and in machine-readable profiles. */
  pitch: string;
  platform: string;
  repository: string;
  points: string[];
  decisions: string[];
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: 'shop-circle',
    name: 'Shop Circle',
    kind: 'Social commerce / Mobile',
    dates: 'Jun - Aug 2026',
    tagline: 'A shared space for discovering products and the people behind them.',
    summary: 'Social discovery and commerce, together in one mobile experience.',
    pitch:
      'A cross-platform social commerce app with one feed for posts and products, multi-image uploads, optimistic likes, ranked discovery, and typo-tolerant search.',
    platform: 'Cross-platform mobile',
    repository: 'https://github.com/MohitGujarati/ShopCircle',
    points: [
      'Relational schema with 6 tables, 10 SQL migrations and 2 engagement-ranked views, secured with **PostgreSQL Row-Level Security** instead of application code.',
      'Google OAuth and username login with deep-link callbacks, plus a CI/CD pipeline from GitHub Actions to a signed APK on Firebase App Distribution.',
    ],
    decisions: [
      'Access rules live beside the relational data, so authorization does not depend on checks in the mobile interface.',
      'Discovery has two distinct jobs: database views rank engagement, while Algolia handles search relevance and typos. Keeping those responsibilities separate lets the feed and search use different ranking logic.',
    ],
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Algolia', 'GitHub Actions'],
  },
  {
    slug: 'recall-ai',
    name: 'Recall AI',
    kind: 'AI assistant / Android',
    dates: 'Feb - May 2026',
    tagline: 'A meeting assistant that listens, remembers, and helps you act.',
    summary: 'Live meetings turned into transcripts, answers, and practical next steps.',
    pitch:
      'A voice-driven meeting assistant that transcribes live audio, answers questions about the meeting, and handles tasks like setting alarms and reminders for to-dos.',
    platform: 'Android',
    repository: 'https://github.com/MohitGujarati/RecallAI--Intelligent-Meeting-Assistant',
    points: [
      'Real-time streaming pipeline built on the **Gemini API**, Kotlin Coroutines and StateFlow, with a fully declarative Jetpack Compose UI.',
      'Offline-first persistence with Room, normalized schemas and SQL-to-Flow queries. CI/CD handles secure API key injection, tests, linting and Firebase test builds.',
    ],
    decisions: [
      'Live session state and saved meeting data have different lifecycles. StateFlow carries changing state from the streaming pipeline; Room exposes persisted data through observable queries.',
      'Offline-first storage keeps saved data available without a connection. AI answers still depend on Gemini, so local persistence and online inference remain separate concerns.',
    ],
    tags: ['Kotlin', 'Jetpack Compose', 'Hilt', 'Room', 'Flow', 'Gemini API'],
  },
  {
    slug: 'lummina',
    name: 'Lummina',
    kind: 'AI learning / Full-stack web',
    dates: 'Mar - May 2026',
    tagline: 'A learning platform built around conversation, practice, and feedback.',
    summary: 'A learning platform that moves from conversation to practice.',
    pitch:
      'An AI learning platform with streaming chat, quiz generation, AI grading, study guides, and real-time voice exams.',
    platform: 'Full-stack web',
    repository: 'https://github.com/MohitGujarati/lummina-core',
    points: [
      'A **ReAct-based agent orchestrator** with multi-step pipelines and structured outputs that automatically regenerates any quiz scoring below 70%.',
      'AI requests go through Express so Gemini and Supabase credentials stay on the server. Responses stream to the client over SSE, and voice exams run on WebSockets with Gemini Live.',
    ],
    decisions: [
      'Text responses need a server-to-client stream; voice exams need an ongoing two-way exchange. SSE and WebSockets serve those different communication patterns.',
      'Quiz evaluation adds a check between generation and delivery. Regenerating low-scoring quizzes adds another model step, while giving the pipeline a defined quality threshold.',
    ],
    tags: ['React 19', 'Vite', 'Express.js', 'Gemini Live', 'WebSocket', 'Supabase'],
  },
];

export type Paper = {
  slug: string;
  kind: 'ieee' | 'review';
  badge: string;
  title: string;
  /** Reader-friendly title for the research list. */
  shortTitle: string;
  /** Extra context shown with the abstract. */
  note?: string;
  venue: string;
  year: string;
  coAuthored?: boolean;
  result?: { value: string; label: string };
  abstract: string;
  tags: string[];
  file: string;
};

export const papers: Paper[] = [
  {
    slug: 'parkinsons-detection',
    kind: 'ieee',
    badge: 'IEEE format',
    title: "Parkinson's Disease Detection Using Handwriting: A Hybrid Multi-CNN and Genetic Algorithm Framework",
    shortTitle: 'Parkinson’s detection from handwriting',
    note: 'An academic model study, not a clinically validated diagnostic tool.',
    venue: 'AI700 Applicable Deep Learning / LIU Brooklyn',
    year: '2026',
    coAuthored: true,
    result: { value: '99.2%', label: 'external validation accuracy' },
    abstract:
      "An end-to-end hybrid framework for automated, non-invasive Parkinson's Disease detection from digitized hand-drawn graphomotor biomarkers. It combines deep feature extraction from multiple CNNs (ResNet50, VGG19, InceptionV3), Genetic Algorithm feature selection, XGBoost classification, and SHAP interpretability.",
    tags: ['Deep Learning', 'Multi-CNN', 'Genetic Algorithm', 'XGBoost', 'SHAP', 'Medical AI'],
    file: '/papers/parkinsons-detection-handwriting.pdf',
  },
  {
    slug: 'bert-news-recommendation',
    kind: 'ieee',
    badge: 'IEEE format',
    title: 'Solving Information Overload: Using BERT to Recommend News Articles Related to User Interest',
    shortTitle: 'Personalized news with Sentence-BERT',
    venue: 'CS666 / LIU Brooklyn',
    year: '2025',
    coAuthored: true,
    result: { value: 'SBERT', label: 'semantic ranking over a rich user profile' },
    abstract:
      'A content-based recommendation system that uses Sentence-BERT embeddings and a rich user profile built from explicit preferences, liked articles and reading history. Cosine similarity over all-MiniLM-L6-v2 vectors drives personalized news ranking, avoiding the limits of keyword matching.',
    tags: ['NLP', 'Sentence-BERT', 'Recommender Systems', 'Information Retrieval'],
    file: '/papers/bert-news-recommendation.pdf',
  },
  {
    slug: 'pytorch-vs-tensorflow',
    kind: 'review',
    badge: 'survey',
    title: 'A Comparative Survey of PyTorch vs. TensorFlow for Deep Learning: Usability, Performance, and Deployment',
    shortTitle: 'PyTorch & TensorFlow: a comparison',
    venue: 'AI700 Applicable Deep Learning / LIU Brooklyn',
    year: '2026',
    abstract:
      'Compares the two dominant deep learning frameworks across developer experience, training and inference efficiency, deployment, and ecosystem. Both deliver strong results, but PyTorch leans toward simplicity and research while TensorFlow leans toward a complete production ecosystem, so the right choice depends on which trade-offs matter most.',
    tags: ['PyTorch', 'TensorFlow', 'Deep Learning'],
    file: '/papers/pytorch-vs-tensorflow-survey.pdf',
  },
  {
    slug: 'tensorflow-review',
    kind: 'review',
    badge: 'paper review',
    title: 'TensorFlow: A System for Large-Scale Machine Learning',
    shortTitle: 'Inside TensorFlow’s architecture',
    venue: 'AI700 Applicable Deep Learning / LIU Brooklyn',
    year: '2026',
    abstract:
      'A structured review of the TensorFlow paper: its single dataflow-graph model for computation and mutable state, extensibility through user-level libraries, distributed training, and benchmark performance on image classification and language modeling across CPUs, GPUs and TPUs.',
    tags: ['TensorFlow', 'Dataflow Graphs', 'Distributed Systems'],
    file: '/papers/tensorflow-system-review.pdf',
  },
  {
    slug: 'microservices',
    kind: 'review',
    badge: 'term paper',
    title:
      'Microservices and Distributed Systems: Architectures for Scalable, Fault-Tolerant, and Efficient Modern Applications',
    shortTitle: 'Microservices & distributed systems',
    venue: 'System Design and Analysis / LIU Brooklyn',
    year: '2024',
    abstract:
      'A qualitative analysis of microservices and distributed systems through case studies of Netflix, Uber and ChatGPT, showing how system analysis and design principles (modularity, scalability and fault tolerance) address the limits of monolithic architectures at production scale.',
    tags: ['Microservices', 'Distributed Systems', 'System Design'],
    file: '/papers/microservices-distributed-systems.pdf',
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'languages', items: ['Kotlin', 'TypeScript', 'JavaScript', 'Java', 'Python', 'SQL'] },
  {
    group: 'mobile',
    items: [
      'Jetpack Compose',
      'Android SDK',
      'React Native',
      'Expo',
      'Coroutines',
      'Flow / StateFlow',
      'LiveData',
      'Hilt',
      'Retrofit',
    ],
  },
  {
    group: 'web',
    items: ['React 19', 'Next.js (App Router)', 'MUI', 'Framer Motion', 'Express.js', 'REST APIs', 'WebSocket', 'SSE'],
  },
  {
    group: 'data-cloud',
    items: ['PostgreSQL', 'Supabase', 'SQLite', 'Room', 'Firebase', 'Google Cloud', 'AWS Amplify'],
  },
  { group: 'ai', items: ['Gemini API', 'Gemini Live', 'ReAct agents', 'Structured outputs', 'Voice AI workflows'] },
  {
    group: 'practices',
    items: [
      'MVVM',
      'Clean Architecture',
      'Offline-first',
      'Dependency Injection',
      'GitHub Actions CI/CD',
      'Agile / Scrum',
    ],
  },
];

/** Plain-language skill summaries shown on the home and About pages. */
export const capabilities = [
  {
    title: 'Mobile products',
    body: 'Kotlin, Jetpack Compose, React Native and Expo. Offline data, responsive interfaces and background services.',
  },
  {
    title: 'Web & infrastructure',
    body: 'React, Next.js and TypeScript, backed by Express, PostgreSQL and Supabase. Deployment through AWS and GitHub Actions.',
  },
  {
    title: 'Applied AI',
    body: 'Gemini integrations for streaming chat, voice conversations and multi-step agent workflows.',
  },
];

export const education = [
  {
    degree: 'M.S. in Computer Science',
    school: 'Long Island University',
    place: 'Brooklyn, NY',
    dates: 'Sep 2024 - May 2026',
    note: 'GPA 3.9 / 4.0',
    description:
      'Conducted extensive literature review on AI, ML, DL, and software development research papers, applying findings to a comprehensive project. Presented the project for professorial review and synthesized the outcomes into a detailed IEEE-formatted research report.',
    subjects: ['System Design', 'DSA', 'Full Stack Web Development'],
  },
  {
    degree: 'B.Tech in Computer Engineering',
    school: 'Shankersinh Vaghela Institute of Technology',
    place: 'Gujarat, India',
    dates: 'Aug 2016 - Sep 2020',
    subjects: ['Engineering Maths', 'OS', 'Java', 'DSA', 'Computer Networks'],
  },
];

export const awards = [
  'Excellence Award in Graduate Computer Science, LIU Brooklyn',
  'Kotlin Professional Certificate, JetBrains',
  'Member of Google Developer Group @ Long Island University',
];

/** Strip the **bold** markers used in content strings. */
export const plain = (s: string) => s.replace(/\*\*/g, '');
````

### `frontend/lib/theme.ts`

````ts
export type Theme = 'light' | 'dark';

export function getTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return 'dark';
}

export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* storage blocked */
  }
}
````

### `.github/workflows/deploy.yml`

````yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

defaults:
  run:
    working-directory: frontend

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - id: pages
        uses: actions/configure-pages@v5
      - run: npm ci
      # API routes need a server; Vercel runs them, a static export cannot.
      - run: rm -rf app/api
      - run: npm run build
        env:
          GITHUB_PAGES: 'true'
          # "" for a MohitGujarati.github.io repo, "/<repo>" for a project repo
          PAGES_BASE_PATH: ${{ steps.pages.outputs.base_path }}
          # Canonical URLs point at the Vercel site, so search engines treat it as the one official copy.
          NEXT_PUBLIC_SITE_URL: https://mohitgujarati.vercel.app
          NEXT_PUBLIC_GA_ID: G-ZEZ78GD0WE
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./frontend/out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
````

<!-- source-files:end -->
