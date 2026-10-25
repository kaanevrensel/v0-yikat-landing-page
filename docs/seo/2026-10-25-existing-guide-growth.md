# Existing-guide growth — 25 October 2026

## Evidence and scope

The October search comparison identified the existing machine-washing and dry-cleaning guides as relevant destinations gaining visibility, alongside the shoe service hub. This is visibility and click evidence, not a causal experiment or proof of ChatGPT recommendations. Exact metrics, raw exports and production acquisition data stay outside this public repository.

Keep the existing homepage, artwork, three primary navigation destinations and short process explanation. Add two contextual guide links after the shoe-process steps and in the existing Bakırköy visit-preparation section. Make the two guides' existing local assessment sections actionable with ordinary photo/service links, reusing the existing page-context WhatsApp link and contact measurement. No new article, repeated CTA block, review claim, repair service or pickup promise.

## Implementation plan

1. Add optional typed section links to care content and render them through the existing photo enquiry/service links; no slug-specific renderer behavior.
2. Add the two existing guide destinations to home/local context and the assessment links to their relevant guide sections. Keep physical inspection as the final method/price/timing decision.
3. Repair modification dates from real content history below, preserving publication dates. No current-clock or build-driven dates.
4. Run lint/typecheck, production-backed Playwright checks (including no-JavaScript, keyboard, 320px and desktop), sitemap/Article date parity, plus the existing complete required suite. Inspect local screenshots. Publication and changed-URL submission require the release authorization below.

## Modification-date evidence

| Content | Last meaningful edit used | Evidence |
|---|---|---|
| Home, Bakırköy local page, machine-washing guide, dry-cleaning guide | 2026-10-25 | This change adds relevant links; machine guide also clarifies photo versus physical inspection. |
| Shoe hub and three material service pages | 2026-10-21 | `ac6b2d4` / PR29 changed actual service limitations. |
| White shoe, suede/nubuck, sports shoe, leather shoe, mesh, care-versus-repair and pricing guides | 2026-10-21 | The same commit changed each guide's substantive service-scope explanation. Dry-cleaning was also edited then, superseded by its October 25 edit. |
| Guide index | 2026-10-16, unchanged | PR29 changed article bodies, not the title/description/link fields rendered in the index. This change likewise leaves its visible content unchanged. |
| Other routes and guide publication dates | Existing dates retained | No blanket date refresh. The shared October 15 discovery identity floor remains sitemap-only. |

Dates denote the last actual content edit, not a promise of publication. If release occurs later without further content changes, retain the edit dates.

Google's [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) says lastmod should reflect meaningful content changes. Its [AI guidance](https://developers.google.com/search/docs/appearance/ai-features) requires ordinary search eligibility, not extra AI files or special schema. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) distinguishes search crawling from training and user-initiated retrieval. Existing permissive robots and server-rendered content remain appropriate.

## Validation

- `pnpm lint`: passed, no errors; one pre-existing `next/no-img-element` warning in the legacy `components/visit-section.tsx`.
- `pnpm typecheck`: passed, including after restoring the generated `next-env.d.ts` to its tracked production path.
- `node --test tests/*.test.mjs`: 35 passed.
- `YIKAT_TEST_PORT=3225 pnpm test --workers=2`: 98 passed in 5.6 minutes against a fresh production webpack build. The documented local multiworker browser-cleanup delay occurred; the command completed with exit 0.
- Added checks cover no-JavaScript keyboard navigation from home/local pages, the real destination and page-only context of photo enquiries, physical-inspection wording, publication/modification parity across visible text/Article/Open Graph/sitemap, unchanged article dates, and 320/1280px accessibility and overflow.
- Independently reviewed source/date mapping/contact-event classification and local screenshots at both widths; no blocking findings. No new animation or dependency.
- `git diff --check`: passed. The generated test-build path change was removed.

Production and provider acceptance remain separate from these local checks. The owner authorized proceeding with the reviewed SEO growth update on October 25 after the release-ready summary. Release procedure: commit and push the reviewed branch, verify exact-source CI, merge, verify the production alias and rendered change, then submit the changed canonical URLs through IndexNow. External listing edits and private analytics remain separate.
