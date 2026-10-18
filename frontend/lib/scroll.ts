import type Lenis from 'lenis';

// Header clearance comes from `scroll-padding-top` in globals.css, which both Lenis and native scrolling honour.
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Glide to an element, or jump with `immediate`. Falls back to native scrolling before Lenis starts. */
export function scrollToElement(element: HTMLElement, immediate = false) {
  if (lenis) lenis.scrollTo(element, { immediate, force: true });
  else element.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth', block: 'start' });
}

/** The element a same-page `#fragment` link points to, or null for any other link. */
export function samePageTarget(href: string) {
  const url = new URL(href, window.location.href);
  const path = (pathname: string) => pathname.replace(/\/$/, '');
  if (!url.hash || url.origin !== window.location.origin || path(url.pathname) !== path(window.location.pathname))
    return null;
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

/** Navigate within the site: glide when the target is on this page, otherwise hand over to the router. */
export function navigateTo(href: string, push: (href: string) => void) {
  const target = samePageTarget(href);
  if (!target) return push(href);
  window.history.pushState(window.history.state, '', new URL(href, window.location.href).hash);
  scrollToElement(target);
}

/** Jump to the top and drop any momentum left over from the previous page. */
export function resetScroll() {
  lenis?.scrollTo(0, { immediate: true, force: true });
}
