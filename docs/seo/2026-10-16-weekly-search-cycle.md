# Weekly search and demand review

Owner authorization: October 16, 2026. Ship an ongoing search-improvement loop and usable measurement without spending, manufacturing results or adding intrusive tracking.

## Implementation plan

1. Reuse the bounded public crawler. Run it every Thursday at 07:17 UTC (10:17 Istanbul), with a manual run available. Check only the website, not Google search results. Preserve a failed or incomplete audit as such.
2. Produce a short decision queue for the existing commercial destinations and a fixed list of relevant Turkish queries. The scheduled report contains public technical findings and marks native query, Maps, contact and shop metrics as unavailable. It never invents rank or demand.
3. On an authorized workstation, accept native Search Console exports using the existing parser. Retain only exact matches to the reviewed query list, public target-page metrics, coverage limitations and source hashes. Never upload native exports or customer data to the public workflow artifacts.
4. Keep a weekly human checkpoint for Search Console, Business Profile and shop source accuracy. Use complete periods, recorded provider timezones and separate populations. Select one evidence-supported page improvement each week and record its result before publishing another page.
5. Test unknown/zero distinctions, private-query exclusion, malformed inputs, fresh evidence and failed technical audits. A green audit is not indexing, a fixed-location rank, an enquiry or an order.

The infrastructure audit found Vercel Analytics only and no GA/GTM loader. Actual production Hobby custom reporting returned HTTP 402 on October 16. Root subsequently approved a first-party aggregate counter on the existing Supabase infrastructure: see the counter contract below. No paid plan, third-party tracker or contact-count backfill is included.

## Weekly operation

The `weekly-search` GitHub Actions workflow runs on the default branch. It publishes a run summary and a 30-day artifact containing only the public crawl and public priority report. It has read-only repository permissions, a 15-minute limit, three concurrent HTTP requests and no credentials. A failed or incomplete crawl fails the run after preserving its report. Scheduled runs may be delayed or disabled by GitHub, so Emre checks the run history during the Thursday review; merging a cron definition alone is not proof of a run. [GitHub schedule behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

The first manual run must succeed on merged main before declaring scheduling operational. The expected first scheduled checkpoint is October 22. Technical reports retain the run timestamp and source commit; they describe the public site fetched then, which may have a different deployed SHA during a release.

For the private native review:

```sh
node scripts/search-audit.mjs --out output/search-review/audit
node scripts/search-priorities.mjs --audit output/search-review/audit/audit.json --current /private/path/to/native-export --out output/search-review/priorities
```

Add `--previous /private/path/to/equal-previous-export` for a comparison. Private exports stay outside git and Actions. The command retains only allowlisted query text and approved public target-page paths. Query and page dimensions remain separate: it does not claim a query led to that page. A missing exported query is unknown, not zero. Rankings are reported averages from Search Console, not a local Maps or organic position.

Every Thursday, Emre reviews final Search Console days with the same property, search type, country and device filters. Pacific daily boundaries remain explicit. Kaan records the source at counter intake and Emre reads the existing aggregate-only shop report in Istanbul time. Business Profile interactions stay in their native reporting window; they are not completed calls or orders. Contact counts stay unknown until a supported reporting route and real observations exist. The pre-existing private `weekly-report.mjs` remains the combined demand-report command; its sources and contracts are in the canonical YIKAT workspace under `workstreams/search-growth-20261015/measurement-next/`.

For manual local observations, keep Bakırköy location, Turkish language, device, time and screenshot consistent. Record the Maps pack and organic results separately. Do not scrape Google or treat personalized one-off results as a universal position. [Google machine-generated traffic policy](https://developers.google.com/search/docs/essentials/spam-policies#machine-generated-traffic). Search Console can omit query rows and does not guarantee all rows; preserve those gaps. [Search Analytics API and date semantics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query).

## Decision rules

- First fix observed crawl, canonical, indexing or internal-link failures.
- A relevant query with at least 20 reported impressions, average position at most 12 and CTR below 3% goes to snippet/offer review. These are triage thresholds, not universal CTR benchmarks or proof of a defect.
- Queries with at least 20 impressions and average position between 12 and 30 go to answer, proof and internal-link review of the existing destination.
- Low-volume or missing rows remain an evidence collection task. Do not publish location or synonym permutations to fill empty rows.
- A new page needs a distinct customer question, confirmed service scope and original useful evidence. Repair intent remains a scope question until the actual shop offering is confirmed.
- Report Google review count/replies, referral conversations, enquiries and paid/delivered orders separately. Do not calculate a cross-system conversion rate from incompatible dates or populations.

## First-party contact reporting

`/api/contact-counts` implements a schema 2 counter using SQL182 in the product repository. It reuses only the existing server-only anonymous integration key and rejects privileged keys. The route is disabled until `YIKAT_CONTACT_COUNTER_ENABLED=true`. Production is pinned to the live database; preview is pinned to TEST. The client sends only a fixed action, public page bucket and coarse referrer class. Guide pages share `/rehber/*`; all other unknown paths become `other`. There are no visitor IDs, IP storage, cookies, messages, query strings or order joins. The database chooses the Istanbul date, atomically increments one, bounds all daily accepted events to 10,000 and prunes rows outside the most recent 90 calendar days when a new valid event is processed. Direct anonymous/authenticated table reads and writes are denied. Only the narrow increment RPC is exposed.

Known automation, hidden-document and synthetic DOM activations are excluded; a one-second in-memory action/page cooldown reduces accidental double activation. The endpoint checks origin/Fetch Metadata and validates a 512-byte exact payload, but anonymous callers can still spoof legitimate requests. Repeat visits, browser blocking, request failures and the daily cap affect counts. This metric is accepted contact activations, not unique visitors, qualified enquiries, completed calls or orders. There is no silent retry. Provider logs remain subject to the existing hosting notice; the aggregate table itself has no person-level data.

The website-only KVKK section describes this actual processing. Root must independently verify SQL182, its production backup/apply/readback and the activation timestamp. Local/preview synthetic tests never establish a genuine production event. Read aggregate counts using the authorized private report command in `workstreams/local-growth-20261016/measurement/`; it refuses periods that precede the verified activation day. Never place database/provider secrets or native reports in the public weekly workflow. The unresolved Vercel 336 versus 352 pageview discrepancy is not used as a reconciled baseline, and Vercel schema 1 is not spliced into the new series.

The public anonymous RPC can be called independently of the website checks. The feature flag stops website delivery only. An emergency stop of all public increments also revokes EXECUTE on `public.record_website_contact(text,text,text)` from anon and authenticated; preserve the aggregate table and separately record restoration of that grant. Operational/admin default table grants are explicitly revoked and re-granted as SELECT only.
