# Mohit Gujarati: Portfolio

Personal portfolio built with Next.js (App Router, static export) and deployed to GitHub Pages.

## Develop

```
npm install
npm run dev        # http://localhost:3000  (add ?intro to force the intro)
npm run build      # static site in ./out
npm start          # serve ./out locally
```

## Where things live

```
lib/site.ts            ALL content: profile, experience, projects, papers, skills, education
app/page.tsx           page layout (reads lib/site.ts)
app/layout.tsx         <head>: SEO metadata, fonts, theme + intro boot script
app/globals.css        styles and light/dark theme tokens
components/            interactive pieces (intro, nav, terminal, research filters, achievements…)
lib/intro.ts           "hello" in many languages particle intro (2D canvas)
lib/graph.ts           BFS graph animation behind the hero
lib/terminal.ts        mohit-sh terminal commands
public/                resume PDF and research paper PDFs
```

Edit text in `lib/site.ts` and everything updates together: the page, the JSON-LD
structured data, `llms.txt`, `llms-full.txt`, the sitemap and the terminal.

## SEO and AI search

Generated at build time:

- `/robots.txt`: allows search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…)
- `/sitemap.xml`: home page, resume and paper PDFs
- `/llms.txt` and `/llms-full.txt`: Markdown profile for AI assistants ([llmstxt.org](https://llmstxt.org))
- schema.org JSON-LD: Person, ProfilePage, WebSite, work roles, projects, ScholarlyArticle for each paper
- Open Graph / Twitter card with `public/og.png`, canonical URL, web manifest

The intro never plays for crawlers, automated browsers or reduced-motion users, and all
content is in the static HTML.

## Deploy (GitHub Pages)

1. Create a public repo named `MohitGujarati.github.io` (serves at https://mohitgujarati.github.io/).
2. Push this project to its `main` branch.
3. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

A project repo (e.g. `/Portfoliowebsite`) also works: the workflow passes the base path in
automatically. Note that `robots.txt` only takes effect at a domain root, so the user-site repo is best for SEO.
