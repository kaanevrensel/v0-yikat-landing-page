# Polish Phase — Sequential Dispatch Plan

**Source:** `docs/superpowers/notes/2026-04-27-emil-review.md` at commit `34286d5`
**Total findings:** 11 (3 Critical / 4 Important / 4 Minor)
**Strategy:** Sequential dispatch — one task at a time, browser test between each. User says "next" to advance.
**Model rule:** Opus 4.7 for all implementer and reviewer agents. Never Haiku. Sonnet only with explicit user approval.
**Date:** 2026-04-27

---

## Task Blocks

---

### Task 1 — C2: WashingMachine RM opacity (Bug)

- **Severity:** Critical (Bug)
- **Source:** Review § "Findings — Critical / C2"
- **Diagnosis:** `WashingMachine.tsx:25` — `const effectiveBodyOpacity = prefersReducedMotion ? 0 : bodyOpacity`. Under `prefers-reduced-motion: reduce`, the machine body SVG is permanently opacity 0. RM users see a blank left column in the hero. The machine illustration — the page's primary visual — never renders for these users.
- **Code reality check:** Confirmed. Line 25 of `WashingMachine.tsx` is exactly as described. The drum `angle` is correctly neutralized to `0` under RM (`const angle = prefersReducedMotion ? 0 : smooth`), so spinning is already suppressed. Only the body opacity handling is wrong: the intent was to skip the fade-out animation, but the implementation hides the machine entirely at all scroll positions. The fix is one character.
- **Direction (Emil lens):** RM doesn't mean "no visuals" — it means "no gratuitous motion." The machine illustration carries meaning (this is a laundry service; the machine is how users understand the product instantly). Removing it under RM degrades comprehension, not just aesthetics. The scroll-driven fade (`bodyOpacity` going 1→0 over 0–380px) should be preserved for non-RM users. For RM users, the body stays at opacity 1 always — visible, static, no animation. This is the minimum correct behavior.
- **Scope estimate:** `components/WashingMachine.tsx` — 1 line changed. Single commit.
- **Risk register:** After fix, RM users will see the static washing machine at all scroll positions, including positions where the knob has morphed into its fixed viewport-edge state. Verify that the static machine + static morphed knob don't visually collide or create a layout issue. Under RM, `morphProgress` snaps to 1 at `MORPH_START` (knob jumps to edge), so at scrollY=0 the machine is visible + knob is at rest scale in machine — correct. At scrollY > MORPH_START the machine body stays opacity 1 while knob is at edge scale — may create a "machine with no knob" look since the knob has left. This is acceptable: the machine body fading out was always a decorative transition, not a functional requirement.
- **Dispatch readiness:** READY
- **Test focus:** Enable reduced-motion in OS or devtools. Hard-reload. Confirm the washing machine illustration is visible in the hero left column at scrollY=0. Scroll past MORPH_START — confirm machine stays visible (no fade). Confirm drum does not spin. Confirm label ring orbits correctly (it has its own RM handling).

---

### Task 2 — C1: Reviews section placeholder boxes

- **Severity:** Critical
- **Source:** Review § "Findings — Critical / C1"
- **Diagnosis:** `ReviewsSection.tsx` renders three dashed-border placeholder cards with "Yakında müşteri yorumları burada." — the only content in the section below the heading. This breaks the professional character of the page and signals incompleteness at the exact moment social proof is expected.
- **Code reality check:** Confirmed. The content body is exactly three hardcoded dashed-box divs. Importantly: `yorumlar` exists in `lib/sections.ts` at index 5 (angle 225°) and the `SECTIONS` array enforces exactly 8 entries. Removing the section entirely from `sections.ts` would break the LabelRing (which assumes 8 sections at 45° intervals) and trigger the runtime invariant throw. So "remove completely" requires also patching `sections.ts`, `LabelRing.tsx` (all 8-section assumptions), and `app/page.tsx`. Scope is wider than it looks.
- **Direction (Emil lens):** Dashed placeholder boxes are architecturally load-bearing (they hold the section's structural height) but visually corrosive. The choice isn't between "add real reviews" and "remove the section" — that's too binary. Emil's principle: elements that don't earn their presence should be removed. But "presence" means the visual footprint, not the URL/nav anchor. The section heading + eyebrow earns its presence (it confirms this product has social proof to come, and keeps the nav ring consistent). The three empty boxes do not. The minimal correct move: collapse the content body. Keep the section in the DOM and in SECTIONS; remove the three boxes; optionally replace with a single line of honest copy or nothing at all below the heading. This preserves LabelRing navigation integrity with zero complexity.
- **Scope estimate:** `components/sections/ReviewsSection.tsx` — replace the `<motion.div variants={revealItem} className="mt-16 grid...">` block (lines 39–53) with a minimal replacement. Single commit. `lib/sections.ts` untouched.
- **Risk register:** The section's vertical height will shrink significantly without the three cards (~240px min-height each). The page scroll length decreases. Verify the LabelRing section-top measurement re-calculates correctly after layout change (it uses `ResizeObserver` on `document.body` — should auto-correct). Check that the anchor `#yorumlar` still works.
- **Dispatch readiness:** ⚠️ NEEDS DECISION — See "Open Questions" below. The implementer needs to know what, if anything, replaces the three boxes.
- **Test focus:** Scroll through the Yorumlar section. Confirm no dashed boxes appear. Confirm the section heading + eyebrow renders. Confirm the LabelRing correctly highlights "YORUMLAR" when the section is in view. Confirm page scroll length is shorter (expected).

---

### Task 3 — C3: CTA button `transition-all` + missing active state

- **Severity:** Critical
- **Source:** Review § "Findings — Critical / C3"
- **Diagnosis:** `CTASection.tsx:49` — the "WhatsApp'tan sipariş ver" button uses `transition-all` and has no `:active` scale feedback. `transition-all` is an anti-pattern that transitions every CSS property including layout-triggering ones. The missing `active:scale-[0.97]` means the primary conversion button gives no tactile press feedback.
- **Code reality check:** Confirmed. The button className is `inline-flex items-center gap-3 rounded-lg bg-white px-8 py-4 font-medium text-[#0F172A] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] focus-visible:...`. The nav CTA button (`SiteNav.tsx:116`) already has the correct pattern: `transition-[background-color,transform] duration-100 ease-out hover:bg-[#1a7de8] active:scale-[0.97]`. The nav button is the template.
- **Direction (Emil lens):** When you have a correct pattern, propagate it. The nav CTA earns its press feedback — the hero CTA should be identical in quality. The CTA button on the blue section has different properties to transition (no background-color change on hover, shadow changes instead), so the specific properties differ: `transition-[box-shadow,transform] duration-100 ease-out`. Add `active:scale-[0.97]`. The focus state is already correct — keep it unchanged.
- **Scope estimate:** `components/sections/CTASection.tsx` — 1 className change on the button, adding `active:scale-[0.97]`, replacing `transition-all` with `transition-[box-shadow,transform]`. ~2 characters changed in the className string. Single commit (can share with Task 4).
- **Risk register:** The `transition-all` currently also transitions `color` and `border` — removing it means these no longer transition. The button has no hover color change (white bg, no text color shift), so this is harmless. Focus ring is set with explicit `focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2` — not affected by transition changes.
- **Dispatch readiness:** READY
- **Test focus:** Click the CTA button — confirm scale-down on press. Hover — confirm shadow lifts smoothly. Tab to button — confirm focus ring is still visible. Verify no visual regression on the blue section background.

---

### Task 4 — I4: PageLoader exit ease-in → ease-out

- **Severity:** Important
- **Source:** Review § "Findings — Important / I4"
- **Diagnosis:** `PageLoader.tsx:60` — `transition={{ duration: 0.3, ease: "easeIn" }}` on the loader's exit fade. Ease-in starts slow and finishes fast — the loader lingers visibly before disappearing. For a page-load transition, this is the worst easing: users are waiting for content, and the loader should clear the stage immediately, not reluctantly.
- **Code reality check:** Confirmed. The exit motion on the `<motion.div key="loader">` uses `ease: "easeIn"`. The duration is 0.3s (300ms) — at the edge of what feels instant. With ease-in, the first ~100ms produce almost no visible movement, making the effective perceived wait 400ms+.
- **Direction (Emil lens):** Exit = ease-out. The strong custom curve `[0.23, 1, 0.32, 1]` starts at ~80% of total velocity in the first 10% of duration — users see the loader moving immediately. The 300ms duration is fine once the curve is corrected (it will feel much shorter). This is the same curve used throughout the page (`SectionReveal`, `SiteNav` mobile menu). Consistency of motion language matters: the loader should feel like it belongs to the same system.
- **Scope estimate:** `components/PageLoader.tsx` — 1 value changed: `ease: "easeIn"` → `ease: [0.23, 1, 0.32, 1]`. Single commit (can share with Task 3).
- **Risk register:** None. The exit animation only affects the loader overlay removal. Under RM, the loader `exiting` state leads to `!visible` which removes the element entirely — the transition doesn't fire. No RM regression.
- **Dispatch readiness:** READY
- **Test focus:** Hard-reload on a throttled connection (DevTools → Network → Slow 3G). Watch the loader exit. It should feel like it steps aside cleanly — visible motion from frame 1, not a slow dissolve.

---

### Task 5 — I1: Hero ChevronDown generic bounce

- **Severity:** Important
- **Source:** Review § "Findings — Important / I1"
- **Diagnosis:** `HeroSection.tsx:59` — `<ChevronDown className="... animate-bounce" />`. Tailwind's `animate-bounce` uses a `translateY(-25%)` keyframe with implicitly slow easing going up, creating a hard mechanical bounce. On a page whose motion language is spring-based and `cubic-bezier(0.16, 1, 0.3, 1)`, the default bounce is a note out of key.
- **Code reality check:** Confirmed. The `animate-bounce` utility in Tailwind produces `@keyframes bounce { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); } }`. The `translateY(-25%)` displacement is 25% of the chevron element height — substantial for a small icon. The alternating `ease-in` / `ease-out` curve gives it a hard mechanical bounce feel.
- **Direction (Emil lens):** The scroll cue has valid purpose: it guides first-time visitors to scroll. So animation is justified (it's seen once per visit, not tens of times). But the implementation needs to match the page's motion character. The right replacement: a gentle float using a custom CSS keyframe — `translateY(0) → translateY(4px) → translateY(0)` with `ease-in-out`, 2.5s, infinite. The displacement is 4px (vs. the current ~5-6px from 25% of a 16-pixel icon). The timing aligns roughly with the emoji breathing rhythm (3.5s), creating a relaxed ambient pulse rather than an anxious bounce. Add `@keyframes hero-cue-float` in `globals.css` and class `.hero-cue-float`. Remove `animate-bounce`, add the new class. CSS over Framer Motion here — this is a predetermined, non-interactive animation and CSS runs off-main-thread.
  Note: `globals.css` already has `@media (prefers-reduced-motion: reduce) { .animate-ping, .animate-bounce { animation: none; } }`. Add `.hero-cue-float` to this suppression rule so RM is respected automatically.
- **Scope estimate:** `app/globals.css` (add keyframe + class + RM suppression), `components/sections/HeroSection.tsx` (swap `animate-bounce` → `hero-cue-float`). Two files, ~5 LOC total. Single commit.
- **Risk register:** The new float is smaller displacement (4px vs ~6px) and slower (2.5s vs 1s). It will feel much calmer. Verify it's visible enough to serve as a scroll affordance on first load. Check that RM correctly suppresses it. The existing `size-3.5` ChevronDown is already styled — only the animation class changes.
- **Dispatch readiness:** READY
- **Test focus:** On fresh page load, confirm the ChevronDown gently floats rather than bounces. The motion should feel ambient, not energetic. Enable RM — confirm the chevron is static.

---

### Task 6 — I2: SectionEyebrow knob pointer indicator

- **Severity:** Important
- **Source:** Review § "Findings — Important / I2"
- **Diagnosis:** `SectionEyebrow.tsx:38-53` — the mini-knob SVG rotates to the section's dial angle, but the SVG fill is a radially symmetric gradient making rotation invisible. The Knob Thread design language (connecting the main dial's orientation to each section header) is half-implemented: the API is wired (`angle` prop used in `transform: rotate(${angle}deg)`) but the visual reads as a plain blue circle at every angle.
- **Code reality check:** Confirmed. The SVG has `viewBox="0 0 80 80"`, circle at `cx=40 cy=40 r=32`. There is explicitly no indicator — the code comment acknowledges the gap: "Phase 6 will add a small white indicator line." The rotation is functionally wired and correct; only the visual indicator is missing. The SVG renders at `size-10` (40px CSS). At 40px rendered with 80-unit viewBox, 1 SVG unit = 0.5px.
- **Direction (Emil lens):** The Knob Thread is one of the most distinctive design decisions on this page — each section header carries a miniature version of the main dial, rotated to show the section's clock position in the dial. Without the pointer, this is invisible and the coherence is lost. The pointer should echo the main Knob's visual language: a white rounded rectangle at 12 o'clock (SVG coords: centered at cx=40, anchored near the top of the circle). At this scale, a rect of `width=5, height=14, rx=2, x=37.5, y=9.5, fill="rgba(255,255,255,0.88)"` renders as roughly 2.5px × 7px — visible at 40px without dominating. After `rotate(${angle}deg)` transforms the parent, this points to the section's clock position. This directly mirrors the main Knob's `POINTER_W`, `POINTER_H`, `fill="#F4F6FA"` at miniature scale. The cohesion is the point.
- **Scope estimate:** `components/SectionEyebrow.tsx` — add one `<rect>` element to the SVG (inside the existing `<defs>` + `<circle>` structure), ~3-4 LOC. Single commit. No prop API changes.
- **Risk register:** The indicator adds a very small visual element. Verify it's visible against the blue gradient circle at all section angles. The `onDark` variant (CTASection's eyebrow on blue background) uses `textColor = "text-white/80"` — the knob SVG is the same in both variants, so the white indicator will be slightly less distinct against the blue circle on the dark CTA section. Acceptable: the pointer is still visible (white on brand blue at ~88% opacity).
- **Dispatch readiness:** READY
- **Test focus:** Scroll to each of the 7 content sections and inspect the eyebrow. Each mini-knob should show a clear white pointer oriented to that section's clock position (Hizmetler=45°, Nasıl=90°, Fiyatlar=135°, Neden=180°, Yorumlar=225°, SSS=270°, Sipariş=315°). The CTA (Sipariş) section eyebrow is on a blue background — confirm the pointer is still visible there.

---

### Task 7 — I3: FAQ accordion trigger hover affordance

- **Severity:** Important
- **Source:** Review § "Findings — Important / I3"
- **Diagnosis:** `FAQSection.tsx:77` — the AccordionTrigger className includes `hover:no-underline`, suppressing the base component's underline. No replacement hover state is provided. Hovering an FAQ question produces no visual feedback beyond the browser's default cursor change. The six questions are the most actively scanned elements in the FAQ section.
- **Code reality check:** Confirmed. The accordion trigger in `ui/accordion.tsx` has `hover:underline` as its default. FAQSection overrides with `hover:no-underline`. Nothing replaces it. The `rounded-md` class is present on the trigger's base, and `py-5` (20px) gives it enough vertical padding for a background highlight to look intentional.
- **Direction (Emil lens):** Interactive text elements need hover affordance — especially at this scale (text-lg, full-width row). A background fill is the right choice over text-color drift: it signals "this entire row is clickable" rather than just "this text changes." `hover:bg-[#F5F5F2]` matches the existing muted surface color used throughout the page (nav mobile menu hover, etc.), keeping the palette coherent. The `rounded-md` on the trigger handles corner rounding automatically. Add `-mx-2 px-2` to extend the background to the left edge (the trigger's padding-left is already at the content edge, so a slight negative margin prevents the highlight from looking inset). Keep `hover:no-underline`.
- **Scope estimate:** `components/sections/FAQSection.tsx` — add `hover:bg-[#F5F5F2] -mx-2 px-2 transition-colors` to the AccordionTrigger className. ~10 characters. Single commit.
- **Risk register:** The `-mx-2 px-2` trick extends the background hit area slightly. Verify this doesn't cause horizontal overflow or clip against the `max-w-3xl` container. Check mobile — the accordion rows span full width; the negative margin should be fine within `px-6` section padding.
- **Dispatch readiness:** READY
- **Test focus:** Hover over each FAQ question. A subtle `#F5F5F2` background should appear. Click to open — background should remain on hover. Check mobile — tap each question, confirm it opens correctly. Confirm no horizontal overflow.

---

### Task 8 — M4: Mobile hamburger icon swap transition

- **Severity:** Minor
- **Source:** Review § "Findings — Minor / M4"
- **Diagnosis:** `SiteNav.tsx:126-128` — the hamburger button renders either `<Menu>` or `<X>` based on `open` state with no transition. The icon swaps instantly on tap, which can feel like a rendering glitch on slower devices and misses the opportunity to confirm the mode change.
- **Code reality check:** Confirmed. The button renders `{open ? <X className="size-5" /> : <Menu className="size-5" />}` with no wrapper or transition. The button itself has `transition-colors` for background but no motion on the icon. The mobile menu it controls uses a full Framer `AnimatePresence` / `motion.div` exit animation — the icon swap being instant creates an asymmetry between the menu animation and the button animation.
- **Direction (Emil lens):** Icon state changes should mirror the state they represent. Opening the menu is a meaningful mode switch; the icon confirming it should feel deliberate, not accidental. A 150ms rotation-fade using Framer `motion.span` with `key={open}` creates a crossfade-with-rotation: the outgoing icon fades + rotates, the incoming icon fades in + rotates to rest. Parameters: `initial={{ opacity: 0, rotate: open ? -30 : 30 }}`, `animate={{ opacity: 1, rotate: 0 }}`, `transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}`. The rotation direction mirrors the X's own geometry (Menu → X: rotate -30° in; X → Menu: rotate +30° in). Keep `MotionConfig reducedMotion="user"` coverage — under RM the rotation will be zeroed by the parent MotionConfig.
- **Scope estimate:** `components/SiteNav.tsx` — wrap the conditional icon in a `motion.span` with `key={open}`. ~5 LOC addition. Single commit.
- **Risk register:** The `motion.span` wrapper is inside an `<AnimatePresence>` parent? No — the AnimatePresence wraps the mobile menu `motion.div`, not the button. The icon's `motion.span` is a standalone element — no AnimatePresence needed for a simple appearance-in-place animation. Verify the 40×40 (`size-9`) button still centers the icon correctly after the `motion.span` wrapper is added.
- **Dispatch readiness:** READY
- **Test focus:** On mobile viewport, tap the hamburger. The Menu icon should fade+rotate into the X icon. Tap again — X should fade+rotate back to Menu. The animation should feel quick and deliberate, not flashy. Enable RM — confirm the swap is instant (no rotation, immediate opacity change to 1).

---

### Task 9 — M1: Footer copyright casing

- **Severity:** Minor
- **Source:** Review § "Findings — Minor / M1"
- **Diagnosis:** `footer.tsx:103` — `"© 2026 Yıkat. Tüm hakları saklıdır."` uses "Yıkat" (mixed case). Every other brand reference on the page uses "YIKAT" (all caps, matching the logo).
- **Code reality check:** Confirmed. Line 103 of `footer.tsx`.
- **Direction:** Change "Yıkat" to "YIKAT". Brand names should be exactly consistent everywhere. This is the simplest finding on the page.
- **Scope estimate:** `components/footer.tsx` — 1 character change (uppercase the Y, I, K, A, T). Can share commit with Tasks 10 and 11.
- **Risk register:** None.
- **Dispatch readiness:** READY
- **Test focus:** Scroll to footer bottom bar. Confirm "© 2026 YIKAT. Tüm hakları saklıdır."

---

### Task 10 — M2: Pricing section eyebrow gap inconsistency

- **Severity:** Minor
- **Source:** Review § "Findings — Minor / M2"
- **Diagnosis:** `PricingSection.tsx:25` — `mt-6` after the `SectionEyebrow`. Every other section uses `mt-8`. Small rhythm break.
- **Code reality check:** Confirmed. Pricing line 25: `className="mt-6 grid grid-cols-1..."`. All other sections (Hizmetler, Nasıl, WhyUs, Reviews, FAQ, CTA) use `mt-8` for the grid immediately after the eyebrow.
- **Direction:** Change `mt-6` to `mt-8`. The pricing section's eyebrow → content spacing should match the other sections' rhythm.
- **Scope estimate:** `components/sections/PricingSection.tsx` — 1 Tailwind class change. Can share commit with Tasks 9 and 11.
- **Risk register:** Adds 8px vertical space between the eyebrow and the display-size price number. The pricing section uses `bg-[#F5F5F2]` and `py-24 md:py-40` — ample vertical room. The change is invisible at normal viewing speed.
- **Dispatch readiness:** READY
- **Test focus:** Scroll to Fiyatlar section. Confirm the eyebrow row and price number have consistent spacing matching other sections.

---

### Task 11 — M3: HowItWorks step numbers use brand blue

- **Severity:** Minor
- **Source:** Review § "Findings — Minor / M3"
- **Diagnosis:** `HowItWorksSection.tsx:51` — `text-[#2798ff]` on the step numbers "01", "02", "03". Brand blue means interactive on this page (nav links, CTA buttons, label ring active labels). Step numbers are structural anchors, not actions.
- **Code reality check:** Confirmed. Line 51: `<span className="text-3xl font-bold text-[#2798ff] md:text-4xl" ...>`. The numbers are presentational — they have no `onClick`, no `href`, no role.
- **Direction (Emil lens):** Color communicates contract. Blue says "you can interact with this." A step number that's blue but unclickable is a false contract — small, but it trains the user's expectations incorrectly. Change to `text-[#64748B]` (muted foreground, existing system color) — clearly readable at 3xl/4xl, clearly structural, not interactive. The step numbers become visual anchors in the neutral palette, letting the step titles (`text-[#0F172A] font-semibold`) lead each row visually.
- **Scope estimate:** `components/sections/HowItWorksSection.tsx` — 1 Tailwind class change. Can share commit with Tasks 9 and 10.
- **Risk register:** The step numbers at `text-3xl font-bold text-[#64748B]` will be less visually prominent than the current brand blue. This is intentional — the titles should lead. Verify the numbers still read clearly at mobile sizes.
- **Dispatch readiness:** READY
- **Test focus:** Scroll to Nasıl Çalışır section. Confirm step numbers "01", "02", "03" render in muted gray (`#64748B`), not blue. Numbers should still be clearly visible. Confirm step titles remain dark (`#0F172A`).

---

## Sequencing Rationale

**C2 first** (not C1): C2 is a bug that affects a specific user group (RM). Correctness before polish — get the page working for everyone before working on taste.

**C1 second** (despite NEEDS DECISION): Putting C1 early means the user answers the decision question before the sequential dispatch has far to travel. The question is asked in the plan's "Open Questions" section, so the user can decide before dispatch begins — or answer it when they say "next" after Task 1. Delaying C1 to after the taste fixes would mean 6 tasks execute before the most visually impactful change (removing placeholder boxes) lands.

**C3 + I4 third and fourth** (bundled commit): Both are 1-line motion corrections. C3 fixes the conversion touchpoint; I4 fixes the first impression. They compound each other: after both land, the page's motion quality improves at two key moments simultaneously.

**I1, I2, I3** (in review order): Each is independent, READY, and affects a different surface. No dependencies between them.

**M4 before M1/M2/M3**: M4 (hamburger) involves JSX changes with design judgment (animation parameters). The trivial text/class bundle (M1/M2/M3) comes last — once all design-judgment changes are done, the final commit is pure housekeeping.

**Disagreement with review ordering:** The review recommended "C2 → C1 → C3+I4 bundle" as the top 3. This plan follows that order. The only reordering is that I4 becomes a named task (not silently bundled into C3) — the dispatch contract requires each finding to be explicitly tracked even if they share a commit.

---

## Bundling Decisions

**Tasks 3 + 4 may share one commit:**
C3 (`CTASection.tsx`) and I4 (`PageLoader.tsx`) are in different files, each a 1-value change, no design judgment overlap. Commit message must call out both: `fix(motion): CTA transition-all + loader ease-in → ease-out`. They are dispatched as separate tasks but the implementer may land both in one commit if both are clean on the first pass.

**Tasks 9 + 10 + 11 share one commit:**
M1 (`footer.tsx`), M2 (`PricingSection.tsx`), M3 (`HowItWorksSection.tsx`) are pure 1-class/1-word changes across 3 files with zero design judgment. After individual verification by the reviewer, a single commit: `fix(minor): footer YIKAT casing, pricing mt-8, step number neutral color`.

**Task 8 (M4) stays separate:**
M4 (`SiteNav.tsx`) adds Framer Motion JSX with animation parameters — design judgment is required on the rotation degrees and timing. Not eligible for the trivial bundle.

**All other tasks:** Single-commit, one task at a time.

---

## Open Questions for User

**Q1 — Task 2 (C1): What replaces the three dashed placeholder boxes in ReviewsSection?**

Choose one before dispatching Task 2:

- **A — Collapse to heading only:** Remove the three boxes. Keep the section heading + eyebrow. No content body. Section stays in the LabelRing nav. Minimal, honest.
- **B — Single text signal:** Replace boxes with one line of copy in muted text, e.g., `"Yakında müşteri yorumları eklenecek."` — no boxes, no grid, just a paragraph. Cleaner than A if you want a content placeholder without visual structure.
- **C — Real review:** Replace with one actual customer quote (user supplies the text, name, optional star rating). Requires content. Maximum trust impact.

---

## Workflow Contract

- One task dispatched at a time
- Dispatch sequence: implementer agent (Opus 4.7) → commit → reviewer agent (Opus 4.7) → report → user browser test → "next"
- Bundled commits (Tasks 3+4, Tasks 9+10+11) per the Bundling section above — still dispatched as separate tasks, may share a commit
- Stop condition after each task: STOP after reviewer reports. Do NOT auto-advance.
- User answers Q1 (Task 2 question) either before dispatch begins or when saying "next" after Task 1 completes
