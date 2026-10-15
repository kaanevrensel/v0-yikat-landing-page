# Commercial page improvement, 15 October 2026

The five existing service and shop destinations now help visitors decide what to show, what cleaning can address and how to visit the actual Bakırköy shop. Their URL and intent map are unchanged. No new location or synonym pages were generated.

## Scope and evidence

The implementation follows PRODUCT.md, current CLAUDE.md, the 19 existing care guides and `2026-10-10-priority-keywords.csv`. Historical Google keyword figures in that CSV are not current ranking results. Current scope is shoe cleaning at the physical shop. Courier collection has not started; textile services remain upcoming.

| Destination | Visitor decision improved |
| --- | --- |
| `/ayakkabi-temizleme` | Choose a first step from material and observed condition; distinguish upper, sole, inner surface and damage; prepare an informed price enquiry. |
| `/bakirkoy-ayakkabi-temizleme` | Plan a real visit and know what to discuss before drop-off, at acceptance and on collection. Real storefront, route video, address and hours remain prominent. |
| `/sneaker-yikama` | Show mesh damage, mixed panels, print edges, special laces and insoles; use relevant mesh and insole guidance. |
| `/suet-nubuk-temizleme` | Describe rain marks, oil, changed nap and past products separately; use material-specific aftercare. |
| `/deri-ayakkabi-bakimi` | Distinguish smooth leather, coatings, polish, cleaning expectations and existing peeling; use care and storage guidance. |

The two general hubs previously told visitors to ask about collection availability without stating the known pause. Both now explicitly say collection has not started. Shipping acceptance remains unconfirmed and requires contacting the shop before sending an item.

No prices, guaranteed results, turnaround promises, repair offering, customer photos, customer reviews or manufacturer affiliation have been invented. Existing fee and cancellation policies are unchanged.

## Material and condition guide

`lib/care-assessment.ts` is a small editorial decision table, used by `components/discovery/care-assessment.tsx`. It is not AI diagnosis or a pricing engine. Four materials and six conditions give 24 valid combinations. Damage always suppresses ordinary material-cleaning instructions. Unknown material with ordinary dirt asks the reader to identify the material before trying a product or brush.

Two labelled native selects update the advice in place. Focus stays on the control; a short polite status message announces the result. Clearing either input removes stale advice. Links lead to the existing relevant guide and service destination. The photo action opens the established editable WhatsApp message containing only the public page URL. The tool sends no selection events, writes no data, performs no upload, adds no query parameters and uses no browser storage.

Server HTML includes a usable explanation and ordinary material, damage and contact links. The interactive controls are hidden until hydration; a failed or disabled script leaves the guidance available. The tool does not hide the rest of the page. No new animation or dependency is introduced.

## Design decisions

The existing Bricolage family, navy text, blue links, pale-blue working surface and discovery-page alignment are preserved. A compact two-column explanation/work area becomes one column below 900px; selects stack on narrow phones. Controls are at least 48px tall, remain native and have explicit keyboard focus outlines. The result is immediate for pointer and keyboard use. There are no animated entrances or layout transitions.

Frontend-design, Impeccable brand-register and design-motion-principles guidance were read for this slice. The repository-local Impeccable context script was absent; the installed skill script ran successfully against this checkout's existing PRODUCT.md. No setup files were added or identity changed.

## Primary sources checked

Checked directly on 15 October 2026. These support the short material-care explanations, not claims about equipment, product use or commercial operations at the shop. Each added aftercare paragraph links its source on the public page. The customer's own product instructions take priority.

- [Nike, general shoe cleaning](https://www.nike.com/a/how-to-clean-shoes): separate components and material-specific care.
- [Nike, mesh and knit care](https://www.nike.com/a/how-to-clean-flyknit-mesh): gentle handling of knit yarn, no machine washing or dryer heat.
- [Nike, suede care](https://www.nike.com/a/how-to-clean-suede-shoes): dry surface care and avoidance of ordinary water washing.
- [Clarks Australia, shoe care](https://clarks.com.au/pages/shoe-care-guide): separate cleaning, conditioning and polishing, with material-specific products and drying guidance.

## Verification

Focused ESLint and TypeScript checks passed. The final fresh production build and all seven Playwright tests passed with two workers in 19.9 seconds (`YIKAT_TEST_PORT=3226 pnpm test tests/care-assessment.spec.ts --workers=2`). Tests cover all 24 combinations and valid links, damage and unknown-material boundaries, invalid inputs, focus retention and Tab navigation, stale-result clearing, no storage or network writes, query exclusion from the WhatsApp message, reload reset, no-JavaScript navigation, 320px/1280px overflow and control size, and axe accessibility. Both tested widths had zero axe violations.

The visual pass shortened native option labels that clipped at 320px and removed duplicate advice from the damage branch. Final 320px and 1280px component screenshots are in ignored `test-results/care-assessment-selected-c-*/care-guidance-*.png`. The test's native selection uses Playwright's select API; keyboard navigation/focus are verified separately, because headless macOS Chrome did not reliably commit the OS popup using synthetic arrow keys. No custom keyboard handler was added to native selects.

Root owns full-suite verification, final release review and current search measurements. A published page is not evidence of indexing, ranking improvement or acquired customers.
