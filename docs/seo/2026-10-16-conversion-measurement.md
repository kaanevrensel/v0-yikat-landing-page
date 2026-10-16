# Contact intent and weekly outcomes

The existing `discovery_contact_click` covered `DiscoveryLink` only. Homepage and shared WhatsApp/directions actions were missing, while service-navigation and review-map links could enter the same legacy event. The new `contact_intent` event has one delegated owner in the root layout and covers actual configured shop contact destinations across the public website.

## Event contract

`contact_intent` has four properties: `schema: 1`, `action: whatsapp | call | directions`, an allowlisted public `page` (otherwise `other`), and a fixed `referrer` class. The referrer categories are `google`, `bing`, `chatgpt`, `other_ai`, `internal`, `other`, and `direct_or_unknown`. Google referrer does not establish organic search; missing referrers remain unknown. The server supplies the existing guide slugs without shipping guide bodies in the tracking component.

The listener handles normal pointer and Enter-key anchor activations, including SVG children and dynamically opened service sheets. Each DOM activation is handled once; a second intentional activation is a second event. Prevented clicks, downloads, internal service links and Google review/profile links do not count. Both actual Google and Apple directions URLs count under `directions`. No link destination, WhatsApp message, query string, identifier, form field, care-tool selection, cookie or local storage is added to the custom event. The implementation calls the existing Vercel SDK; it does not bypass its automation, host or `beforeSend` behavior, change the Analytics configuration, or call ingestion endpoints directly.

The legacy event stops at rollout. Do not splice its totals into the new series or call the apparent coverage increase conversion growth. Record the deployment timestamp and first genuine provider-observed event separately. Automated/local SDK-call tests do not prove provider ingestion. Do not create production test contacts, messages, orders or purchase events to populate this report.

Vercel's current documentation lists custom events on Pro and Enterprise plans. Verify the actual production project's plan and Events access before claiming that the dashboard can report these counts. Historical HTTP 200 ingestion alone does not establish that entitlement. This change adds no paid plan, billing configuration or additional analytics provider. Until native availability and genuine events are observed, contact totals remain unknown. [Vercel event availability](https://vercel.com/docs/analytics/custom-events).

## Shop evidence already available

The product source at the inspected operations checkout records `Order.acquisitionSource` independently of discounts: `UNKNOWN`, `META_CAMPAIGN`, `STREET`, `INSTAGRAM`, `GOOGLE`, `CHATGPT`, `REFERRAL`, and `OTHER`. The counter form asks for the source of the current visit and allows unknown explicitly. `Order.sourceChannel` identifies the order-entry channel, not the marketing source. The existing `GOOGLE` value does not distinguish Maps, organic website search or other Google discovery. There is no observed individual link from the anonymous website click to an order; matching customers or attributing revenue from these aggregates would be unsupported.

`paidAt` and `deliveredAt` are separate recorded facts. Weekly created, paid and delivered counts use different date windows over different populations; they are not consecutive stages of one cohort. Payments can be refunded later, and current delivery fields can change. These counts must not be presented as net revenue or an immutable historical event ledger.

## Weekly operating command

Private inputs, the tested report command, a read-only aggregate SQL template, sample unknown-input manifests and checkpoint outputs live in the canonical workspace:

`workstreams/search-growth-20261015/measurement-next/`

Run from that folder:

```sh
node --test weekly-report.test.mjs
node weekly-report.mjs --observations next-observations.json --search-scorecard /absolute/path/to/scorecard.json --audit /absolute/path/to/audit.json --out checkpoint-2026-10-22
```

Generate the Search Console scorecard with the shipped `scripts/search-scorecard.mjs`. Import native production `contact_intent` counts as mutually exclusive page/action/referrer rows, with explicit known QA exclusions. The import rejects legacy event names, invalid dimensions, overlapping partitions, mismatched contact/shop date windows or timezones, missing native evidence files and unexpected personal-data fields. Partial exports are labeled; unavailable data and unknown QA counts never become zero. Reports preserve source hashes and refuse existing output directories.

The accompanying SQL uses `BEGIN READ ONLY`, a short timeout, a verified Bakırköy `OWN`/`BK` partner and service counter orders only. It exports eight aggregate source buckets, not customers, phone numbers, order IDs, payment amounts or free text. The September 16–October 13 query was subsequently executed through the read-only Management API after the exact shop identity and UTC session were verified; its aggregate native receipt and report remain in the private workstream. Future operators must repeat the identity/window check against the intended database. Kaan can instead provide confirmed aggregates with their exact definitions and evidence, but guessed values remain unknown.

Search Console daily dates use Pacific time. Preserve provider timezones and complete days, and keep search metrics alongside contact/shop metrics without computing a cross-system conversion rate. The existing September 16–October 13 baseline remains 33 clicks and 313 impressions, with only 19 clicks represented in visible query rows. It is not the new event's baseline. [Google date semantics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), [Google report aggregation and freshness](https://support.google.com/webmasters/answer/17011364), [Vercel custom events](https://vercel.com/docs/analytics/custom-events).

## Checkpoints and ownership

- At rollout: Emre records the actual deployment/event-contract start, production host and native analytics availability. First genuine contact receipt remains pending until observed. No synthetic production event is required.
- October 22: Emre reviews indexing for the two requested hubs, exports the latest fully reported search window and inspects contact coverage. Kaan supplies the same period's genuine source/paid/delivered aggregate or leaves it unknown.
- October 29: Repeat with the same definitions, filters and provider timezone. Inspect missing source coverage before interpreting source shares; investigate actual failed contacts or crawl issues.
- November 12: Review demand relevance and contact outcomes. For an entirely postrelease 28-day Search Console comparison, use October 17–November 13 once all days are final, rather than treating the November 12 checkpoint as a complete postrelease window.
- After each release: run the bounded public audit. HTTP health is separate from native Google indexing. A network timeout means unknown, not a confirmed broken page.

These are manual checkpoints, not an installed scheduler. No new recurring infrastructure, database changes or provider mutations are introduced.
