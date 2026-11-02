# Android closed-test page and counter card (November 2, 2026)

Google refused production access for Yıkat Gitsin (`com.yikat.tech`) on October 22, 2026: the 12 closed-test accounts were the team's own. A personal developer account needs at least 12 real testers opted in to a closed test for 14 days in a row. No tester may be simulated, and AI QA is never presented to Google as testing.

## What ships

- `/android` (`app/android/page.tsx`): why we ask, three steps (join the Google Group, opt in on Play, install), what the app can do today (browse services and prices, sign in; doorstep pickup has not started), staying 14 days, feedback (Play private feedback or WhatsApp), leaving the test, a privacy note linking `/gizlilik-politikasi`, and an iPhone note linking the App Store. `noindex, follow`, not in the sitemap, like `/yorum`. No incentives or discounts.
- Constants: `lib/android-test.ts` (group, opt-in, Play, App Store, page URL, PDF, QR). The group URL lives only there.
- Counter card: `scripts/generate-android-test-card.py` → `public/downloads/yikat-android-test-karti.pdf` (one A5 page) and `public/images/android-test-qr.svg`. Same font, logo, palette and pins as the review card (`scripts/assets/care-card/requirements.txt`). The QR and printed link point to `https://www.yikat.tech/android`, never to the group, so renaming the group needs no reprint. The script fails unless the page is one A5 page, the Turkish copy is present, every PDF link is the page URL, and the group address is not printed.
- Tests: `tests/android-test.spec.ts`.

## Before release

Open the group URL signed out in a private window and confirm it shows the real group with "Ask to join"/"Join group". If the group has another address, change `groupUrl` in `lib/android-test.ts` only. The card does not change.

Regenerate the card with the pinned packages: `python scripts/generate-android-test-card.py`. Output is byte-identical across runs in one environment. A different zlib build can change the compressed bytes without changing content.
