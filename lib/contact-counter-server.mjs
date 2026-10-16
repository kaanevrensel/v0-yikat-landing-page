import { validCounterPayload } from './contact-counter.mjs';

const PROJECTS = { production: 'dbannpdbhdvrxxxdbccj', preview: 'lgfadqhnabuzdcwnsltx' };
const BOT = /bot\b|crawler|spider|headless|playwright|puppeteer|lighthouse|yikatpublicsearchaudit/i;
const result = status => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });

function configuration(env) {
  if (env.YIKAT_CONTACT_COUNTER_ENABLED !== 'true' || !PROJECTS[env.VERCEL_ENV]) return null;
  const endpoint = `https://${PROJECTS[env.VERCEL_ENV]}.supabase.co`;
  if (env.YIKAT_PARTNER_SUPABASE_URL !== endpoint || !env.YIKAT_PARTNER_ANON_KEY) return null;
  // A privileged key must never be accidentally used by this public endpoint.
  try {
    if (JSON.parse(Buffer.from(env.YIKAT_PARTNER_ANON_KEY.split('.')[1], 'base64url').toString()).role !== 'anon') return null;
  } catch { return null; }
  return { endpoint, key: env.YIKAT_PARTNER_ANON_KEY };
}

async function boundedJson(request) {
  const advertised = request.headers.get('content-length');
  if (advertised && (!/^\d+$/.test(advertised) || Number(advertised) > 512)) return { status: 413 };
  if (!request.body) return { status: 400 };
  const reader = request.body.getReader(), parts = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 512) { await reader.cancel(); return { status: 413 }; }
      parts.push(Buffer.from(value));
    }
    return { value: JSON.parse(Buffer.concat(parts).toString('utf8')) };
  } catch { return { status: 400 }; }
}

// Never logs/forwards request IPs, user agent, referrer, cookies or arbitrary body.
// Browser-origin checks reduce accidental/cross-site writes, not anonymous fraud.
export async function handleContactCounter(request, env, fetcher = fetch) {
  if (request.method !== 'POST') return result(405);
  const config = configuration(env);
  if (!config) return result(503);
  const origin = new URL(request.url).origin;
  const hostAllowed = env.VERCEL_ENV === 'production'
    ? ['https://www.yikat.tech', 'https://yikat.tech'].includes(origin)
    : /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
  if (!hostAllowed || request.headers.get('origin') !== origin || request.headers.get('sec-fetch-site') !== 'same-origin') return result(403);
  const userAgent = request.headers.get('user-agent') || '';
  if (!userAgent || BOT.test(userAgent)) return result(204);
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('content-type') || '')) return result(415);
  const body = await boundedJson(request);
  if (body.status) return result(body.status);
  if (!validCounterPayload(body.value)) return result(400);
  try {
    const response = await fetcher(`${config.endpoint}/rest/v1/rpc/record_website_contact`, {
      method: 'POST', headers: { apikey: config.key, Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_action: body.value.action, p_page: body.value.page, p_referrer: body.value.referrer }),
      signal: AbortSignal.timeout(3000), cache: 'no-store',
    });
    if (!response.ok) return result(503);
    const receipt = await response.json();
    if (receipt?.ok !== true) return result(receipt?.error === 'daily_limit' ? 429 : 503);
    return result(204);
  } catch { return result(503); }
}
