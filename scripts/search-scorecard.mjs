#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadSearchExport, compareExports } from './lib/search-csv.mjs';
const args = process.argv.slice(2), options = {};
for (let i = 0; i < args.length; i += 2) {
  if (!['--current', '--previous', '--out'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: node scripts/search-scorecard.mjs --current /path/to/export [--previous /path/to/previous] [--out output/search-scorecard/TIMESTAMP]');
  options[args[i].slice(2)] = args[i + 1];
}
if (!options.current) throw new Error('--current Search Console CSV directory is required');
const current = await loadSearchExport(options.current), previous = options.previous ? await loadSearchExport(options.previous) : null;
const report = { observedAt: new Date().toISOString(), current, ...(previous ? { previous, comparison: compareExports(current, previous) } : { comparison: { comparable: false, blockers: ['no_previous_period_supplied'], changes: null } }) };
const output = path.resolve(options.out || `output/search-scorecard/${new Date().toISOString().replaceAll(':', '-')}`);
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'scorecard.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
const percent = v => v === null ? 'unknown' : `${(v * 100).toFixed(2)}%`, totals = current.totalPropertyMetrics, visible = current.visibleQueries;
await writeFile(path.join(output, 'scorecard.md'), `# Search Console measurement baseline\n\n${current.window.start} through ${current.window.end} (${current.window.rowDays} daily rows).\n\n- Property: ${totals.clicks} clicks, ${totals.impressions} impressions, ${percent(totals.ctr)} CTR.\n- Approximate impression-weighted position: ${totals.approximateImpressionWeightedPosition?.toFixed(2) ?? 'unknown'}, reconstructed from rounded daily averages. This is not an unbranded or fixed-location rank.\n- Visible queries: ${visible.rowCount} rows; ${visible.totals.clicks} clicks and ${visible.totals.impressions} impressions.\n- Branded: ${visible.branded.clicks} of ${visible.totals.clicks} visible clicks (${percent(visible.brandedShareOfVisibleClicks)}).\n- Not represented in query rows: ${current.coverage.clicksNotRepresentedInQueryRows} clicks and ${current.coverage.impressionsNotRepresentedInQueryRows} impressions; source of gap unknown.\n- Current URL indexing: not measured by these exports.\n- Period comparison: ${report.comparison.comparable ? 'matching filters and equal complete windows; see JSON for descriptive changes' : `unavailable (${report.comparison.blockers.join(', ')})`}.\n\n${current.warnings.map(v => `- ${v}`).join('\n')}\n\nRaw query strings and customer/person information are not retained in this report. Source file checksums allow reproduction from the private native exports.\n`, { flag: 'wx' });
console.log(JSON.stringify({ output, window: current.window, totals, queryCoverage: current.coverage, comparison: report.comparison }, null, 2));
