import test from 'node:test';
import assert from 'node:assert/strict';
import { counterPayload } from '../lib/contact-counter.mjs';
import { handleContactCounter } from '../lib/contact-counter-server.mjs';

const anon = `e30.${Buffer.from(JSON.stringify({ role: 'anon' })).toString('base64url')}.test-signature`;
const config = { YIKAT_CONTACT_COUNTER_ENABLED: 'true', VERCEL_ENV: 'production', YIKAT_PARTNER_SUPABASE_URL: 'https://dbannpdbhdvrxxxdbccj.supabase.co', YIKAT_PARTNER_ANON_KEY: anon };
const payload = { schema: 2, action: 'whatsapp', page: '/', referrer: 'google' };
const request = (body = payload, headers = {}) => new Request('https://www.yikat.tech/api/contact-counts', { method: 'POST', headers: { origin: 'https://www.yikat.tech', 'sec-fetch-site': 'same-origin', 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0 Safari/605', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const recorded = () => { const calls = []; return { calls, fetcher: async (...args) => { calls.push(args); return Response.json({ ok: true }); } }; };

test('payload buckets approved guides but removes arbitrary paths and extra properties', () => {
  assert.deepEqual(counterPayload({ schema: 1, action: 'whatsapp', page: '/rehber/ayakkabi-nasil-kurutulur', referrer: 'google', email: 'not-retained' }), { schema: 2, action: 'whatsapp', page: '/rehber/*', referrer: 'google' });
  assert.equal(counterPayload({ action: 'call', page: '/customer@example.test', referrer: 'other' }).page, 'other');
  assert.equal(counterPayload({ action: 'directions', page: '/rehber?private=query', referrer: 'other' }).page, 'other');
});
test('valid same-origin activation emits only approved RPC arguments, no forwarded headers', async () => {
  const transport = recorded();
  const response = await handleContactCounter(request(), config, transport.fetcher);
  assert.equal(response.status, 204);
  assert.equal(transport.calls.length, 1);
  assert.equal(transport.calls[0][0], `${config.YIKAT_PARTNER_SUPABASE_URL}/rest/v1/rpc/record_website_contact`);
  assert.deepEqual(JSON.parse(transport.calls[0][1].body), { p_action: 'whatsapp', p_page: '/', p_referrer: 'google' });
  assert.deepEqual(Object.keys(transport.calls[0][1].headers).sort(), ['Authorization', 'Content-Type', 'apikey']);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('disabled, local and mismatched project environments never call storage', async () => {
  for (const overrides of [{ YIKAT_CONTACT_COUNTER_ENABLED: 'false' }, { VERCEL_ENV: 'development' }, { VERCEL_ENV: 'preview' }, { YIKAT_PARTNER_SUPABASE_URL: 'https://evil.example' }, { YIKAT_PARTNER_ANON_KEY: `e30.${Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url')}.x` }]) {
    const transport = recorded();
    assert.equal((await handleContactCounter(request(), { ...config, ...overrides }, transport.fetcher)).status, 503);
    assert.equal(transport.calls.length, 0);
  }
});
test('wrong origin, missing Fetch Metadata, bots, method and bodies are rejected before RPC', async () => {
  for (const invalid of [request(payload, { origin: 'https://evil.example' }), request(payload, { 'sec-fetch-site': 'cross-site' }), request(payload, { 'sec-fetch-site': '' }), request(payload, { 'user-agent': 'Googlebot/2.1' }), request(payload, { 'user-agent': 'HeadlessChrome' }), request(payload, { 'content-type': 'text/plain' }), new Request('https://www.yikat.tech/api/contact-counts')]) {
    const transport = recorded(); await handleContactCounter(invalid, config, transport.fetcher); assert.equal(transport.calls.length, 0);
  }
  for (const invalid of ['{', 'x'.repeat(513), { ...payload, customerId: 'secret' }, { ...payload, events: 10 }, { ...payload, day: '2020-01-01' }, { ...payload, page: '/private-person' }, { ...payload, referrer: 'https://google.com?q=private' }, { ...payload, action: 'purchase' }, { ...payload, schema: 1 }, null, [payload]]) {
    const transport = recorded(); assert.notEqual((await handleContactCounter(request(invalid), config, transport.fetcher)).status, 204); assert.equal(transport.calls.length, 0);
  }
});
test('chunked oversized body is bounded without trusting Content-Length', async () => {
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('x'.repeat(600))); controller.close(); } });
  const value = new Request('https://www.yikat.tech/api/contact-counts', { method: 'POST', headers: Object.fromEntries(request().headers), body: stream, duplex: 'half' });
  const transport = recorded(); assert.equal((await handleContactCounter(value, config, transport.fetcher)).status, 413); assert.equal(transport.calls.length, 0);
});
test('provider failure, wrong shape and caps are not reported as accepted events', async () => {
  for (const fetcher of [async () => { throw new Error('sensitive-provider-detail'); }, async () => new Response('provider detail', { status: 500 }), async () => Response.json({}), async () => Response.json({ ok: false, error: 'daily_limit' })]) {
    const response = await handleContactCounter(request(), config, fetcher);
    assert.ok([429, 503].includes(response.status));
    assert.equal((await response.text()).includes('provider'), false);
  }
});

test('preview may write only the pinned scratch project', async () => {
  const transport = recorded();
  const preview = new Request('https://yikat-preview-test.vercel.app/api/contact-counts', { method: 'POST', headers: { origin: 'https://yikat-preview-test.vercel.app', 'sec-fetch-site': 'same-origin', 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0 Safari' }, body: JSON.stringify(payload) });
  const response = await handleContactCounter(preview, { ...config, VERCEL_ENV: 'preview', YIKAT_PARTNER_SUPABASE_URL: 'https://lgfadqhnabuzdcwnsltx.supabase.co' }, transport.fetcher);
  assert.equal(response.status, 204);
  assert.ok(transport.calls[0][0].startsWith('https://lgfadqhnabuzdcwnsltx.supabase.co/'));
});
