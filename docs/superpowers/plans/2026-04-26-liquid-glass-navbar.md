# Master plan item 3 — Liquid-Glass Navbar (candidates + recommendation)

---

## Revision: emil-design-eng pass (2026-04-27)

> **Status:** ⏳ Awaiting user decision. Original A/B/C candidates superseded. Three fresh candidates below, generated through the Emil Kowalski design engineering lens. Implementation plan (further below) still applies to whichever candidate you pick — it was written for B-style scroll-aware mechanics, but adapts directly to any of the three new candidates (the simplest path is noted per candidate).

> **Visual companion:** `.superpowers/brainstorm/75931-1777238564/content/navbar-candidates.html` (served at `http://localhost:51236` while this session's brainstorm server is up).

### Core lens question this pass answered

*Where does the glass earn its presence, and where is it decoration?*

Emil's framework: a continuous opacity/blur ramp as the user scrolls (Original B) is **decoration** — it's performing "glass-ness" on every scroll frame with no meaningful boundary. A **threshold** (or zero-to-present) communicates a decision: "you've moved; the nav is now needed." That shift from ramp → threshold is the defining change in this revision.

### New Candidate 1 — "Ghost-to-Present" (Threshold Frost)

**Design rationale (Emil voice).** At scroll=0 the nav is a ghost — enough background to show structure (`rgba(250,250,247,0.13)`) but essentially transparent, hero breathing completely through it. At scroll ≥ 40px: a single crossfade to full frost (200ms ease-out, CSS class toggle — not a MotionValue ramp). One moment of change. That moment communicates spatial navigation; the ramp communicates nothing except "I'm getting more opaque."

**Visual character.**
- `scroll=0`: hairline border at `rgba(255,255,255,0.14)` (white, subtle on hero gradient), bg barely-there, blur applied but with near-zero bg — nearly invisible.
- `scroll≥40px`: full frost: `rgba(250,250,247,0.72)`, blur 18px saturate 180%, `rgba(15,23,42,0.07)` border, subtle bottom shadow.
- Interaction: CTA gets `active:scale-[0.97]` (100ms ease-out); links get a `rgba(15,23,42,0.04)` hover pill behind text.

**Technical approach.** `useScroll` → `scrollY.on('change', (v) => setScrolled(v > 40))` sets a boolean → CSS class toggle on `motion.header` → CSS transition handles the crossfade. No per-frame MotionValue updates. No blur radius animation (zero Firefox repaint risk). RM: always glass-state.

**Implementation complexity.** ~20 LOC delta to `SiteNav.tsx`. No new deps.

**Trade-offs.**
- Pro: simplest implementation after Candidate 3; zero per-frame JS after threshold crossed.
- Pro: hero still breathes (ghost state is nearly invisible).
- Con: ghost state has ~13% bg — not fully transparent over hero. Some faint tinting visible.
- Con: "user pauses at exactly 40px" edge case causes frozen mid-transition (rare, acceptable).

### New Candidate 2 — "Zero-to-Glass" (Apple-style floating nav) ← **Recommended**

**Design rationale (Emil voice).** At scroll=0 the nav has ZERO background. Logo and links float directly over the hero gradient — the nav literally does not exist as a surface. The dial, washing machine, hero copy own the viewport entirely. As soon as the user scrolls past 0 (any scroll), the glass appears fast (150ms ease-out), fully formed. This is the Apple.com / Linear / Vercel landing page pattern, and it's correct: the nav earns its surface only once the user has committed to leaving the hero. "The best interface element is the one you don't notice until you need it."

**Visual character.**
- `scroll=0`: `background: transparent`, `border: none`. Only blur is applied (18px — for partial-scroll compositing), but with 0% bg it's invisible. Logo and links sit directly on hero gradient.
- `scroll>0`: `rgba(250,250,247,0.70)`, blur 18px saturate 180%, `rgba(15,23,42,0.06)` border, inner highlight, bottom shadow. Arrives in 150ms.
- Interaction: CTA `active:scale-[0.97]`; optional active-section link indicator (2px `#2798ff` underline, scale-in 120ms) via optional `activeSection?: string` prop (prop is optional — API still zero-required-props).

**Technical approach.** Same as Candidate 1 but threshold is `scrollY > 0` (any scroll). One boolean state. CSS class toggle. RM: always glass-state. Active link indicator is pure CSS + optional prop injection — no IntersectionObserver added to SiteNav itself (the parent can pass `activeSection` from the existing `useActiveSection` hook if desired, or leave undefined).

**Edge case: anchor-link mid-page load.** When user lands on `#hizmetler` directly, page is already scrolled — nav should appear instantly (no transition). Fix: add `data-no-transition` to header on first render, remove it after first `scroll` event. Suppresses the flash.

**Implementation complexity.** ~25 LOC delta to `SiteNav.tsx`. No new deps. Optional prop addition.

**Trade-offs.**
- Pro: hero gets 100% of the viewport at scroll=0 — strongest composition of the three.
- Pro: established, validated Apple/Linear pattern — Emil explicitly defers to Apple's interface decisions.
- Pro: active link indicator is a natural addition that makes nav and dial speak the same design language.
- Con: logo/links must be legible over hero bg without a surface behind them. The YIKAT hero is light blue (`#dbeafe` range) — `#0F172A` text is fully legible. If hero ever goes dark, this needs revisiting.
- Con: anchor-link edge case requires the no-transition guard (small extra code).

### New Candidate 3 — "Constant Substance" (Always-Glass, Interaction-First)

**Design rationale (Emil voice).** Don't use scroll behavior to earn the glass. Make the glass earn itself through perfect interaction quality. Every pressable element responds correctly. Hover states are honest — not just a color change, but a real pill (`rgba(39,152,255,0.06)` behind the text). The mobile drawer inherits the glass surface (continuous material). The aggregate of these invisible correctnesses creates something that feels right without any single element being flashy.

**Visual character.**
- `scroll=0 and all positions`: `rgba(250,250,247,0.68)`, blur 16px saturate 175%, `rgba(15,23,42,0.06)` border, inner highlight `rgba(255,255,255,0.45)`. Identical everywhere.
- Interaction: CTA `active:scale-[0.97]`; link hover: `-mx-2 px-3 rounded-md transition-colors hover:bg-[rgba(39,152,255,0.06)]` pill.
- Mobile drawer: inherits same glass bg/blur instead of opaque `#FAFAF7` — continuous glass surface when open.

**Technical approach.** Pure CSS changes to `SiteNav.tsx`. Replace opaque `bg-[#FAFAF7]` with glass values. Add hover and active state classes. No JS additions, no scroll listener, no MotionValues.

**Implementation complexity.** ~10 LOC delta. Truly the simplest path.

**Trade-offs.**
- Pro: simplest implementation. Zero scroll listener. Zero MotionValues. Zero performance overhead.
- Pro: mobile drawer glass continuity is a genuinely sophisticated detail.
- Con: frost at constant density competes with the hero dial/gradient at scroll=0. The redesign's centrepiece has to share the viewport with a permanent frosted panel.
- Con: "one density fits all contexts" is a compromise value — must be right over both the hero gradient AND the white sections.

### Which original candidates survived?

| Original | Verdict |
|---|---|
| **A — Static Frost** | DNA lives in Candidate 3 (constant glass), but without Emil's interaction quality additions. Pure A is underdone. |
| **B — Scroll-Aware Frost (previously recommended)** | **Superseded.** Core insight (frost responds to scroll) survives in Candidates 1 and 2 as threshold-based approaches. The mechanism changes from MotionValue ramp → boolean class toggle. The ramp itself is decoration. |
| **C — True Liquid SVG** | Rejected. Performance risk on iOS, Firefox fallback, and the distortion adds noise not information. |

### Recommendation: Candidate 2 — Zero-to-Glass

1. The YIKAT hero + dial is the centrepiece. Candidate 2 gives it the entire viewport at scroll=0. Candidates 1 and 3 both put a visible frost surface over the hero.
2. The threshold pattern (any-scroll → glass appears) is more decisive than a ramp and simpler than Candidate 1's ghost state tuning.
3. The active link indicator is a natural optional enhancement that ties the nav and the dial into visual dialogue — making two independent components feel like a system.
4. This is the established Apple.com / Linear / Vercel pattern. Emil explicitly studies and respects these implementations.
5. If the floating-logo-over-hero feels too bold in browser, Candidate 1 is the safe fallback — same mechanism, just adds the ghost state instead of zero.

---

## Original candidates (pre-emil-design-eng pass — for reference)

> **Original recommendation (Candidate B) is superseded pending user decision. See revision section above.**

> **Status:** ⏳ Awaiting user pick. Implementation plan inside applies to recommended candidate (B). Switch to A or C requires re-scoping the implementation section only — constraints and test plan still hold.

> **For agentic workers:** REQUIRED SUB-SKILL once dispatched: `superpowers:subagent-driven-development`. Steps use `- [ ]` checkboxes.

## Context

`components/SiteNav.tsx` currently uses an opaque `bg-[#FAFAF7]` border-bottom hairline. The brand has matured (`feat/landing-redesign` branch, master plan items 2.4a–2.4c shipped) and the morphed knob + label ring now share the viewport with the navbar during scroll. The opaque nav looks heavy against the lighter, glassier interactions below it. Apple-style frosted glass would visually integrate the nav with the rest of the redesigned hero.

## Goal

Apply a liquid-glass / Apple-style frosted effect to the existing SiteNav. Restrained, tasteful — not flashy. Effect lives ONLY on the navbar; must not bleed into knob, drum, label ring, or section content.

## Hard constraints

- SiteNav existing API/props must not break — exported `SiteNav` component, no required props.
- Logo + 4 links + Sipariş Ver button + mobile hamburger keep working identically.
- Top-nav links stay instant-scroll (NOT smooth) — intentional, do NOT "fix".
- Brand color `#2798ff` preserved for accents.
- Reduced-motion fallback required (static translucent fill, no scroll-driven density change).
- 60fps on scroll on mid-range mobile; no layout thrash, no paint storms.
- Safari (iOS + macOS), Chrome, Firefox — graceful degradation per browser.
- No regressions to knob/ring/drum performance — navbar shares the viewport with them during scroll.

## Candidates

Visual companion comparison: `.superpowers/brainstorm/51199-1777213840/content/candidates.html` (served at `http://localhost:55281` while this session's brainstorm server is up).

### Candidate A — Static Frost (CSS-only)

**Technical approach.** Replace `bg-[#FAFAF7]` with `bg-[rgba(250,250,247,0.62)]` + `backdrop-blur-[16px]` + a subtle inner-top highlight via `box-shadow: inset 0 1px 0 rgba(255,255,255,0.5)`. Hairline border kept but switched to `rgba(15,23,42,0.06)`. No JavaScript. No scroll listener. Same look at all scroll positions.

**Visual character.** Quietly transparent. The hero color visible behind the nav at the top of the page; section colors visible later. The frost density is constant.

**Browser support matrix.**
- Chrome 76+, Edge 79+, Safari 9+, Firefox 103+: full support.
- Older Firefox: `backdrop-filter` ignored — falls back to the rgba fill which still reads as a translucent surface.
- iOS Safari 9+: works with `-webkit-backdrop-filter` prefix.

**Performance profile.** Zero JS cost. `backdrop-filter` is GPU-composited on all major browsers. No paint storms, no layout thrash. The navbar already lives on its own layer (`position: fixed`) so adding the filter doesn't promote any new layer.

**Implementation complexity.** Touches `components/SiteNav.tsx` only (the `<header>` className). ~5 LOC delta. No new deps.

**Pros.** Lowest risk. Lowest LOC. Universal browser support. No JS to maintain. Trivial RM fallback (no behavior to disable).

**Cons.** Static — doesn't respond to scroll. The nav looks the same at the top of the hero as it does over a busy section. Some users may find this "less alive" than B.

**Risks.** None significant. The rgba-on-no-filter fallback is acceptable for legacy Firefox.

### Candidate B — Scroll-Aware Frost (recommended)

**Technical approach.** Same backdrop stack as A, but the `bg` opacity, blur radius, border opacity, and a subtle bottom shadow ramp from "thin" to "dense" between `scrollY ∈ [0, 80]`. Wired with a `useScroll` MV → `useTransform` chain (no scroll listener — matches the `Knob.tsx` pattern). Reduced-motion users get the dense end-state pinned.

**Visual character.** At the top of the hero, the nav is barely-there frost — the hero shines through. As the user scrolls past 80px, the frost densifies and a faint shadow blooms below the hairline, separating the nav from the content. Apple's macOS Sonoma menubar does this.

**Browser support matrix.** Same as A. The scroll-driven opacity ramp uses `backdrop-filter` and CSS opacity transitions, both fully supported. `useScroll` is part of framer-motion v11 already in use.

**Performance profile.** GPU-composited. The `useScroll` hook reads `window.scrollY` via a passive listener that framer-motion already manages (no new listener). The `useTransform` chain emits new MV values per frame, applied as CSS-var or inline style on the header — no React re-render. Bundle add: ~0 KB (framer-motion already imported in SiteNav for the mobile drawer).

**Implementation complexity.** Touches `components/SiteNav.tsx`. Adds ~30 LOC: `useScroll` + 4 `useTransform` MVs (bgAlpha, blurPx, borderAlpha, shadowAlpha) + `motion.header` wrapper with `style` driven by MVs. No new deps. No new files.

**Pros.** Apple-like alive feeling. RM-clean (pinned to scrolled-state). Reuses framer-motion patterns established by Knob/LabelRing. No new scroll listener (uses framer-motion's). Falls back identically to A for browsers without `backdrop-filter`.

**Cons.** Slightly more code than A (~25 LOC delta). One more `useTransform` chain in the bundle (~negligible).

**Risks.** Animating `backdrop-filter` blur radius is GPU-cheap on Chrome/Safari but **Firefox repaints the whole filter region** when `blur()` magnitude changes. Mitigation: keep blur radius CONSTANT (e.g., always 18px) and only ramp the rgba fill alpha + box-shadow alpha. Documented in implementation step B-2.

### Candidate C — True Liquid (SVG turbulence + displacement)

**Technical approach.** Add an inline `<svg>` with `<filter id="liquid-glass-displace">` containing `feTurbulence` (fractal noise) → `feDisplacementMap`. Reference it in CSS via `backdrop-filter: blur(8px) saturate(170%) url(#liquid-glass-displace)`. The displacement creates micro-warping of the content behind the nav, like real glass refracting light.

**Visual character.** Closest to actual frosted glass — content visible behind the nav warps subtly as it scrolls past. Reads as an Apple Vision Pro / iOS 17 control center surface.

**Browser support matrix.**
- Chromium (Chrome/Edge): `backdrop-filter: url()` works.
- Safari (iOS + macOS): `backdrop-filter: url()` works on macOS, **rasterizes on every frame on iOS** — drops to 30–45fps on iPhone 12 / mid-range Android.
- Firefox: `backdrop-filter: url()` is **NOT supported** — degrades to the rgba fallback (no glass effect at all).

**Performance profile.** Heaviest of the three. SVG filters run on the CPU in Safari iOS (no GPU compositing for filter chains containing `feTurbulence`). With the navbar at `position: fixed` over a scrolling page, the filter region rasterizes every frame the content underneath moves. Risks dropping the knob morph + label ring rotation below 60fps on mid-range mobile.

**Implementation complexity.** Touches `components/SiteNav.tsx` + adds SVG filter def either inline or in a separate `components/LiquidGlassFilter.tsx` portal. ~70 LOC delta. Plus per-browser fallback logic (e.g., `@supports (backdrop-filter: url(#x))` query) to drop the filter on Firefox.

**Pros.** Most "real" glass look. Highest design ceiling.

**Cons.** Performance risk on iOS — directly contradicts the "no regressions to knob/ring/drum performance" hard constraint. Three-tier fallback complexity (Chrome OK / Safari iOS degraded / Firefox no effect). Most LOC. Most maintenance surface.

**Risks.** **HIGH.** Likely to fail the 60fps mobile constraint without a feature-detect-and-disable layer. Effort to make it safe approaches the cost of the visual lift it provides.

## Recommendation: Candidate B — Scroll-Aware Frost

**Why.**

1. **Constraint alignment.** B meets every hard constraint without compromise. A also meets them but feels static. C breaks the 60fps mobile constraint without significant fallback engineering.
2. **Restraint matches the brief.** "Restrained, tasteful — not flashy." B is exactly that: invisible at rest, present when needed.
3. **Pattern reuse.** B uses the same `useScroll` + `useTransform` MV pattern Knob.tsx and LabelRing.tsx already use. Zero new mental model.
4. **Reduced-motion story is clean.** Pin all four MVs to their scrolled-state values when `useReducedMotion()` returns true. No animated refraction. No motion. Users get a static dense frost — same one scrolled users see.
5. **Performance budget intact.** No new scroll listener. Constant blur radius (mitigates Firefox repaint cost). All animated properties (rgba alpha, box-shadow opacity) are GPU-cheap.
6. **Reversibility.** If B reads "too active," dropping back to A is a one-commit revert that removes the MV chain and pins the alphas to the dense values.

If you'd prefer A's pure static restraint, the implementation plan below collapses to just step B-1 (the className swap + the inline base style — skip the MV chain).

---

## Implementation plan (Candidate B)

> **One file changed:** `components/SiteNav.tsx`. No new files. No new deps. No globals.css change.

### Files

- **Modify:** `components/SiteNav.tsx` (the `<header>` element + add MotionValues at top of `SiteNav`).

### Step B-1: Add the `motion.header` shell with constant frost

Replace the current `<header>` with a `motion.header`. Set baseline classes to use a subtle frost (everyone sees this even before scroll-aware values kick in). Drop the opaque `bg-[#FAFAF7]` and the static border-b color.

```tsx
<motion.header
  role="banner"
  className="fixed inset-x-0 top-0 z-50 h-14 backdrop-blur-[18px] backdrop-saturate-[180%] md:h-16"
  style={{
    backgroundColor: "rgba(250, 250, 247, 0.62)",
    borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.5)",
    WebkitBackdropFilter: "blur(18px) saturate(180%)",
  }}
>
```

Verify in browser at scrollY=0: nav is translucent, hero visible behind. Tab through links — focus rings still readable. Mobile hamburger still opens drawer. Sipariş Ver button still hits WhatsApp. **Commit:** `feat(navbar): static liquid-glass frost`.

### Step B-2: Wire scroll-aware MV chain

Add at the top of the `SiteNav` function body:

```tsx
const { scrollY } = useScroll()
const SCROLL_RAMP_END = 80

const bgAlpha = useTransform(scrollY, [0, SCROLL_RAMP_END], [0.42, 0.78], { clamp: true })
const borderAlpha = useTransform(scrollY, [0, SCROLL_RAMP_END], [0.03, 0.10], { clamp: true })
const shadowAlpha = useTransform(scrollY, [0, SCROLL_RAMP_END], [0, 0.04], { clamp: true })
const innerHighlightAlpha = useTransform(scrollY, [0, SCROLL_RAMP_END], [0.30, 0.55], { clamp: true })

// Pin to scrolled-state values when RM
const pinned = (mv: MotionValue<number>, end: number) =>
  prefersReducedMotion ? useMotionValue(end) : mv

// (Use useMemo or a top-level useMotionValue call with conditional .set() instead — see hooks rule note in step B-3)
```

Then build the live CSS strings via `useTransform`:

```tsx
const backgroundColor = useTransform(bgAlpha, (a) => `rgba(250, 250, 247, ${a})`)
const borderBottomColor = useTransform(borderAlpha, (a) => `rgba(15, 23, 42, ${a})`)
const boxShadow = useTransform(
  [shadowAlpha, innerHighlightAlpha],
  ([s, h]: number[]) =>
    `inset 0 1px 0 rgba(255,255,255,${h}), 0 1px 14px rgba(15,23,42,${s})`,
)
```

Apply to the motion.header `style` prop (replacing the constants from B-1):

```tsx
style={{
  backgroundColor,
  borderBottom: "1px solid transparent",
  borderBottomColor,
  boxShadow,
  WebkitBackdropFilter: "blur(18px) saturate(180%)",
}}
```

**Note on Firefox repaint cost (mitigation):** blur radius stays constant at 18px across the ramp. Only the alphas animate.

**Commit:** `feat(navbar): scroll-aware frost density ramp`.

### Step B-3: Reduced-motion pin (rules-of-hooks safe)

The pin pattern from B-2 calls `useMotionValue` conditionally — that violates rules of hooks. Refactor: create the MVs unconditionally, and conditionally read EITHER the live MV OR a constant MV pinned to the end value.

```tsx
const bgAlphaLive = useTransform(scrollY, [0, 80], [0.42, 0.78], { clamp: true })
const bgAlphaPinned = useMotionValue(0.78)
const bgAlpha = prefersReducedMotion ? bgAlphaPinned : bgAlphaLive
// repeat for borderAlpha, shadowAlpha, innerHighlightAlpha
```

This matches the established Knob.tsx pattern (`prefersReducedMotion ? zeroMV : easedProgress`). Verify: macOS Reduce Motion ON → nav appears already-dense at scrollY=0, no animation as you scroll.

**Commit:** `fix(navbar): pin frost density for reduced-motion`.

### Step B-4: Cross-browser fallback comment (no code change)

Add a one-line comment above the `motion.header` documenting the no-`backdrop-filter` fallback:

```tsx
// Browsers without backdrop-filter (legacy Firefox) fall back to the rgba bg
// alone — still reads as translucent, just no blur. Acceptable graceful degrade.
```

No commit needed if combined with B-1 or B-3.

### Step B-5: Final TypeScript + production build

```bash
./node_modules/.bin/tsc --noEmit
pnpm build
```

Both must exit 0. **No commit** unless the build surfaces an issue requiring a fix.

---

## Test plan

### Visual regression checks (open `http://localhost:3000` after `pnpm dev`)

- [ ] **Top of page (scrollY=0):** nav reads as thin frost. Hero gradient, washing machine, knob all visible behind nav. Logo + links + CTA fully legible.
- [ ] **Mid-scroll (scrollY≈40):** density visibly increases. No flicker, no jank.
- [ ] **Past hero (scrollY≥80):** dense frost, subtle bottom shadow visible, nav clearly separated from section content underneath.
- [ ] **Each section background:** verify nav looks correct over each section (hero/services/how/pricing/FAQ/footer). No section's bg color clashes with the frost.
- [ ] **Mobile drawer open (≤768px):** drawer panel still opaque (intentional — readability for menu). Drawer top edge sits flush against nav bottom border.

### Performance checks (Chrome DevTools Performance panel)

- [ ] **Record 5 seconds of scrolling from top to past-hero.** Frame rate stays ≥58fps on a throttled "Mid-tier mobile" CPU profile. No long tasks (>50ms) attributable to the navbar.
- [ ] **Layers panel:** confirm `<header>` is its own composited layer (because of `position: fixed` + `backdrop-filter`). Should not promote sibling elements.
- [ ] **Paint flashing:** enable Rendering → Paint flashing. Scrolling should NOT flash the entire viewport. Only the nav region may flash (acceptable — that's the backdrop-filter recompositing).
- [ ] **Knob + LabelRing 60fps verification:** scroll past the morph window. Knob morph and label ring rotation must still hit 60fps. Compare to a pre-change baseline if uncertain.

### Reduced-motion check

- [ ] macOS Settings → Accessibility → Display → Reduce motion: ON.
- [ ] Refresh `http://localhost:3000`. Nav should appear already-dense at scrollY=0. Scrolling does NOT change frost density.
- [ ] Mobile hamburger drawer: opens with no slide animation (existing RM behavior).

### Mobile hamburger smoke test

- [ ] Resize to 375px width (iPhone SE).
- [ ] Hamburger icon visible, links hidden.
- [ ] Tap hamburger → drawer opens. Tap link → drawer closes, page scrolls to anchor.
- [ ] Tap outside drawer or press Escape → drawer closes.

### Cross-browser pass

- [ ] **Chrome desktop:** all checks pass.
- [ ] **Safari macOS:** all checks pass. `-webkit-backdrop-filter` prefix takes effect.
- [ ] **Safari iOS (real device or Responsive Design Mode):** frost visible, scrolling smooth, no rasterization stutter.
- [ ] **Firefox 121+:** frost visible (Firefox 103+ supports backdrop-filter).
- [ ] **Firefox legacy (<103, if any test target):** rgba fallback only — verify nav still readable as a translucent fill, no broken layout.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Firefox repaints whole filter region on blur change | Low (mitigated) | Medium | Blur radius held constant at 18px across ramp. Only alphas animate. |
| Backdrop-filter rasterization slows knob+ring 60fps target on iOS | Low | High | Performance test on actual iPhone SE / iPhone 12. If frame drops appear, drop to Candidate A's static config. |
| Frost makes nav links unreadable over high-contrast section backgrounds | Low | Medium | Section backgrounds are uniformly light (`#FAFAF7`-`#F5F5F2` family). If a future section uses dark bg, this risk re-emerges — flag at that point. |
| Conditional `useMotionValue` violates rules of hooks | Medium (avoided via B-3) | High (silent breakage) | B-3 explicitly refactors to the unconditional-create + conditional-read pattern. |
| Mobile drawer panel inherits frost and reads as illegible | Low | Medium | Drawer has its own bg-`[#FAFAF7]` opaque fill — won't inherit. Verified via the visual test plan. |
| Adding `backdrop-blur` Tailwind utility requires Tailwind config change | None | None | `backdrop-blur-[18px]` is an arbitrary value, supported by Tailwind v4 out of the box. |

---

## Rollback plan

The navbar is on every page. Rollback must be immediate and complete.

**Single-commit revert:**
```bash
git revert <sha-of-task-B-2-commit>  # or the squash if implementer batches
```

This restores Candidate B's pre-scroll-aware state (still has the static frost from B-1). To go all the way back to the pre-glass opaque navbar:
```bash
git revert <sha-of-task-B-1-commit>
```

Both reverts touch only `components/SiteNav.tsx`. No data migrations, no config rollbacks, no other files affected.

**Smoke test after revert:**
- `pnpm build` clean.
- `http://localhost:3000` loads, nav opaque again, all links work.

**Decision criteria for rollback:**
- Production performance monitoring shows >5% INP regression on the homepage.
- User reports of nav being unreadable on any in-scope browser.
- Knob/label-ring 60fps target broken on real-device testing.

---

## Self-review

**Spec coverage:**
- Goal stated. ✓
- All 8 hard constraints addressed in candidate analysis or implementation steps. ✓
- 3 candidates with full criteria (technical, visual, browser, perf, complexity, pros/cons/risks). ✓
- Recommendation with 6-point rationale. ✓
- Implementation plan: 5 ordered steps, file paths, code blocks. ✓
- Test plan: 5 categories, all checkable items. ✓
- Risk register: 6 risks with mitigations. ✓
- Rollback: single-file, two-commit-or-one. ✓

**Placeholder scan:** None. All steps have concrete code or commands.

**Type consistency:** `MotionValue<number>` for all alpha MVs. `prefersReducedMotion: boolean | null` (from `useReducedMotion()`) consistent with rest of codebase (per the Task 9 follow-up note in `docs/session-resume.md`). No new types introduced.

**Ambiguity check:** Step B-2 explicitly notes the rules-of-hooks violation in its proposed code; B-3 fixes it. This is a teaching sequence — implementer reads B-2 first, sees the issue documented, applies the fix in B-3 from the start. Could be tightened by collapsing B-2+B-3 into one step, but the two-step form mirrors the Knob.tsx commit history and is clearer for the implementer.
