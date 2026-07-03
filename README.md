# ⚽ MG26 — Ultimate Portfolio

<b>🔗 [Play it live → mohitgujarati.github.io/Portfoliowebsite](https://mohitgujarati.github.io/Portfoliowebsite/)</b>

A FIFA / EA-FC-style **playable portfolio**. No frameworks, no build step — plain HTML/CSS/JS, deployed on GitHub Pages.

## 🎮 Features

- **Boot screen** — press to kick off
- **FUT-style player card** with a 94 OVR rating and dev-themed stats (KOT · AND · AI · ARC · DB · WEB)
- **Squad hub** — every project is a player card (gold, TOTY, hero and classified tiers). Tap for the full scouting report
- **Pack opening** — walkout animation, confetti and all. No microtransactions, 100% pack luck
- **Career mode** — experience as seasons with form ratings
- **Attributes** — skills as animated 0–99 stat bars
- **Trophy room** — certifications as silverware
- **Scout reports** — research papers as dossiers
- **Contract talks** — the contact section (transfer window is open)
- **XP, levels & achievements** — persisted in localStorage; explore to rank up from Academy Prospect to Icon
- **Synthesized sound effects** via WebAudio (mute toggle in the HUD)
- 🕹️ *Legends say an old code still works here… (↑↑↓↓←→←→BA)*

## 🗂️ Editing content

All portfolio content (projects, experience, skills, certifications, papers) lives in **`js/data.js`** — one source of truth used by both modes.

Game flavor (ratings, positions, card tiers, ticker news, XP rules) lives in **`game/game-data.js`**.

| File | Purpose |
|---|---|
| `index.html` | Game mode (default) |
| `classic.html` | The classic portfolio, untouched |
| `game/` | Game styles, engine and data |
| `contract.html` | Dark-themed EmailJS contact form (iframe) |
| `contacts.html` | Original contact form (used by classic mode) |

## 📸 Previous versions

Version 1 (classic) is still available at [`/classic.html`](https://mohitgujarati.github.io/Portfoliowebsite/classic.html).

<p align="center">
  <a href="https://mohitgujarati.github.io/Portfoliowebsite/classic.html" target="_blank">
   <img width="1819" height="938" alt="Classic portfolio preview" src="https://github.com/user-attachments/assets/dafffaf2-6075-42db-9248-1f93d4b4f15e" />
  </a>
</p>

---
*Not affiliated with EA SPORTS.*
