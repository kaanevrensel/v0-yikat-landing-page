#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildPriorityReport, readPriorityExport, renderPriorityReport } from './lib/search-priorities.mjs';

const options = {}, args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 2) {
  if (!['--audit', '--current', '--previous', '--out'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: node scripts/search-priorities.mjs --audit audit.json [--current private-export-directory] [--previous private-export-directory] --out output-directory');
  options[args[i].slice(2)] = args[i + 1];
}
if (!options.audit || !options.out || (options.previous && !options.current)) throw new Error('Audit and output are required; previous needs current');
if (process.env.GITHUB_ACTIONS === 'true' && (options.current || options.previous)) throw new Error('Native exports are private; never import them in public Actions');
const audit = JSON.parse(await readFile(options.audit, 'utf8'));
const current = options.current ? await readPriorityExport(options.current) : null;
const previous = options.previous ? await readPriorityExport(options.previous) : null;
const sourceCommit = /^[a-f0-9]{40}$/.test(process.env.GITHUB_SHA || '') ? process.env.GITHUB_SHA : null;
const report = buildPriorityReport({ audit, current, previous, sourceCommit });
const output = path.resolve(options.out);
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'priorities.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
await writeFile(path.join(output, 'priorities.md'), renderPriorityReport(report), { flag: 'wx' });
console.log(JSON.stringify({ output, nativeEvidence: report.source.status, targets: report.rows.length, comparisonAvailable: report.comparison.comparable }));
