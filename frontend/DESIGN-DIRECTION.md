# Portfolio direction

Reading this as: a personal engineering portfolio for collaborators and hiring teams, with a minimal, cinematic luxury language built from typography and motion.

DESIGN_VARIANCE: 7. MOTION_INTENSITY: 6. VISUAL_DENSITY: 2.

The user's explicit no-images instruction overrides image recommendations in the design skill. No raster visuals, generated images, photos, decorative SVG illustrations, fake screenshots, or image placeholders.

## Existing site audit

The restored site uses Inter Tight, JetBrains Mono and Instrument Serif, a dark terminal identity, code panels, a boot animation, a floating pet, and a long single-page layout. Separate About, Experience, Research and project pages exist. Preserve the content source, PDFs, route compatibility, metadata and analytics. Preserve the chronology and progression of the experience timeline. Replace the terminal styling, competing effects and dense homepage.

## New system

- Graphite and silver palette; equally considered pale theme, following system preference with a manual control.
- Manrope as the primary family, with a narrow use of the existing monospace family for dates.
- Text itself is the visual material: oversized personal identity, controlled letter spacing, thin weights and clear spatial composition.
- A short introduction, selected projects and a career preview on the home page. Separate Work, Experience, About, Research and Contact pages.
- Sharp geometry. Circular controls only where the control is a compact standalone action. No elevated cards.
- Entry choreography establishes hierarchy; scroll reveals pace the reading; a growing timeline expresses chronological progression; hover and navigation motion provide feedback.
- Native scrolling. No custom cursor, endless intro, auto-playing media or scroll hijacking. Reduced-motion support and fully readable no-JavaScript content.
- Refinement: projects come immediately after the opening; mobile hero height follows content; interior content is edited into fewer sections. Motion supplies a shared navigation underline, restrained arrow spring, and 20px opposing name movement on desktop scroll. CSS and Web Animations handle brief route and below-fold reveals, without hiding content at rest.
- Motion reference: https://motion.dev/docs/react-use-scroll and https://motion.dev/docs/react-use-reduced-motion . No library example assets are used.
- Layers: base 0; sticky header 20; native menu dialog uses browser top layer.

## Restore point

`.design-backup/2026-10-17-pre-cinematic.zip` preserves app, components, lib and the relevant configuration before this build. Keep this snapshot and the older original snapshot.

## October 18 — pixel-field revision

The user's supplied reference overrides the earlier text-only art direction: introduce a code-rendered grid of small rounded squares behind the name. No imported or generated images. The field is completely clear at rest, illuminates green around the pointer, and decays when the pointer leaves. Canvas drawing is local, capped at 2× DPR, uses elapsed-time easing, pauses when hidden, and stops its animation loop when settled. Reduced-motion removes the trailing interpolation; touch interaction never prevents page scrolling.

The desktop identity is now one horizontal line, paired with a simple role/location line and a work anchor. Default theme is carbon with a muted moss accent; a saved light preference is preserved. Removed the redundant homepage manifesto and its unused styles. Experience remains intact. Snapshot before this revision: `.design-backup/2026-10-18-pre-pixel.zip`.

Implementation references: MDN [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), and [roundRect](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect).
