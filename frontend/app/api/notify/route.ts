import { NextResponse } from 'next/server';

const MAX_LENGTH = 400;
/** Only the two message formats the site sends (lib/notify.ts and the command palette). */
const SITE_MESSAGE = /^(👀 \*Visitor click\*|🔎 \*Command palette\*) on `\/[^`]{0,120}`: /u;

/**
 * Forwards visitor notifications to Slack. The webhook URL stays in the server-only SLACK_WEBHOOK_URL,
 * so it never reaches the browser and cannot be copied from the page.
 */
export async function POST(request: Request) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return new NextResponse(null, { status: 204 });

  // Browsers always send Origin on POST: accept only requests from this site's own pages.
  const origin = request.headers.get('origin');
  if (!origin || new URL(origin).host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });

  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (typeof text !== 'string' || text.length > MAX_LENGTH || !SITE_MESSAGE.test(text))
    return new NextResponse(null, { status: 400 });

  // Raw < > could form Slack mentions such as <!channel>; the site's own text is already escaped.
  const safe = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: safe }),
  });
  return new NextResponse(null, { status: response.ok ? 204 : 502 });
}
