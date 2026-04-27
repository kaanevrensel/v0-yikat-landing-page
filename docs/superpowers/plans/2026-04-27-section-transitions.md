# Master plan item 6 — Section enter/exit transitions

> **Status:** ⏳ Awaiting user candidate decision. Implementation plan below applies to recommended Candidate 2 (One Beat).

> **For agentic workers:** REQUIRED SUB-SKILL once dispatched: `superpowers:subagent-driven-development`. Steps use `- [ ]` checkboxes.
> **Model tier:** see `docs/superpowers/project-rules.md`

> **Visual companion:** `.superpowers/brainstorm/94482-1777295353/content/section-transitions.html`

## Context

The page currently uses `SectionReveal` (`components/SectionReveal.tsx`) for all 8 content sections. The wrapper is a `motion.section` with `whileInView={{ once: true, amount: 0.3 }}` and `variants={container}`. Children use `revealItem` variants: `{ opacity: 0→1, y: 16→0, 500ms, ease [0.16,1,0.3,1] }` with a `staggerChildren: 0.11` cascade. `MotionConfig reducedMotion="user"` at the tree root handles RM without per-component hooks.

**What's missing:** The section wrapper itself has no motion — it is invisible (`hidden: {}`) and immediately visible (`visible: {}`). Children stagger in but the *section as a unit* never announces its arrival. The result: each section feels like a list of items appearing, not like a scene entering.

**Emil framing.** These transitions trigger once per section per page-view. Frequency: maybe 7–8 per visit, first-time only. Emil's framework says: this is the sweet spot for considered animation. Not rare enough to go all-out (onboarding), not frequent enough to strip entirely (keyboard shortcuts). "One clear act that says: this section has arrived."

---

## Candidates

### Candidate 1 — "Still Water"

**Design rationale (Emil voice).** Opacity only. The section wrapper fades from 0 to 1 in 280ms as the children stagger. Nothing moves; the content simply materialises. The philosophy: the children already move (y: 16), adding wrapper movement would create double-motion — the section moves *and* each child moves within it. Two movements, one beat. Still Water resolves the conflict by giving the wrapper zero spatial motion.

**Why not recommended.** Pure opacity on a wrapper that's already fading in via child stagger is nearly invisible — the wrapper fade is masked by the children. In practice, Still Water is indistinguishable from the current state. Emil: "if users can't see the difference, you have not made a decision, you have made noise."

**Visual character.** Section fades 0→1, 280ms, ease-out. Children stagger unchanged (y: 16→0, 500ms). Zero wrapper movement.

**RM behavior.** `MotionConfig reducedMotion="user"` strips all motion. No change needed.

**Implementation delta.** Modify `container` variant: add `opacity: 0` to `hidden`, `opacity: 1` to `visible`. ~3 LOC. Trivial.

**Trade-offs.**
- Pro: zero risk of double-movement artifacts.
- Con: invisible in practice. Ships nothing meaningful.

---

### Candidate 2 — "One Beat" ← Recommended

**Design rationale (Emil voice).** The section wrapper rises as a unit (y: 28→0 + opacity: 0→1, 380ms), *then* children cascade 220ms later. Two distinct acts: the stage arrives, then the actors walk on. The 220ms delay is calculated: it equals the moment the wrapper is ~60% through its ease (cubic-bezier(0.16,1,0.3,1) reaches ~60% displacement at ~180ms for a 380ms animation — 220ms gives the eye time to register the wrapper's arrival before the content begins). This is not a gap; it is a handoff.

**Why recommended.** It answers Emil's question "why does this animate?" cleanly: the wrapper movement signals spatial arrival (this section is entering the viewport, not just appearing). The two-act structure prevents double-movement because the acts are temporally separated. The ease curve `[0.16,1,0.3,1]` matches the existing `revealItem` curve — one consistent motion language across the entire page.

**Visual character.** Wrapper: y 28→0 + opacity 0→1, 380ms, `cubic-bezier(0.16,1,0.3,1)`. Children: stagger begins at 220ms delay, each child y 16→0 + opacity 0→1, 500ms, same curve. Total perceived duration: ~720ms from scroll trigger to last child settled.

**RM behavior.** `MotionConfig reducedMotion="user"` strips y motion and opacity animations automatically. The delayChildren on the container remains but has no visual effect (children animate instantly). No per-component RM handling needed.

**Implementation delta.** Modify `container` variant hidden/visible states and add `delayChildren: 0.22`. Keep `revealItem` unchanged. ~8 LOC delta in `SectionReveal.tsx`, zero other files.

**Trade-offs.**
- Pro: two-act structure is narratively clear; survives reduced-motion gracefully.
- Pro: minimal delta — one file, ~8 LOC.
- Con: 220ms delay means children start later than today. Total section settle time increases by ~220ms. Acceptable for once-per-visit animations.
- Con: y: 28 on the wrapper adds scroll-jank risk if sections are close together and scroll is fast. Mitigated by `once: true` + `amount: 0.3`.

---

### Candidate 3 — "Scroll Gesture"

**Design rationale (Emil voice).** Instead of a snap-in on `whileInView`, each section tracks the scroll continuously: as it enters the viewport bottom, it proportionally rises from y: 48 to y: 0 based on the intersection ratio. Once the section fully enters (`amount: 1`), it latches. Uses `useScroll({ target: ref, offset: ["start end", "start start"] })` + `useTransform` per section instance.

**Why not recommended.** Two problems. First, scroll-speed dependency: a user who fast-scrolls past a section sees it in mid-animation state at latch, not settled. Emil: "if the animation can end in a non-clean state, your system has a bug." Second, a `useScroll` per `SectionReveal` instance multiplies scroll listeners by 8. Emil: "if the complexity budget buys nothing visible at normal scroll speed, it's debt, not design." The per-section `useRef` + `useScroll` + `useTransform` chain is ~35 LOC on top of the existing 20, for an effect that reads the same as Candidate 2 at normal scroll speed.

**Visual character.** Proportional y movement as section enters viewport. Latches at y: 0 when fully in view.

**RM behavior.** `MotionConfig reducedMotion="user"` removes transforms. The `useScroll`/`useTransform` setup remains (wasted but harmless).

**Implementation delta.** ~35 LOC delta. Requires adding `useRef`, `useScroll`, `useTransform` imports, wrapping each instance in a new pattern. High complexity for low marginal gain.

**Trade-offs.**
- Pro: scroll-responsive feel, intentional interaction model.
- Con: scroll-speed dependent end state. Non-clean latch is a systemic bug.
- Con: 8× scroll listener overhead vs. 0 today.
- Con: significantly more complex with no visible benefit at normal scroll speed.

---

## Implementation plan (Candidate 2 — One Beat)

> **Files changed:** `components/SectionReveal.tsx` only. ~8 LOC delta.

### Step T-1: Update `container` variant in `SectionReveal.tsx`

Current:
```tsx
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0 } },
}
```

After:
```tsx
const container: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.11,
      delayChildren: 0.22,
    },
  },
}
```

`revealItem` stays unchanged. The wrapper's own `duration: 0.38` + `ease` are in the `visible` transition object — framer-motion applies them to the wrapper's `opacity` and `y` changes; `staggerChildren` and `delayChildren` apply to child orchestration.

**Verify:** `pnpm dev`, scroll through all 8 sections. Each section: wrapper rises and fades in first (380ms), then children cascade (starting at 220ms into the wrapper animation). No double-movement. Children do not start before wrapper is partially settled.

**Commit:** `feat(transitions): One Beat section enter animation`

### Step T-2: TypeScript + production build

```bash
pnpm build
```

Must exit 0. Fix any type errors.

**Commit (only if fixes needed):** `fix(transitions): build type fixes`

---

## Test plan

- [ ] **Normal scroll** (desktop): each section wrapper rises + fades, then children stagger. Two acts clearly visible.
- [ ] **Fast scroll** (keyboard Page Down): `once: true` means sections that are scrolled past quickly either latch into visible state or trigger immediately on next viewport entry. No mid-animation freeze.
- [ ] **Slow scroll** (trackpad, deliberate): the 220ms gap between wrapper and children is perceptible and reads as intentional two-act structure.
- [ ] **Reduced motion** (macOS Accessibility → Reduce Motion): no movement, sections appear instantly. `MotionConfig reducedMotion="user"` handles this — verify no visual residue.
- [ ] **Mobile 375px** (Safari): all 8 sections animate. No layout shift (wrapper y movement is GPU-composited).
- [ ] **Re-enter** (scroll back up, then down again): `once: true` — sections do not re-animate. They remain visible.
- [ ] **Hero section**: HeroSection is NOT wrapped in `SectionReveal` — confirm it is unaffected.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Wrapper `y: 28` causes section header to clip above viewport on very-short sections | Low | Low | `amount: 0.3` means section must be 30% in viewport before animation triggers. 28px movement is unlikely to cause clipping. |
| `delayChildren: 0.22` in `visible.transition` — framer-motion applies to children or wrapper? | None | Medium | Verified pattern: transition object at `visible` level controls both wrapper properties (via `duration`/`ease`) and orchestration (via `staggerChildren`/`delayChildren`). This is the documented framer-motion Variants pattern. |
| Fast-scroll user sees sections in partially-revealed state at scroll-end | Low | Low | `once: true` triggers animation once when 30% in view — by the time user stops scrolling, sections in view are fully settled. |
| 8× wrapper animation instances — perf on low-end mobile | Low | Low | `opacity` + `y` (transform) — GPU-composited. No layout/paint. 8 simultaneous instances is trivial. |

---

## Self-review

- Candidate rationale: Emil lens applied consistently across all 3. ✓
- Recommendation: Candidate 2 with clear "why not" for 1 and 3. ✓
- Implementation: single file, ~8 LOC, commit per step. ✓
- Test plan: 7 checks covering normal, fast, slow, RM, mobile, re-entry, hero exclusion. ✓
- Risk register: 4 risks. ✓
- No TBDs or placeholders. ✓
- Scope: one file, one variant update. Tight. ✓
