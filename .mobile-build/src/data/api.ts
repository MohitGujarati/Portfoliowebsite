import { parsePortfolio, type Portfolio } from './model';

/** Atomic update: one failed/invalid endpoint rejects the entire snapshot. */
export async function fetchPortfolio(
  baseUrl: string,
  signal: AbortSignal,
  transport: typeof fetch = fetch,
): Promise<Portfolio> {
  if (!/^https?:\/\//i.test(baseUrl)) throw new Error('The API URL must start with http:// or https://.');
  const base = baseUrl.replace(/\/+$/, '');
  const combined = await transport(`${base}/api/portfolio`, { signal });
  if (combined.ok) {
    const valid = parsePortfolio(await combined.json());
    if (!valid) throw new Error('The server returned invalid portfolio data.');
    return valid;
  }
  if (combined.status !== 404) throw new Error('The portfolio endpoint is unavailable.');

  // Compatibility fallback for older deployments of the existing Express API.
  const keys = ['profile', 'projects', 'experience', 'education', 'skills'] as const;
  const values = await Promise.all(
    keys.map(async (key) => {
      const response = await transport(`${base}/api/${key}`, { signal });
      if (!response.ok) throw new Error(`The ${key} endpoint is unavailable.`);
      return response.json();
    }),
  );
  const valid = parsePortfolio(Object.fromEntries(keys.map((key, i) => [key, values[i]])));
  if (!valid) throw new Error('The server returned invalid portfolio data.');
  return valid;
}
