import { createHash } from 'node:crypto';
import { inspectHtml, normalizeUrl, parseRobots, parseSitemap, robotsAllows } from './search-html.mjs';

export async function mapLimit(items, concurrency, worker) {
  const results = new Array(items.length); let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) { const index = next++; results[index] = await worker(items[index], index); }
  }));
  return results;
}
function exclusionReason(url, origin) {
  const parsed = new URL(url);
  if (parsed.origin !== origin) return 'outside_origin';
  let pathname;
  try { pathname = decodeURIComponent(parsed.pathname); } catch { return 'invalid_path'; }
  if (/^\/api(?:\/|$)/i.test(pathname)) return 'api_url_excluded';
  if (parsed.search) return 'query_url_excluded';
  return null;
}
function reportUrl(value, base) {
  const normalized = normalizeUrl(value, base);
  if (!normalized) return '[invalid_or_unsupported_url]';
  const url = new URL(normalized); url.search = ''; url.hash = '';
  return url.href;
}
function excludedRecord(url, reason) {
  const safe = reportUrl(url);
  return { url: safe, finalUrl: safe, status: null, redirects: [], error: reason, outcome: 'excluded' };
}
export async function fetchPublic(url, { origin, timeoutMs = 15000, maxBytes = 4_000_000, fetchImpl = fetch } = {}) {
  const original = normalizeUrl(url);
  if (!original || new URL(original).origin !== origin) throw new Error('Fetch outside allowed origin');
  const excluded = exclusionReason(original, origin);
  if (excluded) return excludedRecord(original, excluded);
  let current = original;
  const redirects = [];
  for (let hop = 0; hop <= 5; hop++) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(current, { method: 'GET', redirect: 'manual', signal: controller.signal, headers: { 'User-Agent': 'YikatPublicSearchAudit/1.0 (+https://www.yikat.tech/)', Accept: 'text/html,application/xml,text/xml,text/plain' } });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        const target = location ? normalizeUrl(location, current) : null;
        await response.body?.cancel();
        if (!target || new URL(target).origin !== origin) return { url: original, finalUrl: current, status: response.status, redirects, error: 'redirect_outside_origin_or_invalid', outcome: 'incomplete' };
        const excludedTarget = exclusionReason(target, origin);
        if (excludedTarget) {
          redirects.push({ from: current, to: reportUrl(target), status: response.status, excluded: excludedTarget, queryRedacted: Boolean(new URL(target).search) });
          return { url: original, finalUrl: current, status: response.status, redirects, error: `redirect_${excludedTarget}`, outcome: 'incomplete' };
        }
        redirects.push({ from: current, to: target, status: response.status }); current = target; continue;
      }
      const reader = response.body?.getReader(); const chunks = []; let bytes = 0;
      if (reader) while (true) {
        const part = await reader.read(); if (part.done) break;
        bytes += part.value.byteLength;
        if (bytes > maxBytes) { await reader.cancel(); throw new Error('body_exceeds_limit'); }
        chunks.push(Buffer.from(part.value));
      }
      const buffer = Buffer.concat(chunks);
      return { url: original, finalUrl: current, status: response.status, redirects, contentType: response.headers.get('content-type') || '', xRobots: response.headers.get('x-robots-tag') || '', bytes, sha256: createHash('sha256').update(buffer).digest('hex'), body: buffer.toString('utf8'), outcome: 'observed' };
    } catch (error) {
      return { url: original, finalUrl: current, redirects, status: null, outcome: 'fetch_failed', error: error.name === 'AbortError' ? 'timeout' : error.message === 'body_exceeds_limit' ? error.message : 'network_error' };
    } finally { clearTimeout(timer); }
  }
  return { url: original, finalUrl: current, redirects, status: null, outcome: 'incomplete', error: 'redirect_limit' };
}
const withoutBody = ({ body: _body, ...record }) => record;
export function pageFindings(record, page, robotsAllowed) {
  const defects = [], warnings = [];
  if (record.outcome !== 'observed') return { defects, warnings, inspection: 'unknown' };
  if (record.status !== 200) defects.push(`http_${record.status}`);
  if (record.redirects.length) defects.push('sitemap_url_redirects');
  if (robotsAllowed === false) defects.push('googlebot_disallowed_by_robots');
  if (!page) return { defects, warnings: [...warnings, 'html_not_inspected'], inspection: 'unknown' };
  if (page.noindex) defects.push('noindex');
  if (page.canonicals.length !== 1) defects.push('canonical_count');
  else if (page.canonicals[0].url !== record.url) defects.push('canonical_not_self');
  if (page.titles.length !== 1 || !page.titles[0]) defects.push('title_missing_or_multiple');
  if (page.h1.length !== 1 || !page.h1[0]) warnings.push('h1_missing_or_multiple');
  if (page.description.length !== 1 || !page.description[0]) warnings.push('description_missing_or_multiple');
  if (page.nofollow) warnings.push('page_nofollow');
  return { defects, warnings, inspection: 'complete' };
}
export async function auditSite({ site = 'https://www.yikat.tech', concurrency = 4, maxPages = 500, fetcher } = {}) {
  const base = new URL(site); base.pathname = '/'; base.search = ''; base.hash = '';
  if (base.protocol !== 'https:' || base.username || base.password) throw new Error('Use a public HTTPS site origin');
  const origin = base.origin;
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 12 || !Number.isInteger(maxPages) || maxPages < 1 || maxPages > 2000) throw new Error('Invalid crawl bounds');
  // Apply the same policy at every entry path, including injected read-only test transports.
  const get = url => {
    const excluded = exclusionReason(url, origin);
    return excluded ? Promise.resolve(excludedRecord(url, excluded)) : (fetcher ? fetcher(url) : fetchPublic(url, { origin }));
  };
  const sitemapRecords = [], sitemapUrls = new Set(), queue = [`${origin}/sitemap.xml`], visited = new Set();
  const issues = [];
  while (queue.length) {
    if (visited.size >= 25) { issues.push('sitemap_count_limit'); break; }
    const url = queue.shift(); if (visited.has(url)) continue; visited.add(url);
    const record = await get(url); sitemapRecords.push(withoutBody(record));
    if (record.status !== 200 || record.outcome !== 'observed') { issues.push('sitemap_fetch_incomplete'); continue; }
    try {
      const sitemap = parseSitemap(record.body, url);
      for (const entry of sitemap.urls) {
        const excluded = exclusionReason(entry, origin);
        if (excluded) { issues.push(`sitemap_${excluded}`); continue; }
        if (sitemap.type === 'sitemapindex') queue.push(entry);
        else sitemapUrls.add(entry);
      }
    } catch (error) { issues.push(`sitemap_parse_failed:${error.message}`); }
    if (sitemapUrls.size > maxPages) { issues.push('sitemap_page_limit'); break; }
  }
  const robotsRecord = await get(`${origin}/robots.txt`);
  const robotsKnown = robotsRecord.outcome === 'observed' && [200, 404, 410].includes(robotsRecord.status);
  const robots = robotsRecord.status === 200 ? parseRobots(robotsRecord.body) : [];
  if (!robotsKnown) issues.push('robots_status_unknown');
  const urls = [...sitemapUrls].sort().slice(0, maxPages);
  if (!urls.length) issues.push('sitemap_contains_no_page_urls');
  const pages = await mapLimit(urls, concurrency, async url => {
    const record = await get(url);
    const html = record.outcome === 'observed' && record.status === 200 && /text\/html|application\/xhtml\+xml/i.test(record.contentType) ? inspectHtml(record.body, url, record.xRobots) : null;
    const allowed = robotsKnown ? robotsAllows(robots, url) : null;
    return { ...withoutBody(record), googlebotRobotsAllowed: allowed, ...(html || {}), ...pageFindings(record, html, allowed), indexing: { status: 'unknown', reason: 'Public fetch cannot establish Google-selected canonical or index state' } };
  });
  const byUrl = new Map(pages.map(p => [p.url, p]));
  const links = new Set(), excludedQueryLinks = new Set();
  for (const page of pages) for (const link of page.links || []) {
    const parsed = new URL(link.url);
    if (parsed.origin !== origin) continue;
    if (parsed.search) { excludedQueryLinks.add(parsed.pathname); continue; }
    if (exclusionReason(link.url, origin)) continue;
    links.add(link.url);
  }
  const additional = [...links].filter(url => !byUrl.has(url)).sort();
  const additionalLimit = Math.max(0, maxPages - urls.length);
  if (additional.length > additionalLimit) issues.push('internal_target_limit');
  const targets = await mapLimit(additional.slice(0, additionalLimit), concurrency, async url => withoutBody(await get(url)));
  const targetsByUrl = new Map([...pages, ...targets].map(p => [p.url, p]));
  for (const page of pages) {
    page.inboundFromSitemap = pages.filter(source => source.url !== page.url && !source.nofollow && source.links?.some(l => l.url === page.url && !l.nofollow)).map(p => p.url);
    page.internalLinkProblems = [...new Set((page.links || []).map(l => l.url))].flatMap(url => {
      const target = targetsByUrl.get(url);
      if (!target) return [];
      if (target.outcome !== 'observed') return [{ url, state: 'unknown', reason: target.error }];
      if (target.status >= 400) return [{ url, state: 'defect', reason: `http_${target.status}` }];
      if (target.redirects.length) return [{ url, state: 'warning', reason: 'redirected_internal_link' }];
      return [];
    });
    if (!page.inboundFromSitemap.length && page.url !== `${origin}/`) page.warnings.push('no_inbound_link_from_audited_sitemap_pages');
    if (page.internalLinkProblems.some(p => p.state === 'defect')) page.defects.push('broken_internal_link');
  }
  for (const field of ['titles', 'h1']) {
    const grouped = new Map();
    for (const page of pages) if (page[field]?.[0]) grouped.set(page[field][0], [...(grouped.get(page[field][0]) || []), page]);
    for (const duplicates of grouped.values()) if (duplicates.length > 1) for (const page of duplicates) page.warnings.push(`duplicate_${field === 'titles' ? 'title' : 'h1'}`);
  }
  const depths = new Map([[`${origin}/`, 0]]), breadth = [`${origin}/`];
  while (breadth.length) {
    const url = breadth.shift(), page = byUrl.get(url);
    if (!page || page.nofollow) continue;
    for (const link of page.links || []) if (!link.nofollow && byUrl.has(link.url) && !depths.has(link.url)) { depths.set(link.url, depths.get(url) + 1); breadth.push(link.url); }
  }
  for (const page of pages) {
    page.linkDepthFromHomepage = depths.get(page.url) ?? null;
    // Compare original canonicals above, but never retain their query values in evidence.
    if (page.canonicals) page.canonicals = page.canonicals.map(canonical => ({
      raw: reportUrl(canonical.raw, page.url), url: canonical.url ? reportUrl(canonical.url) : null,
      queryRedacted: Boolean(canonical.url && new URL(canonical.url).search),
    }));
    delete page.links;
  }
  return {
    schemaVersion: 1, observedAt: new Date().toISOString(), origin, bounds: { concurrency, maxPages, sitemapLimit: 25 },
    limitations: ['Server HTML only; JavaScript rendering, Core Web Vitals, Google-selected canonical, indexing and rankings are not measured.', 'Same-origin GET requests only; query-bearing links, API paths and external targets are excluded.', 'H1 counts, duplicate metadata and link depth are diagnostics, not Google ranking rules or an SEO score.', 'Unknown fetches are not reported as proven broken pages. The crawl is a timestamped observation, not a continuous availability guarantee.'],
    issues: [...new Set(issues)], sitemaps: sitemapRecords, robots: withoutBody(robotsRecord), excludedQueryLinkPaths: [...excludedQueryLinks],
    summary: { sitemapUrlsDiscovered: sitemapUrls.size, sitemapPagesAudited: pages.length, additionalTargetsChecked: targets.length, completeHtmlInspections: pages.filter(p => p.inspection === 'complete').length, incompleteHtmlInspections: pages.filter(p => p.inspection !== 'complete').length, fetchUnknown: pages.filter(p => p.outcome !== 'observed').length, internalTargetsUnknown: targets.filter(p => p.outcome !== 'observed').length, pagesWithDefects: pages.filter(p => p.defects.length).length, pagesWithWarnings: pages.filter(p => p.warnings.length).length, indexedPages: null }, pages, additionalTargets: targets,
  };
}
