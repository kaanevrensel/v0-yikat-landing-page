import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { inspectHtml, parseSitemap, parseRobots, robotsAllows, robotDirectives } from '../scripts/lib/search-html.mjs';
import { auditSite, fetchPublic, mapLimit } from '../scripts/lib/search-crawl.mjs';
import { parseCsv, classifyQuery, aggregateMetrics, loadSearchExport, compareExports } from '../scripts/lib/search-csv.mjs';

test('CSV supports BOM, commas, escaped quotes, CRLF and embedded newlines', () => {
  const parsed = parseCsv('\uFEFFName,Value\r\n"quoted, name","line 1\r\nline 2 ""quoted"""\r\n');
  assert.deepEqual(parsed.rows, [{ Name: 'quoted, name', Value: 'line 1\r\nline 2 "quoted"' }]);
});
test('CSV rejects malformed quotes, missing cells and duplicate headers', () => {
  for (const text of ['A,B\n"open,x', 'A,B\n1', 'A,A\n1,2', 'A\n"x"oops', 'A\nnot"valid']) assert.throws(() => parseCsv(text));
});
test('brand classification includes Turkish dotted/dotless case without substring false positives', () => {
  for (const query of ['YIKAT', 'YİKAT', 'Yıkat', 'yikat', 'yıkat gitsin', 'Yikatapp', 'YIKAT.TECH', 'Yıkat Bakırköy', 'YI\u0307KAT']) assert.equal(classifyQuery(query).branded, true, query);
  for (const query of ['yıktaş', 'yıkayayım', 'ayakkabı yıkatma', 'yitik']) assert.equal(classifyQuery(query).branded, false, query);
  assert.equal(classifyQuery('Bakırköy ayakkabı tamircisi').intent, 'repair_not_offered');
  assert.equal(classifyQuery('Bakırköy ayakkabı temizleme').intent, 'local_cleaning');
});
test('position calculation weights impressions and preserves zero/unknown', () => {
  const value = aggregateMetrics([{ clicks: 1, impressions: 1, position: 10 }, { clicks: 0, impressions: 9, position: 2 }]);
  assert.equal(value.approximateImpressionWeightedPosition, 2.8);
  assert.equal(value.ctr, 0.1);
  assert.equal(aggregateMetrics([]).approximateImpressionWeightedPosition, null);
});
test('HTML ignores script/comment/template decoys and reads quoted >, relative canonical, entities', () => {
  const page = inspectHtml(`<title>Y&#305;kat &amp; Bakım</title><link href='/real' rel='alternate canonical'><meta content='index, follow' name='ROBOTS'><h1 class="a > b">Gerçek <span>başlık</span></h1><script>"<h1>fake</h1><a href='/fake'>x</a>"</script><!-- <title>fake</title> --><template><h1>fake</h1></template><a href="/path?a=1&amp;b=2" rel="nofollow">link</a>`, 'https://www.yikat.tech/real');
  assert.deepEqual(page.titles, ['Yıkat & Bakım']);
  assert.deepEqual(page.h1, ['Gerçek başlık']);
  assert.equal(page.canonicals[0].url, 'https://www.yikat.tech/real');
  assert.deepEqual(page.links, [{ url: 'https://www.yikat.tech/path?a=1&b=2', nofollow: true }]);
});
test('X-Robots scopes and none directive are distinguished', () => {
  assert.deepEqual(robotDirectives('googlebot-news: noindex'), []);
  assert.ok(robotDirectives('googlebot: noindex, nofollow').includes('noindex'));
  assert.equal(inspectHtml('<meta name="robots" content="none">', 'https://www.yikat.tech/').noindex, true);
});
test('sitemap excludes image loc and supports nested indexes while rejecting invalid entries', () => {
  const sitemap = parseSitemap('<urlset><url><loc>https://www.yikat.tech/a</loc><image:image><image:loc>https://cdn.test/a.jpg</image:loc></image:image></url></urlset>');
  assert.deepEqual(sitemap.urls, ['https://www.yikat.tech/a']);
  assert.equal(parseSitemap('<sitemapindex><sitemap><loc>https://www.yikat.tech/one.xml</loc></sitemap></sitemapindex>').type, 'sitemapindex');
  assert.throws(() => parseSitemap('<urlset><url><loc>/relative</loc></url></urlset>'));
  assert.throws(() => parseSitemap('<!DOCTYPE foo><urlset></urlset>'));
});
test('sitemap rejects truncated or mismatched XML instead of accepting completed prefix entries', () => {
  const first = '<url><loc>https://www.yikat.tech/</loc></url>';
  for (const xml of [`<urlset>${first}<url><loc>https://www.yikat.tech/two`, `<urlset>${first}<url></urlset>`, `<urlset>${first}</urlset><urlset/>`, `<urlset>${first}</urlset><!-- truncated`]) assert.throws(() => parseSitemap(xml), /sitemap/i);
  assert.deepEqual(parseSitemap(`<?xml version="1.0"?><!-- valid --><urlset xmlns:image="https://example.test/ns"><url><loc><![CDATA[https://www.yikat.tech/a]]></loc><image:image><image:loc>https://example.test/a.jpg</image:loc></image:image></url></urlset>`).urls, ['https://www.yikat.tech/a']);
});
test('robots merges matching groups, prioritizes agent specificity and allow ties', () => {
  const rules = parseRobots('User-agent: *\nDisallow: /\nUser-agent: Googlebot\nDisallow:\nUser-agent: Other\nDisallow: /\nUser-agent: Googlebot\nDisallow: /private\nAllow: /private/public\nDisallow: /*?secret=*$\nAllow: /equal\nDisallow: /equal');
  assert.equal(robotsAllows(rules, 'https://www.yikat.tech/'), true);
  assert.equal(robotsAllows(rules, 'https://www.yikat.tech/private/x'), false);
  assert.equal(robotsAllows(rules, 'https://www.yikat.tech/private/public'), true);
  assert.equal(robotsAllows(rules, 'https://www.yikat.tech/x?secret=x'), false);
  assert.equal(robotsAllows(rules, 'https://www.yikat.tech/equal'), true);
});
test('fetch blocks external redirect and missing Location instead of following arbitrary targets', async () => {
  for (const headers of [{ location: 'https://elsewhere.example/' }, {}]) {
    let calls = 0;
    const record = await fetchPublic('https://www.yikat.tech/', { origin: 'https://www.yikat.tech', fetchImpl: async () => { calls++; return new Response('', { status: 302, headers }); } });
    assert.equal(record.outcome, 'incomplete'); assert.equal(calls, 1);
  }
});
test('direct and redirected API/query targets are never fetched and excluded query values are not recorded', async () => {
  const origin = 'https://www.yikat.tech';
  for (const excluded of ['/api/example?token=synthetic-test', '/api/example', '/%61pi/example', '/public?token=synthetic-test']) {
    let calls = [];
    const direct = await fetchPublic(`${origin}${excluded}`, { origin, fetchImpl: async url => { calls.push(url); return new Response('unexpected'); } });
    assert.equal(calls.length, 0, excluded);
    assert.equal(direct.outcome, 'excluded');
    assert.equal(JSON.stringify(direct).includes('synthetic-test'), false);
    const redirected = await fetchPublic(`${origin}/`, { origin, fetchImpl: async url => {
      calls.push(url);
      return new Response('', { status: 302, headers: { location: url === `${origin}/` ? '/hop' : excluded } });
    } });
    assert.deepEqual(calls, [`${origin}/`, `${origin}/hop`]);
    assert.equal(redirected.outcome, 'incomplete');
    assert.equal(JSON.stringify(redirected).includes('synthetic-test'), false);
  }
});
test('API/query sitemap entries are excluded and canonical query redaction preserves the mismatch finding', async () => {
  const calls = [];
  const result = await auditSite({ fetcher: async url => {
    calls.push(url);
    let body = '<title>Home</title><h1>Home</h1><link rel="canonical" href="/?token=synthetic-test">';
    if (url.endsWith('/sitemap.xml')) body = '<sitemapindex><sitemap><loc>https://www.yikat.tech/pages.xml</loc></sitemap><sitemap><loc>https://www.yikat.tech/api/sitemap</loc></sitemap></sitemapindex>';
    if (url.endsWith('/pages.xml')) body = '<urlset><url><loc>https://www.yikat.tech/</loc></url><url><loc>https://www.yikat.tech/api/example</loc></url><url><loc>https://www.yikat.tech/public?token=synthetic-test</loc></url></urlset>';
    return { url, finalUrl: url, status: 200, outcome: 'observed', redirects: [], contentType: 'text/html', body };
  } });
  assert.equal(calls.some(url => url.includes('/api/') || url.includes('?')), false);
  assert.equal(result.summary.sitemapPagesAudited, 1);
  assert.ok(result.pages[0].defects.includes('canonical_not_self'));
  assert.equal(result.pages[0].canonicals[0].queryRedacted, true);
  assert.equal(JSON.stringify(result).includes('synthetic-test'), false);
  assert.ok(result.issues.includes('sitemap_api_url_excluded'));
});
test('fetch differentiates network failure and HTTP 404 and bounds response size', async () => {
  const opts = { origin: 'https://www.yikat.tech' };
  assert.equal((await fetchPublic('https://www.yikat.tech/', { ...opts, fetchImpl: async () => { throw new Error('private details'); } })).error, 'network_error');
  assert.equal((await fetchPublic('https://www.yikat.tech/', { ...opts, fetchImpl: async () => new Response('missing', { status: 404 }) })).status, 404);
  assert.equal((await fetchPublic('https://www.yikat.tech/', { ...opts, maxBytes: 2, fetchImpl: async () => new Response('long') })).error, 'body_exceeds_limit');
});
test('bounded mapper preserves input order and concurrency', async () => {
  let active = 0, peak = 0;
  const result = await mapLimit([1, 2, 3, 4, 5], 2, async item => { active++; peak = Math.max(peak, active); await new Promise(resolve => setTimeout(resolve, 2)); active--; return item * 2; });
  assert.deepEqual(result, [2, 4, 6, 8, 10]); assert.equal(peak, 2);
});
test('crawl identifies real canonical/broken-link defects but keeps unavailable targets unknown', async () => {
  const origin = 'https://www.yikat.tech';
  const bodies = {
    '/sitemap.xml': '<urlset><url><loc>https://www.yikat.tech/</loc></url><url><loc>https://www.yikat.tech/a</loc></url><url><loc>https://www.yikat.tech/lost</loc></url></urlset>',
    '/robots.txt': 'User-agent: *\nAllow: /',
    '/': '<title>Home</title><h1>Home</h1><meta name="description" content="Shop"><link rel="canonical" href="/"><a href="/a">A</a><a href="/broken">Broken</a><a href="/network">Unknown</a><a href="/search?q=private">Query</a>',
    '/a': '<title>A</title><h1>A</h1><link rel="canonical" href="/"><a href="/">Home</a>',
  };
  const result = await auditSite({ fetcher: async url => {
    const pathname = new URL(url).pathname;
    if (['/lost', '/network'].includes(pathname)) return { url, status: null, outcome: 'fetch_failed', redirects: [], error: 'network_error' };
    return { url, finalUrl: url, status: bodies[pathname] ? 200 : 404, outcome: 'observed', redirects: [], contentType: 'text/html', body: bodies[pathname] || '' };
  } });
  assert.equal(result.summary.indexedPages, null);
  assert.equal(result.summary.fetchUnknown, 1);
  assert.equal(result.summary.internalTargetsUnknown, 1);
  assert.equal(result.summary.incompleteHtmlInspections, 1);
  assert.ok(result.pages.find(p => p.url === `${origin}/a`).defects.includes('canonical_not_self'));
  assert.deepEqual(result.pages.find(p => p.url === `${origin}/lost`).defects, []);
  const home = result.pages.find(p => p.url === `${origin}/`);
  assert.ok(home.internalLinkProblems.some(p => p.reason === 'http_404' && p.state === 'defect'));
  assert.ok(home.internalLinkProblems.some(p => p.state === 'unknown'));
  assert.equal(result.pages.find(p => p.url === `${origin}/a`).linkDepthFromHomepage, 1);
  assert.deepEqual(result.excludedQueryLinkPaths, ['/search']);
});
test('HTTP200 non-HTML is an incomplete inspection, never an indexability pass', async () => {
  const result = await auditSite({ fetcher: async url => ({ url, status: 200, outcome: 'observed', redirects: [], contentType: 'text/plain', body: url.endsWith('/sitemap.xml') ? '<urlset><url><loc>https://www.yikat.tech/</loc></url></urlset>' : '' }) });
  assert.equal(result.summary.incompleteHtmlInspections, 1);
  assert.equal(result.pages[0].inspection, 'unknown');
  assert.equal(result.pages[0].indexing.status, 'unknown');
});

async function fixture(t, { start = '2026-10-01', days = 2, queryClicks = 1, filter = 'Web', omitSecond = false, zeroImpressions = false } = {}) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'yikat-search-tools-')); t.after(() => rm(dir, { recursive: true, force: true }));
  const chart = ['Date,Clicks,Impressions,CTR,Position'];
  for (let i = 0; i < days; i++) if (!(omitSecond && i === 1)) chart.push(`${new Date(Date.parse(start) + i * 86400000).toISOString().slice(0, 10)},${zeroImpressions ? '0,0,0%,-' : `2,10,20%,${i + 1}`}`);
  await Promise.all([
    writeFile(path.join(dir, 'Chart.csv'), chart.join('\n')),
    writeFile(path.join(dir, 'Queries.csv'), `Top queries,Clicks,Impressions,CTR,Position\n${zeroImpressions ? '' : `YİKAT,${queryClicks},4,25%,1\n"person, name",0,1,0%,3`}`),
    writeFile(path.join(dir, 'Filters.csv'), `Filter,Value\nDate,Last 28 days\nSearch type,${filter}`),
    writeFile(path.join(dir, 'Pages.csv'), 'Top pages,Clicks,Impressions,CTR,Position\nhttps://www.yikat.tech/,4,25,16%,1\nhttps://www.yikat.tech/?person=private,0,1,0%,1'),
  ]);
  return loadSearchExport(dir);
}
test('export scorecard preserves query gaps and does not retain raw personal queries or aggregate page impressions', async t => {
  const result = await fixture(t);
  assert.equal(result.totalPropertyMetrics.impressions, 20);
  assert.equal(result.landingPages[0].impressions, 25);
  assert.equal(result.coverage.clicksNotRepresentedInQueryRows, 3);
  assert.equal(result.visibleQueries.branded.clicks, 1);
  assert.equal(JSON.stringify(result).includes('person'), false);
  assert.equal(result.indexing.status, 'not_measured');
});
test('comparison rejects unequal, overlapping, filter-mismatched and incomplete periods', async t => {
  const earlier = await fixture(t, { start: '2026-09-01' });
  assert.equal(compareExports(await fixture(t), earlier).comparable, true);
  assert.ok(compareExports(await fixture(t, { days: 3 }), earlier).blockers.includes('unequal_windows'));
  assert.ok(compareExports(earlier, earlier).blockers.includes('overlapping_or_reversed_windows'));
  assert.ok(compareExports(await fixture(t, { filter: 'Image' }), earlier).blockers.includes('different_filters'));
  assert.ok(compareExports(await fixture(t, { days: 3, omitSecond: true }), earlier).blockers.includes('missing_daily_dates'));
});
test('zero prior metrics do not create infinite percentage growth and inconsistent coverage blocks comparison', async t => {
  const earlier = await fixture(t, { start: '2026-09-01' }), current = await fixture(t);
  earlier.totalPropertyMetrics.clicks = 0;
  assert.equal(compareExports(current, earlier).changes.clicks.relative, null);
  const inconsistent = await fixture(t, { queryClicks: 9 });
  assert.ok(compareExports(inconsistent, earlier).blockers.includes('inconsistent_query_export'));
});
test('zero-impression CTR remains unknown in both absolute and relative comparisons', async t => {
  const earlier = await fixture(t, { start: '2026-09-01' });
  const current = await fixture(t, { zeroImpressions: true });
  const comparison = compareExports(current, earlier);
  assert.equal(comparison.comparable, true);
  assert.deepEqual(comparison.changes.ctr, { before: 0.2, after: null, absolute: null, relative: null });
  earlier.totalPropertyMetrics.ctr = null;
  current.totalPropertyMetrics.ctr = 0.2;
  assert.deepEqual(compareExports(current, earlier).changes.ctr, { before: null, after: 0.2, absolute: null, relative: null });
});
