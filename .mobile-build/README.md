# Mohit Gujarati — React Native Portfolio

A native Android/iOS portfolio built with Expo SDK 57, React Native, and TypeScript. Its charcoal/lime colors, typography, code card, terminal, and content are adapted from the portfolio website in `../frontend`.

## Run

Use **Node 24 LTS** (or Node 22.13+). Node 23 is outside the supported range of this React Native version.

```powershell
cd .mobile-build
npm install
npm start
```

Scan the QR code with an **Expo Go version compatible with SDK 57**. Your phone and computer must be on the same Wi-Fi. Press `a` for a running Android emulator, or `w` for the web preview. An iOS simulator requires macOS; a physical iPhone can use compatible Expo Go.

Dependencies are included in the local handoff, so `npm install` is only needed if they are missing or changed. Start the Express server before opening the app on a fresh device.

## Features

- Home with the website's code-card styling and links to featured work.
- Searchable projects with Mobile, Web, and AI filters, detailed case studies, and persistent bookmarks.
- Work timeline, skills, education, and awards.
- Research library with abstracts and five bundled PDFs.
- Bundled résumé; PDFs open in the browser on web and use the native share/open sheet on mobile.
- Contact links, copy-email action, and a message composer that opens the user's email app for review. The app does not send email itself.
- Interactive terminal: `help`, `whoami`, `projects`, `experience`, `skills`, `research`, `contact`, `home`, `clear`.
- Persistent light/dark theme, safe-area layouts, Android back handling, and accessibility labels.
- Supabase-backed portfolio content through the shared Express API, with a last-known-good device cache.

## Shared Supabase data

The app requires `EXPO_PUBLIC_API_URL` in `.env`. It is currently configured for the local Express server at `http://192.168.0.80:5000`. Restart Expo after changing environment variables.

| Device | Example address |
| --- | --- |
| Android emulator | `http://10.0.2.2:5000` |
| Physical phone | `http://YOUR_COMPUTER_LAN_IP:5000` |
| Web on this computer | `http://localhost:5000` |

The app reads the atomic `/api/portfolio` endpoint. It also supports `/api/profile`, `/api/projects`, `/api/experience`, `/api/education`, and `/api/skills` as a compatibility fallback. Responses must match the types in `src/data/model.ts`. Project records need a unique `slug`; experience records need a unique `hash`. Unknown database fields are ignored. Optional project `github` and `url` links are supported when supplied.

The five endpoints are validated together. Supabase is the source of truth. A successful response is cached on the device, and failed requests, invalid content, or an eight-second timeout retain only that last successful response. On a fresh install without a connection, the app shows a retry screen. Pull down on a screen to refresh. Research descriptions and PDFs remain bundled because the current database has no research endpoint. Use HTTPS for a production API; local HTTP examples are intended for Expo Go development. Never put database passwords or service-role keys in `EXPO_PUBLIC_*` variables.

## Edit content

- `src/data/model.ts`: API types, validation, project filters, and terminal commands.
- `src/data/research.ts`: research descriptions and awards that do not yet have Supabase endpoints.
- `src/theme.ts`: colors and font families.
- `App.tsx`: app shell: fonts, theme, tab navigation, and modal state.
- `src/screens/`: one file per screen (`Home`, `Work`, `Journey`, `Research`, `Connect`), the `DetailModal` and `Terminal` modals, shared pieces in `common.tsx`, styles in `styles.ts`.
- `src/components/UI.tsx`: shared UI components.
- `src/data/api.ts` and `usePortfolio.ts`: validated API access, timeout, and offline cache.
- `src/documents.ts` and `assets/`: résumé and research PDF mapping.

Fonts and documents are local assets. A packaged native build can access them offline. Expo Go still needs the development server to load the app initially.

## Checks

```powershell
npm run typecheck
npm test
npm run check:data -- http://192.168.0.80:5000
# Optional production bundling; does not create an APK or IPA:
npm run export
```

TypeScript and the model/API tests were checked during development. The web bundle loaded successfully in a local browser. Device behavior and native Hermes compilation have not been verified: no Android device was connected and permission to execute Hermes was declined. No APK/IPA was generated. No commit, push, or deployment was performed.
