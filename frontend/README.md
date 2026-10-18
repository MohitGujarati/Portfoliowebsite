# Mohit Gujarati — portfolio

Image-free, multipage portfolio built with Next.js 16, React 19, TypeScript, native CSS, and Motion. The homepage pixel field uses Canvas 2D; it has no image assets or 3D dependencies.

## Run locally

From this directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

```sh
npm run typecheck
npm run build
npm start
```

`npm start` runs the production Next.js server after a build. Setting `GITHUB_PAGES=true` builds a static export into `out/` instead (see Deployment).

## Structure

- `app/`: pages, route handlers, metadata, and global styles.
- `components/`: site chrome (`Nav`, `SiteFooter`), interactions, and shared building blocks (`PageHeader`, `WorkList`, `ExternalLink`, `JsonLd`).
- `lib/site.ts`: all content: profile, projects with their case-study details, experience, research, and education.
- `lib/metadata.ts`: `pageMetadata()` for per-page title, description, and canonical URL.
- `lib/jsonld.ts` and `lib/llms.ts`: structured data and machine-readable profile generators.
- `lib/theme.ts`: saved light/dark preference.
- `public/`: résumé and five research PDFs.
- `DESIGN-DIRECTION.md`: design decisions and interaction requirements.
- `PROGRESS.md`: current implementation and verification record.
- `.design-backup/`: ignored local restore archives; not application source.

The root `../server/` API and `../.mobile-build/` native app are separate projects; the mobile app reads its data from that API. The website's displayed content comes from `lib/site.ts`. Its only API integration is `/api/cron`, a daily keep-alive (scheduled in `vercel.json`) that pings the Express API so the API host and Supabase stay awake for the mobile app.

## Configuration

Keep secrets in `.env.local`, never in source control. Existing optional analytics configuration is preserved. A custom deployment can supply `NEXT_PUBLIC_SITE_URL`; subdirectory hosting uses `PAGES_BASE_PATH`. `/api/cron` reads the API address from `NEXT_PUBLIC_API_URL`.

## Deployment

- **Vercel**: set the project's Root Directory to `frontend`. Vercel runs the full Next.js server, including `/api/cron`.
- **GitHub Pages**: `.github/workflows/deploy.yml` removes `app/api` (static hosting cannot run it) and builds a static export with `GITHUB_PAGES=true`, served from `/<repo>`. Set the repository's Pages source to "GitHub Actions".

## Maintenance

TypeScript checks only active source and generated Next.js types, not backup folders. Unused local declarations and parameters fail the type check. Keep generated output, dependency directories, and local restore archives out of source control.

Legacy code, unused artwork, and video-generation work are recoverable from the dated cleanup archives in `.design-backup/`.
