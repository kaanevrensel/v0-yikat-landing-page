# Responsive media for discovery pages

The first production mobile Lighthouse run measured the shop page at 87 performance,
4.09 s simulated LCP and 824 KB transferred; the guide measured 96, 2.44 s and
385 KB. Both reported 100 accessibility/best-practices/SEO and zero layout shift.
These are lab observations, not field Core Web Vitals or ranking evidence.

The store photograph was being fetched at its full source resolution even on a
narrow display. Enable Next's existing responsive image delivery for the new
discovery photographs/map. Remove the unconditional shop-image preload: on phones
the first screen is the answer and contact actions, and the photograph follows.
Existing Home/Product artwork, app screens and payment/download assets explicitly
retain unoptimized source delivery, preserving their previously approved quality.
No image content or source asset is regenerated, retouched or replaced.

A regression checks that a resized image is served successfully with fewer bytes,
and that Home still serves its original artwork. The full existing UI suite also
passes. Post-deployment lab measurements are recorded in the workspace release
receipt; do not report an improvement until the live result has been measured.
