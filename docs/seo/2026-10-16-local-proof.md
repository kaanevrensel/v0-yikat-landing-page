# Local service clarity, review requests and customer proof

October 16, 2026. This is a website release candidate; deployment receipts belong in the canonical YIKAT workspace.

## Public changes

The existing shoe-cleaning hub gains one concise acceptance section. It distinguishes the parts evaluated at intake, repairs excluded from the cleaning price, how collection is agreed, and checking the result together. Wording is grounded in `lib/services.ts`, the existing local shop page and the verified price menu. It adds no numerical turnaround promise, guaranteed stain removal, repair offer or courier availability. Published operating hours are not turnaround evidence. Reliable creation-to-ready event history or an owner-approved service commitment is still required before publishing a time range.

`/yorum` is a useful review-request utility, excluded from the sitemap and marked `noindex, follow`. The existing local shop page links to it after the pickup guidance. The page links directly to the exact managed-profile destination and provides the printable counter card. It asks for the customer's own experience, including negative experiences. There is no incentive, star-rating request, satisfaction screening, prewritten review, automatic message or new receipt-printing integration.

Google's current guidance explicitly supports QR/link requests and values honest, balanced reviews. Incentives are prohibited: <https://support.google.com/business/answer/3474122?hl=en> (read October 16, 2026). The verified destination is `https://g.page/r/CUlueYklLvCeEBM/review`.

## Counter card

- Source: `scripts/generate-review-card.py`; facts: `lib/review-request.ts`.
- Outputs: `public/downloads/yikat-google-yorum-karti.pdf` and `public/images/review-qr.svg`.
- Existing owner PNG logo, navy/blue palette and licensed Bricolage Grotesque font source are reused. Font hash and OFL checks run through the existing care-card generator. No new artwork or font dependency.
- One A5 page, minimum visible text 11pt. Exact square QR modules, four-module quiet zone, medium error correction. The QR is also a clickable PDF link.
- Reproduce with the pinned packages in `scripts/assets/care-card/requirements.txt`, then `python scripts/generate-review-card.py`. No network requests. ReportLab invariant mode makes repeated generation deterministic.
- Staff can print the A5 PDF at 100% scale and place it at pickup. Ask every completed-service customer neutrally: “İstersen deneyimini Google’da paylaşabilirsin; yorum bağlantısı burada.” Do not condition the request on satisfaction or offer a benefit.
- This release prepares the usable asset; a physical counter placement and staff adoption are separate operational steps.

## Public customer-case gate

`lib/customer-cases.ts` is an intentionally empty, typed, reviewed snapshot. `CustomerCases` returns no markup while the snapshot is empty. No empty gallery, coming-soon page, case sitemap URL, fake example or private storage image is published.

The existing admin media gallery is the photographic source. It is not itself permission to publish. The panel workflow owns exact-media consent receipts and their revocation; this site does not write them or infer permission from the existence of photographs.

Before a real case can be added:

1. Review the admin receipt for the exact before and after media of the same physical pair. Verify the customer's permission for public website use, the consent text/version, evidence channel/time, and current withdrawal status. Keep customer, order and private media IDs and consent evidence in the admin system.
2. Verify the factual material, initial problem, actual treatment, outcome, remaining marks/limitations and completion date with the shop. Do not reconstruct treatment from the visual difference alone.
3. Inspect both images for faces, names, phone numbers, receipts, addresses, other customers and identifying details. Produce reviewed public derivatives with appropriate crop/redaction and remove metadata. Avoid retouching the shoe or creating an exaggerated before/after difference. Keep the originals private.
4. Use a non-personal public slug and editorial reference. Public derivatives must be local `public/images/cases/<slug>/before-<first12sha256>.webp` and the matching `after` file. Record real dimensions and descriptive alt text. The snapshot must not include source URLs, signed tokens, order IDs, customer IDs or contact details.
5. Add one reviewed `CustomerCase` with `publicationReviewId`, `permissionVerifiedAt`, `approvedAt` and `revokedAt: null`. `publicationReviewId` is a non-personal editorial label that can be mapped privately to the admin receipt; never put the private receipt contents or customer identity in the public repository.
6. Run the case tests, visually check both images and the rendered case on mobile/desktop, then release and check ordinary public URLs. Only the public narrative and derivative images render; approval metadata does not render into HTML.

The runtime gate rejects incomplete facts, absent/withdrawn/future approval, invalid dates, duplicate slugs, remote/private paths, swapped stages and mixed-pair paths. Repository tests additionally verify that shipped image bytes exist and match their content-addressed filenames. These checks enforce the format; the human/source review supplies the truth of consent and treatment.

On withdrawal, stop publication promptly: mark the snapshot revoked or remove it, remove the two public derivatives, deploy, and verify both ordinary image URLs no longer serve the content, including caches and any retained public deployment URLs. Remove or restrict prior deployment copies that still serve the withdrawn derivatives. A new consent timestamp does not undo withdrawal. This snapshot is deliberately not an automatic media exporter and does not grant website access to the production storage bucket. A gallery hidden from the page alone does not remove already-published image assets.

## Validation

Root owns the combined release and normal URL verification. Lane evidence is stored only under `workstreams/local-growth-20261016/website/` in the canonical YIKAT workspace. No private images, customer records or provider secrets are included in this repository.
