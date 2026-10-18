# Deploying the website to Vercel

How to put `frontend/` live on Vercel, configure it, and check it works. For the API on Render and the GitHub Pages copy, see `DEPLOYMENT_CRON.md`.

**Result:** the full Next.js site on Vercel, served from `https://<project>.vercel.app` or your own domain. It includes the daily `/api/cron/` keep-alive that keeps the mobile app's API and database awake, and the Slack click notifications.

---

## 1. Before you start

- A Vercel account connected to GitHub.
- This repository pushed to GitHub (`MohitGujarati/Portfoliowebsite`).
- The Render URL of the Express API (for the keep-alive). The site itself works without it.
- Optional: a Slack incoming-webhook URL, a GA4 measurement ID, and PostHog keys.

The site needs no database or server secrets at build time. All content is compiled from `frontend/lib/site.ts`.

---

## 2. Create the project (dashboard)

1. In Vercel, choose **Add New → Project** and import `Portfoliowebsite`.
2. **Root Directory:** click *Edit* and choose `frontend`. This is the step most often missed; without it, the build fails because the repository root has no Next.js app.
3. **Framework Preset:** Next.js, detected automatically. Leave the build, output and install commands at their defaults (`next build` and `npm install`).
4. **Node.js version** (Settings → General): 22.x.
5. Add the environment variables from section 3, then click **Deploy**.

### Or with the CLI

```sh
npm i -g vercel
cd frontend
vercel link                    # choose or create the project; root is this folder
vercel env add NEXT_PUBLIC_API_URL production
vercel env add SLACK_WEBHOOK_URL production
vercel --prod
```

---

## 3. Environment variables

Set these in **Project → Settings → Environment Variables**, for Production and Preview.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | For the cron | Base URL of the Express API on Render, e.g. `https://portfolio-api.onrender.com`. Without it, `/api/cron/` pings `localhost` and fails. |
| `SLACK_WEBHOOK_URL` | Optional | Slack incoming webhook, **server-only** (no `NEXT_PUBLIC_` prefix). The browser posts to `/api/notify/`, which forwards only the site's own message formats from its own origin. Every link or button click and every command-palette choice posts a message. Empty disables it. |
| `CRON_SECRET` | Recommended | Any long random string. Vercel sends it to `/api/cron/` as a Bearer token, and other callers get a 401. |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 ID (`G-…`). Empty disables GA. |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Optional | PostHog analytics. Both must be set. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical origin for metadata, sitemap, JSON-LD and `llms.txt`. If unset, the site uses Vercel's production URL. Set it once you add a custom domain. |

**Never set** `GITHUB_PAGES` or `PAGES_BASE_PATH` on Vercel. They switch the build to the GitHub Pages static export, which drops `/api/cron/` and prefixes every URL.

`NEXT_PUBLIC_*` values are compiled into the build, so **redeploy after changing any of them**.

Security note: anything named `NEXT_PUBLIC_*` is compiled into the browser's JavaScript, so keep secrets (the Slack webhook, `CRON_SECRET`) in unprefixed variables. Responses carry security headers (frame blocking, `nosniff`, referrer and permissions policies) from `next.config.ts`.

---

## 4. The keep-alive cron

`frontend/vercel.json` schedules a daily request:

```json
{ "crons": [{ "path": "/api/cron/", "schedule": "0 12 * * *" }] }
```

- It runs at 12:00 UTC. On the Hobby plan, Vercel runs it once a day at some point within that hour.
- `/api/cron/` requests `${NEXT_PUBLIC_API_URL}/api/projects`. That wakes the Render server, and its query wakes Supabase, which keeps both free tiers from pausing for the mobile app.
- **Keep the trailing slash.** The site uses `trailingSlash: true`, so `/api/cron` answers with a 308 redirect, and Vercel cron jobs do not follow redirects.
- Check runs under **Project → Settings → Cron Jobs**, or open `https://<your-domain>/api/cron/` yourself. A healthy response is `{"success":true,…,"projectsFound":3}`.

---

## 5. Custom domain (optional)

1. **Project → Settings → Domains → Add** your domain, then follow Vercel's DNS instructions: an `A` record for the apex domain and a `CNAME` for `www`.
2. Set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` and redeploy, so canonical URLs, the sitemap and structured data use the new domain.
3. Google Search Console: `app/layout.tsx` already includes a `google-site-verification` meta tag for the current property. A new domain needs its own property and token.

---

## 6. After each deploy: checks

Replace `$SITE` with your URL.

```sh
for p in / /work/ /experience/ /about/ /research/ /contact/ /blog/ /projects/shop-circle/ \
         /llms.txt /llms-full.txt /profile.json /sitemap.xml /robots.txt /Mohit_Gujarati_Resume.pdf; do
  printf "%-32s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$SITE$p")"
done                                   # every line should be 200
curl -s "$SITE/projects/" -o /dev/null -w '%{http_code} %{redirect_url}\n'   # 307 → /work
curl -s "$SITE/api/cron/"              # {"success":true,...}
```

In a browser, confirm the following:

- **Pixel field:** at rest, a faint colour wave drifts behind the hero name and each page heading. On hover, green squares light up around the pointer.
- **Command palette:** ⌘K (or Ctrl+K, or `/`) opens it, typing filters the list, and Enter navigates.
- **Page transitions:** clicking a project on the home page morphs its title into the case study heading, in Chromium-based browsers and recent Safari.
- **Slack:** clicking a link posts a "👀 Visitor click" message to Slack, if the webhook is set.

---

## 7. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Build fails: "Couldn't find any `pages` or `app` directory" | Root Directory isn't `frontend`. |
| Every URL starts with `/Portfoliowebsite` | `PAGES_BASE_PATH` is set on Vercel. Remove it and redeploy. |
| `/api/cron/` returns 404 | `GITHUB_PAGES=true` is set, which makes a static export. Remove it. |
| Cron shows failures | `NEXT_PUBLIC_API_URL` is missing or wrong, or the Render service is down. Open the URL's `/health` endpoint. |
| No Slack messages | The webhook variable was added after the last build (redeploy), or Slack revoked the URL. |
| Analytics missing | Check the GA or PostHog variables, then redeploy. Ad blockers also hide analytics requests. |

Previews: every pull request gets a preview URL with the same configuration. Canonical links on previews still point at the production URL (`NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL`), so search engines never index a preview as the main site.
