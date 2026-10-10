# Responsive media for discovery pages

New discovery photographs and the map use responsive Next image delivery. A live
640px shop photograph returns 68,564 bytes compared with the 311,506-byte original.
Source assets are unchanged. Existing Home/Product artwork, app screens and
payment/download assets explicitly retain unoptimized source delivery, preserving
their previously approved quality.

The shop hero photograph is eager with high fetch priority. At 390 × 844 it starts
at y=687, so part is visible before scrolling; the lab trace identified it as LCP.
Lazy loading delayed its request until after layout. Other below-fold photographs
remain lazy. This follows Next's current image guidance:
https://nextjs.org/docs/app/api-reference/components/image#loading

A regression checks successful smaller-image delivery and that Home still serves
its original artwork. The full 47-test CI suite passed the responsive delivery
release. The visible-photo loading correction uses the same suite. Post-deployment
measurements and screenshots are recorded in the private workspace release receipt.

Initial lab observations before responsive delivery: shop 87 performance, 4.09 s
LCP, 824 KB; guide 96 performance, 2.44 s LCP, 385 KB. Both reported 100
accessibility/best-practices/SEO and zero layout shift. A later 390 × 844 lab
profile exposed lazy-loading delay; its scores are not a controlled comparison
with the initial default viewport. Lab scores are not field Core Web Vitals or
ranking evidence.
