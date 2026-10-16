#!/usr/bin/env node
// Authorized local aggregate read only. Never add this to public CI with a key.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { COUNTER_ACTIONS, COUNTER_PAGES, COUNTER_REFERRERS } from '../lib/contact-counter.mjs';

const options = {}, args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 2) {
  if (!['--start', '--end', '--activated-at', '--out'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: node scripts/contact-counter-report.mjs --start YYYY-MM-DD --end YYYY-MM-DD --activated-at verified-ISO-timestamp --out private-output-directory');
  options[args[i].slice(2)] = args[i + 1];
}
const isoDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
if (!isoDate(options.start) || !isoDate(options.end) || options.start > options.end || !options.out || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(options['activated-at'] || '') || !Number.isFinite(Date.parse(options['activated-at']))) throw new Error('Valid dates, timezone-aware activation receipt and output are required');
if (process.env.GITHUB_ACTIONS === 'true') throw new Error('Native aggregate reports belong in the private workspace, not public Actions');
const observedAt = new Date(), dateInIstanbul = date => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
const today = dateInIstanbul(observedAt), activatedDay = dateInIstanbul(new Date(options['activated-at']));
const oldestRetainedDay = new Date(Date.parse(`${today}T00:00:00Z`) - 89 * 86400000).toISOString().slice(0, 10);
if (options.start < activatedDay || options.start < oldestRetainedDay || options.end > today || new Date(options['activated-at']) > observedAt) throw new Error('Period must be within verified activation, retained days and the present; unavailable days are unknown');
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) throw new Error('Authorized read credential is missing');
if (process.env.SUPABASE_PROJECT_REF_DEV && process.env.SUPABASE_PROJECT_REF_DEV !== 'dbannpdbhdvrxxxdbccj') throw new Error('Production project identity mismatch');
const query = `SELECT "day"::text AS "day", "action", "page", "referrer", "events" FROM public."WebsiteContactDaily" WHERE "day" BETWEEN DATE '${options.start}' AND DATE '${options.end}' ORDER BY "day", "action", "page", "referrer"`;
const response = await fetch('https://api.supabase.com/v1/projects/dbannpdbhdvrxxxdbccj/database/query', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query }), signal: AbortSignal.timeout(15000) }).catch(() => null);
if (!response?.ok) throw new Error('Native aggregate read unavailable; no zero report written');
const rows = await response.json();
const keys = new Set();
if (!Array.isArray(rows) || rows.some(row => {
  const key = JSON.stringify([row.day, row.action, row.page, row.referrer]);
  const invalid = Object.keys(row).sort().join(',') !== 'action,day,events,page,referrer' || !isoDate(row.day) || row.day < options.start || row.day > options.end || !COUNTER_ACTIONS.includes(row.action) || !COUNTER_PAGES.includes(row.page) || !COUNTER_REFERRERS.includes(row.referrer) || !Number.isInteger(row.events) || row.events < 1 || row.events > 10000 || keys.has(key);
  keys.add(key); return invalid;
})) throw new Error('Unexpected aggregate shape; no report written');
const daily = {};
for (const row of rows) daily[row.day] = (daily[row.day] || 0) + row.events;
if (Object.values(daily).some(count => count > 10000)) throw new Error('Daily count exceeds enforced cap; inspect source');
const report = { schemaVersion: 2, observedAt: observedAt.toISOString(), source: 'production WebsiteContactDaily read through authorized Management API', verifiedActivationAt: options['activated-at'],
  period: { start: options.start, end: options.end, timeZone: 'Europe/Istanbul', includesPartialActivationDay: options.start === activatedDay, includesOpenCurrentDay: options.end === today },
  acceptedContactActivations: rows.reduce((sum, row) => sum + row.events, 0), byAction: Object.fromEntries(COUNTER_ACTIONS.map(action => [action, rows.filter(row => row.action === action).reduce((sum, row) => sum + row.events, 0)])), rows,
  knownQaExcludedByClient: 'Browser automation and synthetic events filtered; completeness of exclusions is not proven', genuineHumanOnlyCount: null, uniquePeople: null, qualifiedEnquiries: null, orders: null,
  limits: ['Anonymous spoofing and repeated real activations remain possible.', 'Browser blocking, network failures and the daily cap can undercount activations.', 'Missing days before activation or outside retention are not zero.', 'Calendar boundaries differ from Search Console Pacific days; no joined conversion ratio.', 'A supplied activation timestamp must come from a verified native release receipt; this parser does not authenticate the receipt.'] };
await mkdir(path.resolve(options.out), { recursive: true });
await writeFile(path.join(path.resolve(options.out), 'contact-counts.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ output: path.resolve(options.out), acceptedContactActivations: report.acceptedContactActivations, period: report.period, genuineHumanOnlyCount: null }));
