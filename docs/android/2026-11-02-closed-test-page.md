# Android closed-test page and counter card (November 2, 2026)

Google refused production access for Yıkat Gitsin (`com.yikat.tech`) on October 22, 2026: the 12 closed-test accounts were the team's own. A personal developer account needs at least 12 real testers opted in to a closed test for 14 days in a row. No tester may be simulated, and AI QA is never presented to Google as testing.

## What ships

- `/android` (`app/android/page.tsx`): a favour, not a "be first" pitch ("Android’in varsa bir ricamız var."); why we ask; three steps (join the Google Group, opt in on Play, install); what the app can do today (browse services and prices, sign in; doorstep pickup has not started); staying at least 14 days, ideally until the app is public on Google Play, because testers join on different days and Google counts who is opted in on the day we apply; feedback (Play private feedback and e-mail; no WhatsApp link, because the shop line is answered by the AI assistant first); leaving at any time (leaving the group also counts as leaving the test; uninstalling does not); a privacy note that links `/kvkk` for rights and `/gizlilik-politikasi` for the general policy without claiming either describes the test; and an iPhone note linking the App Store. `noindex, follow`, not in the sitemap, like `/yorum`. No incentives or discounts.
- The opt-in button is described, never quoted as exact: Google's Turkish label is not verified yet (Emre records it with a screenshot before release). The page names the likely labels with "gibi"; the card names none.
- External links open in a new tab and share one visually hidden description, "Bağlantı yeni sekmede açılır." (`aria-describedby`).
- Constants: `lib/android-test.ts` (group, opt-in, Play, App Store, page URL, feedback e-mail, PDF, QR). The group URL lives only there.
- Counter card: `scripts/generate-android-test-card.py` → `public/downloads/yikat-android-test-karti.pdf` (one A5 page) and `public/images/android-test-qr.svg`. Same font, logo, palette and pins as the review card (`scripts/assets/care-card/requirements.txt`). The QR and printed link point to `https://www.yikat.tech/android`, never to the group, so renaming the group needs no reprint. The script fails unless `groupUrl` can be read from `lib/android-test.ts`, the page is one A5 page, the Turkish copy is present and retired copy ("Testçi ol", "ilk sen", "14 gün testte kal") is absent, every PDF link is the page URL, and no `groups.google.com` address is printed. The Playwright spec only sees uncompressed PDF objects (link annotations), so the printed-text check lives in the script.
- Tests: `tests/android-test.spec.ts`.

## Before release

1. Open the group URL in a private window with an account that is not a member and confirm it shows the real group with **Join group**. If it shows "Ask to join", the group's "Who can join" setting is wrong: fix it to "Anyone can join" before release, or testers wait in an approval queue.
2. Confirm the group's **Who can view members** is "Group managers". The Gizlilik paragraph says other testers cannot see the member list; it is false otherwise.
3. Record the exact Turkish label of the opt-in button (opt-in page signed in with a member account, Google account language Turkish, `?hl=tr`). If the page's "gibi" sentence names the wrong label, correct it. Do not quote a label on the card.
4. `feedbackEmail` in `lib/android-test.ts` must equal the feedback address set on the Alpha track.
5. WhatsApp: done. The button was removed, because the shop line is answered by the AI assistant first. Add it back only after the assistant has a pinned fact about the Android test (no doorstep orders yet, thank them, hand off to the team).
6. Privacy: the privacy and KVKK texts do not mention the test group yet. Add a short "Android kapalı test grubu" paragraph to the privacy source in yikat-app `docs.ts` and regenerate `lib/legal-content.json` in the lawyer pass. The page does not claim those texts cover it.

## Status, November 5, 2026

- The group exists at the address in `lib/android-test.ts` (`yikat-android-test@googlegroups.com`, created 22:26 UTC from emre@yikat.tech, its owner). Settings read back on the group's own page: anyone on the web can see and join the group; conversations, posting, the member list and member e-mail addresses are visible to group managers only. Item 2 is done.
- The Alpha track's testers are now managed by that group. The feedback address on the track is `emre@yikat.tech`, the same as `feedbackEmail`. Item 4 is done. Google is reviewing the tester change (sent 22:29 UTC).
- Google published the change on November 5 (Publishing overview: "Last published on November 5, 2026", nothing in review at about 22:59 UTC). The only closed track is Alpha, and its testers come only from the group.
- Item 1, checked at about 23:01 UTC as emre@benian.ai, which is not a member: the group page offers **Join group** directly (not "Ask to join"). Nothing was pressed.
- Item 3 could not be recorded. Both team accounts we may use (emre@yikat.tech, the group owner, and emre@benian.ai) opted in during the September team test, and their opt-in survives the switch: the opt-in page tells both "You are a tester." It is shown in English, whatever `hl` says, because it follows the Google account's language. The page keeps naming the label with "gibi". Record the label from the first real tester's screen if one is shared, and never by joining with a team account.
- The Play dashboard (read 23:04 UTC) still ticks all three production-access tasks, including "at least 12 testers opted-in", on those September team opt-ins. Before the production application, team accounts should leave the program (opt-in page, "Leave the program") so that only real testers are counted.
- Item 6 stays with the lawyer pass.

If the group has another address, change `groupUrl` in `lib/android-test.ts` only. The card does not change.

Regenerate the card with the pinned packages: `python scripts/generate-android-test-card.py`. Output is byte-identical across runs in one environment. A different zlib build can change the compressed bytes without changing content.
