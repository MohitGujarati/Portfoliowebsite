import { NextResponse } from 'next/server';

/**
 * Daily keep-alive (scheduled in vercel.json): requesting the Express API's projects wakes the Render server,
 * and its query keeps the Supabase project from pausing. Vercel sends `Authorization: Bearer $CRON_SECRET` when
 * CRON_SECRET is set, which stops anyone else from triggering it.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`)
    return NextResponse.json({ success: false }, { status: 401 });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const response = await fetch(`${apiUrl}/api/projects`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`API responded with status ${response.status}`);
    const data = await response.json();
    return NextResponse.json({ success: true, projectsFound: Array.isArray(data) ? data.length : 0 });
  } catch (error) {
    // Details stay in the Vercel logs, not in the public response.
    console.error('Keep-alive failed:', error);
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
