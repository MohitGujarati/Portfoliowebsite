# Portfolio workspace

Three independent npm projects. Root `package.json` only holds cross-project scripts and Prettier.

| Folder | What | Run |
| --- | --- | --- |
| `frontend/` | Next.js 16 website (Vercel + GitHub Pages) | `npm run dev` → :3000 |
| `server/` | Express API over Supabase; used only by the mobile app | `npm run api` → :5000 |
| `.mobile-build/` | Expo app; reads the API via `EXPO_PUBLIC_API_URL` | `npm run mobile` |

Checks from the root: `npm run typecheck`, `npm test`, `npm run build`, `npm run format`.

## Where things live

- **Website content:** everything shown on the site, plus JSON-LD, `llms.txt`, `profile.json` and the sitemap, comes from `frontend/lib/site.ts`. Edit content there, not in pages.
- **Shared website pieces:** `PageHeader`, `WorkList`, `ExternalLink` and `JsonLd` in `frontend/components/`, and `pageMetadata()` in `frontend/lib/metadata.ts`.
- **Click notifications:** `ClickNotifier` (mounted in `layout.tsx`) posts each link or button click to `/api/notify/`, which forwards it to the server-only `SLACK_WEBHOOK_URL` (`lib/notify.ts`, `app/api/notify`). With no URL set, it does nothing.
- **Command palette and page transitions:** `CommandPalette` (⌘K / Ctrl+K / `/`) builds its results from `site.ts`. Titles morph between pages through React `<ViewTransition>` names: `project-<slug>` and `job-<hash>`. A name must be unique on a page.
- **Styles:** `frontend/app/globals.css` keeps one rule per line and is not run through Prettier.
- **Mobile app:** screens are in `.mobile-build/src/screens/`, shared styles in `screens/styles.ts`, and data types and validation in `src/data/model.ts`. Papers and awards are bundled in `src/data/research.ts`, because the API has no endpoint for them.
- **API data:** Supabase tables `Project`, `Profile`, `Experience`, `Education` and `Skills`. `docs/seed.sql` seeds all but `Project`.

## Deployment and docs

See `docs/DEPLOYMENT_VERCEL.md` (Vercel) and `docs/DEPLOYMENT_CRON.md` (Render API and GitHub Pages). `docs/REBUILD.md` and `docs/DESIGN.md` can reproduce the whole site. After changing website code or CSS, run `npm run docs:sync` so their embedded source stays current.

- **Vercel:** builds `frontend/` as a full Next.js server. `/api/cron/` (scheduled in `vercel.json`) keeps Render and Supabase awake for the mobile app.
- **GitHub Pages:** `deploy.yml` deletes `frontend/app/api` and builds with `GITHUB_PAGES=true` for a static export. Anything under `app/api` therefore never ships to Pages.

## Rules

- Never commit or push unless the user explicitly asks.
- Work locally. Ask before anything that leaves the machine: git remote, Supabase, npm install or audit, Vercel, Slack.
- The website's look and behaviour are final. Refactors must not change rendered output.
- `frontend/.design-backup/` holds the user's restore archives. Don't delete or read it.
