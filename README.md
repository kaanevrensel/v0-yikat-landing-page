# Yıkat website

Turkish marketing website at https://www.yikat.tech/. Development and verification instructions are in [CLAUDE.md](CLAUDE.md).

## Attribution state

September 27, 2026: the homepage has a visible, server-rendered BENIAN technology-support link. It is enabled only on the homepage, rather than repeated across service pages. [PR 8](https://github.com/kaanevrensel/v0-yikat-landing-page/pull/8) merged and the link was independently verified on the production homepage. The credit makes no AI-product or delivered-outcome claim. Current release status, verification evidence and remaining access work are maintained in [BEN-3094](https://linear.app/benian/issue/BEN-3094).

## October 15 website update

The visibility branch corrects Yıkat branding, shop hours, tax identity, legal references, service availability and shoe-care advice. It adds the verified drying-cabinet clip, official social links and eight distinct guides. [Implementation plan and source evidence](docs/seo/2026-10-15-visibility-plan.md).

Local verification: lint, typecheck, legal-source consistency, production build and all 52 Playwright tests passed. Desktop and mobile visual review covered the shop heading, service states, process tabs, video and guide tables. Production release and business-profile evidence are recorded separately in the YIKAT operations workstream.

## Google reviews foundation

The read-only Google reviews connection is disabled by default. When enabled after API and publication clearance, it verifies this shop's Place ID, reads every provider page, preserves review attribution and offers an accessible panel beside the shop information. With the connection off, the existing Google profile link stays visible. No reviews are stored persistently or fabricated, and no own-business review-rating schema is added. [Activation requirements, limits and verification](docs/seo/2026-10-15-google-reviews-plan.md).

## Search growth, October 15 2026

The main cleaning hub now includes a material-and-condition guide with 24 routes, a server-rendered no-JavaScript alternative and no customer data storage. The Bakırköy and three material pages explain intake, service limits and aftercare more precisely. The guide hub offers a printable one-page care card with actual shop details and linked manufacturer sources.

The bounded public crawler and native Search Console CSV scorecard separate technical findings, incomplete query coverage and measured search outcomes. Their 20 edge tests run separately in CI. No new location or synonym pages were created.

Implementation and validation: [commercial pages](docs/seo/2026-10-15-commercial-pages.md), [care card](docs/seo/2026-10-15-care-card.md), [measurement](docs/seo/2026-10-15-search-measurement.md). External actions and deployed-state evidence live in the canonical YIKAT workstream `workstreams/search-growth-20261015`. Code and crawl-request acceptance do not establish ranking gains.

## Search and contact measurement, October 16 2026

The site now has 40 sitemap pages, including 20 distinct guides. The new guide answers whether shoes should be taken to a dry cleaner, distinguishes textile cleaning from dry brushing, and explains what to confirm before acceptance. The cleaning hub shows the four verified category base tariffs for one pair, dated October 16 in Istanbul. Existing shop, route and drying footage are clearly identified; no customer case or permission is invented.

One delegated `contact_intent` event now covers actual WhatsApp, phone and directions actions across public pages. It replaces the narrower legacy series, excludes service/review navigation and sends bounded custom properties. Contact events are not orders. The live `www.yikat.tech` project was verified on an active Vercel Hobby team, so custom-event totals remain unavailable under its current plan. Instrumentation, supported reporting and genuine events remain separate states; no paid upgrade or provider change is included. The private weekly reporting command keeps unknown contacts, Search Console coverage and separate created/paid/delivered shop populations explicit.

Native Google Search Console inspection on October 16 at 00:52 UTC reported both `/ayakkabi-temizleme` and `/rehber` as indexed. This is the observation for those two URLs, not evidence that every page is indexed or that rankings improved. The receipt is `workstreams/search-growth-20261015/next-execution-native.json` in the private canonical workspace.

Implementation and source boundaries: [service-selection guide](docs/seo/2026-10-15-service-selection-guide.md), [verified tariffs and workshop evidence](docs/seo/2026-10-15-workshop-proof.md), [contact measurement and checkpoints](docs/seo/2026-10-16-conversion-measurement.md). Combined release checks and deployment evidence are recorded in the canonical YIKAT workstream; source changes do not establish improved rankings or customer acquisition.
