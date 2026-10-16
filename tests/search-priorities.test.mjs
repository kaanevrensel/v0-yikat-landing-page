import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { buildPriorityReport, priorities, readPriorityExport, renderPriorityReport } from '../scripts/lib/search-priorities.mjs';

const timestamp = '2026-10-16T02:00:00Z';
const audit = () => ({ observedAt: timestamp, summary: { sitemapPagesAudited: 40, pagesWithDefects: 0 }, issues: [], pages: [...new Set(priorities.map(row => row.target))].map(target => ({ url: `https://www.yikat.tech${target}`, inspection: 'complete', defects: [], warnings: [] })) });

async function nativeFixture(t, { query = 'Bakırköy ayakkabı temizleme', clicks = 0, impressions = 30, position = 8, extra = '', start = '2026-10-01' } = {}) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'yikat-priorities-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await Promise.all([
    writeFile(path.join(directory, 'Chart.csv'), `Date,Clicks,Impressions,CTR,Position\n${start},2,60,3.3%,8`),
    writeFile(path.join(directory, 'Queries.csv'), `Top queries,Clicks,Impressions,CTR,Position\n${query},${clicks},${impressions},0%,${position}\nprivate-person-5551234567,1,5,20%,2\n${extra}`),
    writeFile(path.join(directory, 'Pages.csv'), 'Top pages,Clicks,Impressions,CTR,Position\nhttps://www.yikat.tech/bakirkoy-ayakkabi-temizleme,2,50,4%,6\nhttps://www.yikat.tech/private-person-5551234567,0,1,0%,3'),
    writeFile(path.join(directory, 'Filters.csv'), 'Filter,Value\nDate,Custom\nSearch type,Web'),
  ]);
  return { directory, imported: await readPriorityExport(directory) };
}

test('scheduled report preserves unknown query and Maps evidence, no invented zero', () => {
  const report = buildPriorityReport({ audit: audit(), observedAt: timestamp });
  assert.ok(report.rows.every(row => row.organicSearch.metrics === null && row.mapsRank === null));
  assert.equal(report.source.status, 'not_imported');
  assert.ok(renderPriorityReport(report).includes('unknown'));
});
test('native report retains only reviewed exact query and target-page data', async t => {
  const { imported } = await nativeFixture(t);
  const report = buildPriorityReport({ audit: audit(), observedAt: timestamp, current: imported });
  assert.equal(report.rows[0].nextAction, 'review_snippet_offer_and_query_fit');
  assert.equal(report.rows[0].targetPageSearch.clicks, 2);
  assert.equal(report.rows[1].organicSearch.status, 'not_in_export');
  assert.equal(report.rows[1].organicSearch.metrics, null);
  assert.equal(JSON.stringify(report).includes('private-person'), false);
  assert.equal(JSON.stringify(report).includes('5551234567'), false);
});
test('missing export rows and reported zero-impression rows remain distinct', async t => {
  const { imported } = await nativeFixture(t, { impressions: 0, position: '-' });
  const report = buildPriorityReport({ audit: audit(), observedAt: timestamp, current: imported });
  assert.equal(report.rows[0].organicSearch.status, 'reported');
  assert.equal(report.rows[0].organicSearch.metrics.ctr, null);
  assert.equal(report.rows[0].organicSearch.metrics.impressions, 0);
  assert.equal(report.rows[1].organicSearch.metrics, null);
});
test('technical defects and incomplete audits outrank speculative content work', async t => {
  const { imported } = await nativeFixture(t);
  const broken = audit(); broken.pages[0].defects.push('canonical_not_self'); broken.pages[1].inspection = 'unknown';
  const report = buildPriorityReport({ audit: broken, observedAt: timestamp, current: imported });
  assert.equal(report.rows[0].nextAction, 'fix_observed_technical_defect');
  assert.equal(report.rows[2].nextAction, 'refresh_incomplete_or_stale_audit');
  const stale = buildPriorityReport({ audit: audit(), observedAt: '2026-10-25T02:00:00Z', current: imported });
  assert.equal(stale.audit.stale, true);
  assert.equal(stale.rows[0].nextAction, 'refresh_incomplete_or_stale_audit');
});
test('overlapping periods do not manufacture a query comparison', async t => {
  const { imported } = await nativeFixture(t);
  const report = buildPriorityReport({ audit: audit(), observedAt: timestamp, current: imported, previous: imported });
  assert.equal(report.comparison.comparable, false);
  assert.equal(report.rows[0].organicSearch.previousMetrics, null);
});
test('unapproved origins, future audits and duplicate normalized query rows fail', async t => {
  const wrong = audit(); wrong.pages[0].url = 'https://example.com/';
  assert.throws(() => buildPriorityReport({ audit: wrong, observedAt: timestamp }), /actual public/);
  assert.throws(() => buildPriorityReport({ audit: audit(), observedAt: '2026-10-15T00:00:00Z' }), /time/);
  await assert.rejects(nativeFixture(t, { extra: 'BAKIRKÖY AYAKKABI TEMİZLEME,1,2,50%,1' }), /Duplicate normalized/);
});
