# Task 2.4c — Label Ring (REVISED: Rotating Ring with Fixed Marker)

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` (or `superpowers:executing-plans`). Steps use `- [ ]` checkboxes.

## Revision note

Original plan (committed in `7a0dc86`) used a STATIONARY ring with bucketed depth-of-field. Tasks 1 and 2 shipped against that design. Browser verification at scrolled state revealed the half-clipped knob means only 3-4 of 8 labels are practically visible at any moment — half the nav is unreachable. UX consult on 2026-04-26 recommended a ROTATING ring with a fixed marker — the dial metaphor honestly applied. This file documents the new direction. Tasks 1, 2, and the standalone knob pixelation fix (`4337e14`) remain in history; their LabelRing code is substantially refactored in upcoming tasks.

**Goal:** As the user scrolls, an inner ring of 8 section labels rotates around the morphed knob so the active section's label lands at a fixed marker (3 o'clock desktop / 6 o'clock mobile). Other labels rotate with it. Continuous opacity/scale/typography interpolation by angular proximity to marker. Marker is a thin brand-color tick on the bezel.

**Architecture:** Same Candidate A skeleton — sibling LabelRing overlay + `lib/knob-geometry.ts` shared constants. Outer parent `motion.div` still tracks knob center via the existing MV blend chain. NEW: an inner rotating container with `ringRotation` MV driven by scroll position relative to section anchors. 8 labels at fixed angles within the rotating container, each counter-rotated to stay upright, each styled by continuous angular-proximity interpolation.

**Tech stack:** Next.js 16 + React 19, framer-motion v11, TypeScript strict, Tailwind, `useActiveSection` hook.

---

## Done so far (DO NOT REDO)

| SHA | Title | What it shipped |
|---|---|---|
| `a771b4d` | refactor(knob): hoist geometry constants to lib/knob-geometry.ts | New `lib/knob-geometry.ts` with all shared constants. Knob.tsx imports them. Zero behavior change. |
| `fe0b448` | feat(label-ring): scaffold static LabelRing with depth-of-field | Created `components/LabelRing.tsx` with parent motion.div tracking knob center via DOMRect + viewport + scroll, MV blend chain, 8 labels at static positions with bucketed depth-of-field. Mounted in HeroSection. **Static-DOF logic and bucketed visual table are now obsolete** — Task 4 removes them. The morph-chain skeleton (left/top/scale MVs) is RETAINED. |
| `5b68ffe` | fix(label-ring): remove dead pointer-events on aria-hidden labels + collapse color ternary | Reviewer follow-up. Removed `pointerEvents: "auto"` from per-label divs (children inherit none from aria-hidden parent); collapsed `isHighlighted ? brand : (isActive ? brand : neutral)` to `(isHighlighted \|\| isActive) ? brand : neutral`. |
| `4337e14` | fix(knob): replace gradient fills with solid colors to eliminate banding at scale | Knob's `<linearGradient>` defs (small RGB delta over large render area = visible banding bands at scrolled state) replaced with solid midpoint fills: body `#3286E7`, top `#3F93F2`. `<defs>` block removed. |

---

## Locked spec (UX consult 2026-04-26)

### Design thesis

The knob is a *physical control*. A washing-machine program selector has one truth: **the indicator is fixed; the dial rotates to bring the chosen program to the indicator.** Every nav decision serves that mechanic. Scrolling = turning the dial. The half-clipped geometry is the point: the user is looking at a real machine from the operator's seat. No popping, no spring overshoot, no unrelated motion competing with the rotation.

### 1. Marker

A thin **brand-color tick** sits outside the knob's outer edge at MARKER_ANGLE.

- Shape: rectangle (or thin SVG line), 2px wide × 14px long (radial — long axis points toward knob center).
- Position: 6px gap outside the knob's outer-circle edge, at MARKER_ANGLE.
- MARKER_ANGLE: `0°` desktop (3 o'clock), `90°` mobile (6 o'clock).
- Color: `#2798ff` (YIKAT brand — NOT orange. The UX agent guessed wrong; we use brand blue everywhere).
- Static — no pulse, no glow, no animation. Reference frame for the eye.

### 2. Label visibility (opacity falloff by angular distance)

All 8 labels render. Per-label opacity = `clamp(1 - (|Δθ_marker| / 110°)^1.4, 0, 1)` where `Δθ_marker` is the label's CURRENT angle relative to MARKER_ANGLE (post-rotation, normalized to [-180°, 180°]).

- Within ±30° of marker: ~95–100% opacity.
- At ±90° (top/bottom of visible arc): ~25%.
- Past ±110°: 0 (effectively invisible — labels behind the knob).

Soft falloff so labels emerge/recede as the ring rotates. No hard masking — banding-free.

### 3. Rotation feel

**Scroll-progress-tied continuous interpolation. easeInOutCubic. No spring.**

Compute each section's `offsetTop` (re-measure on resize and on `load`). For current `scrollY`, find the bracket: index `i` such that `sectionTop[i] <= scrollY < sectionTop[i+1]`. Compute fraction `t = (scrollY - sectionTop[i]) / (sectionTop[i+1] - sectionTop[i])`, clamp [0, 1], ease via `easeInOutCubic(t)`. Interpolate `ringRotation` between `targetRotation(i)` and `targetRotation(i+1)` along the SHORTEST angular path (normalize delta to [-180°, 180°]).

Where `targetRotation(i) = MARKER_ANGLE - SECTIONS[i].angle`.

Edge cases:
- `scrollY < sectionTop[0]`: hold at `targetRotation(0)`.
- `scrollY >= sectionTop[last]`: hold at `targetRotation(last)`.

This mirrors the existing knob morph (scroll-tied + cubic + no spring) — same physics → same coherent feel.

### 4. Active label at marker (continuous, derived from proximity)

Each label's typography is interpolated continuously by angular proximity to marker. `proximity = 1 - clamp(|Δθ_marker| / 180°, 0, 1)` → 0 at opposite, 1 at marker.

| Property | Off-marker (proximity 0) | At marker (proximity 1) | Interp |
|---|---|---|---|
| Font-size desktop | 16px | 22px | linear in proximity |
| Font-size mobile | 13px | 17px | linear in proximity |
| Font-weight | 500 | 700 | linear in proximity |
| Color (non-highlight) | `#0F172A` | `#2798ff` | linear color mix |
| Letter-spacing | 0.08em | 0.04em | linear in proximity |
| Scale | 0.85 | 1.00 | linear in proximity |

**SİPARİŞ override:** color is always `#2798ff` (brand) regardless of proximity. All other properties (size, weight, scale, letter-spacing) interpolate normally — SİPARİŞ still grows when it arrives at the marker.

**No "arrival pop" animation.** The continuous interpolation IS the animation; an extra pulse on snap would betray the dial illusion.

### 5. Adjacent labels

Uniform-ish per #4's continuous interp. **No additional depth-of-field on top of the opacity falloff and proximity-based scale/size.** Rotation itself is the strongest attention signal; layered DOF is visual noise.

### 6. Click on non-active label

**Page scrolls smoothly to section. Ring follows naturally because rotation is scroll-tied.** ONE source of truth (scroll position).

```ts
const handleClick = (sectionId: string) => {
  freezeRef.current = true
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  window.setTimeout(() => { freezeRef.current = false }, 900)
}
```

`freezeRef` (passed to `useActiveSection`) suppresses the IntersectionObserver during the smooth-scroll so active state doesn't flicker through intermediate sections. Ring rotation, being driven by raw scrollY (not by active index), tracks the smooth scroll continuously — no separate animation needed.

**No click pulse animation.** Removed entirely (was in original plan; UX consult explicitly contraindicates).

### 7. Mobile marker = 6 o'clock

Mobile knob is at top edge, half-clipped, only bottom semicircle visible. Marker at MARKER_ANGLE = 90° (6 o'clock), tick pointing upward (radially toward center). Bottom-center of the visible arc — thumb-clear, sits in the user's downward reading flow.

### 8. Reduced-motion

`prefers-reduced-motion: reduce`:
- **No ring rotation.** ringRotation locked to the discrete rotation for the current active section (re-derived only when activeIndex changes via the IntersectionObserver, NOT scroll-tied).
- **All 8 labels visible** at their fixed positions in the (now-static) ring.
- **Active state changes instant** — typography snaps when activeIndex changes, no transition.
- Marker tick still rendered at MARKER_ANGLE.
- Click navigation still works (browser respects reduced-motion at the smooth-scroll level itself).

This preserves the visual identity (still looks like a dial) while honoring the reduced-motion contract.

### 9. Hero rest state — gated visibility

Labels are invisible while the knob is still attached to the machine illustration. Visibility ramps in once morph progress is mostly complete:

```ts
const visibilityGate = useTransform(morphProgress, (p) => clamp((p - 0.85) / 0.15, 0, 1))
```

Each label's effective opacity = `falloffOpacity * visibilityGate * sipariṣ_override`.

When morph < 85% complete: gate = 0, all labels invisible. Morph ≥ 85% to 100%: gate ramps 0→1 over the last 15% of morph progress.

### 10. Sweep entry

**No "fan from 3 o'clock" sweep.** With a rotating ring, labels are constantly in motion — adding a fancy entry choreography on top is overload at the exact moment the knob is settling.

The `visibilityGate` ramp (item 9) IS the entry. Optional 30ms-staggered fade per label keyed off angular distance from MARKER_ANGLE — defer to Task 7 implementation; if it adds visible polish without complexity, include it; if not, the gate alone suffices.

---

## Additional locked details

### Typography
- All-caps Turkish labels (some with diacritics: İ, Ş, Ç, Ğ).
- `line-height: 1` to prevent diacritic clipping.
- `padding-top: 4px` on label container to give İ-dot clearance.
- Font family: inherit (existing site sans).

### z-index
- SiteNav: z-50 (unchanged, untouched).
- Knob: z-30 (unchanged).
- LabelRing: z-30, but mounted AFTER `<Knob />` in `HeroSection.tsx` DOM order so it renders above. Same z, layout-order stacking.

### Per-label counter-rotation
The rotating container applies `rotate(ringRotation)` to all children. Each label must counter-rotate by `-ringRotation` to stay upright. Without this, labels would tumble.

```tsx
<motion.button style={{ rotate: useTransform(ringRotation, r => -r), ... }}>
  {label}
</motion.button>
```

Counter-rotation must also be MV-derived (not a static value), so it tracks ringRotation continuously.

### Performance
- 8 labels × ~5 MV chains each (proximity, opacity, scale, fontSize, fontWeight, color, letter-spacing, counter-rotation) = ~40 useTransforms per frame. Trivially cheap on any device from the last 6 years; framer-motion's diff is sub-1ms total.
- The rotating container gets a single `rotate()` MV — one composited layer for the orbit.
- Avoid permanent `will-change: transform` — apply only during active scroll if perf inspection reveals layer-thrashing.

### Keyboard a11y
- Tab order = source order = SECTIONS array order (basla → hizmetler → ... → siparis).
- On focus: scrollIntoView the corresponding section (drives rotation via the scroll-tied chain — no separate "rotate to focused" logic needed).
- Focus ring: 2px `#2798ff` outline, 2px offset, drawn on the focused label whatever its current rotated position. (Don't try to delay focus-ring render until label arrives at marker — too clever, brittle.)

### Geometry confirmed
```ts
ringRotation = MARKER_ANGLE - SECTIONS[activeIndex].angle  // discrete (reduced-motion only)
ringRotation = continuous interp between adjacent sections // normal mode
labelGlobalAngle = (SECTIONS[i].angle + ringRotation) mod 360
Δθ_marker = shortestSignedDistance(labelGlobalAngle, MARKER_ANGLE) // [-180, 180]
proximity = 1 - |Δθ_marker| / 180
```

### Sections (immutable)
Per `lib/sections.ts`: 8 sections at 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°. SİPARİŞ has `highlight: true`. Do NOT reorder, do NOT modify angles, do NOT touch `lib/sections.ts`.

---

## File structure

| Path | Status | Responsibility |
|---|---|---|
| `lib/knob-geometry.ts` | ✅ DONE (a771b4d) | Shared constants. Add `MARKER_ANGLE_DESKTOP = 0`, `MARKER_ANGLE_MOBILE = 90`, `MARKER_GAP = 6`, `MARKER_LENGTH = 14`, `MARKER_WIDTH = 2`, `LABEL_RING_GAP = 16` in Task 4. |
| `components/Knob.tsx` | ✅ DONE (a771b4d, 4337e14) | No further changes. |
| `components/LabelRing.tsx` | EXISTING (fe0b448, 5b68ffe) | Substantial refactor in Tasks 4–8: remove static DOF, add rotating container, marker, continuous styling, gated visibility, counter-rotation, RM gate. |
| `components/sections/HeroSection.tsx` | ✅ DONE (fe0b448) | LabelRing already mounted as Knob sibling. No further changes. |

**Out of scope (hard):** SiteNav.tsx, sections.ts, Knob.tsx, Knob morph behavior, dependency additions.

---

## Tasks

### Task 3: Wire `useActiveSection` + click navigation

**Goal:** Replace hardcoded `activeIndex = 0` in LabelRing with the live IntersectionObserver-based active section. Make labels clickable. Add a11y attributes. Visual styling stays as Task 2's static depth-of-field for now (it gets removed in Task 4).

**Why now:** active section is an input to the rotation logic in Task 4. Wire the input first, then build the rotation system on top.

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 3.1:** Add imports
  - `useRef, useCallback` to React imports
  - `useActiveSection` from `@/hooks/use-active-section`

- [ ] **Step 3.2:** Replace hardcoded active

  Find:
  ```tsx
  const activeIndex = 0
  ```
  Replace with:
  ```tsx
  const freezeRef = useRef(false)
  const [activeIndex, setActiveManual] = useActiveSection(freezeRef)

  const handleClick = useCallback((index: number, id: string) => {
    freezeRef.current = true
    setActiveManual(index)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    window.setTimeout(() => { freezeRef.current = false }, 900)
  }, [setActiveManual])
  ```

- [ ] **Step 3.3:** Convert label `<div>` to `<button>` with click handler + a11y

  In the SECTIONS.map render block, replace the `<div>` with:
  ```tsx
  <button
    key={section.id}
    type="button"
    onClick={() => handleClick(i, section.id)}
    aria-label={section.ariaLabel}
    aria-current={isActive ? "true" : undefined}
    style={{
      position: "absolute",
      left: cx,
      top: cy,
      transform: `translate(-50%, -50%) scale(${visual.scale})`,
      opacity: visual.opacity,
      color,
      fontSize: visual.fontSize,
      fontWeight: isActive ? 600 : 500,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      pointerEvents: "auto",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
      lineHeight: 1,
      paddingTop: 4,
      fontFamily: "inherit",
    }}
  >
    {section.label}
  </button>
  ```

- [ ] **Step 3.4:** Remove `aria-hidden="true"` from the parent motion.div (LabelRing is now interactive).

- [ ] **Step 3.5:** TypeScript check

  ```bash
  ./node_modules/.bin/tsc --noEmit
  ```
  Expected: clean.

- [ ] **Step 3.6:** Commit

  Use `git commit -F /tmp/task3-msg.txt` with:
  ```
  feat(label-ring): wire active section tracking + click navigation

  Replace hardcoded activeIndex with useActiveSection hook. Convert label
  divs to buttons with onClick + scrollIntoView smooth-scroll +
  freezeRef-based active suppression for 900ms post-click. aria-current on
  active label, aria-label per section. Removed aria-hidden from parent
  (now interactive). Visual styling still Task-2 static DOF — Task 4
  removes that and adds the rotating ring.
  ```

---

### Task 4: Add rotating ring + scroll-tied rotation interpolation

**Goal:** Refactor LabelRing's internal layout: parent motion.div now contains an inner rotating container. Compute `ringRotation` MV continuously from scrollY relative to section anchors. Apply rotation. Remove the static depth-of-field helper (no longer needed). Labels render with uniform style for now — Task 6 adds proximity-based styling.

**Why this is the big task:** the rotating ring is the central new mechanic. Get it working in isolation (uniform labels, no marker, no proximity styling) before layering more on top.

**Files:**
- Modify: `lib/knob-geometry.ts` (add marker + ring constants)
- Modify: `components/LabelRing.tsx` (substantial refactor)

**Steps:**

- [ ] **Step 4.1:** Add constants to `lib/knob-geometry.ts`

  Append at end:
  ```ts
  /** Marker angle in degrees (CSS angle convention: 0° = east). */
  export const MARKER_ANGLE_DESKTOP = 0   // 3 o'clock
  export const MARKER_ANGLE_MOBILE = 90   // 6 o'clock

  /** Marker tick visual constants. */
  export const MARKER_GAP = 6        // px gap between knob outer edge and tick inner end
  export const MARKER_LENGTH = 14    // px tick length (radial)
  export const MARKER_WIDTH = 2      // px tick width

  /** Gap between knob outer edge and label center, in BASE_SIZE units (gets scaled with parent). */
  export const LABEL_RING_GAP = 16

  /** Visibility gate: morphProgress range over which labels fade in. */
  export const VISIBILITY_GATE_START = 0.85
  export const VISIBILITY_GATE_END = 1.0

  /** Opacity falloff exponent (per UX spec — see plan §2). */
  export const OPACITY_FALLOFF_DEG = 110
  export const OPACITY_FALLOFF_EXPONENT = 1.4
  ```

- [ ] **Step 4.2:** In LabelRing.tsx, add imports

  ```ts
  import { SECTIONS, SECTION_IDS } from "@/lib/sections"
  import {
    BASE_SIZE, /* existing imports */,
    MARKER_ANGLE_DESKTOP, MARKER_ANGLE_MOBILE,
    LABEL_RING_GAP,
    OPACITY_FALLOFF_DEG, OPACITY_FALLOFF_EXPONENT,
  } from "@/lib/knob-geometry"
  ```

- [ ] **Step 4.3:** Add section-position measurement

  Inside LabelRing component, add after the existing viewport effect:
  ```tsx
  const [sectionTops, setSectionTops] = useState<number[]>([])
  useEffect(() => {
    if (typeof window === "undefined") return
    const measure = () => {
      const tops = SECTION_IDS.map((id) => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top + window.scrollY : 0
      })
      setSectionTops(tops)
    }
    measure()
    // Re-measure when layout might change.
    window.addEventListener("resize", measure)
    window.addEventListener("load", measure)
    return () => {
      window.removeEventListener("resize", measure)
      window.removeEventListener("load", measure)
    }
  }, [])
  ```

- [ ] **Step 4.4:** Add MARKER_ANGLE selector and helpers (module-level)

  Add to module-level helpers:
  ```ts
  function shortestSignedAngle(from: number, to: number): number {
    return ((to - from + 540) % 360) - 180
  }

  function clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v))
  }

  function computeRingRotation(
    scrollY: number,
    sectionTops: number[],
    markerAngle: number,
    sectionAngles: number[],
  ): number {
    if (sectionTops.length === 0) return 0
    const target = (i: number) => markerAngle - sectionAngles[i]

    if (scrollY <= sectionTops[0]) return target(0)
    if (scrollY >= sectionTops[sectionTops.length - 1]) return target(sectionTops.length - 1)

    let i = 0
    while (i < sectionTops.length - 1 && sectionTops[i + 1] <= scrollY) i++

    const lo = sectionTops[i]
    const hi = sectionTops[i + 1]
    const frac = hi === lo ? 0 : clamp((scrollY - lo) / (hi - lo), 0, 1)
    const eased = easeInOutCubic(frac)

    const r0 = target(i)
    const r1 = target(i + 1)
    const delta = shortestSignedAngle(r0, r1)
    return r0 + delta * eased
  }
  ```

- [ ] **Step 4.5:** Add ringRotation MV in component

  Inside LabelRing component (after `morphProgress` definition):
  ```tsx
  const markerAngle = isDesktop ? MARKER_ANGLE_DESKTOP : MARKER_ANGLE_MOBILE
  const sectionAngles = SECTIONS.map((s) => s.angle)

  const ringRotationRaw = useTransform(scrollY, (y) =>
    computeRingRotation(y, sectionTops, markerAngle, sectionAngles)
  )
  // Reduced-motion: lock to discrete rotation for current active section.
  const ringRotationDiscrete = useTransform(scrollY, () =>
    markerAngle - SECTIONS[activeIndex].angle
  )
  const ringRotation = prefersReducedMotion ? ringRotationDiscrete : ringRotationRaw
  ```

  Note: `ringRotationDiscrete` doesn't actually need to be a useTransform of scrollY — it could be a plain number. But making it an MV keeps the type uniform with `ringRotationRaw` so the conditional pick works. Alternatively, use `useMotionValue` and `.set()` in an effect on `activeIndex` change. Either pattern works; pick the cleaner one in implementation.

- [ ] **Step 4.6:** Refactor render — wrap labels in rotating container

  Replace the existing SECTIONS.map block inside the parent motion.div with:
  ```tsx
  <motion.div
    style={{
      position: "absolute",
      inset: 0,
      rotate: ringRotation,
      transformOrigin: "center",
    }}
  >
    {SECTIONS.map((section, i) => {
      const isActive = i === activeIndex
      const angleRad = (section.angle * Math.PI) / 180
      const ringRadiusInBase = BASE_SIZE / 2 + LABEL_RING_GAP
      const cx = BASE_SIZE / 2 + ringRadiusInBase * Math.cos(angleRad)
      const cy = BASE_SIZE / 2 + ringRadiusInBase * Math.sin(angleRad)

      const isHighlighted = section.highlight === true
      const color = (isHighlighted || isActive) ? "#2798ff" : "#0F172A"

      return (
        <motion.button
          key={section.id}
          type="button"
          onClick={() => handleClick(i, section.id)}
          aria-label={section.ariaLabel}
          aria-current={isActive ? "true" : undefined}
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            x: "-50%",
            y: "-50%",
            // Counter-rotate to stay upright as the ring rotates.
            rotate: useTransform(ringRotation, (r) => -r),
            color,
            fontSize: isDesktop ? 16 : 13,
            fontWeight: isActive ? 700 : 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            paddingTop: 4,
            lineHeight: 1,
            fontFamily: "inherit",
          }}
        >
          {section.label}
        </motion.button>
      )
    })}
  </motion.div>
  ```

  **Rules-of-hooks gotcha:** `useTransform` inside `.map()` violates rules of hooks. Refactor: extract the per-label render to a `LabelButton` subcomponent that takes `ringRotation` as a prop and creates its own MV. (Same pattern as old plan's Task 5; LabelRing's hook count stays bounded.)

  ```tsx
  type LabelButtonProps = {
    section: typeof SECTIONS[number]
    isActive: boolean
    isDesktop: boolean
    cx: number
    cy: number
    ringRotation: import("framer-motion").MotionValue<number>
    onClick: () => void
  }

  function LabelButton({ section, isActive, isDesktop, cx, cy, ringRotation, onClick }: LabelButtonProps) {
    const counterRotate = useTransform(ringRotation, (r) => -r)
    const isHighlighted = section.highlight === true
    const color = (isHighlighted || isActive) ? "#2798ff" : "#0F172A"

    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={section.ariaLabel}
        aria-current={isActive ? "true" : undefined}
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          x: "-50%",
          y: "-50%",
          rotate: counterRotate,
          color,
          fontSize: isDesktop ? 16 : 13,
          fontWeight: isActive ? 700 : 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          paddingTop: 4,
          lineHeight: 1,
          fontFamily: "inherit",
        }}
      >
        {section.label}
      </motion.button>
    )
  }
  ```

- [ ] **Step 4.7:** Remove the `depthOfField` helper from the file (no longer used). Remove `LABEL_RING_GAP` constant (now imported from lib). Remove the import of `useTransform` types if any are now unused — let tsc tell you.

- [ ] **Step 4.8:** TypeScript check

  ```bash
  ./node_modules/.bin/tsc --noEmit
  ```
  Expected: clean.

- [ ] **Step 4.9:** Commit

  Use `git commit -F /tmp/task4-msg.txt` with:
  ```
  feat(label-ring): rotating ring with scroll-tied rotation interpolation

  Major rework: parent motion.div now contains an inner rotating container.
  ringRotation MV computed continuously from scrollY relative to section
  offsetTops, eased with easeInOutCubic, shortest angular path between
  consecutive section targets. Each label counter-rotates to stay upright.
  Labels render with uniform styling (size, weight, letter-spacing) for now;
  proximity-based continuous styling lands in Task 6.

  Removed Task-2's static depthOfField helper and bucket table — the
  rotating-ring model uses continuous proximity-derived values instead.

  Reduced-motion path: ringRotation locked to the discrete target for the
  current active section (no scroll-tied interp). Tasks 7–8 polish the rest.
  ```

---

### Task 5: Marker tick at MARKER_ANGLE

**Goal:** Add the small brand-color tick on the bezel at MARKER_ANGLE. Renders inside the parent motion.div but OUTSIDE the rotating container (it's stationary relative to the knob, not relative to the ring).

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 5.1:** Add marker constants to imports from `@/lib/knob-geometry`:
  ```ts
  MARKER_GAP, MARKER_LENGTH, MARKER_WIDTH
  ```

- [ ] **Step 5.2:** Add a `<Marker />` subcomponent at module level:

  ```tsx
  type MarkerProps = { markerAngle: number }

  function Marker({ markerAngle }: MarkerProps) {
    // Knob outer edge sits at radius BASE_SIZE/2 from parent center.
    // Tick INNER end at radius (BASE_SIZE/2 + MARKER_GAP).
    // Tick OUTER end at radius (BASE_SIZE/2 + MARKER_GAP + MARKER_LENGTH).
    // Tick center at midpoint, oriented radially.
    const angleRad = (markerAngle * Math.PI) / 180
    const innerR = BASE_SIZE / 2 + MARKER_GAP
    const tickCenterR = innerR + MARKER_LENGTH / 2
    const cx = BASE_SIZE / 2 + tickCenterR * Math.cos(angleRad)
    const cy = BASE_SIZE / 2 + tickCenterR * Math.sin(angleRad)

    return (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: MARKER_WIDTH,
          height: MARKER_LENGTH,
          backgroundColor: "#2798ff",
          // Orient long axis radially: rotate so height vector points outward from center.
          // Element's natural orientation has height along +y. We want height along the radial
          // direction at angle markerAngle. Rotate by (markerAngle + 90)°: at markerAngle=0
          // (3 o'clock), radial direction is +x, rotation +90° aligns +y to +x. ✓
          transform: `translate(-50%, -50%) rotate(${markerAngle + 90}deg)`,
        }}
      />
    )
  }
  ```

  Verify the rotation math in browser: at desktop (markerAngle=0) the tick should be horizontal (long axis pointing left-right, since it's radial at 3 o'clock); at mobile (markerAngle=90) the tick should be vertical (long axis pointing up-down, radial at 6 o'clock).

  Wait — re-derive. At 3 o'clock, the radial direction is +x (east). The tick's long axis should ALSO be +x (pointing inward/outward along the radius). So we want height-vector rotated to point along +x. Element height is by default along +y. To rotate +y → +x, we rotate by -90° (or +270°). So `rotate(${markerAngle - 90}deg)`.

  Test: markerAngle=0 → rotate(-90°) → long axis horizontal ✓. markerAngle=90 → rotate(0°) → long axis vertical (along +y, which IS the radial direction at 6 o'clock) ✓.

  Use `rotate(${markerAngle - 90}deg)` in the transform.

- [ ] **Step 5.3:** Render the Marker INSIDE the parent motion.div but OUTSIDE the rotating container:

  ```tsx
  return (
    <motion.div style={{ /* parent style: position fixed, left, top, scale, etc. */ }}>
      <Marker markerAngle={markerAngle} />
      <motion.div style={{ position: absolute, inset: 0, rotate: ringRotation, transformOrigin: center }}>
        {SECTIONS.map(...)}
      </motion.div>
    </motion.div>
  )
  ```

  Order matters: marker is rendered FIRST so labels (which can pass through marker visually if they overlap) render on top. If you'd rather marker be on top, render it last. Eyeball in browser; UX doesn't specify; pick the option that reads cleanest.

- [ ] **Step 5.4:** TypeScript check.

- [ ] **Step 5.5:** Commit

  Use `git commit -F /tmp/task5-msg.txt`:
  ```
  feat(label-ring): static brand-color marker tick at 3 o'clock (desktop) / 6 o'clock (mobile)

  Add a 2x14px brand-color (#2798ff) tick outside the knob's outer edge,
  oriented radially, positioned at MARKER_ANGLE. Static — no animation.
  Visual reference frame for the rotating ring: labels arrive at this point
  to indicate active. Renders inside parent (tracks knob center via blend
  chain) but OUTSIDE the rotating container (stationary relative to knob).
  ```

---

### Task 6: Continuous proximity-based label styling

**Goal:** Replace LabelButton's uniform style with continuous interpolation by angular proximity to marker. Per the §4 spec table: fontSize, fontWeight, color, letter-spacing, scale all interpolate from off-marker to at-marker values based on `proximity = 1 - |Δθ_marker|/180`.

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 6.1:** Inside `LabelButton`, add the proximity MV chain.

  Just before the existing `counterRotate` definition:
  ```ts
  const markerAngle = isDesktop ? MARKER_ANGLE_DESKTOP : MARKER_ANGLE_MOBILE

  // Label's current absolute angle = its fixed angle + ring rotation
  const labelGlobalAngle = useTransform(ringRotation, (r) => (section.angle + r) % 360)

  // Shortest signed angular distance from marker (always in [-180, 180])
  const angularDelta = useTransform(labelGlobalAngle, (g) => shortestSignedAngle(g, markerAngle))

  // Proximity: 1 at marker, 0 at opposite. Magnitude only.
  const proximity = useTransform(angularDelta, (d) => 1 - clamp(Math.abs(d) / 180, 0, 1))
  ```

  (Pass `isDesktop` as a prop to LabelButton — add to LabelButtonProps.)

- [ ] **Step 6.2:** Derive each style MV from `proximity` and `angularDelta`:

  ```ts
  // Opacity falloff (per UX spec §2)
  const opacityRaw = useTransform(angularDelta, (d) => {
    const x = Math.abs(d) / OPACITY_FALLOFF_DEG
    return clamp(1 - Math.pow(x, OPACITY_FALLOFF_EXPONENT), 0, 1)
  })

  // Scale: 0.85 → 1.0 by proximity
  const scaleMV = useTransform(proximity, (p) => 0.85 + 0.15 * p)

  // Font size: off-marker → at-marker (16→22 desktop, 13→17 mobile)
  const fontSizeMV = useTransform(proximity, (p) =>
    isDesktop ? 16 + 6 * p : 13 + 4 * p
  )

  // Font weight: 500 → 700
  const fontWeightMV = useTransform(proximity, (p) => 500 + 200 * p)

  // Letter spacing: 0.08em → 0.04em (em string)
  const letterSpacingMV = useTransform(proximity, (p) => `${(0.08 - 0.04 * p).toFixed(4)}em`)

  // Color: neutral (#0F172A) → brand (#2798ff). framer-motion's color interp via mix-helper.
  // Use the literal hex strings; framer-motion auto-detects color values in style.
  // We can't directly useTransform to a color string without manual interp; use the mix import:
  ```

  Framer-motion provides `mix` from `framer-motion/utils`:
  ```ts
  import { mix } from "framer-motion"
  const colorMV = useTransform(proximity, (p) => mix("#0F172A", "#2798ff", p))
  ```

  Verify `mix` is exported from `framer-motion`. If not (sometimes `mixColor` or under a subpath), use a tiny inline color-mix helper:
  ```ts
  function mixColor(a: string, b: string, t: number): string {
    const parse = (h: string) => [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16),
    ] as const
    const [ar, ag, ab] = parse(a)
    const [br, bg, bb] = parse(b)
    const r = Math.round(ar + (br - ar) * t)
    const g = Math.round(ag + (bg - ag) * t)
    const bl = Math.round(ab + (bb - ab) * t)
    return `rgb(${r}, ${g}, ${bl})`
  }
  const colorMV = useTransform(proximity, (p) => mixColor("#0F172A", "#2798ff", p))
  ```

  SİPARİŞ override: bypass the MV interp for color. If `section.highlight`, render `color: "#2798ff"` directly (static), skip `colorMV`.

- [ ] **Step 6.3:** Apply all MVs to the motion.button style block:

  ```tsx
  <motion.button
    /* ...existing props... */
    style={{
      position: "absolute",
      left: cx,
      top: cy,
      x: "-50%",
      y: "-50%",
      rotate: counterRotate,
      scale: scaleMV,
      opacity: opacityRaw,  // visibilityGate added in Task 7
      color: section.highlight ? "#2798ff" : colorMV,
      fontSize: fontSizeMV,
      fontWeight: fontWeightMV,
      letterSpacing: letterSpacingMV,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
      paddingTop: 4,
      lineHeight: 1,
      fontFamily: "inherit",
    }}
  >
    {section.label}
  </motion.button>
  ```

- [ ] **Step 6.4:** TypeScript check. Verify `mix` import works or fall back to `mixColor` helper.

- [ ] **Step 6.5:** Commit

  Use `git commit -F /tmp/task6-msg.txt`:
  ```
  feat(label-ring): continuous proximity-based label styling

  Each label's opacity, scale, fontSize, fontWeight, color, and letter-spacing
  are now MV-derived from angular proximity to MARKER_ANGLE. Labels grow into
  activeness as they rotate toward the marker — no discrete state change, no
  arrival pop. Opacity falloff per UX spec §2:
  clamp(1 - (|Δθ|/110)^1.4, 0, 1).

  SİPARİŞ keeps brand color regardless of proximity (size/weight/scale still
  interpolate). All other labels: color mixes from #0F172A (neutral) to
  #2798ff (brand) by proximity.
  ```

---

### Task 7: Gated visibility on morph progress

**Goal:** Labels are invisible while the knob is still attached to the machine illustration. Multiplier `visibilityGate = clamp((morphProgress - 0.85) / 0.15, 0, 1)` ramps each label's opacity in over the last 15% of morph progress.

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 7.1:** Import VISIBILITY_GATE constants from `@/lib/knob-geometry`.

- [ ] **Step 7.2:** In LabelRing component (after `morphProgress` definition), add:
  ```ts
  const visibilityGate = useTransform(morphProgress, (p) =>
    clamp((p - VISIBILITY_GATE_START) / (VISIBILITY_GATE_END - VISIBILITY_GATE_START), 0, 1)
  )
  ```

- [ ] **Step 7.3:** Pass `visibilityGate` as a prop to `LabelButton`. Combine with falloff opacity:

  Inside LabelButton:
  ```ts
  const finalOpacity = useTransform(
    [opacityRaw, visibilityGate],
    ([o, g]: number[]) => o * g
  )
  ```

  And use `opacity: finalOpacity` in the button style instead of `opacity: opacityRaw`.

- [ ] **Step 7.4 (optional):** Per-label staggered fade-in once gate fully open

  UX spec §10 mentions "30ms staggered fade per label keyed off angular distance from MARKER_ANGLE." This is a polish nicety. Skip in v1 — the gate ramp is enough on its own. Revisit only if user explicitly requests after seeing it in the browser.

- [ ] **Step 7.5:** TypeScript check.

- [ ] **Step 7.6:** Commit

  Use `git commit -F /tmp/task7-msg.txt`:
  ```
  feat(label-ring): gate label visibility behind morph completion

  Multiply each label's effective opacity by visibilityGate, which ramps
  0→1 over morphProgress 0.85→1.0. Labels are invisible while the knob is
  still attached to the machine illustration; they fade in only as the
  knob settles into its scrolled destination.

  No per-label stagger in v1 — the gate ramp alone reads cleanly. Optional
  staggered fade can be added later if explicitly desired.
  ```

---

### Task 8: Reduced-motion + a11y final pass + production build

**Goal:** Verify reduced-motion path (ringRotation locked, no transitions, all labels visible). Verify keyboard nav. Verify VoiceOver. Run production build clean.

**Files:**
- Possibly: `components/LabelRing.tsx` (small a11y additions)

**Steps:**

- [ ] **Step 8.1:** End-to-end reduced-motion test

  DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Reload. Verify:
  - Knob morph held at rest (already verified pre-feature).
  - Labels visible at static positions in their UNROTATED layout (so they're at their fixed source angles, not rotated by ringRotation).
  - Wait — for reduced motion, the spec says "ringRotation locked to the discrete target for the current active section." That means the ring IS rotated to bring active to marker, just no smooth interpolation. Verify:
    - When at hero (active=basla, angle=0°), ring rotates so basla lands at MARKER_ANGLE.
    - As you scroll into hizmetler (without smooth animation), ringRotation snaps to the new discrete target.
  - Active label has the at-marker styling (size 22/17, weight 700, brand color, scale 1.0).
  - All other labels at their off-marker static styling.
  - No CSS transitions on any label property change (they snap instantly).

  If transitions are happening when activeIndex changes (because framer-motion smoothly interpolates between MV values by default), the fix is: in reduced-motion mode, the discrete ringRotation MV update should be instant. framer-motion's default behavior: `useMotionValue.set()` updates instantly; `useSpring` interpolates. We're using useTransform which derives synchronously — should be instant. Verify.

- [ ] **Step 8.2:** Keyboard nav

  Disable reduced-motion. Tab through the page. Verify:
  - Tab focus passes through SiteNav, then through LabelRing's 8 buttons in source order.
  - Visible focus ring on each label. If not visible, add `:focus-visible` outline:
    ```ts
    // In each motion.button style — but framer-motion's style prop doesn't accept :focus-visible.
    // Use a className with Tailwind:
    className: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2798ff]"
    ```
  - Enter/Space activates click → smooth-scroll to section.
  - Tab order matches DOM source order (basla → siparis); the rotating ring doesn't reorder DOM.

- [ ] **Step 8.3:** VoiceOver / NVDA

  Cmd+F5 on macOS. Verify each label's full ariaLabel announces; active label gets "current page" or equivalent.

- [ ] **Step 8.4:** Cross-breakpoint regression

  Resize through 375 → 480 → 768 → 1024 → 1280 → 1920. At each width, scroll from 0 through past full morph. Verify:
  - Knob morph still works.
  - LabelRing tracks knob center.
  - Marker at correct position (3 o'clock desktop, 6 o'clock mobile, snaps at 1024 boundary).
  - Ring rotates as expected.
  - Labels never overflow viewport unreadably.
  - No console errors.
  - No CLS (LabelRing additions shouldn't shift layout — it's position:fixed).

- [ ] **Step 8.5:** Build

  ```bash
  ./node_modules/.bin/tsc --noEmit
  pnpm build
  ```
  Expected: clean tsc, build succeeds. Pre-existing warnings unrelated to LabelRing are fine.

- [ ] **Step 8.6:** Commit (only if any fixes were needed)

  ```
  fix(label-ring): a11y + reduced-motion polish
  [describe fixes]
  ```

  If no fixes needed: no commit. Verification itself is the deliverable.

---

## Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Section-position measurement races (initial paint with images not loaded → wrong offsetTops → wrong rotation at scrollY=0) | High | Medium | Re-measure on `load` event AND `resize`. Initial render uses sectionTops=[] which makes computeRingRotation return 0 — labels may be at wrong rotation for ~100ms. Acceptable; alternative is to delay LabelRing render until measurement, which adds visual flash. |
| ringRotation MV updates 60fps × 8 LabelButton MV chains × 6 derived MVs each = ~2880 transforms/sec | Low | Low | Framer-motion's diffing is sub-1ms total. Verify no jank in browser; if found, optimize by computing all per-label derivatives in a single useTransform that returns an object (one MV update vs many). |
| Color interpolation produces unexpected midtones | Low | Low | Framer-motion's `mix` does sRGB interp which can produce muddy midpoints. If colors at proximity ~0.5 look ugly, switch to OKLCH-aware mix (manual implementation) or accept as-is; transition is brief enough not to matter. |
| Counter-rotation jitters during fast scroll | Low | Medium | Both ringRotation and counterRotate derive from the same scrollY — they're locked frame-perfectly. If jitter appears, it's a framer-motion render-batching issue; check by logging both values per frame. |
| `mix` not exported from `framer-motion` | Medium | Low | Step 6.2 includes a fallback `mixColor` helper. Use it if import fails. |
| Marker tick orientation math wrong | Medium (eyeball-only verifiable) | Low | Step 5.2 derives from first principles AND notes the test cases. Verify visually in browser before commit. |
| Reduced-motion path leaves stray transitions | Medium | Low | Task 8 step 8.1 explicitly tests for this. CSS transitions defaulting on style props are the most common culprit; framer-motion MV updates are synchronous so should snap. |
| Section anchors `<section id="...">` not present in DOM at LabelRing mount time | Low | Medium | `useActiveSection` hook handles this (returns 0 if no elements). Section measurement effect handles it (returns 0 for missing IDs). LabelRing degrades gracefully — labels just sit at index-0 rotation. Not blocking. |

## Scope boundary (hard)

- **Do NOT touch SiteNav.tsx.** Coexists at z-50.
- **Do NOT modify Knob.tsx.** Done at `4337e14`. Knob's morph is the input; LabelRing tracks it.
- **Do NOT modify sections.ts.** 8 sections at fixed angles. Order is order.
- **Do NOT add dependencies.**
- **Do NOT introduce hover/click animations beyond what's specced** (no scale-on-hover, no click pulse). Spec deliberately omits them.

## Rollback plan

Each task is a single commit. Revert any commit cleanly with `git revert <sha>`. Tasks 4–7 are sequential modifications to LabelRing.tsx; reverting one mid-chain may leave partially-applied state — prefer reverting from latest backwards (revert Task 7, then 6, etc.) rather than reverting Task 4 in isolation.

Full feature rollback: `git revert a771b4d..<final-sha>` reverts the entire LabelRing + Knob hoist arc. Knob.tsx returns to its pre-Task-1 state (lose the gradient fix too — to keep that, cherry-pick `4337e14` after the revert).

## Self-review

- **Spec coverage:** All 10 numbered UX spec items mapped to tasks (marker→T5, opacity→T6, rotation→T4, active style→T6, adjacent uniform→T6, click→T3, mobile marker→T4 via constant, RM→T4+T8, gated visibility→T7, no sweep→T7).
- **No placeholders:** every task has concrete code + file paths. Two helper functions (clamp, shortestSignedAngle, mixColor fallback) shown verbatim.
- **Type consistency:** ringRotation is MotionValue<number> across all uses. proximity is MV<number> (0..1). All style MVs feed motion.button which accepts MV-typed style props natively. `mix` import is hedged with fallback.
- **DRY:** computeRingRotation is module-level; per-label derivations live in LabelButton subcomponent (one definition, 8 instances). Marker subcomponent reused desktop/mobile via single `markerAngle` prop.

Plan complete.
