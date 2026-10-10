# Local website redesign — October 7, 2026

Authorized scope: local implementation only. No commit, push or deployment.
Checkout: /Users/emrebenian/Developer/yikat-website-local; original iCloud checkout is preserved.

## Art direction

A crisp white storefront for the app's tactile blue cleaning objects. Reference is the actual YIKAT app, not a generic technology template. Bricolage Grotesque carries the whole site. Original vector logo and service PNGs are retained.

Palette: white #FFFFFF, cloud #F3F8FF, brand blue #269AFF, readable action blue #1A68C1, ink #102C42, muted ink #526777.
Layout: 1440px content maximum, 32–64px desktop gutters, 20px mobile gutters. Left-aligned readable copy, large object compositions, varied section rhythms. 84px maximum hero typography.

Home: spacious split hero / interactive services / pickup-to-return story / app showcase / shop visit and three actions.
Product: product-led hero / interactive app journey / service detail / practical FAQ and download.
Partners: business-led hero with illustrative operations panel / three concrete benefits / short application and review steps / FAQ.

## Motion

Marketing context: Jakub primary (polish), Jhey secondary (one cleaning splash and tactile objects), Emil for nav and forms. The user's brief explicitly sets the balance: animated but understandable and calm.
Opening foam wipe lasts roughly one second, once per session, with a replay control. It never captures input. Figures react to scrolling and selection; no continuous pulsing buttons or forced scroll. Reduced motion removes splash and transforms. Content is visible without animation.

## Functional boundaries

App Store URL verified against the public listing: https://apps.apple.com/tr/app/id6806875753 . Android reads “Yakında”; the user's 2–3 week estimate is described as an estimate in the download dialog.
The existing site's phone, WhatsApp and directions remain authoritative.
Partner input matches the existing submit_partner_application RPC contract. Local preview submissions are stored on this computer, never sent to production. The UI states this explicitly. Production submission remains deliberately disabled until the existing provider is connected in a separately authorized release.

## Review of direction

Rejected a generic stack of feature cards and full-page looping video. Original physical service objects, an editorially simple process strip and an interactive phone demonstrate the product directly. No fabricated reviews, counters or prices.
