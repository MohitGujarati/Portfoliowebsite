# Deployment & Keep-Alive Cron

The repository holds three projects:

* **`frontend/`**: the Next.js portfolio, deployed to **Vercel** and **GitHub Pages**. Its content comes from `frontend/lib/site.ts`.
* **`server/`**: the Express API, deployed to **Render**. It reads portfolio data from **Supabase**.
* **`.mobile-build/`**: the Expo mobile app. It reads its data from the Express API (`EXPO_PUBLIC_API_URL`).

---

## 1. Express API (Render)

1. Create a "Web Service" on [Render](https://render.com/) connected to this repository.
2. **Root Directory:** `server`
3. **Build Command:** `npm install`
4. **Start Command:** `node index.js`
5. **Environment Variables:** `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

Endpoints: `/api/projects`, `/api/profile`, `/api/experience`, `/api/education`, `/api/skills`, `/api/portfolio` (all of the above) and `/health`. `docs/seed.sql` creates and fills the Profile, Experience, Education and Skills tables.

---

## 2. Frontend on Vercel

1. Import the repository in the [Vercel Dashboard](https://vercel.com).
2. **Root Directory:** `frontend`. Vercel detects Next.js automatically.
3. **Environment Variables:** `NEXT_PUBLIC_API_URL` set to the Render URL, plus the optional analytics keys from `frontend/.env.example`.

---

## 3. Frontend on GitHub Pages

`.github/workflows/deploy.yml` runs on every push to `main`. It removes `frontend/app/api` (static hosting cannot run route handlers), builds a static export with `GITHUB_PAGES=true` and the repository's base path, and publishes `frontend/out`.

In the repository settings, set **Pages → Source** to **GitHub Actions**.

---

## 4. Keep-Alive Cron (Vercel)

Supabase pauses free-tier databases after 7 days of inactivity, and Render puts free-tier servers to sleep after 15 minutes. Both would break the mobile app.

`frontend/vercel.json` schedules `/api/cron/` daily at 12:00 UTC. That route (`frontend/app/api/cron/route.ts`) requests `/api/projects` from the Express API, which wakes Render, and the API's query wakes Supabase.

The cron path ends with `/` because the site uses `trailingSlash: true`: `/api/cron` answers with a redirect, and Vercel cron jobs do not follow redirects.
