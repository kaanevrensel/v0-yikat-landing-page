# Yıkat search visibility audit

Observed October 15, 2026. This is an implementation baseline, not a ranking-result claim.

## Identity and ranking question

The relevant similarly named competitor is [yikatapp.com](https://yikatapp.com/), a separate cleaning marketplace. Its Google Play identity is `com.yikat.app`; it is not our Android application. The verified Instagram for our shop is [@yikat.app](https://www.instagram.com/yikat.app/), with a dot. Our managed Google Business Profile links to that account and [Maps CID 11452704591158275657](https://www.google.com/maps?cid=11452704591158275657).

The live Yıkat homepage title was `Yıkat Gitsin | Temizlik ve bakım`, while its WebSite schema used Yıkat and an alternate name Yıkat Gitsin. Those are conflicting naming signals. This branch makes the title, WebSite, social metadata and visible identity consistent with Yıkat. Google chooses the displayed site name automatically; [its documentation](https://developers.google.com/search/docs/appearance/site-names) identifies consistent homepage text and WebSite data as inputs. We cannot promise a particular search-result name or recrawl date.

A single search result is not evidence of a universal position. The root agent subsequently verified our Search Console property, but no competitor traffic, backlink comparison or location-controlled rank history was obtained. Therefore the cause of any individual competitor placement remains unproven. [Google's local ranking guidance](https://support.google.com/business/answer/7091) names relevance, distance and prominence; completeness, reviews and links are relevant inputs, while geographic distance cannot be fixed by adding pages.

## Observed footprint

| Surface | Yıkat before this branch | Competitor observation |
| --- | --- | --- |
| Sitemap | 26 direct page URLs | 48 service sitemaps contain 9,495 service/location URLs |
| Editorial content | 11 care guides | 30 blog entries across three listing pages |
| Service scope | Actual Bakırköy shoe shop; homepage gave five services equal availability | Eight service categories and broad province/district pages |
| Local page | Real shop address, map and genuine photographs | Includes a Bakırköy cleaning location page |
| Entity signals | Mixed Yıkat / Yıkat Gitsin; no verified Instagram link | Separate app identity, broad service pages and multiple languages |

Counts are sitemap/listing observations, not indexed-page counts. Competitor location/provider claims are the competitor's own claims and were not independently verified. Sitemap image entries were excluded from page counts. Sources: [our sitemap](https://www.yikat.tech/sitemap.xml), [competitor sitemap](https://yikatapp.com/sitemap.xml), [competitor blog](https://yikatapp.com/blog/), [competitor Bakırköy page](https://yikatapp.com/istanbul-bakirkoy-temizlik/).

## Verified Search Console baseline

The root agent read the managed URL-prefix property on October 15: the three-month view showed 103 clicks, 677 impressions, 15.2% CTR and average position 4.3. Brand queries dominated (39 clicks for `yıkat`, six for `yikat`), with repair-related intent also appearing. The indexing report, last updated October 11, showed seven indexed URLs out of 25 known URLs and 18 not indexed. No field Core Web Vitals data was available. These dashboard figures are a dated baseline; they do not establish the effect of this branch or that all 26 sitemap URLs had been indexed. The October 10 additions were recent. Root retains the native export and indexing-reason evidence in the YIKAT workstream.

The 28-day performance view for September 16–October 13 showed 33 clicks, 313 impressions, 10.5% CTR and average position 3. Leading visible queries included `yıkat` (15 clicks / 37 impressions), `yıkat bakırköy` (2 / 14) and `yikat` (1 / 10). The native export attributed 30 clicks to the homepage, two to the suede page and one to the sneaker page; 23 were mobile and ten desktop, all from Turkey. Of the 19 clicks represented in the exported query rows, 18 were branded. The overall report includes 33 clicks, so the visible-query subset must not be treated as the complete query mix. A brand-heavy average position is not a benchmark for unbranded shoe-cleaning queries. These unequal windows should not be presented as a growth comparison.

The October 11 indexing breakdown was 16 `Discovered, currently not indexed` and two `Crawled, currently not indexed`. The discovered list included `/ayakkabi-temizleme`, `/iletisim`, `/rehber` and guides released on October 10, with no last-crawl date. The report did not classify these as robots exclusions. That timing can reflect ordinary discovery/crawl lag; it does not establish a technical indexing defect.

Root subsequently inspected both crawled examples in the native report: one was a generated JavaScript chunk and the other a bundled `.woff2` font. They were static resources, not two missing content pages. The 18 non-indexed URLs must therefore not be described as 18 excluded HTML pages or a backlog of 18 content fixes. Continue monitoring the discovered content URLs after Google crawls them; neither this status nor the competitor's sitemap size proves the cause of a ranking difference. The dated native receipts and exports remain in `workstreams/operations-visibility-20261015/` in the private YIKAT workspace.

The sitemap was submitted and read on October 15, with native status `Success`, 39 discovered pages and zero discovered videos. This confirms sitemap processing and URL discovery, not indexing of 39 pages. The seven-indexed/25-known indexing snapshot was last updated October 11, before the October 15 release. Keep that snapshot, the latest sitemap discovery count and any later confirmed indexing changes separate. Zero discovered videos is the sitemap report's count; it does not mean the website has no video.

## Implemented response

1. Correct the shop's hours, tax identity, brand name, legal references and outdated KVKK description. The business schema and visible shop details share `lib/site.ts`. Root separately updates the managed Google profile so native business information agrees.
2. Put Bakırköy, the real address and opening hours in the first screen. Label the four unavailable services and courier collection accurately. Preserve the five illustrations and existing visual identity.
3. Use the real drying-cabinet footage supplied by Kaan, with optional playback. Link official Instagram and the live Google profile/reviews without inventing testimonials or copying a stale rating.
4. Add eight useful decisions to the existing guide architecture: mesh/knit, laces, insoles, mud, rain, storage, cleaning versus repair, and price-enquiry preparation. Each has a distinct intent, practical steps, boundaries, original manufacturer sources, related reading and a relevant route to the actual shop. The total becomes 19 guides and 39 sitemap URLs, including five newly accessible legal documents.
5. Keep each page server-rendered and crawlable, with unique title/canonical, valid internal links, actual publication dates and accessible mobile tables. Preserve the price boundary: no unverified price list or fabricated service coverage.

Multiplying a competitor's 9,495 service/location pages by ten would create irrelevant coverage for a one-shop launch. It is not a quality target. [Google's spam policies](https://developers.google.com/search/docs/essentials/spam-policies) address doorway pages and scaled content made primarily to manipulate rankings. Expansion should earn its own page with a distinct customer question or firsthand evidence.

## Next evidence to collect

- Search Console: compare equivalent 28-day periods by query, landing page and device after the release has had time to be crawled. Separate branded Yıkat queries, Bakırköy service intent and care questions. Record impressions, clicks, CTR, average position and confirmed content-page indexing. Keep anonymized/omitted query rows, static-resource exclusions and sitemap discovery counts distinct.
- Fixed local query checks: use the same Bakırköy location, device and query set. Keep organic listings separate from the Maps pack. Record the displayed competitor and date, not just a claimed position.
- Consent-backed before/after stories: identify actual order/item permission, redact identifying details and publish only pairs with known material, starting condition, process and honest outcome. A permission checkbox alone is not a complete publishing feed.
- Review sync: the server foundation is disabled by default. Enable the authenticated [Business Profile reviews API](https://developers.google.com/my-business/content/review-data) only after API access, verified OAuth/location identity and public-display rights are cleared, as detailed in [the integration plan](2026-10-15-google-reviews-plan.md). Retain source attribution and show a current fetch date. Until then, the live profile link gives access to every Google review without presenting a partial static sample as a sync. Avoid self-serving LocalBusiness review/aggregateRating markup under [Google's review guidance](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).
- Expand from demonstrated demand: use real query gaps, customer questions and permissioned work examples. Avoid synonym-only articles, invented locations, service guarantees and unsupported repair expertise.

## Release boundary

Local implementation and green tests prove code behavior. They do not prove production deployment, Google recrawl, indexing, improved positions or extra orders. Root owns the final browser review, release, live checks and native project writeback.
