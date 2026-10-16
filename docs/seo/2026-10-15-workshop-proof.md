# Verified workshop evidence and base tariffs

This change makes the existing cleaning hub's price section concrete and preserves the actual shop evidence. No new service/location page or customer case is created.

## Sources and scope

The canonical private evidence folder is `/Users/emrebenian/Desktop/STARTUPS/YIKAT/workstreams/search-growth-20261015/proof-next/`. Raw operational evidence stays there, outside this public repository.

- `price-catalog.json`: authenticated read-only production PriceList read, four current SHOES categories: Bez 400, Deri 650, Süet 750 and Bot 900 TRY.
- `pricing-functions.json`: exact deployed quote definition uses these current categories and tariffs; shoe pricing represents one pair. It also defines a child reduction, but that separate rule and campaign prices are not advertised by this base menu.
- `shop-price-observation.json`: independent last-30-days aggregate of actual first-party Bakırköy counter records corroborates those base tariffs. The separately named Kadıköy test partner is excluded. Discounts mean a stored base tariff is not the final charged amount. Historical flat child pricing is not reused.
- The observation was October 16, 2026 in Europe/Istanbul, although the operator's Chicago date was October 15. `priceMenuVerifiedAt` uses the shop's date and does not update itself on every render.
- `case-availability.json`: the new live aggregate still has zero recorded sharing consents and zero complete permissioned pairs. No customer photo or identifier was retrieved, published or fabricated.

`lib/site.ts` is the single source for the exact base menu and its verification date. Its old 400–1000 range and mixed placeholder taxonomy are corrected. The global LocalBusiness catalog consumes these category names, but continues to omit price Offers and priceRange. Material service pages do not infer a numeric tariff for every sneaker or nubuk shoe. The old unused `components/price-menu.tsx` is not mounted in current routes; its existing generic layout is not revived.

The cleaning hub labels the compact table as a base fee for one pair, gives the actual observation date and asks the customer to confirm category, scope and final price at acceptance. No tax, inclusions, turnaround, repair availability or campaign terms are invented. Future tariff changes must update the single source and recheck the evidence rather than merely advance the date.

## Genuine images and playback

The cabinet video/poster/VTT are unchanged derivatives of Kaan's `IMG_2785.MOV`; provenance is in `docs/design/2026-10-15-care-assets.md`. The image identifies drying only. The text does not infer temperature, chemistry, disinfection or a customer result.

The local page labels the original owner shop photograph with its August 2026 source date and identifies the existing route film as shop footage. Source references remain in `public/images/shop/SOURCE.md`. The care-card link points to the already generated licensed-font PDF. No new illustration, crop, retouching or customer photograph was added.

Design preserves the current Bricolage/blue discovery layout, existing table styles and native optional media controls. New facts render in server HTML. Price comparison has no entrance animation; media retains `preload="none"`, captions and no autoplay. Design-motion and Impeccable brand/context checks were applied; no new theme or motion dependency was needed.

## Validation

Focused checks are in `tests/workshop-proof.spec.ts`: no-JavaScript exact-category prices/date, native video play/pause and caption/source contracts, genuine source labels, reachable PDF, 320px/1280px fit and accessibility.

`pnpm typecheck` and `pnpm lint` passed. Lint retains the pre-existing `components/visit-section.tsx` image-element warning. Independent content review found no blocking issue. The focused browser run was canceled before tests ran because root reserved the remaining disk capacity for a single combined build; browser, accessibility and visual results remain pending that integrated run.

Root owns review, merge and normal-production URL/visual verification. Local validation and a commit are not proof of deployment, indexing or ranking improvement.
