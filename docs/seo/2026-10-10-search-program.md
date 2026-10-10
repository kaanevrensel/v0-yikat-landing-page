# Search discovery release — 10 October 2026

## Problem and behavior

The site had three short material-service pages but no dedicated shop destination
or care-guide collection. Google Search Console's pre-release three-month view
shows 99 clicks, 635 impressions, 15.6% CTR and average position 4.7 for
July 7–October 6, 2026 (native CSV exported). The leading
visible queries are branded; repair queries also appear, although the verified
offer is shoe cleaning. These are historical metrics, not results of this release.
The native Google generative-AI beta report for the same period shows 33 total
impressions. Its CSV is saved separately; page totals are not additive because one
search can include multiple URLs. Neither metric means 33 independent citations,
visitors or new recommendations from this release.

This release adds 14 URLs: one actual Bakırköy location, one shoe-cleaning hub,
a guide index and eleven distinct care guides. It improves the three existing
material-service URLs. Primary navigation and the image-led homepage stay intact.
The shop's actual address, Maps identity, photographs and owner-confirmed daily
10:00–22:00 hours are consistent throughout. No invented prices, reviews, repair
service, collection availability or guaranteed turnaround are published.

## Native research

Google Ads Keyword Planning API, read-only, observed 2026-10-10:

- Turkish language 1037; Google Search network.
- Turkey 2792, Istanbul city 1012782, Bakirkoy district 9198944.
- Five seed families, 3,816 unique candidate phrases; historical data returns
  3,809 rows per geography. Native month series: September 2025–August 2026.
- Blank means unreported; zero is retained when explicitly returned. Variants
  and overlapping geographies cannot be added. Paid competition is not organic
  difficulty. Bid currency is USD. No advertising resources were changed.
- Full raw data and reproducible research script remain in the private workspace:
  `workstreams/seo-20261010/`. The adjacent curated CSV maps priorities to URLs.
  Product-shopping, repair and unavailable transactional services are excluded.

Microsoft Bing Webmaster Tools Keyword Research, native verified property:

- Turkey, Turkish (Turkey), all devices. Three-month cleaning and suede-question
  queries returned insufficient trend data and no related/question suggestions.
- Expanded to 12 months (2025-10-09–2026-10-08). `ayakkabı` displayed **1.4K
  impressions**, with shopping URLs dominating its top ten. This is Bing's rounded
  period metric, not Google's average monthly volume, and is not a service target.
- `ayakkabı temizleme` remained insufficient at 12 months; its top URLs mixed Nike
  and retailer instructions, products, Temiz.co and Online Lostra. This supports
  separate service and instructional destinations rather than one overloaded page.
- `süet ayakkabı nasıl temizlenir` returned instructional URLs. `bakırköy ayakkabı
  temizleme` returned Temiz.co's local page, Beyoğlu Lostra and Armut first. Its
  suggestion panel rate-limited further requests, so no local Bing volume is claimed.
- Remote results are intent observations, not a Bakırköy local-pack rank grid.

## Page and content decisions

| Intent | Destination |
|---|---|
| Nearby shoe cleaning, address, hours, visit | `/bakirkoy-ayakkabi-temizleme` |
| Shoe cleaning/washing service and quote factors | `/ayakkabi-temizleme` |
| Sneaker/sports shoe service | `/sneaker-yikama` |
| Suede/nubuck service | `/suet-nubuk-temizleme` |
| Leather care service | `/deri-ayakkabi-bakimi` |
| Machine washing, temperature and spin | `/rehber/ayakkabi-makinede-yikanir-mi` |
| White footwear, dirt versus yellowing/damage | `/rehber/beyaz-ayakkabi-nasil-temizlenir` |
| Suede/nubuck care decisions | `/rehber/suet-nubuk-ayakkabi-nasil-temizlenir` |
| Odor without unsupported sterilization claims | `/rehber/ayakkabi-kokusu-nasil-giderilir` |
| Drying without heat damage | `/rehber/ayakkabi-nasil-kurutulur` |
| Reading washing/care labels | `/rehber/yikama-sembolleri` |
| What dry cleaning means | `/rehber/kuru-temizleme-nedir` |
| Duvet label, capacity and drying decisions | `/rehber/yorgan-nasil-yikanir` |
| Sports-shoe care steps and material boundaries | `/rehber/spor-ayakkabi-nasil-temizlenir` |
| Leather cleaning versus polish and repair | `/rehber/deri-ayakkabi-nasil-temizlenir` |
| Shirt ironing sequence and label limits | `/rehber/gomlek-nasil-utulenir` |

Laundry and dry-cleaning transactional terms have demand but require confirmed
service availability before commercial pages are published. The four textile
guides are educational and tell readers to verify acceptance before planning a
service. No cloned neighborhood pages or made-up expert biographies are used.

## Search and AI discovery

Every page serves its answer, headings, source links and FAQs in server HTML.
Each URL has its own canonical, title, description and social metadata. A stable
business identity connects LocalBusiness, WebSite, Service, Article and breadcrumb
data. Schema reflects visible facts. Guides cite actual manufacturer/care sources,
handle conflicting instructions explicitly and retain honest publication dates.

Contextual service/guide links, a crawlable index, footer links and the sitemap
support discovery. Existing robots access remains public, including OAI-SearchBot.
IndexNow submission is deploy-gated, verifies every URL/key, and defaults to a dry
run. No special AI file or schema is represented as a ranking requirement.

Primary guidance used:

- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)
- [Google local ranking](https://support.google.com/business/answer/7091)
- [Bing Webmaster guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)
- [Bing AI Performance](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)
- [OpenAI publisher guidance](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
- [IndexNow protocol](https://www.indexnow.org/documentation)

## Local profile handoff

Use the existing [Google listing](https://www.google.com/maps?cid=11452704591158275657),
not a duplicate. Verified phone +90 850 303 31 93; Sakızağacı Mahallesi İskele
Caddesi No:15-B, 34142 Bakırköy/İstanbul; pin 40.9778141,28.8777991. It currently
shows old 09:00 opening and a shoe-repair category. The business account has no
management access. Emre said to handle access with Kaan by email. Apple Business
also needs the existing account sign-in; no credentials should be emailed.

Apply daily 10:00–22:00 hours, the closest accurate available cleaning category,
material-specific services, real storefront/process images and the new local URL.
Use an accurate public name, without appended keywords. Draft descriptions and
Kaan handoff are in the workspace. Request honest reviews from all completed
customers without incentives or filtering; no review outreach has been sent.

## Measurement

`discovery_contact_click` records action, page path and a fixed referrer category.
It never records query strings, phone contents, messages or a raw referrer URL.
Directions/WhatsApp/call clicks are intent, not orders. Direct/unknown includes
AI visits with stripped referrers; it cannot measure all AI discovery.

Keep release, submitted, accepted, crawled, indexed, ranked, clicked and purchased
as separate evidence states. After 7/14/28 days review Google/Bing queries and URLs,
branded/nonbranded demand, indexed canonicals, contact intent and actual shop
outcomes. Review native AI citation reports separately from referral traffic.
The workspace benchmark preserves prompt, date, engine, locale and cited URL;
mentions without source links are not citations. No future monitoring job has
been scheduled by this release.

## Validation and release

Local lint and typecheck pass; one pre-existing image warning remains. Production
build and all 46 Playwright tests pass with one worker, including all discovery
URLs, no-JS answers/actions, schema, sitemap, unknown-URL 404, mobile overflow and
serious/critical axe checks. The first run exposed a narrow-screen table overflow,
fixed with proper grid min-width. A local two-worker process shutdown hung; the
full one-worker rerun passed. CI runs the required two-worker gate.

Live deployment and native submission receipts are recorded separately after
release. No ranking, citation or traffic increase is claimed from publication.

The final coverage pass maps all 50 available-service/educational priority phrases to dedicated pages; six transactional phrases remain gated on service availability. The adidas leather citation resolves directly to its actual leather Superstar example. New shirt guidance cites reachable Tefal and current GINETEX pages; retired Philips URLs that redirect to shopping or return 404 were excluded.
