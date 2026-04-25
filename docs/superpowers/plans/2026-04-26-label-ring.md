# Task 2.4c — Label Ring Around Morphed Knob

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` (or `superpowers:executing-plans`). Steps use `- [ ]` checkboxes.

**Goal:** Render 8 section labels around the morphed Knob at its scrolled destination. Labels use a depth-of-field hierarchy (active = brightest, neighbors dim, far = ghost), enter via a scroll-tied radial sweep, and click-navigate to their section. Stationary ring (does NOT rotate with the knob).

**Architecture:** Candidate A — sibling `<LabelRing />` overlay, mounted alongside `<Knob />` in `HeroSection`. Constants are hoisted to `lib/knob-geometry.ts` so both components share BASE_SIZE, breakpoint, morph thresholds. LabelRing duplicates the position MV chain (DOMRect-tracked rest + viewport-derived destination + eased blend) using the same `machineRef`. Zero behavior change to Knob — only its constant declarations move out.

**Tech stack:** Next.js 16 + React 19, framer-motion v11 (`useScroll`, `useTransform`, `useMotionValue`, `useReducedMotion`, `motion.div`), Tailwind, `useActiveSection` hook (IntersectionObserver), TypeScript strict.

---

## Source of truth

This plan locks in:

1. **Architecture decisions** from user (Candidate A, stationary ring, mobile semicircle, sweep entry, SiteNav coexists, z-40).
2. **UI/UX spec** from Phase 1 consult (depth-of-field tables, sweep timing, typography, hover, click pulse, reduced-motion behavior, mobile angle remap intent).

Both are baked into the constants and per-task code below. Do NOT improvise — if a number isn't in this plan, ask the user before deviating.

---

## File structure

| Path | Status | Responsibility |
|---|---|---|
| `lib/knob-geometry.ts` | NEW | Shared constants used by both `Knob.tsx` and `LabelRing.tsx`: BASE_SIZE, MORPH_START, MORPH_END, SCROLLED_PADDING, MIN_SCROLLED_SIZE, KNOB_LOCAL_X, KNOB_LOCAL_Y, KNOB_DIAMETER, VIEWBOX_W, VIEWBOX_H, DESKTOP_BREAKPOINT. No React, no MVs, no helpers — pure number exports. |
| `components/Knob.tsx` | MODIFIED (Task 1 only) | Replace inline constant declarations with imports from `lib/knob-geometry.ts`. **Zero behavior change.** No other touch in this plan. |
| `components/LabelRing.tsx` | NEW | Sibling overlay. Receives `containerRef` (same `machineRef` Knob uses). Internally tracks DOMRect + viewport + scroll, computes blended center, renders 8 labels at fixed angles around that center. Owns: depth-of-field, sweep entry, hover, click pulse, mobile semicircle, reduced-motion gates, a11y. |
| `components/sections/HeroSection.tsx` | MODIFIED (Task 2) | Mount `<LabelRing containerRef={machineRef} />` as a sibling to `<Knob />` (one-line addition). |

**Out of scope for this plan:**
- `components/SiteNav.tsx` — DO NOT touch. SiteNav coexists at z-50; LabelRing sits below at z-40. Visual divergence is intentional (SiteNav = utility chrome, LabelRing = page-nav metaphor).
- Knob's morph behavior — DO NOT alter rotation, position blend, scale, opacity gates, or any pixel-output of Knob beyond Task 1's constant-import refactor.
- New sections, new section ordering, new sections.ts entries — the 8 sections in `lib/sections.ts` are immutable for this work.

---

## Locked spec — bake these values verbatim into the code

### Sections (from `lib/sections.ts`, do not redefine)

8 sections at 45° intervals, clockwise from 3 o'clock (CSS angle convention: 0° = east, 90° = south, 180° = west, 270° = north):

| Index | id | label | desktop angle | highlight |
|---|---|---|---|---|
| 0 | basla | YIKAT | 0° | — |
| 1 | hizmetler | HİZMETLER | 45° | — |
| 2 | nasil | NASIL | 90° | — |
| 3 | fiyatlar | FİYATLAR | 135° | — |
| 4 | neden | NEDEN | 180° | — |
| 5 | yorumlar | YORUMLAR | 225° | — |
| 6 | sss | SORULAR | 270° | — |
| 7 | siparis | SİPARİŞ | 315° | true (always brand color) |

### Ring radius (around the morphed knob's center)

The label ring sits OUTSIDE the morphed knob's edge. Knob radius at scrolled state ≈ `(BASE_SIZE / 2) * destScale`. Label ring radius needs ~16px gap from knob edge for breathing room.

```ts
// In LabelRing.tsx — radius for label center, in px, scaled to current blended scale
const KNOB_RADIUS_AT_SCALE = (BASE_SIZE / 2) * scale  // scale is the blended MV
const LABEL_RING_GAP = 16
const labelRingRadius = KNOB_RADIUS_AT_SCALE + LABEL_RING_GAP
```

At rest (scale ≈ small), labels would crowd the knob — that's fine because at rest the labels are invisible (sweep entry hasn't started, opacity = 0).

### Depth-of-field (angular distance from active label)

Compute angular distance between each label's angle and the active label's angle, normalized to [0°, 180°] (shortest arc):

```ts
function angularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}
```

Bucket → opacity + scale:

| Distance bucket | Example angles from active=0° | Opacity | Scale |
|---|---|---|---|
| 0° (active) | active itself | 1.00 | 1.00 |
| 45° (adjacent) | 45°, 315° | 0.62 | 0.86 |
| 90° (near) | 90°, 270° | 0.34 | 0.74 |
| 135° (far) | 135°, 225° | 0.18 | 0.66 |
| 180° (opposite) | 180° | 0.10 | 0.62 |

Crossfade between active states: **280ms `cubic-bezier(0.4, 0, 0.2, 1)`**.

### Typography

| Bucket | Desktop | Mobile | Weight |
|---|---|---|---|
| Active | 16px | 13px | 600 |
| Adjacent | 14px | 12px | 500 |
| Near | 13px | 11px | 500 |
| Far | 12px | 10px | 500 |
| Opposite | 12px | 10px | 500 |

- **Letter-spacing:** `0.04em` (Turkish caps benefit from light tracking).
- **Color (non-active):** `#0F172A` (matches SiteNav neutral).
- **Color (active):** `#2798ff` (brand).
- **Color (SİPARİŞ):** always `#2798ff` regardless of active state (per `highlight: true` in sections.ts).
- **Font family:** inherit (existing site sans-serif).
- **Text transform:** uppercase (sections labels are already uppercase strings, but enforce CSS just in case).

### Sweep entry

Scroll-tied appearance. Labels fade from opacity 0 to their depth-of-field opacity over the scroll range:

```
Sweep range:    scrollY ∈ [120, 340]  (ENDS BEFORE morph at 380)
Per-label easing: cubic-bezier(0.22, 1, 0.36, 1)  (no overshoot)
Stagger pattern: eased radial — angle 0° appears first, angle 180° appears last
Stagger span:    30% of total sweep duration
```

Each label has a per-label `appearStart` and `appearEnd` within the global [120, 340] range. Use angular distance from 0° (the basla anchor) to compute the per-label offset:

```ts
// staggerOffset ∈ [0, 1] — 0 for angle 0, 1 for angle 180 (max distance from anchor)
const staggerOffset = angularDistance(label.angle, 0) / 180
const sweepDuration = 340 - 120                    // 220
const staggerWindow = sweepDuration * 0.30         // 66 — span over which staggers spread
const perLabelDuration = sweepDuration - staggerWindow  // 154 — each label's own fade duration
const appearStart = 120 + staggerOffset * staggerWindow
const appearEnd = appearStart + perLabelDuration
```

This guarantees:
- All labels start fading in by scrollY ≥ 120
- All labels are fully faded in by scrollY ≤ 340
- Earliest labels (angle 0°) finish first; latest (angle 180°) finish last
- Total sweep ends 40px of scroll BEFORE morph settles at 380, so the destination feels "ready" before it's reached

**Tension flagged:** at fast scrolling (e.g., trackpad fling), the 280ms depth-of-field crossfade and the eased sweep stagger could overlap visually. Mitigation if it's noticeable: shorten the crossfade to 200ms first. Default: ship at 280ms, reassess in browser verification.

### Hover

Any non-active label, on hover:
- scale snaps to **1.0** (overrides depth-of-field scale)
- color snaps to **#2798ff** (overrides depth-of-field color)
- opacity snaps to **1.0** (overrides depth-of-field opacity)
- transition: **180ms ease-out**

Hover fully overrides depth-of-field. SİPARİŞ on hover: scale up + opacity to 1.0 (color is already brand).

### Active treatment

**No accent marker** (no underline, no dot, no pill). Depth-of-field alone signals active.

### Click pulse

On click (any label):
1. Scale animates `1.0 → 0.94 → 1.0` over **220ms**, easing `cubic-bezier(0.4, 0, 0.2, 1)`.
2. After pulse completes (or in parallel — your call, both work), invoke navigation:
   - Set freezeRef.current = true (suppress active-section observer for ~900ms)
   - `document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })`
   - Manually call `setActiveManual(index)` so active state updates immediately
   - After 900ms, set freezeRef.current = false
3. **Skip pulse animation entirely on `prefers-reduced-motion`** — navigate immediately.

### Reduced-motion (`prefers-reduced-motion: reduce`)

- Sweep entry: **skipped**. Labels appear at full final opacity from page load (gated only by depth-of-field).
- Depth-of-field: **still applies** (it's a static visual hierarchy, not motion).
- Crossfade between active states: **instant** (no 280ms transition).
- Hover: **instant** (no 180ms transition).
- Click pulse: **skipped**. Click goes straight to navigate.
- Click navigation: still smooth-scroll via `scrollIntoView` (browser respects user's reduced-motion at the smooth-scroll level itself — don't override).

### z-index

```
SiteNav:    z-50  (utility chrome — search, CTA, hamburger)
LabelRing:  z-40  (page-nav metaphor — orbits the knob)
Knob:       z-30  (visual anchor)
```

LabelRing must be `position: fixed` (same as Knob) to track viewport coords during morph.

### Mobile semicircle

When `viewport.w < 1024` (DESKTOP_BREAKPOINT):
- Knob is at top edge of viewport (`destTopPx = 0`, half-clipped)
- Visible half of the ring is BELOW the knob (CSS angle 0°–180°, going through 90° = south)
- Remap each label's angle so all 8 labels fit into the visible bottom semicircle

**Intent (per user):** basla (YIKAT) at 9 o'clock, siparis (SİPARİŞ) at 3 o'clock, neden (NEDEN) at 6 o'clock.

In CSS angle convention (0° = east = 3 o'clock, 90° = south = 6 o'clock, 180° = west = 9 o'clock):

| Section | Desktop angle | Intended mobile clock | Intended mobile CSS angle |
|---|---|---|---|
| basla | 0° | 9 o'clock | 180° |
| hizmetler | 45° | between 9 and 7:30 | ~157.5° |
| nasil | 90° | between 7:30 and 6 | ~135° |
| fiyatlar | 135° | between 6 and 4:30 | ~112.5° |
| neden | 180° | 6 o'clock | 90° |
| yorumlar | 225° | between 6 and 4:30 (mirror) | ~67.5° |
| sss | 270° | between 4:30 and 3 | ~45° |
| siparis | 315° | 3 o'clock | ~22.5° → 0° |

Linear formula that satisfies all three intent anchors (basla → 180°, neden → 90°, siparis → 0°):

```ts
function toMobileAngle(desktopAngle: number): number {
  // Map desktop [0°, 360°] → mobile [180°, 0°] (linear, decreasing)
  // basla(0°) → 180°, neden(180°) → 90°, siparis(315°) → 22.5° (close to 0°/3 o'clock)
  return 180 - (desktopAngle / 360) * 180
}
```

| Section | Desktop | Computed mobile | Clock |
|---|---|---|---|
| basla | 0° | 180° | 9 o'clock ✓ |
| hizmetler | 45° | 157.5° | between 9 and 7:30 ✓ |
| nasil | 90° | 135° | between 7:30 and 6 ✓ |
| fiyatlar | 135° | 112.5° | between 6 and 4:30 ✓ |
| neden | 180° | 90° | 6 o'clock ✓ |
| yorumlar | 225° | 67.5° | between 6 and 4:30 ✓ |
| sss | 270° | 45° | between 4:30 and 3 ✓ |
| siparis | 315° | 22.5° | between 4:30 and 3 (close to 3) ✓ |

Use the formula above in Task 7. Verify all 8 positions match the table during browser check.

**Note:** on mobile, the ring radius is smaller (knob is `viewport.w / BASE_SIZE` scale, smaller than desktop's `viewport.h / BASE_SIZE` scale). Labels need to be positioned tighter. Same `LABEL_RING_GAP = 16` should still work but verify at 375px width — increase to 20-24px if labels look cramped.

---

## Task breakdown

8 tasks. Each task = single implementer commit. Reviewer dispatch happens between tasks (handled by orchestrator, not part of plan steps). Important reviewer findings → separate follow-up commits (never amends).

---

### Task 1: Hoist constants to `lib/knob-geometry.ts`

**Goal:** Pure refactor. Extract every constant from `Knob.tsx` that LabelRing will need into a new lib file. Knob.tsx imports them back. **Zero behavior change** — knob renders pixel-identically before/after this commit.

**Why this is task 1:** Frontload the regression risk. If anything breaks here, we catch it before LabelRing exists, and the fix is contained.

**Files:**
- Create: `lib/knob-geometry.ts`
- Modify: `components/Knob.tsx` (lines 17-32 — replace the constant block with import; line 26 — also remove DEFAULT_REST_SCALE since it's derivable)

**Steps:**

- [ ] **Step 1.1: Create `lib/knob-geometry.ts`**

```ts
// lib/knob-geometry.ts
//
// Shared geometry constants for the knob morph + label ring.
// Used by components/Knob.tsx and components/LabelRing.tsx.
// Pure number exports — no React, no MotionValues, no helpers.

/** Container footprint (px, matches viewBox dimension). */
export const BASE_SIZE = 500

/** WashingMachine SVG viewBox dimensions (used for DOMRect → knob-center math). */
export const VIEWBOX_W = 900
export const VIEWBOX_H = 1100

/** Knob center in the WashingMachine viewBox (control panel). */
export const KNOB_LOCAL_X = 450
export const KNOB_LOCAL_Y = 210

/** Old knob diameter in WashingMachine's pre-extraction 100-unit local viewBox.
 *  Used to compute restScale so the rendered knob CSS size matches commit efa011c. */
export const KNOB_DIAMETER = 88

/** scrollY threshold where the morph begins. */
export const MORPH_START = 120

/** scrollY threshold where the morph is fully settled. */
export const MORPH_END = 380

/** Total vertical padding at the scrolled destination (desktop only). */
export const SCROLLED_PADDING = 40

/** Floor for the scrolled destination size (desktop only). */
export const MIN_SCROLLED_SIZE = 420

/** Viewport width threshold (px). At or above = desktop. Below = mobile. */
export const DESKTOP_BREAKPOINT = 1024
```

- [ ] **Step 1.2: Modify `components/Knob.tsx`** — replace the constant block with an import.

Find this block (lines 17-32):

```ts
const BASE_SIZE = 500
const VIEWBOX_W = 900
const VIEWBOX_H = 1100
const KNOB_LOCAL_X = 450
const KNOB_LOCAL_Y = 210
const KNOB_DIAMETER = 88                                // r=44 in old 100-unit viewBox
const KNOB_FILL_SCALE = BASE_SIZE / KNOB_DIAMETER       // 500/88 ≈ 5.6818
const C = BASE_SIZE / 2                                 // 250 — knob center in new viewBox
// Fallback rest-scale used before measurement; harmless since opacity=0 until isMeasured.
const DEFAULT_REST_SCALE = 100 / BASE_SIZE

// Morph driver constants (ported verbatim from deleted DialNavigator.tsx @ ac52fd0~1).
const MORPH_START = 120              // scrollY px — morph begins
const MORPH_END = 380                // scrollY px — morph settled
const SCROLLED_PADDING = 40          // total vertical padding at scrolled destination
const MIN_SCROLLED_SIZE = 420        // clamp floor for the scrolled destination scale
```

Replace with:

```ts
import {
  BASE_SIZE,
  VIEWBOX_W,
  VIEWBOX_H,
  KNOB_LOCAL_X,
  KNOB_LOCAL_Y,
  KNOB_DIAMETER,
  MORPH_START,
  MORPH_END,
  SCROLLED_PADDING,
  MIN_SCROLLED_SIZE,
  DESKTOP_BREAKPOINT,
} from "@/lib/knob-geometry"

// Derived locally — not shared (LabelRing computes from BASE_SIZE directly).
const KNOB_FILL_SCALE = BASE_SIZE / KNOB_DIAMETER       // 500/88 ≈ 5.6818
const C = BASE_SIZE / 2                                 // 250 — knob center in new viewBox
const DEFAULT_REST_SCALE = 100 / BASE_SIZE              // SSR fallback; opacity=0 hides until measured
```

The `import` block goes at the top of the file with the other imports (after `useEffect, useState` from React, before the `type Props`).

- [ ] **Step 1.3: Update `Knob.tsx` desktop-breakpoint check**

Find line 105 (in current file):
```ts
const isDesktop = viewport.w >= 1024
```

Replace with:
```ts
const isDesktop = viewport.w >= DESKTOP_BREAKPOINT
```

(One-line change. Brings the magic 1024 in line with the shared constant.)

- [ ] **Step 1.4: Verify TypeScript**

Run:
```bash
./node_modules/.bin/tsc --noEmit
```
Expected: clean exit, zero errors.

- [ ] **Step 1.5: Browser verification — pixel-identity check**

Run dev server (`pnpm dev`), open http://localhost:3000.

Verify:
- [ ] Page loads. Knob visible at control panel.
- [ ] Scroll to scrollY ≈ 200 — knob mid-morph, no visual jank.
- [ ] Scroll to scrollY ≈ 800 — knob at viewport left edge (desktop) or top edge (mobile <1024).
- [ ] Resize browser between 375px and 1920px — knob repositions smoothly.
- [ ] Reduced-motion (DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`): knob stays at rest.

If ANY scenario differs from pre-commit behavior: revert and investigate. Task 1 must be a behavioral no-op.

- [ ] **Step 1.6: Commit**

```bash
git add lib/knob-geometry.ts components/Knob.tsx
git commit -m "$(cat <<'EOF'
refactor(knob): hoist geometry constants to lib/knob-geometry.ts

Pure refactor — extract BASE_SIZE, MORPH_START, MORPH_END, SCROLLED_PADDING,
MIN_SCROLLED_SIZE, KNOB_LOCAL_X/Y, VIEWBOX_W/H, KNOB_DIAMETER, and a new
DESKTOP_BREAKPOINT (1024) into a shared module. Knob imports them back; zero
behavior change. Prep for LabelRing (Task 2.4c) which needs the same constants.
EOF
)"
```

---

### Task 2: Scaffold `<LabelRing />` component (static, hardcoded active)

**Goal:** Get LabelRing on screen with all 8 labels positioned around the morphed knob's center, using DEPTH-OF-FIELD with active=index 0 hardcoded. No animation, no interaction. Verify positioning math is correct first.

**Why hardcoded active:** isolates the position math from the active-section wiring. If labels appear in the wrong place, we catch it without IntersectionObserver complications.

**Files:**
- Create: `components/LabelRing.tsx`
- Modify: `components/sections/HeroSection.tsx` (add `<LabelRing>` mount, line 64 area)

**Steps:**

- [ ] **Step 2.1: Create `components/LabelRing.tsx`** with full position math.

```tsx
"use client"

import { type RefObject, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useReducedMotion } from "framer-motion"
import {
  BASE_SIZE,
  VIEWBOX_W,
  VIEWBOX_H,
  KNOB_LOCAL_X,
  KNOB_LOCAL_Y,
  KNOB_DIAMETER,
  MORPH_START,
  MORPH_END,
  SCROLLED_PADDING,
  MIN_SCROLLED_SIZE,
  DESKTOP_BREAKPOINT,
} from "@/lib/knob-geometry"
import { SECTIONS } from "@/lib/sections"

type Props = {
  containerRef: RefObject<HTMLDivElement | null>
}

const DEFAULT_REST_SCALE = 100 / BASE_SIZE
const LABEL_RING_GAP = 16                    // px gap between knob edge and label center

function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t
  const f = 2 * t - 2
  return 0.5 * f * f * f + 1
}

const lerp = (r: number, d: number, p: number) => r + (d - r) * p

export function LabelRing({ containerRef }: Props) {
  const [isMeasured, setIsMeasured] = useState(false)
  const restLeftMV = useMotionValue(0)
  const restTopMV = useMotionValue(0)
  const restScaleMV = useMotionValue(DEFAULT_REST_SCALE)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const r = el.getBoundingClientRect()
      const p = computeRestPosition(r)
      restLeftMV.set(p.restLeft)
      restTopMV.set(p.restTop)
      restScaleMV.set(p.restScale)
      setIsMeasured(true)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [containerRef, restLeftMV, restTopMV, restScaleMV])

  const [viewport, setViewport] = useState({ w: 375, h: 800 })
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const rawProgress = useTransform(scrollY, [MORPH_START, MORPH_END], [0, 1], { clamp: true })
  const easedProgress = useTransform(rawProgress, easeInOutCubic)
  const zeroMV = useMotionValue(0)
  const morphProgress = prefersReducedMotion ? zeroMV : easedProgress

  const isDesktop = viewport.w >= DESKTOP_BREAKPOINT
  const destLeftPx = isDesktop ? 0 : viewport.w / 2
  const destTopPx = isDesktop ? viewport.h / 2 : 0
  const destScale = isDesktop
    ? Math.max(MIN_SCROLLED_SIZE, viewport.h - SCROLLED_PADDING) / BASE_SIZE
    : viewport.w / BASE_SIZE

  const destLeftMV = useMotionValue(0)
  const destTopMV = useMotionValue(0)
  const destScaleMV = useMotionValue(0)
  useEffect(() => {
    destLeftMV.set(destLeftPx)
    destTopMV.set(destTopPx)
    destScaleMV.set(destScale)
  }, [destLeftPx, destTopPx, destScale, destLeftMV, destTopMV, destScaleMV])

  const left = useTransform(
    [restLeftMV, destLeftMV, morphProgress],
    ([r, d, p]: number[]) => lerp(r, d, p),
  )
  const top = useTransform(
    [restTopMV, destTopMV, morphProgress],
    ([r, d, p]: number[]) => lerp(r, d, p),
  )
  const scale = useTransform(
    [restScaleMV, destScaleMV, morphProgress],
    ([r, d, p]: number[]) => lerp(r, d, p),
  )

  // TASK 2 SCAFFOLD: hardcoded active index. Replaced with useActiveSection in Task 4.
  const activeIndex = 0

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        left,
        top,
        x: "-50%",
        y: "-50%",
        width: BASE_SIZE,
        height: BASE_SIZE,
        scale,
        transformOrigin: "center",
        pointerEvents: "none",
        zIndex: 40,
        opacity: isMeasured ? 1 : 0,
      }}
    >
      {SECTIONS.map((section, i) => {
        const isActive = i === activeIndex
        const dist = angularDistance(section.angle, SECTIONS[activeIndex].angle)
        const visual = depthOfField(dist)

        // Position label center on the ring (radius in BASE_SIZE units, since
        // the parent motion.div is BASE_SIZE×BASE_SIZE and uses scale to size).
        // Label center coords relative to parent: (BASE_SIZE/2 + r*cos, BASE_SIZE/2 + r*sin)
        const knobRadiusInBase = BASE_SIZE / 2
        const ringRadiusInBase = knobRadiusInBase + LABEL_RING_GAP
        const angleRad = (section.angle * Math.PI) / 180
        const cx = BASE_SIZE / 2 + ringRadiusInBase * Math.cos(angleRad)
        const cy = BASE_SIZE / 2 + ringRadiusInBase * Math.sin(angleRad)

        const isHighlighted = section.highlight === true
        const color = isHighlighted ? "#2798ff" : (isActive ? "#2798ff" : "#0F172A")

        return (
          <div
            key={section.id}
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              transform: `translate(-50%, -50%) scale(${visual.scale})`,
              opacity: visual.opacity,
              color,
              fontSize: 16,
              fontWeight: isActive ? 600 : 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              pointerEvents: "auto",
            }}
          >
            {section.label}
          </div>
        )
      })}
    </motion.div>
  )
}

function computeRestPosition(rect: DOMRect) {
  const containerAspect = rect.width / rect.height
  const svgAspect = VIEWBOX_W / VIEWBOX_H
  const widthConstrained = containerAspect < svgAspect
  const machineScale = widthConstrained ? rect.width / VIEWBOX_W : rect.height / VIEWBOX_H
  const renderedW = VIEWBOX_W * machineScale
  const renderedH = VIEWBOX_H * machineScale
  const offsetX = (rect.width - renderedW) / 2
  const offsetY = (rect.height - renderedH) / 2
  const knobCenterX = rect.left + offsetX + KNOB_LOCAL_X * machineScale
  const knobCenterY = rect.top + offsetY + KNOB_LOCAL_Y * machineScale
  const restScale = (KNOB_DIAMETER * machineScale) / BASE_SIZE
  return {
    restLeft: knobCenterX,
    restTop: knobCenterY,
    restScale,
  }
}

function angularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

function depthOfField(distanceDeg: number): { opacity: number; scale: number } {
  // Bucket by exact 45° increments — labels are at fixed 45° intervals so distance
  // is always a multiple of 45.
  if (distanceDeg === 0) return { opacity: 1.00, scale: 1.00 }
  if (distanceDeg <= 45) return { opacity: 0.62, scale: 0.86 }
  if (distanceDeg <= 90) return { opacity: 0.34, scale: 0.74 }
  if (distanceDeg <= 135) return { opacity: 0.18, scale: 0.66 }
  return { opacity: 0.10, scale: 0.62 }
}
```

- [ ] **Step 2.2: Modify `components/sections/HeroSection.tsx`** — mount LabelRing.

Find line 7 (current Knob import):
```ts
import { Knob } from "@/components/Knob"
```

Add directly below:
```ts
import { LabelRing } from "@/components/LabelRing"
```

Find line 63:
```tsx
      <Knob containerRef={machineRef} />
```

Add directly below (sibling, same parent):
```tsx
      <LabelRing containerRef={machineRef} />
```

- [ ] **Step 2.3: Verify TypeScript**

```bash
./node_modules/.bin/tsc --noEmit
```
Expected: clean.

- [ ] **Step 2.4: Browser verification — positioning + depth-of-field**

`pnpm dev`, http://localhost:3000.

Verify:
- [ ] At rest (scrollY=0): labels are crowded around the small rest-state knob (this is expected because they share the parent's scale). They may visually overlap the knob — that's OK for Task 2; sweep entry hides them at rest in Task 5.
- [ ] At scrolled state (scrollY ≈ 800, desktop ≥1024): 8 labels visible around the morphed knob. YIKAT (basla) at 3 o'clock (right of knob center). HİZMETLER at 4:30 (down-right). NASIL at 6 o'clock. FİYATLAR at 7:30. NEDEN at 9 o'clock. YORUMLAR at 10:30. SORULAR at 12 o'clock. SİPARİŞ at 1:30.
- [ ] YIKAT (active hardcoded) is brightest, full size, brand blue.
- [ ] HİZMETLER and SİPARİŞ (adjacent, distance 45°) are dimmer, smaller, neutral color (#0F172A) — except SİPARİŞ which is brand color regardless (highlight: true).
- [ ] NEDEN (opposite, distance 180°) is the dimmest/smallest.
- [ ] At mobile (375px wide): labels still arranged around the knob's mobile destination (knob now half-clipped at top, labels overlap into hidden upper half — this is expected for Task 2; Task 7 fixes the semicircle remap).

If labels are positioned outside the visible orbit (e.g., off to the side, not orbiting the knob): position math is broken. Investigate the LABEL_RING_GAP arithmetic and the `cx/cy` formula before commit.

- [ ] **Step 2.5: Commit**

```bash
git add components/LabelRing.tsx components/sections/HeroSection.tsx
git commit -m "$(cat <<'EOF'
feat(label-ring): scaffold static LabelRing with depth-of-field

Mount a position:fixed sibling to Knob in HeroSection. Labels positioned at
fixed angles around the blended knob center using same DOMRect-tracked rest +
viewport-derived destination + eased blend chain that Knob uses. Active label
hardcoded to index 0 — IntersectionObserver wiring lands in Task 4.

Depth-of-field hierarchy applied statically: active = full opacity/scale,
neighbors dim, opposite ghost. SİPARİŞ always brand color. No animation.
EOF
)"
```

---

### Task 3: Wire stationary ring + verify position lock to morphed knob

**Goal:** This task is a no-op verification of Task 2's position math at the morphed destination. Confirm that as you scroll, the label ring travels with the knob exactly, and that labels do NOT rotate (stationary ring constraint).

**Why a separate task:** The hardcoded-active state hides any subtle position bugs that depend on which label is active (e.g., scale interpolation could shift label centers). Verify position lockstep BEFORE wiring active state, so any post-Task-4 weirdness can be attributed to the new wiring, not the position math.

**Files:** None modified. This is a verification-only task. **No commit unless a fix is needed.**

**Steps:**

- [ ] **Step 3.1: Slow-scroll lockstep test**

`pnpm dev`. Open DevTools, set CPU to 4× slowdown (Performance tab → CPU dropdown). Scroll the page very slowly using the trackpad. Watch the relationship between the label ring center and the knob center.

Verify:
- [ ] The label ring center stays exactly aligned with the knob center at every scrollY between 0 and 1000.
- [ ] No "label ring leads/lags knob" effect — the two move in perfect sync.
- [ ] Labels do NOT visually rotate as the page scrolls (only the knob's pointer/dot rotates; the ring of labels is stationary).
- [ ] Reset CPU throttling to "No throttling" before continuing.

- [ ] **Step 3.2: Resize-while-scrolled test**

Scroll to scrollY ≈ 500 (mid-morph or just past). With the page at that scroll position, drag the browser window resize handle from 1920px wide down to 375px wide.

Verify:
- [ ] Label ring repositions smoothly to the new knob center at every width.
- [ ] No visible "snap" or teleport when crossing the 1024px desktop/mobile boundary.

- [ ] **Step 3.3: If both checks pass, no commit.** Proceed to Task 4.

If either check fails: investigate the position math in LabelRing.tsx. Most likely cause is the `scale` MV — labels are positioned in BASE_SIZE units inside a parent that scales, so the parent's `scale` MV must match Knob's exactly. Verify by logging `scale.get()` in both components and comparing.

If a fix is needed, make a follow-up commit:
```bash
git add components/LabelRing.tsx
git commit -m "fix(label-ring): align position with knob at all scroll positions"
```

---

### Task 4: Wire `useActiveSection` + click navigation

**Goal:** Replace hardcoded `activeIndex = 0` with the live IntersectionObserver-based active section. Make labels clickable — clicking scrolls to the section and updates active state immediately.

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 4.1: Add imports + freezeRef + active state**

At the top of `LabelRing.tsx`, add to the React imports:
```tsx
import { type RefObject, useEffect, useRef, useState, useCallback } from "react"
```

Add after the existing imports:
```tsx
import { useActiveSection } from "@/hooks/use-active-section"
```

- [ ] **Step 4.2: Replace hardcoded active with hook**

Find this line in LabelRing:
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
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: "smooth" })
  window.setTimeout(() => {
    freezeRef.current = false
  }, 900)
}, [setActiveManual])
```

- [ ] **Step 4.3: Wire click handler + a11y on each label div**

In the `SECTIONS.map(...)` block, change the `<div>` to a `<button>` with the click handler. Find:

```tsx
return (
  <div
    key={section.id}
    style={{
      position: "absolute",
      left: cx,
      ...
    }}
  >
    {section.label}
  </div>
)
```

Replace with:

```tsx
return (
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
      fontSize: 16,
      fontWeight: isActive ? 600 : 500,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      pointerEvents: "auto",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
      font: "inherit",
      // Override font properties since `font: inherit` would reset our explicit ones above.
      // Re-declare explicitly to be safe:
    }}
  >
    {section.label}
  </button>
)
```

**Important:** because `font: inherit` resets all font shorthand properties, re-declare fontSize, fontWeight, letterSpacing AFTER it. Or remove `font: inherit` and accept browser button defaults — verify in step 4.5 that the typography looks correct either way.

- [ ] **Step 4.4: Remove `aria-hidden` from the parent**

Find on the parent motion.div:
```tsx
aria-hidden="true"
```

Remove it. The parent is no longer purely decorative — it contains interactive buttons.

- [ ] **Step 4.5: Verify TypeScript**

```bash
./node_modules/.bin/tsc --noEmit
```
Expected: clean.

- [ ] **Step 4.6: Browser verification — active tracking + click nav**

`pnpm dev`, http://localhost:3000.

Verify:
- [ ] At scrollY ≈ 800 (full morph), YIKAT (basla) is brightest because hero is the active section.
- [ ] Scroll down through page sections. As each section enters view, the corresponding label brightens and others dim. Specifically:
  - Reach #hizmetler section → HİZMETLER becomes active
  - Reach #nasil → NASIL becomes active
  - Reach #fiyatlar → FİYATLAR becomes active
  - …through all 8 sections
- [ ] Click any label (e.g., FİYATLAR). Page smooth-scrolls to the corresponding section. FİYATLAR becomes active immediately (no flash of wrong active during the smooth scroll).
- [ ] Wait ~1s after click. Scroll manually. Active tracking resumes (freezeRef released).
- [ ] Tab key cycles through all 8 labels (keyboard accessibility).
- [ ] Hovering each label with mouse shows pointer cursor.
- [ ] Screen reader (VoiceOver: Cmd+F5): announces each label with its `ariaLabel` and reads "current page" for the active one.

- [ ] **Step 4.7: Commit**

```bash
git add components/LabelRing.tsx
git commit -m "$(cat <<'EOF'
feat(label-ring): wire active section tracking + click navigation

Replace hardcoded active index with useActiveSection hook (IntersectionObserver).
Labels are now buttons; clicking scrolls to the section via scrollIntoView and
freezes the observer for 900ms so the manual active state isn't overridden
mid-scroll. aria-current on the active label, aria-label on each.
EOF
)"
```

---

### Task 5: Sweep entry animation

**Goal:** Labels fade from opacity 0 to their depth-of-field opacity over scrollY [120, 340], with eased radial stagger (label at angle 0° appears first, label at 180° last, stagger spans 30% of duration).

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 5.1: Add per-label sweep MV computation**

Inside the `SECTIONS.map((section, i) => {...})` body, BEFORE the `return` statement, compute the per-label sweep opacity. We need a useTransform per label. Since hooks can't go inside .map(), restructure: extract the per-label render into a child component that owns its own MVs.

Add at the bottom of `LabelRing.tsx` (below the existing helper functions):

```tsx
type LabelButtonProps = {
  section: typeof SECTIONS[number]
  isActive: boolean
  visual: { opacity: number; scale: number }
  color: string
  cx: number
  cy: number
  onClick: () => void
  scrollY: import("framer-motion").MotionValue<number>
  prefersReducedMotion: boolean
}

const SWEEP_START = MORPH_START                  // 120
const SWEEP_END = 340                            // 40px before MORPH_END
const SWEEP_DURATION = SWEEP_END - SWEEP_START   // 220
const STAGGER_FRACTION = 0.30
const STAGGER_WINDOW = SWEEP_DURATION * STAGGER_FRACTION  // 66
const PER_LABEL_DURATION = SWEEP_DURATION - STAGGER_WINDOW  // 154

function LabelButton({
  section, isActive, visual, color, cx, cy, onClick, scrollY, prefersReducedMotion,
}: LabelButtonProps) {
  const staggerOffset = angularDistance(section.angle, 0) / 180  // 0..1
  const appearStart = SWEEP_START + staggerOffset * STAGGER_WINDOW
  const appearEnd = appearStart + PER_LABEL_DURATION

  // Per-label sweep opacity 0..1, scroll-tied with cubic-bezier(0.22, 1, 0.36, 1)
  // Use useTransform with input/output arrays — apply easing manually.
  const sweepProgress = useTransform(scrollY, [appearStart, appearEnd], [0, 1], { clamp: true })
  const sweepEased = useTransform(sweepProgress, easeOutQuint)

  // Reduced-motion: sweep is skipped, labels appear at full final opacity.
  const finalOpacity = prefersReducedMotion
    ? visual.opacity
    : useTransform(sweepEased, (s) => s * visual.opacity)

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
        transform: `translate(-50%, -50%) scale(${visual.scale})`,
        opacity: finalOpacity,
        color,
        fontSize: 16,
        fontWeight: isActive ? 600 : 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        pointerEvents: "auto",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      {section.label}
    </motion.button>
  )
}

function easeOutQuint(t: number): number {
  // Approximation of cubic-bezier(0.22, 1, 0.36, 1) — quintic ease-out.
  return 1 - Math.pow(1 - t, 5)
}
```

**RULES OF HOOKS WARNING:** the conditional `prefersReducedMotion ? visual.opacity : useTransform(...)` violates rules of hooks (useTransform is called conditionally). Fix by ALWAYS calling useTransform, then choosing the value:

```tsx
const sweepedOpacity = useTransform(sweepEased, (s) => s * visual.opacity)
const finalOpacity = prefersReducedMotion ? visual.opacity : sweepedOpacity
```

- [ ] **Step 5.2: Refactor the map to use `<LabelButton>`**

Replace the existing `SECTIONS.map` block in the parent's return with:

```tsx
{SECTIONS.map((section, i) => {
  const isActive = i === activeIndex
  const dist = angularDistance(section.angle, SECTIONS[activeIndex].angle)
  const visual = depthOfField(dist)

  const knobRadiusInBase = BASE_SIZE / 2
  const ringRadiusInBase = knobRadiusInBase + LABEL_RING_GAP
  const angleRad = (section.angle * Math.PI) / 180
  const cx = BASE_SIZE / 2 + ringRadiusInBase * Math.cos(angleRad)
  const cy = BASE_SIZE / 2 + ringRadiusInBase * Math.sin(angleRad)

  const isHighlighted = section.highlight === true
  const color = isHighlighted ? "#2798ff" : (isActive ? "#2798ff" : "#0F172A")

  return (
    <LabelButton
      key={section.id}
      section={section}
      isActive={isActive}
      visual={visual}
      color={color}
      cx={cx}
      cy={cy}
      onClick={() => handleClick(i, section.id)}
      scrollY={scrollY}
      prefersReducedMotion={!!prefersReducedMotion}
    />
  )
})}
```

- [ ] **Step 5.3: Verify TypeScript**

```bash
./node_modules/.bin/tsc --noEmit
```
Expected: clean. If `prefersReducedMotion` typed as `boolean | null`, coerce with `!!` as shown above.

- [ ] **Step 5.4: Browser verification — sweep entry**

`pnpm dev`. Verify:
- [ ] At scrollY=0: all labels invisible (opacity 0).
- [ ] Scroll slowly past scrollY=120: labels start appearing. Label at angle 0° (basla/YIKAT) appears first, label at angle 180° (neden/NEDEN) appears last. Visible "sweep" effect.
- [ ] By scrollY=340, all labels fully visible at their depth-of-field opacity.
- [ ] Labels are at FULL VISIBLE POSITION, not still moving — by scrollY=340 the morph (which ends at 380) is still finishing, but labels are settled.
- [ ] Scroll up: sweep reverses (labels fade out in reverse order).
- [ ] Reduced-motion: page load → no sweep, labels appear instantly at depth-of-field opacities (active brightest, others dim per their bucket).

- [ ] **Step 5.5: Commit**

```bash
git add components/LabelRing.tsx
git commit -m "$(cat <<'EOF'
feat(label-ring): scroll-tied sweep entry with eased radial stagger

Each label fades from opacity 0 to its depth-of-field opacity over scrollY
[120, 340]. Labels at angle 0° appear first; labels at 180° appear last.
Stagger window is 30% of total duration. Easing approximates
cubic-bezier(0.22, 1, 0.36, 1) via easeOutQuint. Reduced-motion: sweep is
skipped; labels appear at static depth-of-field opacities from page load.

Refactored each label into a LabelButton subcomponent so per-label MVs satisfy
rules of hooks.
EOF
)"
```

---

### Task 6: Hover + click pulse animations

**Goal:**
- Hover: scale to 1.0, color to brand, opacity to 1.0, 180ms ease-out. Overrides depth-of-field.
- Click pulse: scale 1.0 → 0.94 → 1.0 over 220ms `cubic-bezier(0.4, 0, 0.2, 1)`. Skipped on reduced-motion.

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 6.1: Add hover + pulse state to `LabelButton`**

Inside `LabelButton`, before the return, add:

```tsx
const [isHovered, setIsHovered] = useState(false)
const [pulseKey, setPulseKey] = useState(0)
```

Modify the onClick handler to bump pulseKey before navigating:

```tsx
const handleClickWithPulse = () => {
  if (!prefersReducedMotion) {
    setPulseKey((k) => k + 1)  // re-trigger animation by changing key
  }
  onClick()
}
```

- [ ] **Step 6.2: Use motion.button's `animate` for pulse, `whileHover` for hover**

Replace the existing motion.button with:

```tsx
<motion.button
  type="button"
  onClick={handleClickWithPulse}
  onPointerEnter={() => setIsHovered(true)}
  onPointerLeave={() => setIsHovered(false)}
  aria-label={section.ariaLabel}
  aria-current={isActive ? "true" : undefined}
  initial={false}
  animate={
    prefersReducedMotion
      ? undefined
      : { scale: [1.0, 0.94, 1.0] }
  }
  transition={
    prefersReducedMotion
      ? undefined
      : { duration: 0.22, times: [0, 0.5, 1], ease: [0.4, 0, 0.2, 1] }
  }
  key={pulseKey}  // re-mount on click triggers the pulse animation
  style={{
    position: "absolute",
    left: cx,
    top: cy,
    // Apply depth-of-field scale at the WRAPPER level via a CSS transform
    // separate from the framer-motion scale animation.
    // ... (see step 6.3 below for the scale composition trick)
  }}
>
  ...
</motion.button>
```

The complication: depth-of-field uses CSS `transform: scale(visual.scale)`, but the click pulse uses framer-motion's `scale` animation. These conflict (last-applied wins). Fix by using a wrapper:

- [ ] **Step 6.3: Wrap the button in a div for depth-of-field scale, animate scale on the button itself**

Restructure:

```tsx
const hoverScale = isHovered ? 1.0 : visual.scale
const hoverOpacity = isHovered ? 1.0 : (
  prefersReducedMotion ? visual.opacity : sweepedOpacity
)
const hoverColor = isHovered ? "#2798ff" : color

return (
  <motion.button
    type="button"
    onClick={handleClickWithPulse}
    onPointerEnter={() => setIsHovered(true)}
    onPointerLeave={() => setIsHovered(false)}
    aria-label={section.ariaLabel}
    aria-current={isActive ? "true" : undefined}
    style={{
      position: "absolute",
      left: cx,
      top: cy,
      transformOrigin: "center",
      // The composed transform: translate to center + depth-of-field scale + click pulse scale
      // We'll use motion's `style.scale` for hover/depth-of-field, and `animate.scale` for pulse.
      x: "-50%",
      y: "-50%",
      scale: hoverScale,
      opacity: hoverOpacity,
      color: hoverColor,
      fontSize: 16,
      fontWeight: isActive ? 600 : 500,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      pointerEvents: "auto",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
      transition: prefersReducedMotion ? "none" : "scale 0.18s ease-out, color 0.18s ease-out, opacity 0.18s ease-out",
    }}
    animate={
      prefersReducedMotion
        ? undefined
        : { scale: [hoverScale, hoverScale * 0.94, hoverScale] }
    }
    transition={
      prefersReducedMotion
        ? undefined
        : { duration: 0.22, times: [0, 0.5, 1], ease: [0.4, 0, 0.2, 1] }
    }
    key={pulseKey}
  >
    {section.label}
  </motion.button>
)
```

**Note:** the `animate` `scale: [hoverScale, hoverScale * 0.94, hoverScale]` and the `style.scale: hoverScale` would conflict. framer-motion's `animate` takes precedence when an `animate` prop is present. The `key={pulseKey}` change re-mounts the component, replaying the animation from scratch each click.

This is delicate — verify carefully in step 6.5.

- [ ] **Step 6.4: Verify TypeScript**

```bash
./node_modules/.bin/tsc --noEmit
```
Expected: clean.

- [ ] **Step 6.5: Browser verification — hover + click pulse**

`pnpm dev`. Verify at scrollY ≈ 800 (full morph):
- [ ] Hover any non-active label (e.g., NASIL while basla is active). It scales up to 1.0, color shifts to brand blue, opacity goes to 1.0. Smooth 180ms transition.
- [ ] Hover SİPARİŞ. Color is already brand; only scale and opacity change.
- [ ] Move mouse off label. It returns to its depth-of-field state (180ms transition).
- [ ] Click any label. Brief pulse animation (~220ms) — quick squish then return. THEN the page scrolls smoothly to the section.
- [ ] Pulse skipped on reduced-motion. Click goes straight to navigation, no scale animation.
- [ ] Hover transitions skipped on reduced-motion (instant change).

If pulse and hover don't compose cleanly (e.g., pulse scale doesn't go relative to hover scale), iterate on step 6.3's animate block. The locked spec is "1.0 → 0.94 → 1.0" — at hover state, "1.0" is the hover-scaled size, so pulse scales from hover-1.0 to hover-0.94 to hover-1.0. Mathematically: `[hoverScale, hoverScale * 0.94, hoverScale]`.

- [ ] **Step 6.6: Commit**

```bash
git add components/LabelRing.tsx
git commit -m "$(cat <<'EOF'
feat(label-ring): hover scale-to-active + click pulse animation

Hover any non-active label: scale → 1.0, color → brand, opacity → 1.0,
180ms ease-out, fully overrides depth-of-field. SİPARİŞ on hover: scale +
opacity change only (color is already brand per highlight: true).

Click pulse: scale 1.0 → 0.94 → 1.0 over 220ms cubic-bezier(0.4, 0, 0.2, 1).
Re-triggered each click via key bump. Skipped on reduced-motion (click goes
straight to navigation).
EOF
)"
```

---

### Task 7: Mobile semicircle remap

**Goal:** When viewport.w < DESKTOP_BREAKPOINT (1024), remap each label's angle from full-circle to bottom-semicircle so all 8 labels fit below the half-clipped knob.

Linear formula: `mobileAngle = 180 - (desktopAngle / 360) * 180`

Anchors satisfied:
- basla (0°) → 180° (9 o'clock)
- neden (180°) → 90° (6 o'clock)
- siparis (315°) → 22.5° (close to 3 o'clock)

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 7.1: Add `effectiveAngle` computation**

In the parent `LabelRing` component, just before the `SECTIONS.map`, the value `isDesktop` is already in scope from the viewport effect. Inside the map, replace this line:

```tsx
const angleRad = (section.angle * Math.PI) / 180
```

With:

```tsx
const effectiveAngle = isDesktop ? section.angle : toMobileAngle(section.angle)
const angleRad = (effectiveAngle * Math.PI) / 180
```

Add the helper at the bottom of the file:

```tsx
function toMobileAngle(desktopAngle: number): number {
  return 180 - (desktopAngle / 360) * 180
}
```

Also: angular-distance for depth-of-field needs to use effective angles (otherwise on mobile, "adjacent" would be wrong):

Replace:
```tsx
const dist = angularDistance(section.angle, SECTIONS[activeIndex].angle)
```

With:
```tsx
const activeEffective = isDesktop
  ? SECTIONS[activeIndex].angle
  : toMobileAngle(SECTIONS[activeIndex].angle)
const dist = angularDistance(effectiveAngle, activeEffective)
```

**Important:** sweep-stagger anchor inside `LabelButton` also references `section.angle`:
```tsx
const staggerOffset = angularDistance(section.angle, 0) / 180
```

Pass `effectiveAngle` as a new prop to `LabelButton` instead of recomputing, so the stagger anchor on mobile uses the remapped angles too. Update the prop type and the parent's render to pass `effectiveAngle`.

- [ ] **Step 7.2: Verify TypeScript**

```bash
./node_modules/.bin/tsc --noEmit
```
Expected: clean.

- [ ] **Step 7.3: Browser verification — mobile semicircle**

DevTools → device toolbar → 375×667 (iPhone SE). Reload page. Scroll to scrollY ≈ 800 (full morph). Knob should be half-clipped at top of viewport.

Verify the visible bottom semicircle:
- [ ] basla (YIKAT) at 9 o'clock (left side of knob, on or near the left edge of the visible knob radius).
- [ ] hizmetler (HİZMETLER) between 9 and 7:30.
- [ ] nasil (NASIL) between 7:30 and 6.
- [ ] fiyatlar (FİYATLAR) between 6 and 4:30.
- [ ] neden (NEDEN) at 6 o'clock (directly below knob center).
- [ ] yorumlar (YORUMLAR) between 6 and 4:30 (right of NEDEN).
- [ ] sss (SORULAR) between 4:30 and 3.
- [ ] siparis (SİPARİŞ) at 3 o'clock (right side, near the right edge of the visible knob radius). Brand color.
- [ ] All 8 labels visible below the knob; none clipped above the viewport.
- [ ] Sweep entry still works (basla appears first, neden last) on mobile.
- [ ] Click navigation still works.

Resize from 375 → 1024 → 1280. Verify the angles snap back to full circle when crossing the 1024 threshold.

If any label is positioned above the visible viewport (i.e., the formula put it in the upper semicircle), the formula is inverted. Try `mobileAngle = (desktopAngle / 360) * 180` instead and re-verify.

If labels are too close to the knob edge on mobile (cramped because mobile knob is smaller), increase `LABEL_RING_GAP` to 24 — but only if visually warranted, not preemptively.

- [ ] **Step 7.4: Commit**

```bash
git add components/LabelRing.tsx
git commit -m "$(cat <<'EOF'
feat(label-ring): mobile semicircle remap (basla 9 o'clock, siparis 3 o'clock)

Below DESKTOP_BREAKPOINT (1024px), the knob is half-clipped at the top edge
of the viewport. Remap each label's angle from full-circle to bottom-semicircle
so all 8 labels fit in the visible half below the knob.

Formula: mobileAngle = 180 - (desktopAngle / 360) * 180
Anchors: basla → 180° (9 o'clock), neden → 90° (6 o'clock), siparis → ~22.5°
(close to 3 o'clock).

Depth-of-field and sweep-stagger angles also use effective (mobile-remapped)
angles, so adjacency relationships and entry order match the visible layout.
EOF
)"
```

---

### Task 8: Reduced-motion final pass + accessibility audit

**Goal:** Verify all reduced-motion gates work end-to-end. Add any missed `prefers-reduced-motion` branches. Final keyboard + screen-reader check.

**Files:** Possibly `components/LabelRing.tsx` if any gates are missing.

**Steps:**

- [ ] **Step 8.1: Reduced-motion end-to-end test**

DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Reload.

Verify:
- [ ] Page load: labels visible immediately at their depth-of-field opacities (no sweep).
- [ ] Scroll: depth-of-field updates instantly when active section changes (no 280ms crossfade — this is implicit because we don't have an explicit transition on the static depth-of-field props in style; verify in DevTools that no transition is applied).
- [ ] Hover: instant (no 180ms transition).
- [ ] Click: navigation happens, no pulse.
- [ ] Knob morph also held at rest (already verified in Task 1).

If you see any animation that should be skipped: trace it back, add a `prefersReducedMotion` gate, commit a fix as a separate step.

- [ ] **Step 8.2: Keyboard navigation**

Disable reduced-motion. Reload. Press Tab.

Verify:
- [ ] Tab key moves focus through site nav, then through LabelRing buttons (in source order: basla, hizmetler, nasil, fiyatlar, neden, yorumlar, sss, siparis).
- [ ] Visible focus ring on each label (browser default is fine — if absent, add `outline: 2px solid #2798ff; outline-offset: 4px` on `:focus-visible`).
- [ ] Enter or Space triggers click (smooth-scroll to section).

If focus ring is missing: add a `:focus-visible` style. This is a small addition — make a follow-up commit.

- [ ] **Step 8.3: VoiceOver / NVDA**

macOS: Cmd+F5 to enable VoiceOver.

Verify:
- [ ] Each label is announced with its full ariaLabel (e.g., "Hizmetler bölümüne git, button").
- [ ] The active label is announced as "current page" (or equivalent, depending on screen reader).
- [ ] Tab order matches source order; no traps.

- [ ] **Step 8.4: Final cross-breakpoint regression check**

Resize through: 375 → 480 → 768 → 1024 → 1280 → 1920. At each width, scroll from 0 to past full morph. Verify:
- [ ] Knob morph still works (Task 1's no-op assumption holds).
- [ ] LabelRing tracks knob center at every scrollY.
- [ ] Sweep entry, depth-of-field, hover, click all work.
- [ ] Mobile semicircle activates below 1024, full circle activates at 1024+.
- [ ] No console errors.
- [ ] No layout shift (CLS = 0 in Lighthouse Performance audit, if you run one).

- [ ] **Step 8.5: TypeScript + production build**

```bash
./node_modules/.bin/tsc --noEmit
pnpm build
```
Expected: clean tsc, build succeeds with zero errors. (Build warnings about pre-existing issues unrelated to LabelRing are fine.)

- [ ] **Step 8.6: Commit (only if any fixes were needed in steps 8.1–8.4)**

If any reduced-motion gate or focus-ring or other a11y polish was added in this task:

```bash
git add components/LabelRing.tsx
git commit -m "$(cat <<'EOF'
fix(label-ring): a11y + reduced-motion polish

[describe specific fixes made]
EOF
)"
```

If no fixes were needed (all gates already worked from prior tasks): no commit. The verification itself is the deliverable.

---

## Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Knob.tsx regression from constant hoist (Task 1) | Low | High (breaks already-validated morph) | Frontload as Task 1 with explicit pixel-identity verification before any LabelRing work. |
| Hover/pulse scale composition conflict (framer-motion `style.scale` vs `animate.scale`) | Medium | Medium (jittery clicks) | Step 6.3 uses motion.button with `key={pulseKey}` re-mount pattern. Iterate in browser if first composition is wrong. |
| Mobile angle remap formula inverted (labels appear above viewport) | Medium | Medium (mobile broken) | Step 7.3 verifies all 8 positions explicitly. If inverted, swap formula. |
| Sweep entry feels janky during fast scroll (eased stagger + crossfade overlap) | Medium | Low (subjective) | Default 280ms crossfade. If user reports jank, reduce to 200ms in a follow-up commit. |
| Rules-of-hooks violation in LabelButton (conditional useTransform) | High initially | Build-time fail | Step 5.1 explicitly calls out the gotcha and the fix (always call useTransform, then choose value). |
| Active section observer races with click navigation | Low | Medium (wrong active during scroll) | freezeRef pattern (900ms freeze after click) inherited from existing useActiveSection design. |
| Position MV duplication between Knob and LabelRing drifts apart over time | Low | Low (two source-of-truths) | Task 1 hoist of constants prevents the most error-prone duplication (magic numbers). MV chain logic is identical and contained — review each future change to ensure both files update together. Document in commit message of Task 2. |

## Scope boundary (hard)

- **Do NOT touch `components/SiteNav.tsx`** — it stays at z-50 and continues to render its existing 4 links + CTA. Visual divergence between SiteNav and LabelRing is intentional (SiteNav = utility chrome, LabelRing = page-nav metaphor).
- **Do NOT alter Knob's morph behavior** — Task 1 is the only allowed Knob.tsx modification, and it must be a pure constant-import refactor with zero pixel difference.
- **Do NOT add new sections, change section ordering, or modify `lib/sections.ts`** — the 8 sections are immutable for this work.
- **Do NOT add new dependencies.** Everything in this plan uses framer-motion v11, React 19, and Tailwind, all of which are already in the project.

## Rollback plan

Each task is a single commit. To roll back:

- **After Task 1 commit** but no further: `git revert HEAD` removes the constant hoist. (Or `git reset --hard HEAD~1` if local-only and safer to reset.)
- **After Tasks 2–8:** `git revert <task-commit-sha>` reverts that specific task. LabelRing is a NEW component plus a one-line HeroSection mount — reverting the Task 2 commit removes both cleanly.
- **Full feature rollback:** `git revert <task-1-sha>..<final-task-sha>` reverts the entire feature. Knob.tsx returns to its pre-Task-1 state. LabelRing.tsx + lib/knob-geometry.ts no longer exist.

If a follow-up commit (from Important reviewer findings) needs to be reverted independently of the parent task, use a targeted revert.

## Self-review

Spec coverage check:

- [x] Architecture: Candidate A — Tasks 1–2 (hoist + sibling LabelRing).
- [x] Stationary ring: Task 2 (no rotation prop on LabelRing) + Task 3 (verification).
- [x] Mobile semicircle: Task 7 (remap formula).
- [x] Sweep entry animation: Task 5.
- [x] SiteNav coexists: scope boundary hard rule + z-40 in Task 2.
- [x] z-40: Task 2 (zIndex: 40 on parent motion.div).
- [x] Depth-of-field opacity/scale: Task 2 (depthOfField helper) + lookup table in spec.
- [x] Crossfade 280ms: Implicit via React state-change → CSS transition. **Gap:** I did not explicitly add `transition: opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)` to the depth-of-field opacity. Need to add this in Task 4 step 4.3 (alongside the button styles): `transition: opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1), color 0.28s cubic-bezier(0.4, 0, 0.2, 1)` (skipped on reduced-motion). **Fix inline below.**
- [x] Typography sizes/weights/colors: Task 2 baseline; per-bucket sizing via depthOfField extension. **Gap:** depthOfField only returns opacity + scale, not fontSize. The spec's per-bucket fontSize table (16/14/13/12/12) is not implemented. Need to extend depthOfField to return fontSize too, per desktop/mobile. **Fix inline below.**
- [x] Letter-spacing 0.04em: Task 2 inline style.
- [x] Hover spec: Task 6.
- [x] Active no-marker: Task 2 (no marker rendered).
- [x] Click pulse: Task 6.
- [x] Reduced-motion: Tasks 5, 6 inline gates + Task 8 audit.
- [x] aria-current, aria-label, keyboard nav: Tasks 4, 8.
- [x] Mobile angle remap: Task 7.

**Inline fixes below.** I'm fixing the two gaps identified above directly in the plan rather than re-rendering everything.

### Inline fix #1 — depth-of-field crossfade transition (Task 4 + 6 update)

When restyling buttons in Task 4 step 4.3 and Task 6 step 6.3, include this in the button's style block:

```tsx
transition: prefersReducedMotion
  ? "none"
  : "opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1), color 0.28s cubic-bezier(0.4, 0, 0.2, 1), scale 0.18s ease-out",
```

This gives:
- 280ms crossfade on opacity changes (depth-of-field active-section transitions).
- 280ms crossfade on color (active brand-blue transitions).
- 180ms ease-out on scale (hover transitions).
- All disabled in reduced-motion.

**Note:** the click-pulse animation (Task 6) uses `animate` + `key={pulseKey}` which bypasses the CSS transition. Both can coexist — the framer-motion `animate` takes precedence during the 220ms pulse window, then CSS transition handles return-to-rest.

### Inline fix #2 — per-bucket fontSize (Task 2 update)

Extend `depthOfField` in Task 2 step 2.1 to return fontSize for both desktop and mobile:

```tsx
function depthOfField(distanceDeg: number, isDesktop: boolean): {
  opacity: number; scale: number; fontSize: number
} {
  const desktop = isDesktop
  if (distanceDeg === 0) {
    return { opacity: 1.00, scale: 1.00, fontSize: desktop ? 16 : 13 }
  }
  if (distanceDeg <= 45) {
    return { opacity: 0.62, scale: 0.86, fontSize: desktop ? 14 : 12 }
  }
  if (distanceDeg <= 90) {
    return { opacity: 0.34, scale: 0.74, fontSize: desktop ? 13 : 11 }
  }
  if (distanceDeg <= 135) {
    return { opacity: 0.18, scale: 0.66, fontSize: desktop ? 12 : 10 }
  }
  return { opacity: 0.10, scale: 0.62, fontSize: desktop ? 12 : 10 }
}
```

Update the call site in the parent and pass `isDesktop`:

```tsx
const visual = depthOfField(dist, isDesktop)
```

Update the button's `style.fontSize`:

```tsx
fontSize: visual.fontSize,
```

(Replaces the hardcoded `fontSize: 16` from the original Task 2 code.)

This needs to apply to Task 2's scaffolded version AND propagate through Tasks 4, 5, 6.

---

## Type consistency check

- `useActiveSection(freezeRef?: MutableRefObject<boolean>) → [number, (i: number) => void]` — matches the hook's existing signature in `hooks/use-active-section.ts`.
- `SECTIONS` type: `readonly Section[]` from `lib/sections.ts`. Each entry has `{id, label, ariaLabel, angle, highlight?, emoji?, number?}`.
- `motion.button` accepts standard HTML button props plus framer-motion's `animate`, `transition`, `initial`, `style.scale`, etc.
- `useReducedMotion()` returns `boolean | null`. Coerce with `!!` where strict `boolean` is needed.
- `useTransform([MV, MV, MV], ([r, d, p]: number[]) => …)` — must use `number[]` not tuple typing (validated in Task 5 of 2.4b knob-morph plan).

All consistent. Plan complete.
