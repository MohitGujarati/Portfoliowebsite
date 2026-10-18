# Design system

The visual language of the portfolio: principles, tokens, type, layout, components, motion and accessibility. The appendix holds the complete stylesheet (`frontend/app/globals.css`), so the look can be reproduced exactly. Behaviour and code are documented in `REBUILD.md`.

---

## 1. Principles

1. **Type is the image.** There are no photos, illustrations or icon sets. Scale, weight and negative letter-spacing carry the identity; the only graphic element is the pixel field, drawn in code.
2. **Carbon, silver, moss.** A near-black surface, soft silver text, and one moss-green accent. Colour appears sparingly: the accent, and the muted wave of the pixel field.
3. **Quiet until touched.** At rest the page is calm, with a slow, faint wave. Interaction answers immediately: green light under the pointer, arrows that lift, rows that shift.
4. **Content first, enhancement second.** Every page reads correctly without JavaScript. Motion is layered on top and switches off with `prefers-reduced-motion`.
5. **One source per thing.** One stylesheet, one content file (`lib/site.ts`), and shared components for repeated patterns.

---

## 2. Colour tokens

Defined on `:root`. The light theme overrides them under `:root[data-theme="light"]`.

| Token | Dark (default) | Light | Use |
| --- | --- | --- | --- |
| `--bg` | `#000000` | `#eeefeb` | Page, header, dialogs |
| `--surface` | `#121212` | `#e2e6de` | Hover fills, selected palette row |
| `--ink` | `#e9ede6` | `#20271f` | Primary text |
| `--muted` | `#9fa79f` | `#5d685b` | Secondary text, body copy, meta |
| `--faint` | `#737e74` | `#7e8b7c` | Tertiary labels, placeholders |
| `--line` | `#30382f` | `#c6cebf` | Hairline borders (always 1 px) |
| `--selection` | `#344c31` | `#c2d5b7` | Text selection |
| `--accent` | `#b1d49c` | `#456b35` | Moss green: wordmark dot, nav underline, hovers, active states |

Other colours:

| Element | Dark | Light |
| --- | --- | --- |
| Pixel reveal (hover) | `#b4ed8b` / `#679d53` / `#354b3b` | `#397538` / `#6d9465` |
| Idle wave | `hsl(h 42% 56%)` | `hsl(h 38% 44%)` |
| Name period (follows wave) | `hsl(h 48% 64%)` | `hsl(h 42% 40%)` |
| Palette backdrop | `rgb(0 0 0 / .62)` + 6 px blur | `rgb(238 239 235 / .72)` |
| Browser theme colour | `#111412` | — |

The wave hue `h` starts at 0° (muted red) and travels the full wheel every 90 seconds.

---

## 3. Typography

- **Sans:** Manrope (`--font-sans`, via `next/font`), used for everything. Fallback: Arial, sans-serif.
- **Mono:** JetBrains Mono 400/500/700 (`--font-jetbrains-mono`). Only for the project index numbers, palette group labels and `kbd`.
- **Body:** 16 px / 1.6, antialiased.

| Role | Size | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- |
| Hero name | `clamp(74px, 14.5vw, 230px)`; phone `clamp(68px, 23vw, 165px)` | 450 | 1.2 | −0.078em |
| Footer "Let's talk" | `clamp(58px, 10.8vw, 160px)` | 400 | 1.15 | −0.07em |
| Display title (page h1) | `clamp(54px, 7.7vw, 118px)` | 400 | 1.09 | −0.067em, balanced |
| Project row title | `clamp(44px, 6.2vw, 88px)` | 400 | 1.3 | −0.065em |
| Next project | `clamp(36px, 6vw, 80px)` | — | 1.3 | −0.06em |
| Section title | `clamp(32px, 3.5vw, 52px)`; editorial `clamp(28px, 3vw, 42px)` | 450 | 1.2 | −0.05em |
| Timeline company | `clamp(32px, 3.4vw, 48px)` | — | 1.25 | −0.05em |
| Contact email | `clamp(20px, 3.4vw, 50px)` | — | 1.5 | −0.05em |
| Hero tagline | `clamp(24px, 3vw, 43px)` | — | 1.4 | −0.055em |
| Page intro | `clamp(18px, 1.8vw, 25px)`, muted | — | 1.6 | −0.025em |
| Wordmark "mohit." | 29 px (27 px on phones) | 600 | 1 | −0.065em |
| Body copy | 18 px, muted | — | 1.85 | −0.015em |
| Text link | 14 px | — | 1.5 | — |
| Nav, buttons, meta | 13 px / 12–13 px | — | 1.7 | — |
| Eyebrow | 12 px, uppercase, muted | — | — | +0.13em |

Display text uses tight negative tracking. Small uppercase labels use positive tracking.

---

## 4. Layout

- **Container:** `width: min(100% − 2 × gutter, 1440px)`, centred.
- **Gutter:** `clamp(24px, 5vw, 88px)`: 24 px at ≤ 767 px and 19 px at ≤ 380 px. Full-bleed regions (the hero name row and page headings) extend one gutter on each side with a negative margin, so the pixel field can reach the edges.
- **Breakpoints:** 1100 px (tighter gaps), 767 px (phone: menu dialog, stacked grids), 380 px (small phones).
- **Vertical rhythm:** `.section-block` uses 120 px of padding (90 px at ≤ 1100 px, 75 px on phones). Editorial grids use 85 px (60 px on phones). The page shell is 70 px from the top.
- **Editorial grid:** title column `1fr`, content column `1.5fr`, gap 12% (8% at ≤ 1100 px). It stacks on phones, and a hairline divides each grid.
- **Home order:** hero, then About, Experience (`.9fr / 1.35fr` grid), Skills (editorial grid) and Selected work.
- **Header:** sticky, 80 px tall (72 px on phones), with a bottom hairline. Wordmark on the left; nav links on the desktop sit 8vw in from it. On the right: "Let's talk ↗", Search ⌘K, theme toggle, and Menu on phones only.
- **Stacking:** content at 0, sticky header at 20, skip link at 30; dialogs use the browser's top layer.

---

## 5. Components

| Component | Anatomy and states |
| --- | --- |
| **Text link** | Inline-flex with a 28 px gap to its arrow `↗`/`→`. A 1 px underline sits at 20% width and 0.6 opacity, and grows to full width on hover in 500 ms. The arrow lifts 3 px up and right. |
| **Hero** | Meta row (role · location, 12 px muted), the name over the pixel field, then a tagline ("Mobile. Web. *AI.*" with the last word muted) and the magnetic "Explore selected work" link. That link has a 64 px circle arrow that fills with the accent and rotates 45° on hover. |
| **Page heading** | Eyebrow (or meta on case studies), display title, muted intro, optional link. It has 80 px bottom padding and the pixel field behind it. |
| **Project row** | Grid `64px / 1fr / 150px`: mono index `01`, meta + title + description, and an action column ("View project" + 54 px `↗`). On hover or focus: a surface fill fades in, an accent hairline sweeps left to right, the content shifts 6 px right, the label slides in, and the arrow lifts and turns accent. |
| **Career row** | Dates (meta), company, role (muted), arrow at top right. Top hairline. |
| **Timeline** | A left rail grows with scroll where `animation-timeline` is supported. Each job has a 9 px ring node, dates, a "Current role" or stage label, the role, the company `h2`, points, and a tech stack line above a hairline. |
| **Paper entry** | `<details>` with summary grid `155px / 1fr / 30px`: year · type, short title, `+`. On hover: surface fill, title shifts 5 px, `+` rotates 90°. When open, the body fades up. |
| **Contact** | A large email link with the arrow pushed to the right edge, a copy button, and two columns: "Elsewhere" and "Background". |
| **Footer** | "Have something in mind?", then a giant "Let's talk ↗" (the arrow moves 12 px on hover), then a bottom row: © year, GitHub / LinkedIn / Résumé, "Back to top ↑". |
| **Theme toggle** | A 17 px circle, half filled with ink. |
| **Command palette** | 640 px panel, 14 px radius, 1 px line border (accent-tinted when focused), deep shadow. The search row has the pixel field, a `⌕` in accent, and a 19 px input. Rows: title (15 px), hint (12 px muted), mono uppercase group tag. The selected row gets a surface fill, a 2 px accent bar on the left and an accent title. Footer: `kbd` hints. It opens 14vh from the top (10vh on phones). |
| **`kbd`** | Mono 10 px, 1 px line border, 4 px radius, muted. |

---

## 6. Motion

- **Easing:** `--ease: cubic-bezier(.16, 1, .3, 1)`, an expressive ease-out, used almost everywhere.
- **Durations:** micro hovers 250–400 ms, larger shifts 450–700 ms. Nothing loops, except the idle pixel wave.

| Moment | Spec |
| --- | --- |
| Hero name entrance | Each line slides up from 130% with a 2° tilt over 1.05 s; the second line starts 120 ms later. A clip box hides it until then. |
| Hero meta / bottom row | Fade up 16 px over 750 ms, with 100 ms and 300 ms delays. |
| Route change | New page fades from 0.4 opacity and rises 6 px over 400 ms. |
| Scroll reveal | `.reveal` below the fold fades up 14 px over 600 ms. |
| Shared-title morph | View transition, 450 ms on `--ease`, blurring 3 px at 30%. The header stays still. |
| Mobile menu | Links stagger up 25 px over 650 ms in 45 ms steps; closing fades in 160 ms. |
| Nav underline | Spring between links (stiffness 380, damping 34). |
| Palette open | Fades and drops 8 px with a 0.985 scale, over 240 ms. |
| Pixel field | Reveal rises in 60 ms and falls in 240 ms. The wave drifts continuously at 30 fps, fading in over 900 ms when the pointer leaves and out over 180 ms when it arrives. |
| Scrolling | Lenis momentum (lerp 0.1) for wheel and trackpad. In-page and cross-page `#section` links glide to their target, clearing the sticky header. |
| Theme switch | Background and text colours cross-fade over 250 ms. |

**Reduced motion:** every animation and transition is removed, view transitions become instant, the pixel wave is off, and the hover reveal snaps on and off.

---

## 7. Accessibility

- A skip link ("Skip to content") appears on focus.
- Focus ring: 2 px solid ink, 6 px offset; never removed except inside the palette input, where the panel border shows focus instead.
- Decorative elements (arrows, pixel canvases, indices, rails) are `aria-hidden`.
- Headings follow the page outline: the hero name is the single `h1` on the home page, and `WorkList` takes `h2` or `h3` to fit its section.
- Dialogs are native `<dialog>`, with Esc to close and focus restored. The palette uses the combobox and listbox pattern.
- Contrast (WCAG): body copy (`--muted` on `--bg`) is 8.5:1 in dark mode and 5.1:1 in light mode, both above the 4.5:1 AA minimum. `--faint` (5.0:1 dark, 3.1:1 light) is only for large or non-essential labels.
- Touch: interactive targets are at least 34 px tall; pointer effects ignore touch where they would get in the way.

---

## 8. Do and don't

- **Do** add colour only through the tokens; a new colour needs a light-theme twin.
- **Do** reuse `PageHeader`, `WorkList`, `ExternalLink` and `.text-link` before writing new markup.
- **Do** keep the stylesheet compact, one rule per line, grouped by section.
- **Don't** add images, icon fonts or gradients. Visual interest comes from type, hairlines and the pixel field.
- **Don't** animate layout on scroll beyond the existing reveals, and never without a reduced-motion fallback.
- **Don't** put the pixel field behind long body text; it belongs behind headings.

---

## Appendix: complete stylesheet

Generated by `npm run docs:sync` from `frontend/app/globals.css`; do not edit by hand.

<!-- stylesheet:start -->

### `frontend/app/globals.css`

````css
/* Carbon / silver / moss. Content 0; sticky navigation 20; dialog top layer. */
:root {
  color-scheme: dark;
  --bg: #000000;
  --surface: #121212;
  --ink: #e9ede6;
  --muted: #9fa79f;
  --faint: #737e74;
  --line: #30382f;
  --selection: #344c31;
  --accent: #b1d49c;
  --ease: cubic-bezier(.16, 1, .3, 1);
  --gutter: clamp(24px, 5vw, 88px);
}
:root[data-theme="light"] { color-scheme: light; --bg: #eeefeb; --surface: #e2e6de; --ink: #20271f; --muted: #5d685b; --faint: #7e8b7c; --line: #c6cebf; --selection: #c2d5b7; --accent: #456b35; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 110px; }
/* Lenis momentum scrolling (components/SmoothScroll.tsx). It animates scroll itself, so native smooth scrolling is off while it runs. */
html.lenis, html.lenis body { height: auto; }
html.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: clip; }
.lenis [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-smooth iframe { pointer-events: none; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--font-sans), Arial, sans-serif; font-size: 16px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
::selection { background: var(--selection); color: var(--ink); }
a { color: inherit; text-decoration: none; }
button, input, textarea { font: inherit; }
button { color: inherit; cursor: pointer; }
button, a, summary { -webkit-tap-highlight-color: transparent; }
button { border: 0; border-radius: 0; background: none; }
button:active { transform: translateY(1px); }
:focus-visible { outline: 2px solid var(--ink); outline-offset: 6px; }
h1, h2, h3, p, ol, ul, dl, dd { margin: 0; }
h1, h2, h3 { font-weight: 450; }
ul, ol { padding: 0; }
strong { color: var(--ink); font-weight: 600; }
.container { width: min(calc(100% - var(--gutter) * 2), 1440px); margin-inline: auto; }
.muted { color: var(--muted); }
.meta { color: var(--muted); font-size: 13px; line-height: 1.7; }
.eyebrow { font-size: 12px; letter-spacing: .13em; text-transform: uppercase; color: var(--muted); margin-bottom: 32px; }
.skip-link { position: fixed; top: 12px; left: 16px; z-index: 30; background: var(--ink); color: var(--bg); padding: 12px 20px; transform: translateY(-150%); }
.skip-link:focus { transform: translateY(0); }
.text-link { display: inline-flex; gap: 28px; align-items: center; font-size: 14px; padding-block: 10px; position: relative; line-height: 1.5; }
.text-link::after { content: ''; position: absolute; left: 0; bottom: 3px; width: 100%; height: 1px; background: currentColor; transform: scaleX(.2); transform-origin: left; opacity: .6; transition: transform .5s var(--ease); }
.text-link:hover::after { transform: scaleX(1); }
.text-link > span[aria-hidden] { transition: transform .4s var(--ease); }
.text-link:hover > span[aria-hidden] { transform: translate(3px, -3px); }

/* Persistent navigation */
.site-header { position: sticky; top: 0; z-index: 20; background: var(--bg); }
.header-inner { height: 80px; display: flex; justify-content: space-between; align-items: center; gap: 28px; border-bottom: 1px solid var(--line); }
.wordmark { font-size: 29px; font-weight: 600; letter-spacing: -.065em; line-height: 1; }
.wordmark-dot { color: var(--accent); }
.desktop-nav { display: flex; gap: 34px; padding-left: 8vw; }
.desktop-nav a { position: relative; font-size: 13px; color: var(--muted); transition: color .25s; }
.desktop-nav a:hover, .desktop-nav a[aria-current="page"] { color: var(--ink); }
.nav-indicator { height: 1px; position: absolute; bottom: -8px; left: 0; right: 0; background: var(--accent); }
.header-actions { display: flex; gap: 26px; align-items: center; }
.header-contact { font-size: 13px; white-space: nowrap; }
.header-contact span { display: inline-block; margin-left: 14px; transition: transform .4s var(--ease); }
.header-contact:hover span { transform: translate(3px, -3px); }
.theme-toggle { width: 40px; height: 44px; display: grid; place-items: center; padding: 8px; }
.theme-toggle > span { display: block; width: 17px; height: 17px; border: 1px solid var(--ink); border-radius: 50%; background: linear-gradient(90deg, var(--ink) 50%, transparent 50%); transition: transform .55s var(--ease); }
.theme-toggle:hover > span { transform: rotate(180deg); }
.menu-toggle { display: none; gap: 14px; align-items: center; height: 44px; padding: 0; font-size: 13px; }
.menu-bars { display: flex; flex-direction: column; gap: 5px; }
.menu-bars i { width: 20px; height: 1px; background: currentColor; }
.menu-dialog { position: fixed; inset: 0; margin: 0; width: 100%; height: 100dvh; max-width: none; max-height: none; padding: 0; border: 0; background: var(--bg); color: var(--ink); }
.menu-dialog[open] { display: flex; flex-direction: column; }
.menu-dialog::backdrop { background: var(--bg); }
.menu-top { display: flex; justify-content: space-between; align-items: center; min-height: 80px; }
.menu-close { display: flex; align-items: center; gap: 20px; font-size: 14px; padding: 12px 0 12px 20px; }
.menu-close span { font-size: 30px; font-weight: 300; }
.menu-links { display: flex; flex-direction: column; justify-content: center; flex: 1; padding-block: 25px; }
.menu-links a { font-size: clamp(35px, 6.5dvh, 76px); line-height: 1.3; letter-spacing: -.055em; display: flex; justify-content: space-between; align-items: center; }
.menu-links a[aria-current="page"] { color: var(--muted); }
.menu-links a span { font-size: .6em; }
.menu-bottom { border-top: 1px solid var(--line); padding-block: 28px; display: flex; justify-content: space-between; font-size: 12px; gap: 20px; }

/* One wide typographic stage. The live pixel field is transparent until touched. */
.home-hero { padding-top: 35px; padding-bottom: 44px; border-bottom: 1px solid var(--line); }
.hero-meta { display: flex; align-items: center; justify-content: space-between; gap: 24px; font-size: 12px; color: var(--muted); }
.hero-meta > p:first-child { color: var(--ink); }
.hero-heading-row { position: relative; isolation: isolate; display: flex; align-items: center; min-height: clamp(290px, 31vw, 490px); margin-inline: calc(-1 * var(--gutter)); padding-inline: var(--gutter); }
.pixel-field { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }
.hero-name { position: relative; display: flex; align-items: baseline; gap: .23em; width: 100%; font-size: clamp(74px, 14.5vw, 230px); letter-spacing: -.078em; font-weight: 450; line-height: 1.2; padding-bottom: .08em; }
/* The clip box reaches past the glyphs so descenders (the j in Gujarati) are not cut off; margins cancel the extra room. */
.name-line { display: block; overflow: hidden; padding: 0 .08em .2em; margin: 0 -.08em -.2em; }
.name-line > span { display: block; }
/* --wave-color is set by PixelField while its idle wave runs; hovering returns the accent. */
.name-period { color: var(--wave-color, var(--accent)); transition: color .5s; }
.hero-bottom { display: flex; justify-content: space-between; align-items: center; gap: 40px; }
.hero-bottom > p { font-size: clamp(24px, 3vw, 43px); line-height: 1.4; letter-spacing: -.055em; color: var(--ink); }
.hero-bottom > p > span { color: var(--muted); }
.hero-work-link { display: inline-flex; align-items: center; gap: 34px; font-size: 13px; white-space: nowrap; }
.magnetic-target { padding: 8px; margin: -8px; }
.circle-arrow { width: 64px; height: 64px; border: 1px solid var(--line); border-radius: 50%; display: grid; place-items: center; font-size: 28px; font-weight: 300; transition: background .35s, color .35s; }
.circle-arrow > span { display: block; transition: transform .45s var(--ease); }
.hero-work-link:is(:hover, :focus-visible) .circle-arrow { background: var(--accent); color: var(--bg); border-color: var(--accent); }
.hero-work-link:is(:hover, :focus-visible) .circle-arrow > span { transform: rotate(45deg); }
.section-block { padding-block: 120px; }
.section-title { font-size: clamp(32px, 3.5vw, 52px); line-height: 1.2; letter-spacing: -.05em; font-weight: 450; }
.section-title-row { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 55px; }
.home-work { padding-top: 95px; padding-bottom: 65px; }
.home-about { border-top: 0; }
.work-list { border-top: 1px solid var(--line); }
.work-row { display: grid; grid-template-columns: 64px minmax(0, 1fr) 150px; align-items: center; gap: 30px; padding: 44px 12px 48px 0; border-bottom: 1px solid var(--line); position: relative; isolation: isolate; }
.work-row::before { content: ''; position: absolute; inset: 0 calc(var(--gutter) * -.35); z-index: -1; background: var(--surface); opacity: 0; transition: opacity .35s; }
.work-row:is(:hover, :focus-visible)::before { opacity: 1; }
.work-row::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px; background: var(--accent); transform: scaleX(0); transform-origin: right; transition: transform .7s var(--ease); }
.work-row:is(:hover, :focus-visible)::after { transform: scaleX(1); transform-origin: left; }
.work-index { font-size: 12px; color: var(--muted); align-self: start; padding-top: 10px; font-family: var(--font-jetbrains-mono), monospace; }
.work-info { transition: transform .6s var(--ease); }
.work-row:is(:hover, :focus-visible) .work-info { transform: translateX(6px); }
.work-info h2, .work-info h3 { font-size: clamp(44px, 6.2vw, 88px); font-weight: 400; line-height: 1.3; letter-spacing: -.065em; margin: 8px 0 12px; }
.work-description { font-size: 15px; max-width: 540px; line-height: 1.7; color: var(--muted); }
.work-arrow { font-size: 54px; font-weight: 300; justify-self: end; line-height: 1; transition: transform .55s var(--ease), color .3s; color: var(--muted); }
.work-action { display: flex; align-items: center; justify-content: flex-end; gap: 20px; }
.work-action-label { font-size: 11px; white-space: nowrap; opacity: 0; transform: translateX(-8px); transition: opacity .35s, transform .5s var(--ease); }
.work-row:is(:hover, :focus-visible) .work-action-label { opacity: 1; transform: translateX(0); }
.work-row:is(:hover, :focus-visible) .work-arrow, .next-project:is(:hover, :focus-visible) .work-arrow { transform: translate(4px, -4px); color: var(--accent); }
.home-career { display: grid; grid-template-columns: .9fr 1.35fr; gap: 10%; padding-bottom: 150px; }
.career-heading .text-link { margin-top: 32px; }
.career-note { max-width: 280px; font-size: 16px; color: var(--muted); margin-top: 25px; }
.career-preview-row { display: block; position: relative; padding-block: 32px; border-top: 1px solid var(--line); }
.career-preview-row h3 { font-size: clamp(21px, 2.3vw, 32px); letter-spacing: -.04em; margin-top: 12px; }
.career-preview-row > p { font-size: 14px; color: var(--muted); margin-top: 3px; }
.career-row-arrow { position: absolute; right: 0; top: 40px; font-size: 24px; color: var(--muted); transition: transform .4s var(--ease); }
.career-preview-row:hover .career-row-arrow { transform: translate(4px, -4px); }

/* Interior pages */
.page-shell { padding-top: 70px; padding-bottom: 80px; min-height: 65dvh; }
.page-heading { position: relative; isolation: isolate; padding-block: 8px 80px; margin-inline: calc(-1 * var(--gutter)); padding-inline: var(--gutter); }
.page-shell > .text-link + .page-heading { padding-top: 55px; }
.display-title { font-size: clamp(54px, 7.7vw, 118px); font-weight: 400; line-height: 1.09; letter-spacing: -.067em; text-wrap: balance; }
.page-intro { font-size: clamp(18px, 1.8vw, 25px); letter-spacing: -.025em; line-height: 1.6; color: var(--muted); max-width: 700px; margin-top: 35px; }
.page-heading > .text-link { margin-top: 32px; }
.page-heading > .meta { margin-bottom: 26px; }
.editorial-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 12%; border-top: 1px solid var(--line); padding-block: 85px; }
.editorial-grid .section-title { font-size: clamp(28px, 3vw, 42px); max-width: 360px; }
.body-copy { color: var(--muted); font-size: 18px; line-height: 1.85; letter-spacing: -.015em; }
p.body-copy + p.body-copy, .body-copy p + p { margin-top: 25px; }
.body-copy .text-link, .body-copy + .text-link { margin-top: 30px; color: var(--ink); }
.text-list { list-style: none; }
.text-list > li { color: var(--muted); font-size: 17px; line-height: 1.8; }
.text-list > li + li { margin-top: 32px; }
.text-list h3 { color: var(--ink); font-size: 24px; line-height: 1.3; letter-spacing: -.035em; margin-bottom: 15px; }
.text-list .meta + h3 { margin-top: 10px; }
.text-list .body-copy + .meta { margin-top: 12px; }
.text-list a { color: var(--ink); }
.project-facts { display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 60px; padding-block: 38px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.project-facts dt { color: var(--muted); font-size: 12px; margin-bottom: 10px; }
.project-facts dd { font-size: 15px; line-height: 1.8; }
.case-content .editorial-grid:first-child { border-top: 0; }
.next-project { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding-top: 80px; border-top: 1px solid var(--line); }
.next-project h2 { font-size: clamp(36px, 6vw, 80px); letter-spacing: -.06em; line-height: 1.3; margin-top: 12px; }
.next-project + .next-project { margin-top: 48px; padding-top: 48px; }

/* Experience: one continuous rail, with dates separate from the story. */
.career-timeline { position: relative; view-timeline-name: --career; view-timeline-axis: block; }
.career-timeline > ol { list-style: none; }
.timeline-rail { position: absolute; left: 0; top: 13px; bottom: 80px; width: 1px; background: var(--line); overflow: hidden; }
.timeline-rail > span { position: absolute; inset: 0; background: var(--ink); transform-origin: top; }
.timeline-job { display: grid; grid-template-columns: .75fr 1.7fr; gap: 70px; padding: 0 0 110px 40px; position: relative; scroll-margin-top: 120px; }
.timeline-job:last-child { padding-bottom: 20px; }
.timeline-date { position: relative; padding-top: 2px; }
.timeline-date > p { font-size: 13px; margin-bottom: 10px; }
.timeline-node { position: absolute; left: -44px; top: 8px; height: 9px; width: 9px; border: 1px solid var(--ink); border-radius: 50%; background: var(--bg); }
.timeline-job:first-child .timeline-node { background: var(--ink); }
.current-role { font-size: 12px; color: var(--muted); }
.job-role { color: var(--muted); font-size: 15px; margin-bottom: 10px; }
.timeline-content h2 { font-size: clamp(32px, 3.4vw, 48px); line-height: 1.25; letter-spacing: -.05em; margin-bottom: 35px; }
.job-points { list-style: none; }
.job-points li { font-size: 16px; line-height: 1.9; color: var(--muted); }
.job-points li + li { margin-top: 22px; }
.job-stack { color: var(--muted); font-size: 12px; line-height: 1.9; padding-top: 30px; margin-top: 32px; border-top: 1px solid var(--line); }

/* Research uses native, keyboard-accessible disclosures. */
.paper-list { border-top: 1px solid var(--line); margin-bottom: 42px; }
.paper-entry { border-bottom: 1px solid var(--line); }
.paper-entry summary { cursor: pointer; list-style: none; display: grid; grid-template-columns: 155px 1fr 30px; align-items: start; gap: 34px; padding-block: 36px; }
.paper-entry summary::-webkit-details-marker { display: none; }
.paper-entry summary { transition: color .3s, background .3s; }
.paper-entry summary:is(:hover, :focus-visible) { background: var(--surface); }
.paper-entry summary h2 { transition: transform .45s var(--ease); }
.paper-entry summary:is(:hover, :focus-visible) h2 { transform: translateX(5px); }
.paper-entry summary:is(:hover, :focus-visible) .disclosure-mark { transform: rotate(90deg); }
.paper-entry[open] summary:is(:hover, :focus-visible) .disclosure-mark { transform: rotate(135deg); }
.paper-full-title { font-size: 19px; line-height: 1.5; letter-spacing: -.025em; margin: 22px 0; }
.paper-entry summary > .meta { padding-top: 6px; }
.paper-entry h2 { font-size: clamp(21px, 2.1vw, 30px); line-height: 1.45; letter-spacing: -.035em; max-width: 840px; }
.disclosure-mark { font-size: 30px; line-height: 1.3; font-weight: 300; transition: transform .4s var(--ease); }
.paper-entry[open] .disclosure-mark { transform: rotate(45deg); }
.paper-body { margin-left: 189px; padding-bottom: 38px; max-width: 850px; }
.paper-body .body-copy { font-size: 16px; margin-top: 20px; }
.paper-body .body-copy + .meta { margin-top: 22px; }
.paper-body .text-link { margin-top: 20px; }
.paper-list + .body-copy { font-size: 14px; max-width: 720px; }
.page-heading + .section-block:has(.paper-list) { padding-top: 0; }

/* Direct contact, no pretend form submission. */
.contact-page .page-heading { padding-bottom: 70px; }
.contact-main { padding-block: 35px 50px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.contact-email { display: flex; align-items: center; justify-content: space-between; gap: 20px; font-size: clamp(20px, 3.4vw, 50px); line-height: 1.5; letter-spacing: -.05em; overflow-wrap: anywhere; }
.contact-email > span { transition: transform .4s var(--ease); }
.contact-email:hover > span { transform: translate(5px, -5px); }
.copy-email { margin-top: 25px; }
.contact-details { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
.contact-details h2 { font-size: 16px; margin-bottom: 24px; }
.contact-details .text-link { display: flex; width: fit-content; margin-bottom: 15px; }
.contact-details .meta { margin-top: 28px; }

/* Closing composition */
.site-footer { padding-block: 80px 28px; border-top: 1px solid var(--line); }
.footer-top > p { font-size: 14px; color: var(--muted); margin-bottom: 25px; }
.footer-contact { display: flex; align-items: baseline; justify-content: space-between; font-size: clamp(58px, 10.8vw, 160px); line-height: 1.15; letter-spacing: -.07em; font-weight: 400; padding-bottom: 65px; }
.footer-contact span { display: inline-block; font-size: .75em; transition: transform .6s var(--ease); }
.footer-contact:hover span { transform: translate(12px, -12px); }
.footer-bottom { display: flex; align-items: center; justify-content: space-between; gap: 25px; padding-top: 30px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; }
.footer-links { display: flex; gap: 27px; }
.footer-links a:hover, .back-top:hover { color: var(--ink); }
body:has(.contact-page) .footer-top { display: none; }
body:has(.contact-page) .site-footer { padding-top: 0; border-top: 0; }

/* The motion tells the reading order, without delaying access to content. */
/* Command palette */
.palette-trigger { display: inline-flex; align-items: center; gap: 10px; height: 34px; padding: 0 8px 0 12px; border: 1px solid var(--line); border-radius: 8px; font-size: 12px; color: var(--muted); white-space: nowrap; transition: color .25s, border-color .25s; }
.palette-trigger:hover { color: var(--ink); border-color: var(--muted); }
kbd { font-family: var(--font-jetbrains-mono), monospace; font-size: 10px; line-height: 1; padding: 3px 5px; border: 1px solid var(--line); border-radius: 4px; color: var(--muted); }
.palette { position: fixed; inset: 0; width: 100%; height: 100%; max-width: none; max-height: none; margin: 0; padding: 14vh 16px 16px; border: 0; background: transparent; color: var(--ink); }
.palette::backdrop { background: rgb(0 0 0 / .62); backdrop-filter: blur(6px); }
:root[data-theme="light"] .palette::backdrop { background: rgb(238 239 235 / .72); }
.palette-panel { max-width: 640px; margin-inline: auto; background: var(--bg); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; box-shadow: 0 40px 120px -40px rgb(0 0 0 / .75); transition: border-color .25s; }
.palette-panel:focus-within { border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); }
.palette-search { position: relative; isolation: isolate; display: flex; align-items: center; gap: 14px; padding: 22px; border-bottom: 1px solid var(--line); }
.palette-prompt { font-size: 22px; color: var(--accent); line-height: 1; }
.palette-input { flex: 1; min-width: 0; border: 0; background: transparent; color: var(--ink); font-size: 19px; letter-spacing: -.02em; outline: none; }
.palette-input::placeholder { color: var(--faint); }
.palette-input:focus-visible { outline: none; }
.palette-list { list-style: none; max-height: min(52vh, 440px); overflow-y: auto; padding: 8px; overscroll-behavior: contain; }
.palette-option { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 16px; padding: 11px 14px; border-radius: 9px; cursor: pointer; }
.palette-option[aria-selected="true"] { background: var(--surface); box-shadow: inset 2px 0 0 var(--accent); }
.palette-title { font-size: 15px; letter-spacing: -.01em; transition: color .2s; }
.palette-option[aria-selected="true"] .palette-title { color: var(--accent); }
.palette-hint { grid-column: 1; font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.palette-group { grid-column: 2; grid-row: 1 / span 2; align-self: center; font-family: var(--font-jetbrains-mono), monospace; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); }
.palette-empty { padding: 28px 22px; font-size: 14px; color: var(--muted); }
.palette-footer { display: flex; justify-content: space-between; gap: 16px; padding: 12px 22px; border-top: 1px solid var(--line); font-size: 11px; color: var(--faint); }
.palette-status { color: var(--accent); }

/* Page transitions: shared titles morph between pages while the header stays put. */
::view-transition { pointer-events: none; }
::view-transition-group(.morph) { animation-duration: 450ms; animation-timing-function: cubic-bezier(.16, 1, .3, 1); }
::view-transition-image-pair(.morph) { animation-name: via-blur; }
@keyframes via-blur { 30% { filter: blur(3px); } }
::view-transition-group(site-header) { animation: none; z-index: 100; }
::view-transition-old(site-header) { display: none; }
::view-transition-new(site-header) { animation: none; }

@media (prefers-reduced-motion: no-preference) {
  .palette[open] .palette-panel { animation: palette-enter .24s var(--ease) both; }
  body, .site-header, .menu-dialog { transition: background-color .25s, color .25s; }
  .route-enter { animation: route-enter .4s var(--ease) both; }
  .name-line > span { animation: name-enter 1.05s var(--ease) both; }
  .name-line:nth-child(2) > span { animation-delay: .12s; }
  .hero-meta { animation: soft-enter .75s .1s var(--ease) both; }
  .hero-bottom { animation: soft-enter .75s .3s var(--ease) both; }
  .menu-dialog[open] .menu-links a { animation: menu-enter .65s var(--ease) both; animation-delay: calc(var(--order) * 45ms); }
  .paper-entry[open] .paper-body { animation: soft-enter .5s var(--ease); }
  @supports (animation-timeline: view()) {
    .timeline-rail > span { animation: rail-grow linear both; animation-timeline: --career; animation-range: entry 40% exit 70%; }
  }
}
@keyframes name-enter { from { transform: translateY(130%) rotate(2deg); } to { transform: translateY(0) rotate(0); } }
@keyframes soft-enter { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes palette-enter { from { opacity: 0; transform: translateY(-8px) scale(.985); } to { opacity: 1; transform: none; } }
@keyframes route-enter { from { opacity: .4; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes menu-enter { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rail-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }

@media (max-width: 1100px) {
  .desktop-nav { gap: 24px; padding-left: 0; }
  .header-actions { gap: 15px; }
  .section-block { padding-block: 90px; }
  .home-work { padding-top: 75px; }
  .home-career { gap: 7%; }
  .timeline-job { gap: 35px; }
  .editorial-grid { gap: 8%; }
}
@media (max-width: 767px) {
  :root { --gutter: 24px; }
  .header-inner { height: 72px; }
  .wordmark { font-size: 27px; }
  .desktop-nav, .header-contact { display: none; }
  .header-actions { gap: 18px; }
  .palette-trigger { padding-right: 12px; }
  .palette-trigger kbd { display: none; }
  .palette { padding-top: 10vh; }
  .palette-footer > span:last-child { display: none; }
  .menu-toggle { display: flex; }
  .home-hero { padding-top: 26px; padding-bottom: 30px; }
  .hero-meta { align-items: flex-start; flex-direction: column; gap: 4px; font-size: 11px; }
  .hero-meta > p + p { font-size: 10px; }
  .hero-heading-row { min-height: 0; padding-block: 40px 34px; }
  .hero-name { display: block; font-size: clamp(68px, 23vw, 165px); line-height: 1.16; letter-spacing: -.078em; padding-bottom: .04em; }
  .name-line + .name-line { margin-top: -.24em; }
  .hero-bottom { align-items: flex-start; flex-direction: column; gap: 24px; }
  .hero-bottom > p { font-size: 24px; }
  .hero-work-link { justify-content: space-between; width: 100%; }
  .circle-arrow { width: 52px; height: 52px; font-size: 25px; }
  .section-block { padding-block: 75px; }
  .section-title { font-size: 32px; }
  .section-title-row { margin-bottom: 32px; align-items: flex-end; }
  .section-title-row > .text-link { font-size: 12px; gap: 14px; white-space: nowrap; }
  .home-work { padding-top: 65px; padding-bottom: 45px; }
  .work-row { grid-template-columns: 26px minmax(0, 1fr) 28px; gap: 12px; padding-block: 32px 36px; padding-right: 0; }
  .work-info h2, .work-info h3 { font-size: clamp(35px, 8.4vw, 58px); line-height: 1.3; margin-top: 10px; }
  .work-info .meta { font-size: 11px; }
  .work-description { font-size: 13px; }
  .work-arrow { font-size: 32px; }
  .work-action-label { display: none; }
  .work-row:is(:hover, :focus-visible) .work-info { transform: none; }
  .work-index { font-size: 10px; padding-top: 3px; }
  .home-career { grid-template-columns: 1fr; gap: 42px; padding-bottom: 90px; }
  .career-note { margin-top: 16px; font-size: 15px; }
  .career-heading .text-link { margin-top: 16px; }
  .career-preview-row { padding-block: 24px; }
  .career-preview-row h3 { font-size: 25px; }
  .career-row-arrow { top: 30px; }
  .page-shell { padding-top: 52px; padding-bottom: 70px; }
  .page-heading { padding-bottom: 60px; }
  .display-title { font-size: clamp(45px, 9.7vw, 72px); line-height: 1.14; letter-spacing: -.06em; }
  .page-intro { font-size: 18px; margin-top: 25px; }
  .eyebrow { font-size: 11px; margin-bottom: 24px; }
  .editorial-grid { grid-template-columns: 1fr; gap: 32px; padding-block: 60px; }
  .editorial-grid .section-title { font-size: 30px; }
  .body-copy { font-size: 16px; line-height: 1.85; }
  .text-list > li { font-size: 16px; }
  .text-list h3 { font-size: 23px; }
  .text-list > li + li { margin-top: 35px; }
  .project-facts { grid-template-columns: 1fr 1fr; gap: 30px; }
  .project-facts > div:last-child { grid-column: 1 / -1; }
  .project-facts dd { font-size: 14px; }
  .timeline-job { grid-template-columns: 1fr; gap: 25px; padding-left: 25px; padding-bottom: 75px; }
  .timeline-node { left: -29px; }
  .timeline-date > p { margin-bottom: 0; font-size: 12px; }
  .timeline-date .meta, .current-role { font-size: 11px; }
  .timeline-content h2 { font-size: 32px; margin-bottom: 24px; }
  .job-role { font-size: 13px; }
  .job-points li { font-size: 15px; }
  .job-stack { font-size: 11px; margin-top: 24px; padding-top: 22px; }
  .paper-entry summary { grid-template-columns: 1fr 25px; gap: 12px 20px; padding-block: 28px; }
  .paper-entry summary > .meta { grid-column: 1; padding: 0; font-size: 11px; }
  .paper-entry h2 { grid-column: 1; grid-row: 2; font-size: 21px; }
  .disclosure-mark { grid-column: 2; grid-row: 2; font-size: 26px; }
  .paper-body { margin-left: 0; padding-right: 20px; }
  .paper-body .body-copy { font-size: 15px; }
  .contact-page .page-heading { padding-bottom: 50px; }
  .contact-email { font-size: clamp(17px, 4.8vw, 34px); letter-spacing: -.04em; gap: 12px; }
  .contact-details { gap: 25px; }
  .contact-details h2 { font-size: 14px; }
  .contact-details .text-link { font-size: 13px; gap: 15px; }
  .next-project { padding-top: 48px; }
  .next-project + .next-project { margin-top: 32px; padding-top: 32px; }
  .site-footer { padding-top: 55px; }
  .footer-top > p { font-size: 13px; }
  .footer-contact { font-size: 17vw; padding-bottom: 50px; }
  .footer-bottom { flex-wrap: wrap; font-size: 11px; gap: 24px; }
  .footer-links { gap: 20px; }
  .footer-bottom > p { width: 100%; }
  .back-top { margin-left: auto; }
  .menu-bottom { flex-wrap: wrap; }
}
@media (max-width: 380px) {
  :root { --gutter: 19px; }
  .hero-name { font-size: 22vw; }
  .section-title-row { align-items: flex-start; flex-direction: column; gap: 12px; }
  .footer-links { gap: 14px; }
  .contact-details { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation-duration: 0s !important; animation-delay: 0s !important; }
}
````

<!-- stylesheet:end -->
