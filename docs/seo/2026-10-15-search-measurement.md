# Search measurement and technical verification

The public crawl on October 15 inspected all 39 sitemap URLs. Every URL returned HTTP 200, exposed server-rendered content, had one unique title and a self-canonical, and had no observed `noindex` or Googlebot robots exclusion. Every page was reachable through crawlable links within two steps of the homepage. No broken internal target was observed. These checks do not establish that Google has indexed the pages or that rankings improved.

The only content-structure diagnostic in that live crawl was the same H1 on the homepage and Bakırköy shop page: `Bakırköy’de ayakkabını yıkat.` This was not an indexing blocker. The candidate now gives the shop page `Bakırköy’de ayakkabı temizleme.` to distinguish its local service intent. Verify the deployed result separately; do not rewrite titles or add words merely to satisfy a fabricated SEO score.

The aggregate October 11 Search Console snapshot is seven indexed URLs out of 25 known. The October 15 sitemap result of 39 discovered URLs is newer, but measures discovery. Two previously described crawled/not-indexed examples were a JavaScript resource and a font, not two missing content pages. Root refreshed individual URL Inspection records during this work: the Bakırköy shop, sneaker, suede and leather pages are indexed. The main `/ayakkabi-temizleme` hub remained discovered/not indexed; its live availability test passed and an indexing request was accepted. The `/rehber` hub also remained discovered/not indexed, and its indexing request was accepted. Neither request was repeated. Queue acceptance is not indexing. The native receipt is `workstreams/search-growth-20261015/google-indexing-actions.json`; use it for per-URL state rather than extrapolating a new total from either snapshot.

The native Search Console Links report, observed October 15 at 23:36 UTC, reported one external link to `https://www.yikat.tech/`, from `bebee.com`, with linking text `yikat tech`. It reported 19 internal links. These are Google's known/reportable links, not a complete backlink census, not 19 internally reachable pages and not a comparison with the competitor. The public crawl separately reached all 39 sitemap URLs within two homepage links. The native receipt is `workstreams/search-growth-20261015/google-links-baseline.json`. This small observed external-link footprint establishes a baseline for relevant earned-link work; it does not establish that the competitor has more links or that this explains a particular rank.

## Reproducible tools

Run from the website checkout with Node 22 or newer. No credentials or new dependencies are required. Commands use read-only public GET requests and local CSV files. No search submission, indexing request, profile mutation, outreach or background schedule is created.

```sh
node --test tests/search-tools.test.mjs
node scripts/search-audit.mjs --out output/search-audit/2026-10-15
node scripts/search-scorecard.mjs --current /absolute/path/to/search-console-export --out output/search-scorecard/2026-10-15
```

Use a new output directory for each observation. Reports use exclusive creation and refuse to overwrite existing evidence. The repository's `output/` directory is already ignored. The private canonical run lives in `YIKAT/workstreams/search-growth-20261015/technical/`, with its own ignore rule. Do not commit native exports or generated reports. Reports retain source checksums and aggregate metrics, but do not copy raw query strings, customer details or credential values.

### Public crawl

`scripts/search-audit.mjs` traverses `/sitemap.xml` and same-origin child sitemaps. It defaults to four concurrent page requests, at most 500 total page/internal targets, 25 sitemaps, a 15-second request timeout, five redirects and a four-megabyte response limit. Concurrency can be set from 1–12 and the page cap from 1–2,000. Out-of-origin sitemap entries and redirects are flagged and not fetched. Query-bearing URLs and API paths are excluded at every entry point, including sitemap entries and each redirect. Excluded query values and declared canonical query values are removed from saved URL fields; canonical comparison uses the original value before redaction.

The report preserves each observed HTTP status, redirect chain, response size and SHA-256. Server HTML inspection ignores script payloads, styles, templates and comments. Checks cover title, description, H1, canonical, generic/Googlebot `robots` metadata and response headers, Googlebot robots rules, internal target failures, inbound links and shortest homepage link depth. Image entries in an XML sitemap do not inflate the page count. Duplicate headings, metadata and missing inbound links are diagnostics, not claims about Google's ranking rules.

Exit codes:

| Code | Meaning |
| --- | --- |
| 0 | All requested inspections completed; no observed blocking defect. Warnings can remain. |
| 1 | An observed HTTP, canonical, robots/noindex or broken internal-link defect exists. |
| 2 | No observed defect, but fetch/parse limits or unknown inspections prevent a complete result. |

A timeout, external redirect, malformed/truncated sitemap or uninspected non-HTML response is unknown/incomplete, never silently counted as a pass. Sitemap tag nesting and a single complete root must validate before any completed prefix entries are accepted. The audit does not execute JavaScript, measure field Core Web Vitals, assess third-party links or fetch Google index records. It uses a declared audit user agent, not Googlebot impersonation. The HTML parser covers this site's static markup and is not a browser DOM conformance validator.

### Search Console scorecard

`scripts/search-scorecard.mjs` requires separate single-period `Chart.csv`, `Queries.csv` and `Filters.csv` exports in English column format. `Pages.csv`, `Devices.csv` and `Countries.csv` are optional. The parser accepts UTF-8 BOM, CRLF, quoted commas, escaped quotes and embedded newlines. It rejects ambiguous numeric formats, malformed CSV, duplicate dates and missing metric headers. Comparison-mode exports with side-by-side metric columns must first be exported as separate periods.

Property totals come from daily chart rows. CTR is recalculated as clicks divided by impressions. The tool reconstructs an explicitly approximate, impression-weighted average position from rounded daily values. It does not average query positions or label the result a fixed-location organic rank. Page impressions are never added to property impressions because multiple page impressions can belong to one property impression.

Brand classification normalizes Turkish dotted/dotless I, case and combining marks, then matches complete brand tokens. It includes Yıkat/Yikat and known joined variants, without treating `yıktaş`, `yıkayayım` or `yıkatma` as brand searches. Because the competitor shares the brand, a lexical brand match does not identify which company the searcher intended. Queries are also separated into repair intent, local cleaning, cleaning/care and other/unclear intent. These transparent lexical categories are measurement aids, not inferred customer identities.

For an equivalent-period comparison:

```sh
node scripts/search-scorecard.mjs --current /path/to/new-28-days --previous /path/to/prior-28-days --out output/search-scorecard/comparison-2026-11-12
```

The tool blocks comparisons when windows differ in length, overlap, reverse order, omit dates, use different non-date filters or have inconsistent query totals. Even a valid comparison remains descriptive: release attribution and changes in the complete query population are not established. Query rows can be anonymized or limited; the visible subset is kept separate from the chart totals.

## Native baseline

Source: the existing September 16–October 13, 2026 Search Console CSV export. This is the pre-expansion baseline, not a current growth result.

| Metric | Observed |
| --- | --- |
| Daily chart totals | 33 clicks, 313 impressions, 10.54% recalculated CTR |
| Approximate weighted position | 3.024 from rounded daily values; native UI rounded to 3 |
| Visible query rows | 25 rows, 19 clicks, 115 impressions |
| Branded visible subset | 18 clicks, 61 impressions |
| Nonbranded visible subset | 1 click, 54 impressions |
| Repair intent within visible nonbrand | 0 clicks, 40 impressions |
| Local cleaning within visible nonbrand | 0 clicks, 1 impression |
| Not represented in query rows | 14 clicks, 198 impressions; reason unknown |

The 18 branded clicks are 94.74% of **visible-query clicks**, not 94.74% of all 33 clicks. The 40 repair impressions are 74.07% of **visible nonbranded impressions**, not all nonbranded searches. The shared brand and incomplete query population prevent broader attribution. The low visible cleaning exposure makes clearer shoe-cleaning relevance and correct Business Profile categorization actionable priorities; it does not prove the category caused the existing repair traffic.

## Next measurements and decisions

1. Follow the accepted main-hub and guide-hub requests and inspect priority guides. Preserve the four confirmed indexed commercial URLs. Record observed time, crawl date, Google-selected canonical and index status separately. Investigate reported failures before requesting recrawl. Do not equate public HTTP 200 with indexed or repeat requests as a substitute for monitoring.
2. Use the same Search Console property, search type, country/device filters and complete 28-day windows. Keep the October 15 expansion date in the release log; allow reporting lag rather than filling missing days with zeros.
3. Keep a fixed Bakırköy device/location/query protocol for manual ranking observations. Record organic results and the Maps pack separately, with time and evidence. Do not infer that Search Console position 3 means position 3 for a prospective local customer.
4. Report direction/phone/WhatsApp events as contact intent. Only verified shop outcomes are orders or revenue. No customer-level attribution or revenue claims are introduced by these tools.
5. Retest the public crawl after each website release. Investigate actual failures before broadening content. Review indexing and query relevance after 7, 14 and 28 days; these are operating checkpoints, not an installed scheduler or a promised ranking improvement.

## Verification

Twenty focused tests pass. They cover malformed and quoted CSVs, Turkish brand variants, weighting, query omissions, equal-period gates, null CTR comparisons, private-query exclusion, raw-HTML decoys, canonical resolution and query redaction, sitemap image exclusion and truncation rejection, Googlebot group precedence, redirect/API isolation, concurrency limits, response limits, network failures, non-HTML unknown states and broken links. Targeted ESLint is clean. The quality workflow runs these tests immediately after typecheck. No application behavior, provider configuration or analytics implementation changed in this slice.

Private evidence:

- `technical/public-audit-final-20261015/audit.json` and `audit.md`: all 39 public URLs and link graph checks.
- `technical/baseline-20260916-20261013/scorecard.json` and `scorecard.md`: native-export baseline with source file checksums.
- `technical/validation.json`: tool/test hashes and current validation outcome.

## Primary references

- [Google: impressions, clicks and average position](https://support.google.com/webmasters/answer/7042828?hl=en)
- [Google: Search Console performance reports](https://support.google.com/webmasters/answer/7576553?hl=en)
- [Google: robots.txt interpretation](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
- [Google: local ranking](https://support.google.com/business/answer/7091)

These sources describe measurement and crawler behavior. They do not establish the competitor's traffic, backlinks, indexed-page count or the cause of its placement.
