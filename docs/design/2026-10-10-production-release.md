# Website release — October 10, 2026

The owner explicitly authorized publication after this revision. This supersedes
the previous localhost-only boundary. Existing service-area pause stays in the
product; remove its marketing notice as requested.

## Changes

- Real published app imagery in the blue Home invitation; no fabricated photo
  stages. Replace the partnership invitation CTA with “Birlikte çalışalım”.
- Fifth Home section shows the shop's washing process using reviewed Drive
  footage and short, factual step labels.
- Product order demo heading “Nasıl çalışır?”; remove the summary/disclaimer.
- “4 adımda yıkat” starts at “Sipariş alındı”, advances sequentially on screen,
  crossfades persistent layers, and yields to manual/keyboard selection.
  Navigation labels: “Sipariş ver”, “Kapından alalım”, “Temizleniyor”,
  “Kapına bırakalım”. Remove the tracking paragraph/caption.
- Download dialog uses a centered official Turkish App Store badge and an
  accessible hidden title. Remove the visible download heading.

## Release plan

1. Inspect and integrate the source assets. Preserve minimal Turkish copy,
   brand colors, reduced motion, keyboard access and offscreen media pause.
2. Prepare functional production partner intake using the existing system;
   do not release a local-only form. Reconcile latest upstream legal changes.
3. Run types, lint, build, meaningful interaction/responsive/accessibility
   checks and native visual review. Inspect the release diff for private data.
4. Push the reviewed branch, verify CI, merge and verify Vercel's deployed SHA,
   normal production URLs, media, download and form behavior.
5. Retain the previous production deployment for rollback if routes, assets or
   core actions fail. Record exact release and verification results here.
