# Public account deletion request

The Play listing destination is `https://www.yikat.tech/hesap-silme`. This is a
public support-request page for **Yıkat Gitsin (Yıkat)**. It opens a prepared email
to `destek@yikat.tech`; it does not submit a form, authenticate a customer, or
perform a privileged database write. A click is never presented as a completed
deletion request.

The page also names the current Turkish app path: **Profil → Hesap bilgilerim →
Hesabımı sil**. The email route works without installing the app. Support must
monitor the mailbox and process these requests before this URL is declared as
an operational deletion route in Play Console.

## Support handling

1. Verify ownership using the registered account email. If access to that inbox
   is unavailable, resolve ownership through the established support procedure
   before changing the account. Never request a password, OTP or card details.
2. An authorized operator must place a verified request into the existing
   customer account-deletion process, preserving its cancellation window and
   the scheduled sweep. Do not substitute an ad hoc hard-delete or delete an
   authentication identity shared with a partner/admin account.
3. Send the requester an acknowledgment and the actual scheduled date. Record
   request handling in the approved support/audit system; do not store customer
   identities or evidence in this repository.
4. Confirm completion from the deletion-sweep outcome. A sent support email,
   scheduled request and completed anonymization are different states.

## Copy contract

The waiting period is approximately 30 days after the request is scheduled.
Name/contact data and detailed address fields are anonymized; notification
records and preferences are deleted. Historical orders and legally required
transaction records remain under the existing retention policy (up to 10 years).
The page does not promise immediate erasure of every record.

Source: current yikat-app `account_request_deletion` (migration 54),
`sweep_pending_deletion` (migrations 124 and 126), Turkish profile strings, and the
generated privacy policy in `lib/legal-content.json`. Update this page when
that process changes; do not edit the generated legal corpus by hand.

## Verification

Run `pnpm typecheck`, `pnpm lint`, and `pnpm test`. `next build` now enforces
TypeScript errors too. The new browser tests cover the request destination,
retention disclosure, footer/sitemap discovery, accessibility, JavaScript-off
content, mobile navigation targets at 320/390/430/768 CSS px, document overflow,
and 200% text enlargement. Text enlargement is not a browser-toolbar zoom test.

Deployment and a real support acknowledgment are separate operational checks.
No live account should be deleted solely for a UI smoke test.

### Implementation checks — 2026-09-05

- `pnpm typecheck`: passed.
- `pnpm lint`: passed with the two pre-existing image-element warnings.
- `pnpm exec playwright test --list`: 22 tests discovered, including 9 new tests.
- Offline React server rendering: passed for the deletion page's canonical URL,
  mailto recipient/subject/body, retention disclosures, credential-free markup,
  sitemap entry, and visible default `BlurText` headings and paragraphs.
- `pnpm build`: blocked when `next/font` attempted to fetch Bricolage Grotesque
  from Google Fonts; this session cannot establish that network connection.
- Browser tests and rendered visual verification were not executed: browser
  access was unavailable. Their presence is not a passing browser test result.
- This change was not deployed and the support mailbox was not exercised.
