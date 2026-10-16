# Official brand and app identity

## Problem and scope

The October 16 Turkish Google spot-check placed the namesake marketplace above
this business for `yıkat` and `yikat`. This is a brand-disambiguation problem,
separate from our stronger observed local shoe-cleaning result. Search results
vary by query, location and time; this check is not an independent Maps rank.

The product and contact routes inherited the homepage Open Graph URL and title.
Their metadata did not explicitly connect the iOS app to the same business
entity that publishes our service pages and guides. Existing app instructions
also did not clearly disclose the current pause in new app orders.

## Implementation

- Preserve the established homepage composition, brand spelling and entity IDs.
- Add accurate alternate website names, including the domain fallback, to the
  existing WebSite node. Add the already public legal business name to the shop.
- Give `/urun` and `/iletisim` their own canonical/social metadata and connect
  their WebPage/ContactPage nodes to the existing business and website.
- Connect the app page to its publisher and exact App Store ID with WebPage
  markup and visible links. No fabricated reviews, ratings or Android download.
- Expose the verified developer identity and official links in useful visible
  copy. Clarify the new-order pause, upcoming collection and Android availability.
- Link the existing contact/about information to the shop and service hub. Update
  only the materially changed sitemap dates; retain the 40-page sitemap.

The public Apple lookup on October 16 identified App Store ID 6806875753,
bundle `com.yikat.tech`, seller `AHMET KAAN EVRENSEL` and seller website
`https://www.yikat.tech`. Store version 1.0.2 was public at verification. The
website retains the owner's current Yıkat brand; pending store metadata does
not establish that a new app version has been approved.

## Verification plan and boundaries

Check rendered canonical/OG/Twitter consistency, one stable business identity,
the exact iOS destination and no false Android offer. Exercise the official link
without JavaScript at 320px and audit the modified pages at mobile/desktop sizes.
Run the repository's lint, typecheck, unit and production-browser checks, then
read back the deployed source SHA and ordinary public routes before notifying
IndexNow of the three changed canonical URLs. Inspect Google indexing separately.

This work helps search engines reconcile identity; it does not prove a rank
increase. SoftwareApplication markup is intentionally absent: a software rich
result requires a review or rating that is visible and cleared for display.
Use real Search Console data and the existing weekly search report to assess
subsequent changes. No new outreach, customer photos or reviews are published.

Sources:
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/structured-data/organization
- https://developers.google.com/search/docs/appearance/structured-data/software-app
- https://itunes.apple.com/lookup?id=6806875753&country=tr

The referenced legacy superpowers skill package was not installed in the local
skill catalogs. This document records the focused plan and review criteria;
actual repository checks and provider readbacks remain required.
