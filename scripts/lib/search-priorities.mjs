import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { compareExports, loadSearchExport, metricRows, normalizeQuery, parseCsv } from './search-csv.mjs';

// Editorial seeds, not claims about keyword volume or current ranking.
export const priorities = [
  ['bakirkoy-shoes', 'Bakırköy ayakkabı temizleme', '/bakirkoy-ayakkabi-temizleme', 'local_service'],
  ['bakirkoy-wash', 'Bakırköy ayakkabı yıkama', '/bakirkoy-ayakkabi-temizleme', 'local_service'],
  ['shoe-cleaning', 'ayakkabı temizleme', '/ayakkabi-temizleme', 'service'],
  ['shoe-prices', 'ayakkabı temizleme fiyatları', '/ayakkabi-temizleme', 'service'],
  ['sneaker-cleaning', 'sneaker temizleme', '/sneaker-yikama', 'material'],
  ['sneaker-wash', 'sneaker yıkama', '/sneaker-yikama', 'material'],
  ['suede-cleaning', 'süet ayakkabı temizleme', '/suet-nubuk-temizleme', 'material'],
  ['nubuck-cleaning', 'nubuk ayakkabı temizleme', '/suet-nubuk-temizleme', 'material'],
  ['leather-care', 'deri ayakkabı bakımı', '/deri-ayakkabi-bakimi', 'material'],
  ['leather-cleaning', 'deri ayakkabı temizleme', '/deri-ayakkabi-bakimi', 'material'],
  ['dry-cleaning-choice', 'ayakkabı kuru temizlemeye verilir mi', '/rehber/ayakkabi-kuru-temizlemeye-verilir-mi', 'care'],
  ['drying', 'ayakkabı nasıl kurutulur', '/rehber/ayakkabi-nasil-kurutulur', 'care'],
].map(([id, query, target, intent]) => ({ id, query, target, intent }));

export async function readPriorityExport(directory) {
  const overview = await loadSearchExport(directory);
  const raw = await readFile(path.join(directory, 'Queries.csv'));
  const rows = metricRows(parseCsv(raw.toString('utf8')), 'Top queries');
  const selected = priorities.map(priority => {
    const matches = rows.filter(row => normalizeQuery(row.dimension) === normalizeQuery(priority.query));
    if (matches.length > 1) throw new Error('Duplicate normalized priority query; resolve export ambiguity');
    const row = matches[0];
    return { id: priority.id, status: row ? 'reported' : 'not_in_export', metrics: row ? { clicks: row.clicks, impressions: row.impressions, ctr: row.impressions ? row.clicks / row.impressions : null, reportedAveragePosition: row.position } : null };
  });
  return { overview, selected, sourceSha256: createHash('sha256').update(raw).digest('hex') };
}

export function buildPriorityReport({ audit, current = null, previous = null, observedAt = new Date().toISOString(), sourceCommit = null }) {
  if (!audit || !Array.isArray(audit.pages) || !audit.summary || !Array.isArray(audit.issues) || !Number.isFinite(Date.parse(audit.observedAt))) throw new Error('A real public audit with timestamp is required');
  if (!Number.isFinite(Date.parse(observedAt)) || Date.parse(audit.observedAt) > Date.parse(observedAt) + 60_000) throw new Error('Invalid report/audit time');
  if (audit.pages.some(page => { try { return new URL(page.url).origin !== 'https://www.yikat.tech'; } catch { return true; } })) throw new Error('Audit must describe the actual public Yikat origin');
  const comparison = current && previous ? compareExports(current.overview, previous.overview) : { comparable: false, blockers: ['matching_native_periods_not_supplied'], changes: null };
  const stale = Date.parse(observedAt) - Date.parse(audit.observedAt) > 7 * 86400000;
  const rows = priorities.map(priority => {
    const page = audit.pages.find(page => page.url === `https://www.yikat.tech${priority.target}`);
    const observation = current?.selected.find(row => row.id === priority.id);
    const metrics = observation?.metrics ?? null;
    let nextAction = 'collect_native_query_evidence';
    if (!page) nextAction = 'check_target_missing_from_sitemap';
    else if (page.defects?.length) nextAction = 'fix_observed_technical_defect';
    else if (page.inspection !== 'complete' || stale) nextAction = 'refresh_incomplete_or_stale_audit';
    else if (metrics && metrics.impressions >= 20 && metrics.reportedAveragePosition <= 12 && metrics.ctr < 0.03) nextAction = 'review_snippet_offer_and_query_fit';
    else if (metrics && metrics.impressions >= 20 && metrics.reportedAveragePosition > 12 && metrics.reportedAveragePosition <= 30) nextAction = 'review_answer_proof_and_internal_links';
    else if (metrics) nextAction = 'observe_without_inventing_a_content_gap';
    const prior = comparison.comparable ? previous.selected.find(row => row.id === priority.id)?.metrics : null;
    const pageMetric = current?.overview.landingPages?.find(page => page.path === priority.target) ?? null;
    return { ...priority, technical: { status: page ? page.inspection : 'missing_from_sitemap', defects: page?.defects ?? [], warnings: page?.warnings ?? [] },
      organicSearch: { status: observation?.status ?? 'not_imported', metrics, previousMetrics: prior, exactQueryInterpretation: 'An allowlisted visible query row; missing is unknown, not zero. Reported average position is not a local rank.' },
      targetPageSearch: pageMetric, mapsRank: null, nextAction };
  });
  return { schemaVersion: 1, observedAt, sourceCommit, audit: { observedAt: audit.observedAt, stale, summary: audit.summary, issues: audit.issues },
    source: current ? { status: 'native_export_imported', window: current.overview.window, timeZone: 'America/Los_Angeles', filters: current.overview.filters, coverage: current.overview.coverage, sourceFiles: current.overview.sourceFiles, querySha256: current.sourceSha256 } : { status: 'not_imported', metrics: null },
    comparison, rows,
    separateManualChecks: [
      { source: 'Google Business Profile', owner: 'Emre', action: 'Read current review/reply counts and native interaction breakdown; preserve its own date window and timezone.', status: 'not_imported' },
      { source: 'Bakirkoy shop', owner: 'Kaan and Emre', action: 'Ask the neutral intake-source question and read aggregate source completeness, paid orders and delivered orders in Istanbul time.', status: 'not_imported' },
      { source: 'Website contact requests', owner: 'Emre', action: 'Read the supported aggregate counter after activation; exclude known QA and preserve unknown bot/duplicate limitations.', status: 'not_imported' },
      { source: 'Maps and organic local observations', owner: 'Emre', action: 'Manually record device, Bakirkoy location, language and time separately for Maps pack and organic listings. Do not scrape search results.', status: 'not_imported' },
    ],
    limitations: ['A scheduled public crawl proves only the fetched technical state, not indexing, search rankings, leads or orders.', 'Query and target-page metrics are separate dimensions and are not joined attribution.', 'The 20-impression, 3-percent CTR and position thresholds are review priorities, not universal benchmarks.', 'Missing native data remains unknown; no zero or uplift is inferred.', 'Private exports and customer information must never be uploaded to public Actions artifacts.'] };
}

export function renderPriorityReport(report) {
  const rows = report.rows.map(row => `| ${row.query} | ${row.target} | ${row.organicSearch.metrics ? `${row.organicSearch.metrics.clicks} / ${row.organicSearch.metrics.impressions}` : 'unknown'} | ${row.nextAction} |`);
  return `# Weekly search review\n\nObserved ${report.observedAt}. Source commit: ${report.sourceCommit ?? 'local/unrecorded'}. Public audit: ${report.audit.observedAt}.\n\n${report.audit.summary.sitemapPagesAudited} pages inspected; ${report.audit.summary.pagesWithDefects} with defects. Crawl issues: ${report.audit.issues.join(', ') || 'none'}. Audit older than seven days: ${report.audit.stale}. Index and Maps rank: unknown.\n\nNative query evidence: ${report.source.status}. ${report.source.window ? `${report.source.window.start} to ${report.source.window.end}, Pacific days.` : 'Emre must add a native export for query decisions.'}\n\n| Reviewed query | Intended destination | Reported clicks / impressions | Next action |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n\n## This week\n\n1. Resolve observed crawl problems or refresh incomplete evidence.\n2. Emre reads matching final Search Console periods; keep Maps and organic observations separate.\n3. Kaan records source at intake; Emre reviews aggregate unknown-source coverage and real order populations.\n4. Review relevant snippets, proof and answers using the decision queue; change one justified page before adding new pages.\n\n${report.limitations.map(value => `- ${value}`).join('\n')}\n`;
}
