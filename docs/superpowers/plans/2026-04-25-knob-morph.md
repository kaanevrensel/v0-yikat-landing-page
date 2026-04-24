# Task 2.4b — Knob Morph (port from deleted DialNavigator)

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` (or `superpowers:executing-plans`). Steps use `- [ ]` checkboxes.

**Goal:** As user scrolls past the hero, the Knob grows and migrates to the viewport left-edge (desktop) or top-edge (mobile). Starting state is pixel-identical to current rest state after commit `efa011c`.

**Approach:** Port the motion design from the deleted `components/DialNavigator.tsx` (last seen at `ac52fd0~1`, removed in `ac52fd0`). Reuse the old driver, easing, spring, destination coords, and scale math verbatim. Adapt the starting endpoint to track the machine's DOMRect (honoring pixel-identity constraint) via Candidate A's continuous MotionValue blend.

**No brainstorm, no UI/UX consult.** Motion design is pre-validated.

---

## Source of truth

The old `DialNavigator.tsx` at `ac52fd0~1`. Re-read with:

```bash
git -C <worktree> show ac52fd0~1:components/DialNavigator.tsx
```

The morph-relevant code is ~30 lines (constants + driver + per-property transforms). Reproduced below for convenience; if there's any conflict, the git-history source is authoritative.

---

## Motion constants (ported verbatim)

```ts
const BASE_SIZE = 500                        // container footprint (px, matches viewBox)
const SCROLLED_PADDING = 40                  // 20 top + 20 bottom
const MIN_SCROLLED_SIZE = 420                // clamp floor for short viewports
const MORPH_START = 120                      // scrollY px — morph begins
const MORPH_END = 380                        // scrollY px — morph settled

// Mobile
const MOBILE_HERO_DIAL_VW = 70               // (unused in 2.4b since rest = DOMRect-tracked)
const MOBILE_SCROLLED_DIAL_VW = 100
const MOBILE_HERO_TOP_PCT = 30               // (unused — see above)

// Desktop hero values (HERO_LEFT_VW=24, HERO_TOP_PCT=28, HERO_SCALE=0.22) are NOT ported.
// Rest endpoint now tracks machine DOMRect to honor pixel-identity constraint.
```

## Driver (ported verbatim)

```ts
function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t
  const f = 2 * t - 2
  return 0.5 * f * f * f + 1
}

const { scrollY } = useScroll()
const rawProgress = useTransform(scrollY, [MORPH_START, MORPH_END], [0, 1], { clamp: true })
const easedProgress = useTransform(rawProgress, easeInOutCubic)
const morphProgressRaw = useSpring(easedProgress, { stiffness: 50, damping: 20 })

const prefersReducedMotion = useReducedMotion()
const morphProgress = prefersReducedMotion ? useMotionValue(0) : morphProgressRaw
```

## Destination (responsive, ported verbatim)

```ts
const [viewport, setViewport] = useState({ w: 375, h: 800 })
useEffect(() => {
  const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
  update()
  window.addEventListener("resize", update)
  return () => window.removeEventListener("resize", update)
}, [])

const isDesktop = viewport.w >= 1024

// Desktop: center at left edge, vertically centered. Half-clipped.
// Mobile: center at top edge, horizontally centered. Half-clipped.
const destLeftPx = isDesktop ? 0                  : viewport.w / 2
const destTopPx  = isDesktop ? viewport.h / 2     : 0
const destScale  = isDesktop
  ? Math.max(MIN_SCROLLED_SIZE, viewport.h - SCROLLED_PADDING) / BASE_SIZE
  : viewport.w / BASE_SIZE
```

---

## Architecture — Candidate A (continuous MotionValue blend)

Rest position/scale track the machine's DOMRect (current Knob.tsx behavior after `efa011c`). Feed them into MotionValues via `.set()` in the existing RO/scroll effect. Destination values are MotionValues updated on resize. A single `morphProgress` drives the blend.

```ts
const restLeft = useMotionValue(0)
const restTop = useMotionValue(0)
const restScale = useMotionValue(SVG_SIZE / BASE_SIZE)   // small default
const destLeftMV = useMotionValue(0), destTopMV = useMotionValue(0), destScaleMV = useMotionValue(0)

// Update dest MVs when viewport changes
useEffect(() => { destLeftMV.set(destLeftPx); destTopMV.set(destTopPx); destScaleMV.set(destScale) },
         [destLeftPx, destTopPx, destScale, destLeftMV, destTopMV, destScaleMV])

// Update rest MVs inside existing RO/scroll effect
// Compute rest knob center (x, y) from container rect, and rest scale from rendered knob diameter / BASE_SIZE
// rest scale = (88 * machine_scale) / BASE_SIZE  — matches current rendered knob diameter

// Blend
const lerp = (r: number, d: number, p: number) => r + (d - r) * p
const left  = useTransform([restLeft, destLeftMV, morphProgress], ([r, d, p]) => lerp(r, d, p))
const top   = useTransform([restTop,  destTopMV,  morphProgress], ([r, d, p]) => lerp(r, d, p))
const scale = useTransform([restScale, destScaleMV, morphProgress], ([r, d, p]) => lerp(r, d, p))
```

Container (replaces current dynamic-size svg):

```tsx
<motion.div
  aria-hidden="true"
  style={{
    position: "fixed",
    left, top,
    x: "-50%", y: "-50%",
    width: BASE_SIZE, height: BASE_SIZE,
    scale,
    transformOrigin: "center",
    pointerEvents: "none",
    zIndex: 30,
    opacity: isMeasured ? 1 : 0,
    willChange: "transform",
  }}
>
  <svg viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`} width={BASE_SIZE} height={BASE_SIZE}>
    {/* existing defs + knob circles, repositioned to center at (BASE_SIZE/2, BASE_SIZE/2) */}
    <motion.g style={{ rotate: angle }} transformOrigin={`${BASE_SIZE/2} ${BASE_SIZE/2}`}>
      {/* circles with cx=250, cy=250 instead of 0, 0 */}
    </motion.g>
  </svg>
</motion.div>
```

The knob inside the SVG is at `(250, 250)` in BASE_SIZE coords (= center). The whole 500×500 box scales as one unit. Rotation still uses `style={{ rotate }}` with explicit `transformOrigin` since knob geometry is now off-origin.

---

## Decisions (defaults applied; flag to change)

1. **Reduced-motion:** knob **holds at rest** (no morph). Plan diverges from old DialNavigator's jump-to-scrolled behavior. Rationale: user's explicit hard constraint for 2.4b.
2. **Indicator pointer:** keep current **always-visible** pointer. Plan diverges from old's fade-in indicator. Stylistic — no explicit constraint either way, defaulting to current.
3. **Rotation during morph:** current scroll-driven rotation (3 turns over `scrollYProgress` [0,1]) **continues** through the morph. No pause. 2.4c will layer active-section rotation on top.
4. **Destination is half-clipped** (center at edge, half offscreen). Matches old DialNavigator exactly. This is the "peek-from-edge" aesthetic — confirm visually post-impl.

---

## Red flags (inherited + adaptation-specific)

- `scrollY` thresholds `[120, 380]` are absolute px, not tied to hero boundaries. If hero height changes, alignment drifts. Not a bug today.
- String-unit interpolation (`"24vw" → "0vw"` in old) is NOT used here — we convert to numeric pixel MotionValues throughout. Strictly better.
- `useSpring(useTransform(easing))` is double-smoothing. Unusual but validated by user. Keep.
- Changing Knob's internal layout from dynamic `width=svgSize` to fixed `500×500 + scale` is a structural refactor — Task 1 must prove pixel parity at scrollY=0 before adding morph.

---

## Tasks

### Task 1: Restructure Knob.tsx to fixed 500×500 + scale layout

**Files:**
- Modify: `components/Knob.tsx`

Convert the outer container from dynamic `width=svgSize` to fixed `motion.div` at `BASE_SIZE × BASE_SIZE` with a `scale` transform. Knob circles repositioned to center at `(BASE_SIZE/2, BASE_SIZE/2)` in SVG coords. Rest scale = `(88 × machine_scale) / BASE_SIZE`, where `88` is the knob diameter in the machine's viewBox units and `machine_scale = rect.width / 900`.

At `morphProgress = 0`, the rendered output must be pixel-identical to commit `efa011c`.

Rotation: `<motion.g style={{ rotate: angle }}>` now needs explicit `transformOrigin={`${BASE_SIZE/2} ${BASE_SIZE/2}`}` since knob geometry is no longer at SVG origin.

- [ ] Replace outer `<svg>` with `<motion.div>` + inner `<svg viewBox="0 0 500 500">`
- [ ] Reposition circles from `(0,0)` to `(250, 250)` local coords
- [ ] Add `transformOrigin` to the rotating `motion.g` (`"250 250"`)
- [ ] Update `computePosition` to compute rest-scale and rest-center (replacing rest-left/top svgSize math)
- [ ] Verify at scrollY=0: knob visually identical to `efa011c` on desktop and mobile

**Commit:** `refactor(knob): restructure to fixed 500x500 + scale-transform layout (pixel-identical at rest)`

### Task 2: Add morph driver (scrollY → spring)

**Files:**
- Modify: `components/Knob.tsx`

Add the ported driver block (scrollY, rawProgress, easedProgress, morphProgress). Not consumed yet. Reduced-motion branch pins `morphProgress` to a constant `useMotionValue(0)`.

- [ ] Import `useScroll`, `useSpring`, `useTransform`, `useReducedMotion`, `useMotionValue`
- [ ] Add `easeInOutCubic` helper (co-located or in `lib/easing.ts` if one exists; otherwise inline)
- [ ] Add `MORPH_START = 120`, `MORPH_END = 380`, `BASE_SIZE = 500`, `SCROLLED_PADDING = 40`, `MIN_SCROLLED_SIZE = 420` constants
- [ ] Wire driver chain; verify `pnpm exec tsc --noEmit` clean

**Commit:** `feat(knob): add morph driver (scrollY band + eased spring)`

### Task 3: Wire destination MotionValues (responsive)

**Files:**
- Modify: `components/Knob.tsx`

Add viewport state + resize listener. Compute `destLeftPx`, `destTopPx`, `destScale` per the responsive branch. Feed into `destLeftMV`, `destTopMV`, `destScaleMV` MotionValues via effect.

- [ ] Add viewport `useState` + resize effect
- [ ] Compute destination values with `isDesktop` branch
- [ ] Create dest MVs and update effect
- [ ] Verify destinations update on window resize via console log (temporary)

**Commit:** `feat(knob): wire responsive destination MotionValues`

### Task 4: Wire rest MotionValues from DOMRect tracking

**Files:**
- Modify: `components/Knob.tsx`

Convert rest position/scale (currently local React state via `computePosition`) into MotionValues fed via `.set()` inside the existing RO + scroll effect. `computePosition` returns `{ restLeft, restTop, restScale }` (pixels), the effect calls `restLeftMV.set(...)` etc.

- [ ] Refactor `computePosition` to return rest values in the new MV-friendly shape
- [ ] Create `restLeftMV`, `restTopMV`, `restScaleMV`
- [ ] Update RO/scroll effect to call `.set()` on each
- [ ] Verify at scrollY=0: rest MVs track machine rect during resize

**Commit:** `feat(knob): wire rest MotionValues from DOMRect tracking`

### Task 5: Compose blend + bind to container

**Files:**
- Modify: `components/Knob.tsx`

Create blended `left`, `top`, `scale` MVs via `useTransform([restMV, destMV, morphProgress], blend)`. Replace the container's static style values with these MVs.

- [ ] Add `lerp` helper (inline or constant)
- [ ] Compose three blended MVs
- [ ] Bind to motion.div `style.left`, `style.top`, `style.scale`
- [ ] Browser: scroll 0 → 500, observe smooth morph on desktop
- [ ] Browser: scroll 0 → 500, observe smooth morph on mobile (375px)
- [ ] Browser: reduced-motion → no morph, knob at rest

**Commit:** `feat(knob): morph knob to viewport edge on scroll (port DialNavigator behavior)`

### Task 6: Browser verification

Manual QA checklist. Run `pnpm dev`, check each row.

| # | Scenario | Expected |
|---|---|---|
| 1 | Desktop (≥1280) scrollY=0 | Knob pixel-identical to `efa011c` at control panel |
| 2 | Desktop scroll through morph band (120→380) | Smooth grow + migrate to left viewport edge, half-clipped, final diameter ≈ (viewport.h − 40) |
| 3 | Desktop past morph (scrollY=500+) | Knob settled at left edge, machine body faded to 0 |
| 4 | Mobile (375px) scrollY=0 | Knob pixel-identical to `efa011c` (smaller, on control panel) |
| 5 | Mobile scroll through morph band | Smooth grow + migrate to top viewport edge, half-clipped, diameter = 100vw |
| 6 | Reduced-motion (DevTools emulate) | Knob holds at rest; no morph |
| 7 | Window resize mid-morph (scrollY ≈ 250, drag width from 1280 → 400) | Crosses breakpoint; destination flips; rest MVs also update; no snap |
| 8 | Scroll-up reversal (scroll to 400, then back to 0) | Morph reverses smoothly; knob returns to rest |
| 9 | Refresh mid-scroll (refresh at scrollY=250) | First paint shows knob at mid-morph position; no jump |

**If any row fails:** file inline bug notes and fix before proceeding.

### Task 7: Spec + code-quality reviewers (Opus 4.7)

Dispatch two reviewers in parallel:

- **Spec reviewer:** verify port fidelity against `ac52fd0~1:components/DialNavigator.tsx` — driver math, destination math, responsive branching. Verify pixel-identity at scrollY=0 vs `efa011c`.
- **Code-quality reviewer:** standard review — correctness, React idioms, MV composition, performance, silent failure modes.

Apply Important findings as separate follow-up commits (never amends).

---

## Risk analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Pixel-identity drift at scrollY=0 | Medium | Task 1 gates on visual-identity verification before adding morph. Revert if drift detected. |
| Rotation transformOrigin regression | Medium | Drum rotation taught us the `transformOrigin + transformBox` requirement. Apply same pattern to the relocated knob group. |
| Resize mid-morph snap | Low | Both rest and dest MVs update on resize; blend is continuous. Verify in Task 6 row 7. |
| Performance regression from larger SVG at rest | Low | SVG is 500×500 but scale-transformed to ~40-90px at rest. GPU handles scale cheaply. If jank: add `content-visibility: auto` or reduce DOM nodes. |
| scrollY thresholds misaligned with hero height | Low (today) | Hero height stable at current layout. Flag for revisit if hero redesigned. |

---

## Out of scope

- Label ring around knob (2.4c)
- Click-to-section navigation (2.4c)
- Active-section rotation (2.4c — will layer on top of current scroll-driven rotation)
- Machine-body fade tuning (already handled in current `WashingMachine.tsx`)
- Indicator pointer fade-in (old behavior; current always-visible preserved)

---

## References

- Deleted source: `git show ac52fd0~1:components/DialNavigator.tsx`
- Deletion commit: `ac52fd0 feat(machine): unify knob — remove DialNavigator, rotate & fade in place`
- Current Knob baseline: `efa011c fix(knob): scale SVG size proportionally to machine on mobile`
- Master plan: `docs/superpowers/plans/2026-04-25-launch-plan.md` — item 1
