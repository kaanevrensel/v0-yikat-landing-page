#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { auditSite } from './lib/search-crawl.mjs';

const args = process.argv.slice(2), options = {};
for (let i = 0; i < args.length; i += 2) {
  if (!['--site', '--out', '--concurrency', '--max-pages'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: node scripts/search-audit.mjs [--site https://www.yikat.tech] [--out output/search-audit/TIMESTAMP] [--concurrency 4] [--max-pages 500]');
  options[args[i].slice(2)] = args[i + 1];
}
const output = path.resolve(options.out || `output/search-audit/${new Date().toISOString().replaceAll(':', '-')}`);
const audit = await auditSite({ site: options.site, concurrency: options.concurrency ? Number(options.concurrency) : 4, maxPages: options['max-pages'] ? Number(options['max-pages']) : 500 });
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'audit.json'), JSON.stringify(audit, null, 2) + '\n', { flag: 'wx' });
const rows = audit.pages.map(p => `| ${new URL(p.url).pathname} | ${p.status ?? 'unknown'} | ${p.inspection} | ${p.defects.join(', ') || 'none observed'} | ${p.warnings.join(', ') || 'none'} | ${p.linkDepthFromHomepage ?? 'unreachable'} |`);
await writeFile(path.join(output, 'audit.md'), `# Public search audit\n\nObserved ${audit.observedAt}. ${audit.summary.sitemapPagesAudited} sitemap pages, ${audit.summary.additionalTargetsChecked} additional internal targets. Index state: unknown.\n\n${audit.limitations.map(v => `- ${v}`).join('\n')}\n\nCrawl completeness issues: ${audit.issues.join(', ') || 'none'}.\n\n| Path | HTTP | HTML inspection | Defects | Diagnostics | Homepage depth |\n| --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}\n`, { flag: 'wx' });
console.log(JSON.stringify({ output, summary: audit.summary, crawlIssues: audit.issues }, null, 2));
process.exitCode = audit.summary.pagesWithDefects ? 1 : audit.summary.incompleteHtmlInspections || audit.summary.internalTargetsUnknown || audit.issues.length ? 2 : 0;
