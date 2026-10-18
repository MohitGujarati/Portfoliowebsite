import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchPortfolio } from '../src/data/api';
import { fixture } from './fixture';

test('loads and validates the combined portfolio endpoint', async () => {
  const requests: string[] = [];
  const transport: typeof fetch = async (url, options) => {
    requests.push(String(url));
    assert.ok(options?.signal);
    return Response.json(fixture);
  };
  assert.deepEqual(await fetchPortfolio('http://localhost:5000/', new AbortController().signal, transport), fixture);
  assert.deepEqual(requests, ['http://localhost:5000/api/portfolio']);
});
test('falls back to the five legacy endpoints when the combined route is absent', async () => {
  const requests: string[] = [];
  const transport: typeof fetch = async (url) => {
    const key = String(url).split('/').at(-1) as keyof typeof fixture | 'portfolio';
    requests.push(key);
    return key === 'portfolio' ? new Response('missing', { status: 404 }) : Response.json(fixture[key]);
  };
  assert.deepEqual(await fetchPortfolio('https://portfolio.example', new AbortController().signal, transport), fixture);
  assert.deepEqual(requests, ['portfolio', 'profile', 'projects', 'experience', 'education', 'skills']);
});
test('rejects a server failure without mixing partial updates', async () => {
  const transport: typeof fetch = async () => new Response('unavailable', { status: 503 });
  await assert.rejects(
    fetchPortfolio('https://portfolio.example', new AbortController().signal, transport),
    /unavailable/,
  );
});
test('rejects malformed JSON, invalid content and render-unsafe optional fields', async () => {
  for (const response of [new Response('bad json'), Response.json({ error: 'not a profile' })]) {
    await assert.rejects(
      fetchPortfolio('https://portfolio.example', new AbortController().signal, async () => response),
    );
  }
  await assert.rejects(
    fetchPortfolio('https://portfolio.example', new AbortController().signal, async () =>
      Response.json({ ...fixture, education: [{ ...fixture.education[0], description: { bad: true } }] }),
    ),
    /invalid/,
  );
});
test('passes cancellation to requests and rejects network failures', async () => {
  const controller = new AbortController();
  controller.abort();
  const transport: typeof fetch = async (_url, options) => {
    options?.signal?.throwIfAborted();
    throw new Error('offline');
  };
  await assert.rejects(fetchPortfolio('https://portfolio.example', controller.signal, transport), {
    name: 'AbortError',
  });
  await assert.rejects(fetchPortfolio('https://portfolio.example', new AbortController().signal, transport), /offline/);
});
test('rejects invalid URL schemes before issuing requests', async () => {
  await assert.rejects(
    fetchPortfolio('file:///portfolio', new AbortController().signal, async () => {
      throw new Error('must not be called');
    }),
    /API URL/,
  );
});
