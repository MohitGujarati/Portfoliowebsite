# System Architecture and Deployment Guidelines

## Purpose
This document provides deep architectural context to Large Language Models (LLMs) and AI agents interacting with this repository. It covers the data flow, component breakdown, SEO strategies, rendering patterns, and the dual-deployment CI/CD pipeline of this Next.js application.

---

## Core Architecture & Rendering Pattern

- **Framework:** Next.js 15+ (App Router paradigm)
- **Rendering Strategy:** Static Site Generation (SSG). The `next.config.ts` explicitly sets `output: 'export'`.
- **Consequence:** The entire application is compiled down to raw HTML, CSS, and JS in the `out/` directory at build time. There is no Node.js server running in production.
- **State Management:** Uses native React hooks (`useState`, `useEffect`, `useCallback`) for local UI state (e.g., interactive terminal, software pet). No global state manager (like Redux or Zustand) is needed because the site is heavily content-driven.

---

## Data Flow & State

The portfolio strictly adheres to a "Single Source of Truth" data model to prevent desynchronization between visual content and SEO metadata.

- **`lib/site.ts`**: This is the application's database. It exports plain TypeScript objects/arrays (`profile`, `experience`, `projects`, `papers`, `skills`). 
- **Consumption:** 
  1. **UI Components:** Read from `site.ts` to render the DOM.
  2. **SEO Generators:** Read from `site.ts` to generate `robots.ts`, `sitemap.ts`, and Schema.org JSON-LD.
  3. **AI Endpoints:** Read from `site.ts` to generate `/llms.txt` and `/llms-full.txt`.

*Agent Rule:* Never hardcode copy, URLs, or experience data directly into `.tsx` files. Always update `lib/site.ts`.

---

## Component Topology

The application relies on highly compartmentalized React components found in `/components`:

### 1. Structural UI
- **`Nav.tsx`**: Main navigation, handles scroll spy to highlight current sections.
- **`StatusLine.tsx`**: Fixed footer showing deployment status, commit hashes, or environment details.
- **`SectionHead.tsx`**: Standardized semantic headings for page sections.

### 2. Interactive & Experimental
- **`Terminal.tsx`**: A simulated interactive CLI that responds to user input (e.g., `help`, `whoami`, `clear`).
- **`SoftwarePet.tsx`**: A highly interactive, physics-based canvas/DOM element. It tracks the cursor, supports drag-and-drop, and manages its own sleep/wake lifecycle. Includes `prefers-reduced-motion` compliance.
- **`Intro.tsx` & `ReplayIntro.tsx`**: Manages the first-load animation sequence.
- **`PageEffects.tsx` / `HeroStage.tsx`**: Handles background ambient animations (e.g., BFS graph traversal canvas animations).

### 3. Content Presentation
- **`CodeCard.tsx`**: Formats programming projects with syntax-highlighted aesthetics.
- **`Research.tsx`**: Specialized card format for academic papers and PDF links.

---

## Dual Deployment Strategy (CI/CD)

This repository is engineered to be simultaneously hosted on two entirely different platforms, requiring strict pathing discipline.

### 1. Vercel (Primary / Active)
- **Trigger:** Vercel automatically watches the `main` branch.
- **Routing:** Hosted at the root domain (`https://mohit-portfolio.vercel.app` or custom domain).
- **Environment Awareness:** The application detects Vercel's runtime via `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` to dynamically set the `SITE_URL`.

### 2. GitHub Pages (Redundancy / Fallback)
- **Trigger:** A dedicated GitHub Actions pipeline (`.github/workflows/deploy.yml`).
- **Routing:** Hosted in a subdirectory (`https://mohitgujarati.github.io/Portfoliowebsite`).
- **Path Resolution:** 
  - Next.js requires the `basePath` property in `next.config.ts`. 
  - The GitHub Action explicitly injects `PAGES_BASE_PATH` as an environment variable during the build step. 
  - This ensures Next.js prefixes all internal `<Link href="/...">` and `<Image src="/...">` calls with `/Portfoliowebsite` when compiling the export.

### Asset Resolution Rule
Because the app shifts between root (`/`) and subdirectory (`/Portfoliowebsite`) hosting environments, **never use hardcoded absolute paths** in meta tags or standard HTML tags.
- Use `absolute(path)` for SEO Canonical URLs, Sitemaps, and OpenGraph images.
- Use `asset(path)` for standard `<img src>` tags or `<a href>` downloads (like the resume PDF).

---

## Advanced SEO & AI Discoverability

This portfolio is heavily optimized for both traditional search engines (Google) and AI crawlers (GPTBot, ClaudeBot).

1. **Google Site Verification:** 
   - Configured via a strictly static `<meta name="google-site-verification" ... />` tag inside the root `app/layout.tsx`.
   - *Why not an HTML file?* Static exports with `trailingSlash: true` convert `.html` files into directories (`/file/index.html`), which breaks Google's verification crawler. The meta tag is the only robust solution for Next.js static exports.
2. **Schema.org JSON-LD:** 
   - `app/page.tsx` injects highly detailed `Person`, `WebSite`, and `ScholarlyArticle` structured data into the `<head>`, directly serialized from `lib/site.ts`.
3. **AI Markdown (`llms.txt`):** 
   - Implements the [llmstxt.org](https://llmstxt.org) standard. Next.js Route Handlers (`app/llms.txt/route.ts`) dynamically generate raw Markdown summaries of the developer's profile to feed context directly to AI web scrapers.
4. **Static Constraints:** 
   - Because `output: 'export'` is active, all dynamic Route Handlers (like `/sitemap.xml` or `/llms.txt`) **MUST** include `export const dynamic = 'force-static'`. Failure to do so will crash the GitHub Actions production build.

---

## Code Quality Checks

- **`.github/workflows/ci.yml`**: Before any pull request or push is accepted, this workflow runs `npm run build` strictly to ensure TypeScript compilation (`tsc`) and Next.js linting (`next lint`) pass perfectly. No broken types or unresolved modules are permitted in `main`.
