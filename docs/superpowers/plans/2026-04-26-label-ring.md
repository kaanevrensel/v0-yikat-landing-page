# Task 2.4c — Label Ring (REVISED v3: 3-label window + fixed knob pointer + pixelation deep dive)

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` (or `superpowers:executing-plans`). Steps use `- [ ]` checkboxes.

## Revision history

- **v1** (committed `7a0dc86`): stationary ring with depth-of-field. Tasks 1, 2 shipped.
- **v2** (committed `f42ac34`): rotating ring with separate marker tick + continuous proximity falloff. Tasks 3, 4 shipped.
- **v3 (this file)**: knob pointer IS the marker (drop separate tick). 3-label window emerges naturally from a continuous angular-distance function (opacity hits 0 at distance ≥ 90°, so only labels within ±90° render). Knob pixelation revisited — 4337e14's solid-fill swap was incomplete; second deep dive needed.

## Goal

Three labels are visible around the morphed knob at any moment — the active section's label at the knob's white pointer (3 o'clock desktop / 6 o'clock mobile), the previous section one slot back (45° earlier), the next section one slot forward (45° later). All other labels render at 0 opacity. As the user scrolls, the ring rotates so the new active label arrives at the pointer; per-label visibility/scale/color/weight are continuous functions of angular distance from the pointer. Knob pointer is the marker — no separate marker tick. Knob fill is genuinely smooth (no banding) at all scales. Reduced-motion users get a snap-to-active fallback.

## Architecture

Same Candidate A skeleton — sibling LabelRing overlay + `lib/knob-geometry.ts` shared constants. The rotating-ring math from Task 4 (commit `1623f39`) is RETAINED verbatim — `computeRingRotation`, `shortestSignedAngle`, `easeInOutCubic`, the bracket-finding loop, `ringRotation` MV. The 3-label-window effect rides on top: each `LabelButton` derives a per-label `currentDistance` MV from `ringRotation`, and all visual properties (opacity, scale, color, font-weight) are continuous functions of `|currentDistance|`. Beyond ±90°, opacity = 0 — that's the "hidden" zone. Knob.tsx loses its scroll-driven rotation and gains a static pointer rotation derived from `isDesktop`; the white pointer rect becomes the marker.

## Tech stack

Next.js 16 + React 19, framer-motion v11, TypeScript strict, Tailwind, `useActiveSection` hook.

---

## Done so far (DO NOT REDO)

| SHA | Title | Status notes |
|---|---|---|
| `a771b4d` | refactor(knob): hoist geometry constants to lib/knob-geometry.ts | Stable. |
| `fe0b448` | feat(label-ring): scaffold static LabelRing with depth-of-field | DOF helpers removed in Task 4. |
| `5b68ffe` | fix(label-ring): remove dead pointer-events on aria-hidden labels + collapse color ternary | Stable. |
| `4337e14` | fix(knob): replace gradient fills with solid colors to eliminate banding at scale | **Incomplete — v3 Task 5 revisits** (banding still visible per user). |
| `6ab9aee` | feat(label-ring): wire active section tracking + click navigation | Stable. |
| `2013489` | fix(label-ring): clear freeze timer on click + unmount, add focus-visible ring | Stable. |
| `1623f39` | feat(label-ring): rotating ring with scroll-tied rotation interpolation | Stable. ringRotation math + LabelButton subcomponent ride into v3 unchanged. |
| `12c047c` | fix(label-ring): robust sectionTops re-measure + cheaper reduced-motion ring rotation | Stable. |

---

## Locked spec (UX consult 2026-04-26 v3)

### Design thesis (updated)

The knob is a physical control. Its white pointer at 3 o'clock IS the active-section marker — there is no separate tick, no second indicator. Three labels are visible at any moment — the active label at the pointer, the previous label one slot back, the next label one slot forward. Other labels are hidden. The 3-label visibility EMERGES from a single continuous function `f(|angularDistance|)` rather than discrete bucketing — opacity hits 0 at ±90°, and since labels are 45° apart, only the active and its two immediate neighbors are non-zero. The math stays elegant; the visual behaves as the user expects from a physical dial.

### 1. Knob pointer is the marker (drop separate tick)

The white pointer rect in Knob.tsx is currently the rotating indicator (scroll-tied 0→1080° from morph plan Task 5, commit `5502f49`). v3:

- Pointer becomes static. Position: `pointerSvgAngle = (MARKER_ANGLE + 90) % 360` clockwise from 12 o'clock origin → 90° on desktop (lands at 3 o'clock), 180° on mobile (lands at 6 o'clock).
- All four shapes inside the rotating group (R_BODY, R_TOP, R_DOT, pointer rect) use the same static rotation. Removing rotation visually changes nothing for the three concentric circles — only the pointer rect moves.
- **Pointer pulse on active section change:** `opacity: 1.0 → 0.7 → 1.0` over 200ms ease-out. Fired ONLY when `activeIndex` changes (not on every scroll tick). Reinforces "this is the selection mechanism." Reduced-motion: skip the pulse.
- Drop `MARKER_GAP`, `MARKER_LENGTH`, `MARKER_WIDTH` constants from `lib/knob-geometry.ts` — no separate tick.

### 2. Ring rotation (retained from v2)

Scroll-progress-tied continuous interpolation. easeInOutCubic per-bracket. Shortest angular path. **No changes from `1623f39`.** The `computeRingRotation` function and `ringRotation` MV stand as shipped.

### 3. Per-label visual values — continuous function of angular distance

For each label, compute its CURRENT angular position relative to the marker:

```ts
const labelDistance = useTransform(ringRotation, (r) =>
  shortestSignedAngle(markerAngle, section.angle + r)
)
```

`labelDistance` is signed in `(-180°, 180°]`. Use `|labelDistance|` for symmetric falloff. All visual properties derive from this single MV.

**Concrete values per the UX consult:**

| `|distance|` | opacity | scale | font-weight | color |
|---|---|---|---|---|
| 0° (active) | 1.0 | 1.0 | 600 | `#2798ff` |
| 45° (prev/next) | 0.55 | 0.78 | 500 | `#0F172A` |
| 90° (boundary) | 0 | 0.78 | 500 | `#0F172A` |
| > 90° (hidden) | 0 | 0.78 | 500 | `#0F172A` |

**Curves between anchor points:**
- `opacity = easeOutQuad(1 - clamp(|distance|/90, 0, 1)) * (1 - 0.45 * clamp(|distance|/45, 0, 1))` — actually simpler: `opacity = easeOutQuad(1 - clamp(|distance|/90, 0, 1))` interpolating 1.0 → 0 over 0° → 90°. The 0.55 at 45° is what easeOutQuad(0.5) gives (~0.75) — we adjust the curve shape so 45° lands exactly at 0.55. Use `opacity = clamp(1 - (|distance|/90)^2, 0, 1) * 0.55 * 2` — no, simpler: pre-compute three anchor points and interpolate. **Implementation: piecewise — for `|distance| <= 45°`, lerp 1.0 → 0.55 over 0°→45° with easeOutQuad. For `45° < |distance| <= 90°`, lerp 0.55 → 0 over 45°→90° with easeOutQuad. For `> 90°`, return 0.** This honors the UX consult's anchor values exactly.
- `scale = lerp(1.0, 0.78, easeInOutCubic(clamp(|distance|/90, 0, 1)))` — single curve over 0°→90°, clamps to 0.78 beyond.
- `font-weight`: snap-flip — `|distance| <= 22.5` → 600, else 500. Smooth font-weight interpolation requires a variable font; we don't have that confirmed. Snap is fine since opacity also drops.
- `color`: threshold flip at `|distance| <= 15°` → `#2798ff`, else `#0F172A`. Per UX consult: "color shift lands ~70% through the rotation, not at the end, so the label feels claimed before it geometrically arrives." 15° is 1/3 of the 45° prev→active arc.

**SİPARİŞ override:** the section with `highlight: true` always uses `#2798ff` regardless of distance — already honored in current code (`isHighlighted || isActive`). Update to `isHighlighted || isCloseToActive`.

### 4. Micro-treatment on active arrival

When `activeIndex` changes (a new section becomes active):

- **Weight pulse on the new active label:** brief weight bump 600 → 680 → 600 over 280ms with `cubic-bezier(0.34, 1.56, 0.64, 1)`. Implementation: a separate "pulse" CSS animation triggered by toggling a class when `activeIndex` flips. Skip on reduced-motion.
- **Pointer pulse:** see §1.
- **No scale bump** on the label (scale already animates from rotation — doubling up looks busy).
- **No color flash, no underline.**

### 5. No overshoot on rotation

Land cleanly. No spring. Rotation is scroll-tied — overshoot would imply physics scrollY doesn't have, and on slow scrolls the label would oscillate awkwardly past the pointer mid-gesture. (UX consult #4.)

### 6. Reduced-motion fallback (UX consult #8)

Snap-to-active:
- Ring rotation locked to the discrete target for the current `activeIndex` (already implemented in `1623f39` + `12c047c` via `ringRotationDiscrete`).
- Active label renders at the pointer slot at full opacity/scale/color.
- Prev/next labels render at their fixed angular positions for the current active, at the same prev/next visual values (opacity 0.55, scale 0.78).
- All other labels stay hidden.
- When `activeIndex` changes (e.g., user clicks a label or scrolls fast across multiple sections), labels swap their content with a 120ms opacity crossfade — within reduced-motion etiquette since opacity isn't vestibular.
- No micro-treatments (skip both pulses).

### 7. Knob pixelation (high priority — second attempt)

`4337e14` replaced two `<linearGradient>` defs with solid fills (`#3286E7` body, `#3F93F2` top). User reports banding still visible. Multi-hypothesis investigation in Task 5.

**Most likely culprits, in order:**

1. **Two-tone discontinuity reads as a band.** Two concentric circles with similar blues create a sharp circular boundary. At ~600px rendered diameter, the eye perceives the inner circle's edge as a "band" rather than a designed feature.
2. **GPU compositing artifact from `willChange: transform`.** Knob has `willChange: "transform"` which forces a separate compositor layer. At large scales, layer downscaling can introduce visible banding/blur. (The pointer rotation removal in Task 6 incidentally tests this — fewer per-frame transform updates.)
3. **SVG sub-pixel rendering at scale.** The 500-unit viewBox is downscaled/upscaled to match a ~600+ px rendered diameter. SVG anti-aliasing at fractional pixel boundaries can produce visible artifacts.
4. **Color quantization in the display pipeline.** 8-bit RGB precision can show banding on large flat areas, especially with subtle gradients (less likely now since we use solid fills).

**Fix candidates (Task 5 picks one based on screenshot diagnosis):**

- **A:** Eliminate the two-tone — single solid `#3286E7` for the entire knob body, drop the inner R_TOP circle.
- **B:** Make R_TOP and R_BODY identical color — same effect as A but keeps the structural element.
- **C:** Increase the contrast between R_BODY and R_TOP so the boundary reads as an intentional ring, not a banding step.
- **D:** Remove `willChange: "transform"` and verify GPU compositing is no longer a factor.
- **E:** Increase BASE_SIZE / viewBox precision to give SVG more sub-pixel headroom.
- **F:** Add `shape-rendering="geometricPrecision"` and/or `image-rendering: optimizeQuality` CSS hints.
- **G:** Apply a subtle SVG noise filter (`<feTurbulence>` + `<feComposite>`) over the body to dither out perceived banding.

If multiple hypotheses contribute, multiple fixes can stack. Task 5 is explicitly an investigation-then-fix task with documented results.

### 8. Visibility gate on morph (retained from v2)

Ring opacity 0 below `morphProgress = 0.85`, fades to 1.0 by `morphProgress = 1.0`. Hides the ring while the knob is still in the machine's control panel. Implemented in Task 8.

---

## File structure

| File | Role |
|---|---|
| `lib/knob-geometry.ts` | Shared constants. v3: removes `MARKER_GAP/LENGTH/WIDTH` (no separate tick) and `OPACITY_FALLOFF_DEG/EXPONENT` (no continuous falloff formula — replaced by piecewise). Keeps everything else. |
| `components/Knob.tsx` | Removes scroll-driven rotation (Task 6). Adds static pointer rotation by `isDesktop`. Adds pointer pulse on `activeIndex` change. Pixelation fix (Task 5). |
| `components/LabelRing.tsx` | LabelButton refactored to receive its angular distance MV and derive all visual props from it (Task 7). Adds visibility gating (Task 8). RM fallback already in place; final pass in Task 9. |
| `hooks/use-active-section.ts` | Untouched. (Pre-existing observer-dep nit flagged by code-quality reviewer remains as a separate cleanup item — out of label-ring scope.) |

---

## Tasks

### Task 5: Knob pixelation deep investigation + fix [HIGH PRIORITY]

**Goal:** Identify the actual cause of the banding visible on the morphed knob (user has flagged this twice — `4337e14` was incomplete) and ship a fix that holds up to a high-quality screenshot at the scrolled state.

**Why this is first:** the user has flagged this twice and explicitly said "do not declare it fixed if you can still see banding in a high-quality screenshot." Front-load the risk.

**Files:**
- Modify: `components/Knob.tsx`
- Possibly modify: `lib/knob-geometry.ts` (if BASE_SIZE bump is part of the fix)

**Steps:**

- [ ] **Step 5.1: Capture baseline.** Take a high-quality (non-JPEG) screenshot of the current knob at scrolled state (scroll past `MORPH_END = 380`) at viewport ~1440×900. Open in an image viewer at 200% zoom and document what's visible — is the inner R_TOP circle's edge perceived as banding? Are circle edges stair-stepped? Are there horizontal/vertical color stripes (GPU artifact)?

- [ ] **Step 5.2: Hypothesis triage.** Run these tests in the browser dev tools, one at a time, observing the knob between each:
  1. Toggle off `willChange: "transform"` on the parent motion.div. Does banding change?
  2. Set R_TOP fill to match R_BODY (`#3286E7`). Does banding disappear?
  3. Add `shape-rendering="geometricPrecision"` to the `<svg>` element. Does banding change?
  4. Apply `image-rendering: optimizeQuality` to the parent motion.div. Does banding change?

  Document which test(s) made a visible difference. The result drives the fix choice.

- [ ] **Step 5.3: Pick fix path.** Based on Step 5.2 results:
  - **If two-tone is the culprit (test 2 fixed it):** apply Fix B — make R_TOP and R_BODY identical color (`#3286E7`). Removes the discontinuity without changing structure. Optionally remove the R_TOP circle entirely (Fix A) — leaner SVG.
  - **If GPU compositing is the culprit (test 1 fixed it):** remove `willChange: "transform"` from the parent motion.div. Verify performance is acceptable (the morph is still smooth). If perf regresses, apply `transform: translate3d(0,0,0)` to keep the layer without `willChange`.
  - **If SVG sub-pixel is the culprit (test 3 or 4 helped):** add `shape-rendering="geometricPrecision"` (cheap, safe). If still visible, bump BASE_SIZE to 1000 (and update viewBox accordingly) for higher precision.
  - **If multiple contribute:** stack the fixes in this priority order: Fix B (cleanest), then Fix D (perf-neutral), then Fix F (low-risk).

- [ ] **Step 5.4: Verify.** After applying the chosen fix(es), take a NEW high-quality screenshot at the same scrolled state and viewport. Compare to baseline. If banding is still visible, iterate — the user has explicitly said "do not declare it fixed if you can still see banding."

- [ ] **Step 5.5: TS check.**
  ```bash
  ./node_modules/.bin/tsc --noEmit
  ```
  Expected: clean.

- [ ] **Step 5.6: Commit.** Write commit message to `/tmp/task5-msg.txt` documenting which hypothesis was confirmed and which fix(es) were applied. Use `git commit -F /tmp/task5-msg.txt`. Suggested message:

  ```
  fix(knob): eliminate banding at scrolled state — <one-line root cause + fix>

  Second attempt at the banding issue (first attempt 4337e14 swapped
  gradients for solid fills but the underlying cause was X). Applied:
  - <fix 1>
  - <fix 2 if any>

  Verified with a high-quality screenshot at viewport 1440x900 with
  scrollY past MORPH_END. Banding no longer visible at 200% zoom.
  ```

---

### Task 6: Freeze knob pointer + pulse on active section change

**Goal:** Replace Knob's scroll-driven rotation with a static `pointerSvgAngle` derived from `isDesktop`. Add a pointer-pulse effect that fires once when `activeIndex` changes.

**Why now:** the pointer must be the marker for the label ring to work. Removing rotation also incidentally tests one pixelation hypothesis (per-frame GPU recompositing).

**Files:**
- Modify: `components/Knob.tsx`

**Steps:**

- [ ] **Step 6.1: Read current state.** Confirm `Knob.tsx` currently has:
  ```tsx
  const rawAngle = useTransform(scrollYProgress, [0, 1], [0, 1080])
  const angle = prefersReducedMotion ? 0 : rawAngle
  ```
  and the rendering:
  ```tsx
  <motion.g style={{ rotate: angle, transformOrigin: `${C}px ${C}px`, transformBox: "view-box" }}>
  ```

- [ ] **Step 6.2: Replace scroll-driven rotation with static pointer angle.**

  Inside the Knob component, after the `isDesktop` derivation:
  ```tsx
  // Pointer's local origin is at 12 o'clock (POINTER_Y = C - R_BODY).
  // To land at MARKER_ANGLE in CSS-angle convention (0° = 3 o'clock):
  //   desktop (MARKER_ANGLE = 0°)  → rotate 90° CW
  //   mobile  (MARKER_ANGLE = 90°) → rotate 180° CW
  const pointerSvgAngle = isDesktop ? 90 : 180
  ```

  Remove the `rawAngle` and `angle` MV declarations and the `scrollYProgress` from the `useScroll()` destructure (only `scrollY` remains). The rotating group's `style.rotate` becomes the constant `pointerSvgAngle`:

  ```tsx
  <motion.g style={{
    rotate: pointerSvgAngle,
    transformOrigin: `${C}px ${C}px`,
    transformBox: "view-box",
  }}>
  ```

  The motion.g wrapper can stay (avoids touching the JSX structure) or be replaced with a plain `<g transform={`rotate(${pointerSvgAngle} ${C} ${C})`}>`. Plain `<g>` is simpler since nothing else animates inside the group; pick that.

- [ ] **Step 6.3: Add pointer-pulse on active section change.**

  Add to imports:
  ```tsx
  import { useActiveSection } from "@/hooks/use-active-section"
  ```

  Inside the Knob component, add (the freezeRef can be a no-op local since Knob doesn't initiate clicks):
  ```tsx
  const freezeRef = useRef(false)
  const [activeIndex] = useActiveSection(freezeRef)

  const [pulse, setPulse] = useState(0)
  const lastActiveRef = useRef(activeIndex)
  useEffect(() => {
    if (lastActiveRef.current !== activeIndex) {
      lastActiveRef.current = activeIndex
      if (!prefersReducedMotion) {
        setPulse((n) => n + 1)
      }
    }
  }, [activeIndex, prefersReducedMotion])
  ```

  The `pulse` counter triggers a CSS animation on the pointer rect. Add to the pointer `<rect>`:
  ```tsx
  <rect
    key={`pointer-${pulse}`}
    x={POINTER_X}
    y={POINTER_Y}
    width={POINTER_W}
    height={POINTER_H}
    rx={POINTER_RX}
    fill="#F4F6FA"
    style={{ animation: pulse > 0 ? "knob-pointer-pulse 200ms ease-out" : undefined }}
  />
  ```

  The `key` change forces React to remount the rect on each pulse, restarting the CSS animation. Add the `@keyframes` to `app/globals.css`:
  ```css
  @keyframes knob-pointer-pulse {
    0%   { opacity: 1; }
    50%  { opacity: 0.7; }
    100% { opacity: 1; }
  }
  ```

  Note: Knob's parent zIndex is 30. LabelRing's parent zIndex is 40. Pointer is part of Knob — fine, it sits visually behind the labels but the pulse is on the pointer itself, no z-conflict.

  **Note on coupling:** Knob now depends on `useActiveSection`. This is a new dependency and worth flagging in the commit message — Knob and LabelRing now both read the same active state independently. If we ever need shared state (e.g., to sync animations precisely), we'd lift it to HeroSection. Not necessary today.

- [ ] **Step 6.4: Drop dead constants from `lib/knob-geometry.ts`.**

  Remove:
  ```ts
  export const MARKER_GAP = 6
  export const MARKER_LENGTH = 14
  export const MARKER_WIDTH = 2
  export const OPACITY_FALLOFF_DEG = 110
  export const OPACITY_FALLOFF_EXPONENT = 1.4
  ```

  Verify no consumers via grep before removing. (Currently no Task 5/6/7 consumes them — they were declared in Task 4 step 4.1 ahead of obsoleted Tasks 5, 6.)

- [ ] **Step 6.5: TS check.**

  ```bash
  ./node_modules/.bin/tsc --noEmit
  ```
  Expected: clean.

- [ ] **Step 6.6: Commit.**

  Use `git commit -F /tmp/task6-msg.txt`:
  ```
  feat(knob): freeze pointer at marker angle + pulse on active section change

  The knob's white pointer becomes the active-section marker for the label
  ring. Removes the scroll-tied 0→1080° rotation (was Task 5 of the morph
  plan, commit 5502f49). Pointer's local rotation is now derived from
  isDesktop: 90° CW (desktop, lands at 3 o'clock) or 180° CW (mobile,
  lands at 6 o'clock).

  Adds a 200ms ease-out opacity pulse on the pointer when the active
  section changes (1.0 → 0.7 → 1.0). Triggered by useActiveSection in
  Knob.tsx; reduced-motion users skip the pulse. Drops dead constants
  MARKER_GAP/LENGTH/WIDTH and OPACITY_FALLOFF_DEG/EXPONENT from
  lib/knob-geometry.ts (separate marker tick + continuous falloff
  formula are no longer part of v3).
  ```

---

### Task 7: 3-label window via continuous angular-distance function

**Goal:** Refactor `LabelButton` so each instance derives all its visual properties (opacity, scale, color, font-weight) from a single per-label `labelDistance` MV. Implements the 3-label-window-emerges-from-continuous-function design.

**Why this is the central change:** the visibility windowing is the new mechanic the user wants.

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 7.1: Remove the existing color ternary from LabelButton.**

  Find:
  ```tsx
  const isHighlighted = section.highlight === true
  const color = (isHighlighted || isActive) ? "#2798ff" : "#0F172A"
  ```

  These get replaced by MV-derived values in 7.3.

- [ ] **Step 7.2: Add helper to LabelRing.tsx (module-level).**

  ```tsx
  function easeOutQuad(t: number): number {
    return 1 - (1 - t) * (1 - t)
  }
  ```

  (`easeInOutCubic`, `clamp`, `shortestSignedAngle` already exist module-level from Task 4.)

- [ ] **Step 7.3: Refactor LabelButton — derive visual props from labelDistance MV.**

  Update `LabelButtonProps`:
  ```tsx
  type LabelButtonProps = {
    section: typeof SECTIONS[number]
    isDesktop: boolean
    cx: number
    cy: number
    ringRotation: MotionValue<number>
    markerAngle: number
    onClick: () => void
  }
  ```

  Note: `isActive` is no longer passed in — color is now distance-derived. (`aria-current` is still distance-derived from "is this the closest label to the marker" — see Step 7.4.)

  Refactor the component body:
  ```tsx
  function LabelButton({ section, isDesktop, cx, cy, ringRotation, markerAngle, onClick }: LabelButtonProps) {
    const isHighlighted = section.highlight === true

    // Per-label angular distance from marker, signed in (-180°, 180°].
    const labelDistance = useTransform(ringRotation, (r) =>
      shortestSignedAngle(markerAngle, section.angle + r),
    )
    const absDistance = useTransform(labelDistance, (d) => Math.abs(d))

    // Opacity: piecewise easeOutQuad, anchors at 0°→1.0, 45°→0.55, 90°→0.
    const opacity = useTransform(absDistance, (d) => {
      if (d >= 90) return 0
      if (d <= 45) {
        const t = d / 45
        return 1 - easeOutQuad(t) * (1 - 0.55)  // 1 → 0.55 over 0°→45°
      }
      const t = (d - 45) / 45
      return 0.55 - easeOutQuad(t) * 0.55  // 0.55 → 0 over 45°→90°
    })

    // Scale: easeInOutCubic from 1.0 → 0.78 over 0°→90°, clamps below.
    const scale = useTransform(absDistance, (d) => {
      const t = clamp(d / 90, 0, 1)
      return 1 - easeInOutCubic(t) * (1 - 0.78)
    })

    // Counter-rotation to keep label upright as ring spins.
    const counterRotate = useTransform(ringRotation, (r) => -r)

    // Color: brand if SİPARİŞ (always), or if within ±15° of marker. Otherwise neutral.
    const color = useTransform(absDistance, (d) =>
      (isHighlighted || d <= 15) ? "#2798ff" : "#0F172A",
    )

    // Font-weight: snap-flip at ±22.5° (halfway through prev/next arc).
    const fontWeight = useTransform(absDistance, (d) => (d <= 22.5 ? 600 : 500))

    // aria-current: this label is the active section iff it's the closest one
    // to the marker (i.e., within ±22.5°, half a section arc).
    const ariaCurrent = useTransform(absDistance, (d) => (d <= 22.5 ? "true" : undefined))

    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={section.ariaLabel}
        // aria-current via style is not standard; we set it as a regular attr
        // by reading the MV's current value at render time. See Step 7.4.
        className="focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2798ff] rounded"
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          x: "-50%",
          y: "-50%",
          rotate: counterRotate,
          opacity,
          scale,
          color,
          fontSize: isDesktop ? 16 : 13,
          fontWeight,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          pointerEvents: "auto",
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

  **Important:** `aria-current` cannot be a MotionValue — ARIA attrs need stable string values for AT. Drop the `ariaCurrent` MV. Instead, pass `isActive: boolean` back as a prop (we already have `activeIndex` in LabelRing), and set `aria-current={isActive ? "true" : undefined}` directly on the button. Restore `isActive` to props.

  **Corrected props:**
  ```tsx
  type LabelButtonProps = {
    section: typeof SECTIONS[number]
    isActive: boolean
    isDesktop: boolean
    cx: number
    cy: number
    ringRotation: MotionValue<number>
    markerAngle: number
    onClick: () => void
  }
  ```

  And in the JSX:
  ```tsx
  aria-current={isActive ? "true" : undefined}
  ```

  (Color is still distance-derived — the `isActive` prop is ONLY for the ARIA attr, not for visual styling.)

- [ ] **Step 7.4: Update LabelRing render call site.**

  Find the render block that maps SECTIONS to LabelButtons. Update to pass `markerAngle` and `isActive`:

  ```tsx
  {SECTIONS.map((section, i) => {
    const angleRad = (section.angle * Math.PI) / 180
    const ringRadiusInBase = BASE_SIZE / 2 + LABEL_RING_GAP
    const cx = BASE_SIZE / 2 + ringRadiusInBase * Math.cos(angleRad)
    const cy = BASE_SIZE / 2 + ringRadiusInBase * Math.sin(angleRad)

    return (
      <LabelButton
        key={section.id}
        section={section}
        isActive={i === activeIndex}
        isDesktop={isDesktop}
        cx={cx}
        cy={cy}
        ringRotation={ringRotation}
        markerAngle={markerAngle}
        onClick={() => handleClick(i, section.id)}
      />
    )
  })}
  ```

- [ ] **Step 7.5: Add the active-arrival weight pulse (CSS-driven).**

  Inside `LabelButton`, after the `isActive` prop is in scope:

  ```tsx
  const [pulseKey, setPulseKey] = useState(0)
  const wasActiveRef = useRef(isActive)
  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      setPulseKey((k) => k + 1)
    }
    wasActiveRef.current = isActive
  }, [isActive])
  ```

  Wrap the `motion.button` in a span that gets the pulse class on key change:

  Actually simpler — add an `animation` style that changes when `pulseKey` increments:
  ```tsx
  style={{
    /* ... existing ... */
    animation: pulseKey > 0 ? `label-active-pulse 280ms cubic-bezier(0.34, 1.56, 0.64, 1)` : undefined,
  }}
  ```

  Note: this animation re-runs every time `pulseKey` increments — but only if the `style.animation` value changes string-wise. Since pulseKey is in a closure but the string is the same, React won't re-trigger. **Force re-trigger by reading pulseKey into the animation name's keyframe count or by using a `key` on the parent.** Simpler: use `key={pulseKey}` on the motion.button. Each pulse → new React key → fresh DOM node → fresh animation. The trade-off: the button briefly remounts (fine, no state to preserve except focus, which active-arrival users aren't holding).

  Add the `@keyframes` to `app/globals.css`:
  ```css
  @keyframes label-active-pulse {
    0%   { font-weight: 600; }
    50%  { font-weight: 680; }
    100% { font-weight: 600; }
  }
  ```

  **Caveat:** non-variable fonts can't render arbitrary weights — `680` will round to `700`. That's still a perceptible bump. Acceptable. If a future variable-font swap happens, the smooth interpolation comes for free.

- [ ] **Step 7.6: TS check.**

  ```bash
  ./node_modules/.bin/tsc --noEmit
  ```
  Expected: clean.

- [ ] **Step 7.7: Commit.**

  Use `git commit -F /tmp/task7-msg.txt`:
  ```
  feat(label-ring): 3-label window via continuous angular-distance function

  Each LabelButton derives all visual properties (opacity, scale, color,
  font-weight) from a single per-label labelDistance MotionValue —
  shortestSignedAngle(markerAngle, section.angle + ringRotation). Anchors
  per UX consult v3:
  - 0°  (active):    opacity 1.0,  scale 1.0,  weight 600, color #2798ff
  - 45° (prev/next): opacity 0.55, scale 0.78, weight 500, color #0F172A
  - 90° (boundary):  opacity 0,    scale 0.78, weight 500
  - >90° (hidden):   opacity 0

  Curves: opacity piecewise easeOutQuad, scale easeInOutCubic, color
  threshold-flip at ±15° (label feels claimed before geometric arrival),
  font-weight snap at ±22.5°. SİPARİŞ stays brand color regardless of
  distance. The 3-visible-label window emerges naturally — beyond ±90°
  opacity = 0, and labels are 45° apart, so only active + ±1 are non-zero.

  Adds 280ms cubic-bezier(0.34, 1.56, 0.64, 1) weight pulse (600→680→600)
  on the new active label when activeIndex changes.

  Drops the isActive-driven color logic; isActive prop now only sets the
  aria-current attr.
  ```

---

### Task 8: Gated visibility on morph progress

**Goal:** Hide the entire ring while the knob is still in the machine (morphProgress < 0.85). Fade in to fully visible by morphProgress = 1.0.

**Why now:** during the morph, labels would float around the small in-machine knob and look broken. Gate them until the dial is in position.

**Files:**
- Modify: `components/LabelRing.tsx`

**Steps:**

- [ ] **Step 8.1: Compute ring-visibility opacity from morphProgress.**

  In `LabelRing`, after `morphProgress` is defined:
  ```tsx
  // Ring visibility gate: 0 below 0.85, fades to 1.0 by 1.0.
  const ringOpacity = useTransform(morphProgress, [VISIBILITY_GATE_START, VISIBILITY_GATE_END], [0, 1], { clamp: true })
  ```

  Import `VISIBILITY_GATE_START`, `VISIBILITY_GATE_END` from `@/lib/knob-geometry` (already exported, just verify).

- [ ] **Step 8.2: Apply to the parent motion.div's `opacity`.**

  Currently the parent motion.div has:
  ```tsx
  opacity: isMeasured ? 1 : 0,
  ```

  Change to multiply with `ringOpacity`. Since `opacity` accepts a MotionValue, the simplest pattern is a derived MV:
  ```tsx
  const baseOpacity = useTransform(ringOpacity, (g) => (isMeasured ? g : 0))
  ```

  And:
  ```tsx
  opacity: baseOpacity,
  ```

  (Using the existing `isMeasured` boolean as a closure capture into a useTransform — recreated on `isMeasured` changes via React re-render. Acceptable.)

- [ ] **Step 8.3: Verify reduced-motion behavior.**

  When `prefersReducedMotion` is true, `morphProgress` is locked at 0 (via the `zeroMV` substitution). That means `ringOpacity` would be 0 forever. **That's wrong** — RM users still need the ring; they just don't get the morph animation.

  Fix: for RM, treat `morphProgress` for gating purposes as 1.0 (knob is "always at destination"). One option:
  ```tsx
  const oneMV = useMotionValue(1)
  const morphProgressForGate = prefersReducedMotion ? oneMV : morphProgress
  const ringOpacity = useTransform(morphProgressForGate, [VISIBILITY_GATE_START, VISIBILITY_GATE_END], [0, 1], { clamp: true })
  ```

  Cleaner: only use `morphProgressForGate` for gating; keep `morphProgress` itself as zero for RM (so the morph chain doesn't move the knob position, which is what RM wants).

  Wait — but if the knob doesn't morph for RM users, they never see the dial at viewport edge. So the labels would be positioned at the in-machine-knob position. That's bad too. Open question: how does the existing morph chain handle RM? Current behavior (per `1623f39`): `morphProgress` is forced to 0, knob stays at the rest position (in-machine). So the dial ALSO stays in-machine for RM. The whole morph is reduced.

  In that case, the ring (at the in-machine knob position) being hidden actually makes sense for RM — there's no "scrolled state" to show the labels in. The whole morph experience is collapsed.

  **But** that means RM users get no nav at all. Bad. Solution: for RM, expose the labels at all times once the user has scrolled past `MORPH_END` (use a discrete check on scrollY rather than morphProgress). Update gate:
  ```tsx
  const ringOpacity = prefersReducedMotion
    ? useTransform(scrollY, (y) => (y >= MORPH_END ? 1 : 0))
    : useTransform(morphProgress, [VISIBILITY_GATE_START, VISIBILITY_GATE_END], [0, 1], { clamp: true })
  ```

  But conditional `useTransform` violates rules of hooks. Use the same pattern as `morphProgress`/`zeroMV` — compute both unconditionally, conditionally pick. Let me write it cleanly:

  ```tsx
  const ringOpacityScrollGate = useTransform(scrollY, (y) => (y >= MORPH_END ? 1 : 0))
  const ringOpacityMorphGate = useTransform(morphProgress, [VISIBILITY_GATE_START, VISIBILITY_GATE_END], [0, 1], { clamp: true })
  const ringOpacityRaw = prefersReducedMotion ? ringOpacityScrollGate : ringOpacityMorphGate
  const ringOpacity = useTransform(ringOpacityRaw, (g) => (isMeasured ? g : 0))
  ```

  However, `prefersReducedMotion` AND `isDesktop`-style RM-vs-not switching for the dial position is a real coupling concern. Actually the LabelRing's POSITION (left/top/scale via the morph chain) is also wrong for RM users — the labels would orbit the in-machine knob. For RM the dial stays in the machine.

  **Simplest correct behavior for RM:** the ring stays HIDDEN entirely (opacity 0) on RM. The user navigates via the existing SiteNav (already z-50 and accessible). Labels are an enhancement, not the only path. This honors reduced-motion best practice (no surprise motion) without crippling navigation. Document this in the commit and in the a11y final pass (Task 9).

  Final implementation:
  ```tsx
  const ringOpacityRaw = useTransform(morphProgress, [VISIBILITY_GATE_START, VISIBILITY_GATE_END], [0, 1], { clamp: true })
  const ringOpacity = useTransform(ringOpacityRaw, (g) => (isMeasured && !prefersReducedMotion ? g : 0))
  ```

  Wait — that hides the ring entirely for RM. But the spec said "snap-to-active fallback" with prev/next visible. There's a tension between "RM = hide" and "RM = snap-to-active 3-label window."

  **Resolution:** the snap-to-active behavior IS what we want for RM. The ring shows, doesn't rotate, snaps content on active changes. So gate the ring's opacity ONLY on morph-completion for the non-RM case, and make a discrete decision for RM:

  ```tsx
  const ringOpacityRaw = prefersReducedMotion
    ? ringOpacityScrollGate
    : useTransform(morphProgress, [VISIBILITY_GATE_START, VISIBILITY_GATE_END], [0, 1], { clamp: true })
  ```

  Same rules-of-hooks issue. Fix: declare both unconditionally, pick:

  ```tsx
  const ringOpacityScrollGate = useTransform(scrollY, (y) => (y >= MORPH_END ? 1 : 0))
  const ringOpacityMorphGate = useTransform(morphProgress, [VISIBILITY_GATE_START, VISIBILITY_GATE_END], [0, 1], { clamp: true })
  const ringOpacityGate = prefersReducedMotion ? ringOpacityScrollGate : ringOpacityMorphGate
  const ringOpacity = useTransform(ringOpacityGate, (g) => (isMeasured ? g : 0))
  ```

  But position-wise — RM users need the dial at viewport edge for the labels to be reachable. That requires the morph itself to play. But morph is currently disabled for RM (locked at 0).

  **This is a Task 9 problem, not Task 8.** Task 8 just gates ring visibility on morphProgress in the non-RM case, and treats RM as "always visible after MORPH_END" (the dial position will be wrong for RM, but Task 9 fixes that by allowing the morph end-state to be reached without animating — instant snap).

  **For Task 8: gate on morphProgress. Defer the RM dial-position decision to Task 9.**

- [ ] **Step 8.4: TS check.**

  ```bash
  ./node_modules/.bin/tsc --noEmit
  ```
  Expected: clean.

- [ ] **Step 8.5: Commit.**

  Use `git commit -F /tmp/task8-msg.txt`:
  ```
  feat(label-ring): gate ring visibility on morph progress

  Ring opacity 0 below morphProgress = 0.85, fades to 1.0 by 1.0. Hides
  the labels while the knob is still in the machine (would otherwise
  orbit a tiny in-machine knob and look broken).

  RM users get a scrollY-based gate (visible after scrollY >= MORPH_END)
  since morphProgress is locked at 0 for them. RM dial-position
  reconciliation lands in Task 9.
  ```

---

### Task 9: Reduced-motion + a11y final pass + production build

**Goal:** Reconcile reduced-motion with the new design (snap-to-active, dial position, no rotation). Final a11y sweep. Ship a clean production build.

**Files:**
- Modify: `components/Knob.tsx` (RM dial position)
- Modify: `components/LabelRing.tsx` (snap-to-active polish)
- Possibly modify: `app/globals.css` (final pulse keyframes)

**Steps:**

- [ ] **Step 9.1: Decide RM dial behavior.**

  Two options, pick one and document:
  - **A:** RM users see the dial morph end-state INSTANTLY on first scroll past MORPH_START. No interpolation, just a snap. Labels appear (per Task 8's RM scrollY gate), ring snap-rotates on active changes (per Task 4's `ringRotationDiscrete`).
  - **B:** RM users never see the dial — the morph is fully disabled, labels never appear, navigation is via SiteNav only.

  **Recommendation: A.** Maintains feature parity. The "no animation" promise of RM is honored by snapping rather than easing — the dial is in its final position, labels are in their slots, no motion plays. User opted into less motion, not less function.

  Implement: in `Knob.tsx` (and LabelRing.tsx if mirrored), when `prefersReducedMotion`:
  - `morphProgress` snaps to 1 once `scrollY >= MORPH_END`, snaps to 0 below. Use a useTransform with a step function:
    ```tsx
    const morphProgressRM = useTransform(scrollY, (y) => (y >= MORPH_START ? 1 : 0))
    const morphProgress = prefersReducedMotion ? morphProgressRM : easedProgress
    ```
  - Mirror this in LabelRing.tsx (currently it has its own `morphProgress` derivation — they need to stay in sync).
  - Update the Task 8 gate accordingly.

- [ ] **Step 9.2: Snap-to-active polish in LabelRing.**

  When `prefersReducedMotion` is true and `activeIndex` changes, the ring rotation MV updates instantly (no scroll-tied tween). Each label's distance recomputes; opacity/scale snap to the new values. Add a 120ms opacity crossfade so the swap isn't jarring:

  ```tsx
  // Inside LabelButton, when prefersReducedMotion:
  const opacity = useTransform(absDistance, /* same function */)
  const opacityRM = useSpring(opacity, { duration: 120, bounce: 0 })
  const finalOpacity = prefersReducedMotion ? opacityRM : opacity
  ```

  Wait — `useSpring` is its own animation. Use `animate()` with a 120ms tween instead? Actually `useSpring` with `duration: 120, bounce: 0` is effectively a 120ms tween, fine.

  Issue: prefersReducedMotion must be passed into LabelButton so each button can wire the right opacity MV. Pass it as a prop.

- [ ] **Step 9.3: a11y sweep.**

  - Verify `aria-current="true"` is on exactly one label at a time (the `i === activeIndex` one). In edge cases where two labels are equidistant from marker mid-rotation, only one should claim active. (The `i === activeIndex` driver guarantees this — it's based on IntersectionObserver, not distance.)
  - Verify keyboard tab order: SiteNav → label buttons in DOM order (which is SECTIONS order). Each label is reachable.
  - Verify focus-visible ring renders on Tab (already in place from Task 3 follow-up).
  - Verify pointer-events: parent motion.div has `pointerEvents: "none"`, label buttons have `pointerEvents: "auto"` — labels clickable, body underneath isn't blocked.
  - Verify the rotating container doesn't trap focus — it doesn't (no role, no aria-modal).
  - Verify color contrast: at full opacity, `#2798ff` on hero background and `#0F172A` on hero background both pass WCAG AA (the hero background is light).

- [ ] **Step 9.4: Production build.**

  ```bash
  pnpm build
  ```
  Expected: clean build, no type errors, no missing imports.

  ```bash
  pnpm start &
  sleep 3
  curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000
  kill %1
  ```
  Expected: HTTP 200.

- [ ] **Step 9.5: Commit.**

  Use `git commit -F /tmp/task9-msg.txt`:
  ```
  feat(label-ring): reduced-motion snap-to-active + a11y final pass

  Reduced-motion users now get a snap-to-active 3-label window: morph
  snaps to its end-state (no easing), ring rotation snaps on activeIndex
  change (no scroll-tied interp), per-label opacity uses a 120ms tween
  to crossfade the slot swap. Maintains feature parity with the animated
  path while honoring prefers-reduced-motion.

  a11y sweep: aria-current is on exactly one label, focus-visible ring
  intact, color contrast passes at active and prev/next opacities, label
  buttons reachable via Tab, no focus trap.

  Production build verified clean.
  ```

---

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Pixelation fix (Task 5) doesn't fully resolve banding. | Multi-hypothesis investigation with documented results. If single fix is insufficient, stack fixes. Verify with high-quality screenshot before claiming done. |
| Knob+LabelRing now both call `useActiveSection` independently. State could desync if observer fires inconsistently. | The hook is deterministic (IntersectionObserver based on document state). Both consumers see the same active. If sync becomes an issue, lift active state to HeroSection. Note in Task 6 commit. |
| Pulse animation fires on every render (forgot to gate). | Pulse triggered by `setPulseKey` in a `useEffect` with `[isActive]` deps — only fires when `isActive` flips. Verified in Task 7.5. |
| Reduced-motion users lose navigation (labels hidden + no morph). | Task 9 keeps labels visible for RM by snapping morph + ring to discrete end-states instead of disabling them. |
| Removing `MARKER_*` constants breaks an unseen consumer. | Grep before removing; only declared in Task 4 step 4.1 ahead of obsoleted Tasks 5-6. No other consumers expected. |
| Color interpolation muddiness at intermediate distances. | Avoided — color is a threshold flip (hex→hex), not interpolated. UX consult's OKLCH suggestion was for continuous interp; we use discrete. |
| Variable-font weight pulse (600→680→600) renders as 700 on non-variable font. | Acceptable — the bump is still perceptible. Ship and revisit if a variable-font swap happens. |

## Scope boundary (hard rules)

- Do NOT touch `lib/sections.ts` — section order, angles, ariaLabels are locked.
- Do NOT touch `hooks/use-active-section.ts` — pre-existing observer-dep nit is out of scope.
- Do NOT touch `components/SiteNav.tsx` — separate nav, separate concerns.
- Do NOT touch the WashingMachine drum component — drum rotation is independent of the knob pointer.
- Do NOT add a separate marker tick — the knob's pointer IS the marker.
- Do NOT add features beyond the spec (no hover treatments, no keyboard arrow nav, no automatic ring carousel).

## Rollback

If v3 turns out to be the wrong direction (third revision):

- Revert `Knob.tsx` rotation change to restore scroll-tied 0→1080° (revert Task 6 commit).
- Revert `LabelRing.tsx` LabelButton refactor to restore Task 4's uniform-style rendering (revert Task 7 commit).
- Restore `lib/knob-geometry.ts` constants (revert Task 6 commit's deletion).

The v2 stationary-then-rotating-ring architecture is fully preserved in commits `1623f39` + `12c047c`. The morph chain skeleton in `LabelRing.tsx` and the geometry in `Knob.tsx` are not rewritten between v2 and v3 — only swapped behaviors.

## Self-review

**Spec coverage:**
- §1 (knob pointer = marker, drop tick) → Task 6
- §2 (ring rotation retained) → no task needed (already shipped)
- §3 (per-label visual values continuous) → Task 7
- §4 (micro-treatment on arrival) → Task 7 (label pulse) + Task 6 (pointer pulse)
- §5 (no overshoot) → enforced by scroll-tied design (no spring)
- §6 (reduced-motion fallback) → Task 9
- §7 (knob pixelation) → Task 5
- §8 (visibility gate on morph) → Task 8

**Placeholder scan:** No "TBD" or "implement later" — every step has concrete code or commands. Step 5.3 has branching guidance based on Step 5.2 results, which is the appropriate form of conditional content for an investigation task.

**Type consistency:** `LabelButtonProps` matches the call site in Step 7.4. `markerAngle: number`, `isActive: boolean`, `ringRotation: MotionValue<number>` consistent throughout. `pointerSvgAngle: number` derived in Knob.tsx. `pulseKey: number`, `pulse: number` are local component state with consistent types.

**DRY:** `easeInOutCubic`, `clamp`, `shortestSignedAngle` reused from Task 4. `easeOutQuad` added once in Step 7.2. `markerAngle` derivation shared between Knob (for pointer) and LabelRing (for distance) — both compute from `isDesktop ? MARKER_ANGLE_DESKTOP : MARKER_ANGLE_MOBILE`. Could be hoisted to a shared helper but it's a one-line derivation; acceptable.

**YAGNI:** No discrete "windowing logic" — visibility emerges from continuous function. No separate marker tick. No spring overshoot. No color interpolation in OKLCH (threshold flip is simpler and matches the design intent of "claiming" before arrival).

**TDD:** No test files in scope — this is a visual/motion feature with no automated test infrastructure for framer-motion-driven UI. Verification is via browser observation per task. (If user wants Playwright snapshots, that's a separate plan.)

**Frequent commits:** 5 atomic commits planned (Tasks 5-9). Each is independently revertable.
