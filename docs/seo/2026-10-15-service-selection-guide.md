# Shoe service selection guide

## Customer decision

The query “ayakkabı temizleme mi kuru temizleme mi” returned dedicated pages from Online Lostra and Ayaklab, alongside manufacturers and our general cleaning hub. The current hub has only a short explanation of the terminology. One distinct guide now answers whether to leave shoes with a dry cleaner, what the service name does and does not establish, and which questions to settle before acceptance.

Route: `/rehber/ayakkabi-kuru-temizlemeye-verilir-mi`.

It compares professional textile cleaning, dry brushing and shoe cleaning; separates material-specific questions; provides five intake questions; and distinguishes cleaning from damage, recolouring and repair. It explicitly preserves the operating scope: Bakırköy shoe cleaning, shop drop-off and collection, clothing dry cleaning and courier not yet launched. It adds no price, turnaround guarantee, cleaning recipe or claim about every dry cleaner's equipment.

## Evidence boundaries

Research on October 15 Chicago time used eight Turkish query strings and public page reads. Returned result order is not a Turkish Google ranking measurement. Search volume, difficulty, competitor indexed pages, traffic, backlinks and causality were not measured. Some tool snippets retained old Yıkat names, prices and promises; they must not be treated as current website content or current native Google branding. The orchestrator separately verified the correct current Google homepage title.

The namesake [yikatapp.com](https://yikatapp.com/) and its [Bakırköy destination](https://yikatapp.com/istanbul-bakirkoy-temizlik/) present car, carpet, upholstery and other household services. No shoe result was returned for the narrow `site:yikatapp.com ayakkabı` query; that is a sample observation, not proof that none exists. Their broader page count is not a reason to add unsupported services or location permutations.

The observed competing [Online Lostra article](https://onlinelostra.com/blog/kuru-temizleme-ayakkabi-temizler-mi) motivated the customer question. Its technical assertions and marketing promises were not copied or used as care authority. The [Ayaklab page](https://www.ayaklab.com/ayakkabi-kuru-temizleme-uygun-mu-ve-dogru-bakim-yontemleri-nelerdir) was returned for the question; an intermediate browser-text fetch timed out, but a subsequent independent public GET returned 200 and its relevant title. Availability is recorded separately from the query observation.

## Primary sources and attribution

- [GINETEX current care symbols](https://www.ginetex.net/gb/labelling/care-symbols.asp), professional-care section: textile dry and wet cleaning are separate processes; care instructions constrain the process. The guide does not extend textile symbols into approval for an entire shoe, and reproduces no protected symbol artwork.
- [Clarks shoe care guide](https://clarks.com.au/pages/shoe-care-guide): separate leather, trainer, suede and nubuck guidance supports material distinctions. Model-specific instructions remain primary. The guide does not generalize Clarks' model-specific machine-washable exception; Yıkat's instruction remains not to put shoes in a washing or tumble-drying machine.
- Shop availability and intake boundaries come from the released site and current workspace launch scope, not the manufacturer articles.

## Integration and validation

The guide uses the existing server-rendered guide component. It is automatically included in the guide hub, static parameters, Article metadata and sitemap. Its publication date is October 16 in Istanbul. Sitemap entries now use the later of the actual guide revision and the shared shop-facts revision, so a new guide is not backdated.

The existing price guide links to it, and it links back to price, repair-scope and material guidance. The price guide's former statement that no verified menu exists is removed and replaced with a direct link to the hub's tariff section. This is coordinated with the workshop-proof release, which verifies the actual current category tariffs; numeric prices are not duplicated in guide prose. Shared commercial pages, styles, navigation, analytics and providers are unchanged in this lane.

Focused tests cover no-JavaScript usefulness, keyboard-operated FAQ, source links, honest shop availability, canonical discovery, reciprocal links, sitemap inclusion, link availability, mobile overflow and axe accessibility at 320 and 1280 pixels. Existing discovery checks cover all canonical HTML and article/source parity. Exact validation and screenshots are recorded in the canonical workstream handoff; release remains the orchestrator's step.

Private research and receipts: `workstreams/search-growth-20261015/competitor-next/` in the canonical YIKAT workspace. Public code contains no raw provider records or customer data.
