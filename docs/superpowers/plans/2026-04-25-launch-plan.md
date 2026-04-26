# YIKAT Launch Plan — Master Roadmap

**Branch:** `feat/landing-redesign`
**Last commit before roadmap:** `efa011c` (knob mobile scaling fix)
**Scope:** 8 items toward production-ready landing, in the sequence below. This is a roadmap, not a task breakdown — sub-plans are authored per item as we reach each one.

---

## Sequence

### 1. Knob morph to viewport edge (Task 2.4b)

- **Goal:** As user scrolls past hero, the Knob grows and migrates to the viewport left-edge (desktop) or top-edge (mobile). Machine body fades simultaneously, so the knob "detaches" naturally. Starting state is pixel-identical to current rest state after `efa011c`. No pop, teleport, or first-paint flash.
- **Sub-plan:** YES — `docs/superpowers/plans/2026-04-25-knob-morph.md` (brainstorm → UI/UX consult → plan).
- **Complexity:** Medium-large (~4–8h impl + review cycles).
- **Depends on:** `efa011c` landed (already on branch).
- **Verify done:** Browser verification at desktop ≥1280 and mobile 375 shows smooth morph, rest-state parity at scrollY=0, reduced-motion respected (knob holds at rest), no glitches on resize-mid-morph or scroll-reversal. Spec + code-quality reviewers approve with zero Critical/Important.

### 2. Label ring around knob (Task 2.4c)

- **Goal:** 8 section labels orbit the morphed knob at its destination. Clicking a label scrolls to that section. Active section visually highlighted via existing `useActiveSection` hook.
- **Sub-plan:** YES — `docs/superpowers/plans/YYYY-MM-DD-knob-label-ring.md` (date-stamped when reached).
- **Complexity:** Medium (~3–5h).
- **Depends on:** Item 1. Labels anchor to the knob's morphed position, so morph destination must be stable first.
- **Verify done:** All 8 labels render at destination across breakpoints, click scrolls smoothly to correct section, active highlight tracks scroll. No overlap with SiteNav at any width. Keyboard-accessible.

### 3. SiteNav liquid-glass treatment

- **Goal:** Apply liquid-glass styling (backdrop-blur + subtle translucency + layered gradients) to the fixed site nav. Ties it into the iOS-26-style dial aesthetic of the hero.
- **Sub-plan:** YES — short design brainstorm + 1-file implementation plan.
- **Complexity:** Small-medium (~2–4h).
- **Depends on:** None. SiteNav z-index stays z-50 per the 2.4b constraint — this item refines visual treatment without touching stacking order.
- **Verify done:** Glass effect visible over all section backgrounds (hero, pricing, FAQ — different bg colors). Reduced-motion = static glass (no animated sweeps). Readable at all scroll positions. Works on Safari (backdrop-filter fallback if needed).

### 4. Loading state (washing-machine spinner)

- **Goal:** On initial page load, show centered spinning washing-machine icon until Next hydration + critical images are ready. Hide on ready with a clean fade.
- **Sub-plan:** No brainstorm — single-task plan inline (component + mount logic + hide criteria).
- **Complexity:** Small (~1–2h).
- **Depends on:** None.
- **Verify done:** Hard-reload shows spinner → fades to content, no flash of bare content before ready. Reduced-motion = static machine icon (no spin). Verified on DevTools slow 3G throttle.

### 5. Section enter/exit transitions

- **Goal:** Each of the 7 main sections has clear enter animation on viewport entry (existing `SectionReveal` partly covers this) and — where appropriate — a subtle exit or parallax treatment. Matches Phase 3 of `docs/superpowers/plans/2026-04-22-major-polish.md`.
- **Sub-plan:** Light — reference Phase 3 of major-polish plan + supplementary notes, no fresh brainstorm.
- **Complexity:** Medium (~3–5h).
- **Depends on:** None — section-level work, independent of hero/knob.
- **Verify done:** Scroll through all 7 sections; each has clear, performant enter animation. No layout shift (CLS stays 0). Reduced-motion = content appears immediately, no animation.

### 6. Emoji shrink (180/110 → 120/80)

- **Goal:** Reduce section-emoji footprint per Phase 4 of major-polish plan.
- **Sub-plan:** None — direct single-commit edit.
- **Complexity:** Trivial (~15–30min).
- **Depends on:** None.
- **Verify done:** DevTools measurement confirms 120/80 dimensions. Visual check: emojis still read as section anchors without dominating the layout.

### 7. KVKK page

- **Goal:** Port KVKK (Turkish data-privacy compliance) content from live site `yikat.tech` into a `/kvkk` route in this repo. Apply existing design-system typography for readability.
- **Sub-plan:** Small content-port plan (fetch source text → apply styling → add to footer link).
- **Complexity:** Small-medium (~1–3h depending on content length).
- **Depends on:** None.
- **Verify done:** `/kvkk` renders full Turkish content, typography consistent with rest of site, mobile-readable, linked from footer.

### 8. Final production build check

- **Goal:** Confirm `pnpm build` clean, `pnpm exec tsc --noEmit` clean, no runtime console errors on local production server (`next start`). Branch ready for user-handled deployment.
- **Sub-plan:** None — verification checklist.
- **Complexity:** Small (~30min–1h if clean; more if issues surface).
- **Depends on:** Items 1–7 complete.
- **Verify done:** Build succeeds, types clean, production server serves all routes (including `/kvkk`) without error, branch ready for merge/deploy.

---

## Execution protocol

For each item:

1. **If sub-plan needed:** brainstorm → (UI/UX consult if visual-heavy) → write plan → commit plan → user approves → dispatch implementers.
2. **If no sub-plan:** implement directly in a single commit → spec + code-quality review → report → user verifies.
3. **Pause between items** for user browser verification before starting the next.
4. **Opus 4.7 for every subagent.** Never Haiku. Sonnet 4.6 only with explicit user approval.
5. **Reviewer Important findings → separate follow-up commits** (never amends).

## Out of scope (hard boundary)

- SEO/meta tags (already done — do not touch)
- Turkish copy (do not rewrite any)
- Placeholder asset swaps (`/public/hero-machine.jpg`, `/public/emojis/*.png`) — user handles later
- Functional integrations (WhatsApp, forms, analytics, cookie banner) — user handles later
- Performance benchmarking (Lighthouse, cross-browser) — user handles later
- Deployment — user handles

## References

- Prior plans on branch: `docs/superpowers/plans/2026-04-21-landing-polish.md`, `2026-04-22-major-polish.md`, `2026-04-23-knob-extraction.md`
- Session-resume handoff: `docs/session-resume.md`

---

## Polish backlog (post-implementation, pre-prod)

- **Navbar glass presence tuning** — Candidate 2 implementation correct but glass reads as faint over white hero background. Investigate at polish time:
  - Threshold tuning: align glass-appear scroll point with the moment knob/dial passes under the nav (currently a fixed 40px threshold, knob crosses nav much later)
  - Hero treatment: does the hero need a subtle gradient/texture behind the nav strip so glass has something to refract
  - Edge treatment: hairline border or shadow under the bar to give it surface presence even when refraction is weak
  - Decision: tune in place, or revisit Candidate 1 (Ghost-to-Present) if Candidate 2 can't be made to read
  - Source: user browser test 2026-04-27, screenshot reviewed
  - Files likely touched: SiteNav.tsx, possibly app/page.tsx hero section
