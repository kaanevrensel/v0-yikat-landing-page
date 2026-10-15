# Google reviews connection, October 15, 2026

## Scope and activation boundary

Build a read-only connection for Yıkat's own verified Bakırköy Business Profile, separate from the website corrections in PR21. No API access, OAuth credentials, API account/location resource, or public-display permission has been verified. This implementation remains disabled until those facts are established. It neither copies the reviews inspected in the browser nor introduces a paid widget.

Google's [Business Profile API policies](https://developers.google.com/my-business/content/policies) limit use to managing or reporting on owned/authorized listings. They allow limited temporary performance storage, with a maximum of 30 days, and require original attribution. The [API terms, section 5](https://developers.google.com/terms#section_5_content) separately restrict public display without the relevant rights. [Business Profile terms](https://developers.google.com/my-business/content/terms) specify precedence. API access approval is not proof of public redistribution permission. Obtain documented clearance for the website use case before setting the separate publication switch. Do not substitute Places API storage/display rules for Business Profile rules.

## Implementation sequence

1. Add a server-only environment boundary and a testable provider client. Refresh OAuth on the server; validate the configured account/location resource; fetch every reviews page in provider update order, with timeout/loop/duplicate guards. Return no partial set on failure.
2. Add a fixed-resource read endpoint. Require both enable and publication-clearance switches, plus complete server-only credentials. No user-supplied location, OAuth callback, review-write endpoint, raw error response, persistent review store, Next data cache, or CDN cache. Concurrent requests may share only an in-flight request.
3. Preserve the existing Google source link when disabled. When enabled, offer a small expandable reviews area by the shop. Preserve original author/text/rating/date and source attribution; show every review through neutral pagination, a last-sync time, and honest empty/error states. Do not synthesize review permalinks or author URLs absent from the provider response. Do not emit Review/AggregateRating structured data for our own business.
4. Test provider pagination, identity/config gates, credential isolation, hostile text, empty/failure responses, and mobile accessible rendering using synthetic test fixtures only. Run lint, typecheck and build; run the existing full suite on the final integration.
5. Open a separate PR after PR21 lands. Deployment of the disabled foundation is distinct from connection activation and a verified live sync.

## Evidence to obtain before activation

- Approved project and appropriate Google API access; offline OAuth consent from the authorized business manager, using `business.manage` scope. Store secrets only in the deployment secret manager.
- Discover account/location resource through official APIs, then match name, website, address and phone to the existing Bakırköy profile. Do not derive API IDs from the Maps CID or the managed-profile UI identifier.
- Document public-display rights and attribution requirements, update the privacy notice for the actual approved processing, and check provider cache headers. This foundation stores no review content persistently.
- Verify an actual complete sync against the native profile, including low-rating and textless reviews. Inspect desktop/mobile content, source links, timestamps and failure behavior before announcing synchronization.

API references: [reviews.list](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list), [review resource](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews), [OAuth offline refresh](https://developers.google.com/identity/protocols/oauth2/web-server#offline).

## Operator handoff

Configuration names are in `.env.example`; all values are server-only. `YIKAT_GOOGLE_BUSINESS_LOCATION` is the exact `accounts/{accountId}/locations/{locationId}` API resource. `YIKAT_GOOGLE_BUSINESS_VERIFIED_PLACE_ID` is the Google Place ID independently matched to this shop, not its Maps CID. Each sync reads the location through Business Information API and compares its resource name, Place ID and website host before reading any reviews. Changing a site secret requires a rebuild/redeploy because the homepage's enable flag is rendered during the build. Removing either switch and redeploying restores the existing direct Google link.

The reader uses a 25-second overall request budget, 50 reviews per provider page, and a 100-page safety limit. Repeated page tokens, duplicate reviews, malformed rows, a reported total inconsistent with the completed set, identity mismatch or any failed page return `unavailable`, never a partial success. Provider errors and credential values are not logged or returned. The route ignores input query parameters, accepts no arbitrary resource or endpoint, and has no write method.

There is no scheduled or stored sync in this foundation. Opening the panel performs a current read; concurrent reads in one server instance share the in-flight request. No review content is kept in server caches or storage. Browser content clears on close, hidden tab, unmount or after five minutes. Images preserve allowed original Google attribution URLs and are not proxied to our image cache. Check traffic and API quota before enabling: server instances do not share rate limits, and this intentionally avoids a permanent review store. The timestamp denotes completion of that successful read, not a background refresh or Google modification date.

The main Playwright suite verifies disabled behavior and the provider with synthetic responses. `YIKAT_TEST_PORT=3217 pnpm test --config=playwright.reviews.config.ts --workers=2` exercises the enabled panel at 320, 390 and 1440 pixels. That test server explicitly clears OAuth values and intercepts only the local endpoint; its invented review fixtures are not reachable from a published route. Screenshot evidence stays in ignored `output/reviews-review/`. Both configurations run in CI.

No live Google sync has been performed. Deployment with both switches off is ready for normal release review; activation remains a separate provider/content-rights dependency.

## Local verification result

Production build, lint and typecheck passed. The full default-off suite passed 58 tests, including the provider tests; the enabled UI suite passed five tests across 320/390/1440 pixels, accessibility, escaped hostile text, pagination, empty/error states and five-minute content expiry. The production browser bundle contains neither OAuth configuration names, provider code/error text nor synthetic review fixtures. Lint reports only the unchanged legacy image warning in `components/visit-section.tsx`. CI and live connection results must be recorded separately.
