# Discovery layout and enquiry refinement

The owner reported that opening labels and breadcrumbs pushed the hero too far
down, and that full-width service links were followed by unexpectedly centered
narrow sections. The fix covers all 17 discovery pages through their shared shell,
styles and service/article templates.

- Remove visible breadcrumb navigation and repeated overlines. Preserve accurate
  hierarchical structured data and useful address, hours and source information.
- Start headings at 96px on phones, 104px on tablets and 112px on desktop, clear of
  the fixed navigation. Top-align the shop hero copy with its photograph.
- Align prose, FAQs and related sections to the same left edge while keeping
  reading lines constrained. Put desktop article contents on the right; retain
  the mobile contents-first reading aid. Use a shared fluid section spacing.
- Give service and guide link rows consistent hover/focus treatment. Remove the
  isolated sidebar accent and keep focus indicators and readable contrast.
- Make the shoe enquiry action specific: send a photograph. WhatsApp receives an
  editable message with the public page URL, without query strings or visitor
  identifiers. The price section gets a direct photo enquiry link; shoe guides
  show their relevant service link near the answer. Track the textile enquiry
  and map-image actions with the existing contact event.
- Keep map attribution outside its labelled action so its visible text does not
  conflict with the accessible name. Enable the experimental label-in-name check
  in every discovery-page accessibility run.
- Add a 384px image candidate and accurate shop/map display sizes so small phones
  avoid an unnecessary 640px minimum download. High-DPR screens still select the
  appropriate larger image; approved Home/Product artwork remains unoptimized.

## Validation

The full 48-test local Playwright suite passed against the production build. The
final map-label and image-size correction passed all eight discovery tests with
the stricter accessibility rule enabled. Each of the 17
search pages is checked at 320, 390, 768 and 1280px for overflow, hero clearance,
section alignment and serious/critical accessibility findings. No-JS answers,
source links, accurate business facts, unique canonicals, crawl access and sitemap
coverage still pass. Lint has no errors and one unchanged warning in an unmounted
legacy component. TypeScript passes. Representative layouts reviewed visually.

On the shop page at 390px, the heading starts at y=96 rather than y=210; navigation
ends at y=70. Layout and contact improvements are not evidence of new enquiries.

## Demand dependencies

Native keyword research and the 50 mapped priorities remain unchanged. The owner
authorized Kaan's handoff email, sent October 10 with verified YIKAT identity.
Google needs access to the existing profile; Apple needs the existing account
sign-in/appropriate location access; Bing awaits the requested postal PIN.
Accurate profiles, verified service/price information, permissioned real care
examples and an honest review process are the next local-search work. No new
transactional services, synthetic evidence or ranking guarantees are introduced.

Release verification: require green CI, successful production deployments at the
merged SHA, normal-domain readback and functional enquiry links. Revert this PR
if navigation covers headings, a contact destination breaks or public crawling
fails. No database, secret, billing, advertising or application-order changes.
