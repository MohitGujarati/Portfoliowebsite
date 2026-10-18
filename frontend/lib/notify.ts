// Slack notifications go through the site's own /api/notify route, which holds the webhook URL server-side.
// A static export (GitHub Pages) has no server, so notifications are off there.
const endpoint = process.env.NEXT_PUBLIC_STATIC_EXPORT
  ? null
  : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/notify/`;

/** Escape the characters Slack treats as markup in message text. */
export const slackText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Send a Slack message through the site's notify route. Fire-and-forget; keepalive lets it finish on navigation. */
export function notifySlack(text: string) {
  if (!endpoint) return;
  void fetch(endpoint, {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }).catch(() => {});
}

/** Describe a clicked link or button in one Slack line. */
export function describeClick(element: Element, page: string) {
  const label =
    // A card-style link (project or job row) is named by its heading, not all of its text.
    (element.getAttribute('aria-label') || element.querySelector('h2, h3')?.textContent || element.textContent || '')
      .replace(/[↗↑←→×✓+]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80) || element.tagName.toLowerCase();
  const href = element instanceof HTMLAnchorElement ? element.href.replace(window.location.origin, '') : '';
  return `👀 *Visitor click* on \`${page}\`: "${slackText(label)}"${href ? ` → ${slackText(href)}` : ''}`;
}
