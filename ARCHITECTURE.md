# System Architecture and Deployment Guidelines

## 🤖 Purpose
This document is specifically formatted to provide context to Large Language Models (LLMs) and AI agents interacting with this repository. It outlines the architectural decisions, constraints, and deployment strategies of this Next.js portfolio.

## 🏗️ Core Architecture
- **Framework:** Next.js 15+ (App Router)
- **Export Mode:** `output: 'export'` (Static Site Generation). The site is compiled into raw HTML/CSS/JS in the `out/` directory.
- **Single Source of Truth:** `lib/site.ts` contains all dynamic textual content (profile info, experience, projects). Do not hardcode content into React components; update `lib/site.ts` instead.
- **Routing:** All routes must be strictly static.

## 🚀 Dual Deployment Strategy
This repository is configured for simultaneous active deployment on two separate platforms. Any changes to the codebase MUST maintain compatibility with both.

### 1. Vercel (Primary)
- **Trigger:** Automatic upon push to the `main` branch.
- **Routing:** Hosted at the root domain (`https://mohit-portfolio.vercel.app`).
- **Environment:** Detects Vercel runtime via `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` to generate the correct absolute URLs for sitemaps and SEO metadata.

### 2. GitHub Pages (Redundancy)
- **Trigger:** GitHub Actions pipeline (`.github/workflows/deploy.yml`).
- **Routing:** Hosted in a subdirectory (`https://mohitgujarati.github.io/Portfoliowebsite`).
- **Path Resolution:** Next.js uses the `basePath` property in `next.config.ts`. The GitHub Action passes `PAGES_BASE_PATH` to Next.js so that all internal `<Link>` and `next/image` paths are prefixed correctly.
- **Constraints:** 
  - Image optimization must be disabled (`images: { unoptimized: true }`).
  - Trailing slashes must be enabled (`trailingSlash: true`).

## ⚠️ Critical Agent Constraints & Rules
When writing or modifying code in this repository, AI agents must strictly adhere to the following rules:

1. **NO Dynamic API Routes:** Because the project relies on `output: 'export'`, you cannot use standard Next.js dynamic Route Handlers (`app/api/.../route.ts`). Any route handler must be completely static and explicitly declare `export const dynamic = 'force-static'`.
2. **SEO & Verification:** Google Site Verification is implemented via a `<meta>` tag inside the root `app/layout.tsx`. Do NOT attempt to create a physical `.html` verification file in the `public/` folder or via a route handler, as `trailingSlash: true` causes strict static exports to append slashes, breaking the verification file path.
3. **Asset Resolution:** Use the `asset(path)` and `absolute(path)` utility functions from `lib/site.ts` when referencing static files or creating metadata, ensuring URLs resolve correctly regardless of whether the site is hosted on Vercel (root) or GitHub Pages (subdirectory).
4. **CI Pipeline:** All code is subject to a strict type-check and linting pipeline in `.github/workflows/ci.yml`. Do not push type errors.

## 📝 SEO and Knowledge Graph
- **Sitemap:** Generated dynamically via `app/sitemap.ts`.
- **JSON-LD:** Structured schema.org data is injected into `app/page.tsx`.
- **AI Context:** `app/llms.txt/route.ts` generates a markdown representation of the portfolio designed to be read by external AI crawlers (e.g., GPTBot, ClaudeBot).
