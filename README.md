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
