import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export function parseCsv(input) {
  const text = input.replace(/^\uFEFF/, ''), rows = [];
  let row = [], field = '', quoted = false, closed = false;
  const endField = () => { row.push(field); field = ''; closed = false; };
  const endRow = () => { endField(); if (row.some(v => v !== '')) rows.push(row); row = []; };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else field += char;
    } else if (char === ',') endField();
    else if (char === '\r' || char === '\n') { if (char === '\r' && text[i + 1] === '\n') i++; endRow(); }
    else if (char === '"') { if (field || closed) throw new Error('Unexpected quote in CSV'); quoted = true; }
    else if (closed) { if (!/[ \t]/.test(char)) throw new Error('Unexpected character after quoted CSV field'); }
    else field += char;
  }
  if (quoted) throw new Error('Unclosed quoted CSV field');
  if (field || row.length || closed) endRow();
  if (!rows.length) throw new Error('Empty CSV');
  const headers = rows.shift().map(h => h.trim());
  if (new Set(headers).size !== headers.length || headers.some(h => !h)) throw new Error('Empty or duplicate CSV header');
  return { headers, rows: rows.map((values, index) => {
    if (values.length !== headers.length) throw new Error(`CSV column count mismatch on data row ${index + 1}`);
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  }) };
}
export function normalizeQuery(query) {
  return query.normalize('NFKD').replace(/\p{M}/gu, '').replaceAll('ı', 'i').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
export function classifyQuery(query) {
  const value = normalizeQuery(query);
  const branded = /(?:^|\s)yikat(?:\s|$)/u.test(value) || /(?:^|\s)yikatgitsin(?:\s|$)/u.test(value) || /(?:^|\s)yikatapp(?:\s|$)/u.test(value);
  const repair = /(?:tamir|onarim|lostra|repair|ремонт)/u.test(value);
  const local = /(?:bakirkoy|sakizagaci|atakoy|zeytinburnu|sirinevler|near me|en yakin|yakinda)/u.test(value);
  const cleaning = /(?:temiz|yikama|cleaning|leke|koku|kurut|bakim)/u.test(value);
  return { branded, intent: repair ? 'repair_not_offered' : cleaning && local ? 'local_cleaning' : cleaning ? 'cleaning_care' : 'other_or_unclear' };
}
function number(value, field, { integer = false, nullable = false } = {}) {
  const raw = value?.trim();
  if (nullable && (!raw || ['-', '—'].includes(raw))) return null;
  if (!raw || !/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(raw)) throw new Error(`Invalid ${field}: expected English Search Console numeric export`);
  const parsed = Number(raw.replaceAll(',', ''));
  if (!Number.isFinite(parsed) || parsed < 0 || (integer && !Number.isInteger(parsed))) throw new Error(`Invalid ${field}`);
  return parsed;
}
export function metricRows(table, dimension) {
  for (const required of [dimension, 'Clicks', 'Impressions', 'Position']) if (!table.headers.includes(required)) throw new Error(`Missing Search Console column: ${required}`);
  return table.rows.map(row => {
    const clicks = number(row.Clicks, 'Clicks', { integer: true }), impressions = number(row.Impressions, 'Impressions', { integer: true });
    const position = number(row.Position, 'Position', { nullable: true });
    if (impressions > 0 && (position === null || position < 1)) throw new Error('Impressions require a reported average position >= 1');
    return { dimension: row[dimension], clicks, impressions, position };
  });
}
export function aggregateMetrics(rows) {
  const clicks = rows.reduce((s, row) => s + row.clicks, 0), impressions = rows.reduce((s, row) => s + row.impressions, 0);
  const positionRows = rows.filter(row => row.position !== null && row.impressions > 0);
  const positionImpressions = positionRows.reduce((s, row) => s + row.impressions, 0);
  return { clicks, impressions, ctr: impressions ? clicks / impressions : null, approximateImpressionWeightedPosition: positionImpressions ? positionRows.reduce((s, row) => s + row.position * row.impressions, 0) / positionImpressions : null };
}
function dateWindow(rows) {
  const dates = rows.map(row => row.dimension).sort();
  if (!dates.length || dates.some(date => !/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date)) throw new Error('Chart needs valid ISO dates');
  if (new Set(dates).size !== dates.length) throw new Error('Duplicate daily dates in Chart.csv');
  const spanDays = (Date.parse(dates.at(-1)) - Date.parse(dates[0])) / 86400000 + 1;
  return { start: dates[0], end: dates.at(-1), rowDays: dates.length, spanDays, completeDailySeries: spanDays === dates.length };
}
export async function loadSearchExport(directory) {
  const sourceFiles = [], tables = {};
  for (const file of ['Chart.csv', 'Queries.csv', 'Pages.csv', 'Devices.csv', 'Countries.csv', 'Filters.csv']) {
    let raw;
    try { raw = await readFile(path.join(directory, file)); }
    catch (error) { if (error.code === 'ENOENT' && !['Chart.csv', 'Queries.csv', 'Filters.csv'].includes(file)) continue; throw error; }
    sourceFiles.push({ file, bytes: raw.length, sha256: createHash('sha256').update(raw).digest('hex') });
    tables[file] = parseCsv(raw.toString('utf8'));
  }
  const chart = metricRows(tables['Chart.csv'], 'Date'), queryRows = metricRows(tables['Queries.csv'], 'Top queries');
  const totals = aggregateMetrics(chart), queries = aggregateMetrics(queryRows);
  const brand = aggregateMetrics(queryRows.filter(row => classifyQuery(row.dimension).branded));
  const nonbrand = aggregateMetrics(queryRows.filter(row => !classifyQuery(row.dimension).branded));
  const intents = Object.fromEntries(['repair_not_offered', 'local_cleaning', 'cleaning_care', 'other_or_unclear'].map(intent => [intent, aggregateMetrics(queryRows.filter(row => !classifyQuery(row.dimension).branded && classifyQuery(row.dimension).intent === intent))]));
  const filtersTable = tables['Filters.csv'];
  if (!filtersTable.headers.includes('Filter') || !filtersTable.headers.includes('Value')) throw new Error('Filters.csv must use Filter,Value headers');
  const filterRows = filtersTable.rows.filter(row => !/^(date|dates)$/i.test(row.Filter));
  const filterSignature = createHash('sha256').update(JSON.stringify(filterRows.map(row => [row.Filter, row.Value]).sort((a, b) => a[0].localeCompare(b[0])))).digest('hex');
  const missingClicks = totals.clicks - queries.clicks, missingImpressions = totals.impressions - queries.impressions;
  const warnings = ['Exported query rows may omit anonymized queries and table-limited rows; their mix is not the complete query mix.', 'Yıkat/Yikat/YİKAT/YIKAT/Yıkat Gitsin and Yikatapp are branded lexical matches; the shared brand cannot establish which business a searcher meant.', 'Average positions are impression-weighted approximations from rounded exported averages, not fixed-location ranks. No arithmetic mean of query positions is used.', 'Page impressions are not summed into property totals; multiple URLs can appear for a single property impression.'];
  if (missingClicks < 0 || missingImpressions < 0) warnings.push('Query totals exceed chart totals. Inspect filters, aggregation and export consistency before interpretation.');
  const window = dateWindow(chart);
  if (!window.completeDailySeries) warnings.push('Chart has missing dates; period comparison is blocked.');
  const pages = tables['Pages.csv'] ? metricRows(tables['Pages.csv'], 'Top pages').flatMap(row => {
    let url; try { url = new URL(row.dimension); } catch { return []; }
    // Only public Yıkat paths are retained; no query parameters or person-level records.
    return url.origin === 'https://www.yikat.tech' && !url.search && !url.hash ? [{ path: url.pathname, clicks: row.clicks, impressions: row.impressions, ctr: row.impressions ? row.clicks / row.impressions : null, reportedAveragePosition: row.position }] : [];
  }) : null;
  return {
    schemaVersion: 1, window, filters: { names: filterRows.map(row => row.Filter), signatureSha256: filterSignature, date: 'Derived from Chart.csv actual dates, not relative filter label' }, sourceFiles,
    totalPropertyMetrics: totals,
    visibleQueries: { rowCount: queryRows.length, totals: queries, branded: brand, nonbranded: nonbrand, nonbrandedIntents: intents, brandedShareOfVisibleClicks: queries.clicks ? brand.clicks / queries.clicks : null, brandedShareOfVisibleImpressions: queries.impressions ? brand.impressions / queries.impressions : null },
    coverage: { visibleQueryClickShare: totals.clicks ? queries.clicks / totals.clicks : null, visibleQueryImpressionShare: totals.impressions ? queries.impressions / totals.impressions : null, clicksNotRepresentedInQueryRows: missingClicks, impressionsNotRepresentedInQueryRows: missingImpressions, causeOfGap: 'unknown; anonymization, row limits and aggregation can contribute' },
    landingPages: pages, deviceMetrics: tables['Devices.csv'] ? metricRows(tables['Devices.csv'], 'Device').filter(row => ['Mobile', 'Desktop', 'Tablet'].includes(row.dimension)).map(row => ({ device: row.dimension, ...aggregateMetrics([row]) })) : null,
    indexing: { status: 'not_measured', reason: 'Search performance exports do not provide a current URL indexing inventory.' }, warnings,
  };
}
export function compareExports(current, previous) {
  const blockers = [];
  if (!current.window.completeDailySeries || !previous.window.completeDailySeries) blockers.push('missing_daily_dates');
  if (current.window.rowDays !== previous.window.rowDays) blockers.push('unequal_windows');
  if (current.window.start <= previous.window.end) blockers.push('overlapping_or_reversed_windows');
  if (current.filters.signatureSha256 !== previous.filters.signatureSha256) blockers.push('different_filters');
  if (current.coverage.clicksNotRepresentedInQueryRows < 0 || previous.coverage.clicksNotRepresentedInQueryRows < 0 || current.coverage.impressionsNotRepresentedInQueryRows < 0 || previous.coverage.impressionsNotRepresentedInQueryRows < 0) blockers.push('inconsistent_query_export');
  if (blockers.length) return { comparable: false, blockers, changes: null };
  const before = previous.totalPropertyMetrics, after = current.totalPropertyMetrics;
  const change = key => ({ before: before[key], after: after[key], absolute: after[key] === null || before[key] === null ? null : after[key] - before[key], relative: after[key] === null || before[key] === null || before[key] === 0 ? null : (after[key] - before[key]) / before[key] });
  return { comparable: true, blockers: [], changes: { clicks: change('clicks'), impressions: change('impressions'), ctr: change('ctr') },
    positionComparison: { before: before.approximateImpressionWeightedPosition, after: after.approximateImpressionWeightedPosition, interpretation: 'Descriptive property-wide averages only; changing query/device/geography mix can move them without any target query rank improvement.' },
    visibleQueryMixComparableAsCompletePopulation: false,
    warning: 'Equal windows and matching export filters support descriptive comparison, not attribution to a release. Search Console is observational, and query coverage can differ.' };
}
