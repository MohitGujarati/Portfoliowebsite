# Current portfolio handoff — October 18, 2026

## User requirements

- Local preview, not deployment. No images or image generation.
- Minimal multipage portfolio, subtle motion, distinct interactions.
- Preserve the Experience section and the ability to restore earlier versions.
- Latest reference: small irregular green squares behind Mohit's name, revealed only around the pointer and hidden at rest.

## Latest completed pass

- Rebuilt the desktop hero around a single large line of type; mobile uses two lines.
- Added `components/PixelField.tsx`, a local Canvas 2D interaction. No image assets, no React updates per pointer movement, no idle render loop, capped device-pixel ratio, cleanup, reduced-motion behavior, passive touch events.
- Default carbon/moss palette, with saved light mode preserved. Green feedback carries through navigation and project hover states.
- Removed the generic homepage manifesto section and its CSS. Kept the meaningful project and experience content.
- Work CTA anchors to actual selected projects. Existing case studies and all secondary pages remain functional.
- Added Next's `data-scroll-behavior` attribute to avoid smooth scrolling between routes.

## Verification

- Production build succeeded: 22 generated routes, including three case studies.
- Final TypeScript check passed after hero/content refinement.
- Browser: desktop pixel reveal and leave-to-clear checked; both themes checked.
- Mobile 390 × 844: no horizontal overflow (content width 375 including native scrollbar behavior), readable stacked name, work content visible below the hero.
- Menu opens by keyboard; Escape closes it, restores trigger focus and body scrolling.
- Work anchor lands at the 110px sticky-header offset; Shop Circle case navigation confirmed.
- No application runtime errors observed. Next's smooth-scroll diagnostic was addressed.

## Local startup

Run `npm run dev` from `frontend`, then open http://localhost:3000.
The latest development server was left running for the user's preview. Restart only if the port is no longer serving.

## Restore snapshots

- `.design-backup/2026-10-17-pre-cinematic.zip`: before the multipage redesign.
- `.design-backup/2026-10-18-pre-pixel.zip`: immediately before the pixel-field revision.
- These local archives are git-ignored. Do not overwrite them or reset the user's dirty worktree.

Any future pass should begin by reading the current code and this record, not by rebuilding the project from scratch. No automatic work has been scheduled across session resets.
