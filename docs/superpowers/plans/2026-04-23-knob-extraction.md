# Knob Extraction (Candidate C) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the washing machine's center knob into a standalone `<Knob />` component at page root so scroll-driven rotation visibly applies. Visually identical to the current six-layer in-SVG knob at rest.

**Architecture:** Standalone `<Knob />` React component rendered at page root with `position: fixed`. A `ResizeObserver` tracks the `WashingMachine` container's `DOMRect` and updates the knob's fixed viewport coordinates. Rotation is driven by `useScroll` → `useSpring` inside `Knob.tsx`, applied via `motion.g` at the Knob's own SVG root — no nested parent `<g transform>` means framer-motion's transform applies cleanly (unlike the current broken nested form).

**Tech Stack:** React 19, framer-motion 11 (`useScroll`, `useSpring`, `useTransform`, `useMotionTemplate`, `useReducedMotion`, `motion.g`), TypeScript 5.7, native `ResizeObserver`. No new dependencies.

---

## Scope Boundary (critical)

**In scope (2.4a):**
- Extract the six-layer knob out of `WashingMachine.tsx`
- Render it as a fixed-positioned standalone component tracked via `ResizeObserver`
- Apply scroll-driven rotation (3 turns, spring) with reduced-motion respect
- First-paint mitigation via `isMeasured` gate

**Out of scope (2.4b — future):** morph knob position to viewport-left (desktop) / viewport-top (mobile) on scroll past hero.
**Out of scope (2.4c — future):** 8-label ring around the knob, click-to-navigate handlers on labels, active-section highlighting.

At the end of 2.4a, the knob sits on the washing machine's control-panel position tracked via `ResizeObserver`, rotating 3 turns over hero scroll with spring overshoot. Nothing else changes.

---

## UI/UX Decisions (pre-approved, do not re-question)

| Decision | Value | Source |
|---|---|---|
| Rotation feel | 3 full turns over `scrollYProgress` [0, 1], spring `{ stiffness: 50, damping: 20 }` | Matches drum/door for visual consistency |
| First-paint | `isMeasured` flag; knob at `opacity: 0` until first RO callback, then flip to `opacity: 1` instantly (no fade) | Avoids flash at (0,0) |
| Pivot | Geometric center (0, 0 in knob-local coords) | Uniform rotation, no offset |
| Click | **No click handler on knob in 2.4a.** Click-to-top is dropped (SiteNav logo covers that) | Future 2.4c adds click on labels only |
| Dual nav | Acceptable as-is — knob-ring is hero-specific, SiteNav is persistent | No affordance work in 2.4a |

---

## Visual Spec (non-negotiable — rest state must be pixel-identical to current in-SVG knob)

Six SVG layers, all at `cx=0 cy=0` local coords inside the Knob's own SVG. The outer `<g>` carries `filter="url(#knobShadow)"`; the `<motion.g>` carries the rotation transform.

```tsx
<g filter="url(#knobShadow)">
  <motion.g style={{ rotate: angle }}>
    <circle cx="0" cy="0" r="44" fill="#000" opacity="0.45" />
    <circle cx="0" cy="0" r="42" fill="url(#knobBody)" />
    <circle cx="0" cy="0" r="34" fill="url(#knobTop)" />
    <circle cx="0" cy="0" r="34" fill="none" stroke="#0A2D5C" strokeOpacity="0.35" strokeWidth="0.8" />
    <circle cx="0" cy="0" r="2.2" fill="#F4F6FA" opacity="0.95" />
    <rect x="-1.8" y="-30" width="3.6" height="11" rx="1.6" fill="#F4F6FA" opacity="0.9" />
  </motion.g>
</g>
```

Gradient and filter defs must be copied verbatim from `WashingMachine.tsx` into the Knob's own `<defs>` because SVG defs are scoped per-SVG:

```tsx
<defs>
  <radialGradient id="knobBody" cx="40%" cy="32%" r="75%">
    <stop offset="0%" stopColor="#5AA8FF" />
    <stop offset="40%" stopColor="#2E86F0" />
    <stop offset="80%" stopColor="#1A63C4" />
    <stop offset="100%" stopColor="#0D3F86" />
  </radialGradient>
  <radialGradient id="knobTop" cx="45%" cy="38%" r="70%">
    <stop offset="0%" stopColor="#6FB0FF" />
    <stop offset="55%" stopColor="#2E86F0" />
    <stop offset="100%" stopColor="#164F9E" />
  </radialGradient>
  <filter id="knobShadow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
    <feOffset dx="0" dy="3" result="offsetblur" />
    <feComponentTransfer>
      <feFuncA type="linear" slope="0.45" />
    </feComponentTransfer>
    <feMerge>
      <feMergeNode />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</defs>
```

---

## Positioning Math

The original knob sits at local SVG coord `(450, 210)` inside a `900×1100` viewBox (line 517 of current `WashingMachine.tsx`: `<g transform="translate(450 210)">`).

When `WashingMachine` is rendered, its wrapping `<div>` has a measured `DOMRect { left, top, width, height }`. The SVG inside fills that div with `preserveAspectRatio="xMidYMid meet"` (default). Because the viewBox is `900×1100` and the SVG fills its container proportionally, the conversion from SVG coords to viewport pixels is:

```
scale = rect.width / 900    // assumes width-constrained fit; verify on narrow viewports
knobCenterX_vp = rect.left + (450 / 900) * rect.width
knobCenterY_vp = rect.top  + (210 / 900) * rect.width   // note: multiplied by width, not height, because aspect ratio is locked
```

The Knob's own SVG is rendered with width/height `≈ 100px` (enough to contain the r=44 recess + r=48 filter padding = ~96px, round up). To anchor the knob's **center** at `(knobCenterX_vp, knobCenterY_vp)`, offset by half the SVG size:

```
svgSize = 100
fixedLeft = knobCenterX_vp - svgSize / 2
fixedTop  = knobCenterY_vp - svgSize / 2
```

The Knob's own SVG has `viewBox="-50 -50 100 100"` so that `(0, 0)` in local coords sits at the SVG's visual center.

**Edge case:** If the container's aspect ratio is taller than 900:1100, the SVG would be height-constrained and `scale = rect.height / 1100`. Implementation should check which axis constrains and pick the right formula. For the current hero layout (grid column), width constraint holds at all breakpoints — but the implementation must branch on `rect.width / rect.height` vs `900 / 1100` to be safe.

---

## MotionValue Wiring

Inside `Knob.tsx` (NOT shared with WashingMachine — each component has its own `useScroll` hook; they read the same underlying scroll so values stay in sync):

```tsx
const prefersReducedMotion = useReducedMotion()
const { scrollYProgress } = useScroll()
const rawAngle = useTransform(scrollYProgress, [0, 1], [0, 1080])  // 3 turns
const smoothAngle = useSpring(rawAngle, { stiffness: 50, damping: 20 })
const angle = prefersReducedMotion ? 0 : smoothAngle
```

Apply via motion.g `style={{ rotate: angle }}` (framer-motion converts this to `transform: rotate(…deg)` on the SVG element — this is the form that has been observed to work at SVG root in this codebase, per drum/door precedent).

**Note:** Current `WashingMachine.tsx` uses `useMotionTemplate` with absolute pivot `rotate(${angle} 450 590)`. For the Knob, the pivot is already at `(0, 0)` in the Knob's own SVG (viewBox `-50 -50 100 100`), so no explicit pivot syntax is needed — a `rotate` transform applied to a group at origin rotates around the origin. Prefer `style={{ rotate: angle }}` for simplicity.

---

## ResizeObserver Wiring

Inside `Knob.tsx`:

```tsx
const [rect, setRect] = useState<DOMRect | null>(null)
const [isMeasured, setIsMeasured] = useState(false)

useEffect(() => {
  const el = containerRef.current   // ref to WashingMachine container div, threaded via prop
  if (!el) return
  const ro = new ResizeObserver(([entry]) => {
    setRect(entry.contentRect)       // contentRect has width/height; need getBoundingClientRect for left/top
    if (!isMeasured) setIsMeasured(true)
  })
  ro.observe(el)
  return () => ro.disconnect()
}, [containerRef, isMeasured])
```

**Important:** `ResizeObserverEntry.contentRect` gives size but not viewport-relative position. For `left`/`top` we need `el.getBoundingClientRect()`. Combined approach inside the RO callback:

```tsx
const ro = new ResizeObserver(() => {
  const r = el.getBoundingClientRect()
  setRect(r)
  if (!isMeasured) setIsMeasured(true)
})
```

Also attach a `scroll` listener (passive) to update `rect.top` as the page scrolls, since RO only fires on size changes, not scroll. Alternative: use `getBoundingClientRect()` inside a `useMotionValueEvent(scrollY, "change", …)` callback, which piggybacks on framer-motion's RAF-batched scroll listener without adding a separate scroll listener.

**Preferred wiring:**
```tsx
useMotionValueEvent(scrollY, "change", () => {
  if (!el) return
  setRect(el.getBoundingClientRect())
})
```

This updates rect on every scroll frame. RO handles resize; scroll event handles scroll; both converge on the same `setRect`.

**First-paint:** `isMeasured` stays `false` until the first RO or scroll callback fires. Knob renders with `opacity: 0` until measured, then flips to `opacity: 1`. No CSS transition on opacity — instant flip prevents flash.

---

## File Structure

```
components/
  Knob.tsx                    ← NEW (standalone component, ~120 lines)
  WashingMachine.tsx          ← MODIFY (remove knob group + defs, keep everything else)
  HeroMachine.tsx             ← MODIFY (forward ref to outer div)
  sections/
    HeroSection.tsx           ← MODIFY (create shared ref, pass to HeroMachine, mount Knob)
```

No changes to: `app/page.tsx`, `components/SectionReveal.tsx`, `components/SiteNav.tsx`, any other section component, `lib/sections.ts`, `use-active-section.ts`.

---

## Tasks

### Task 1: Create `Knob.tsx` as visually-identical static component

**Files:**
- Create: `components/Knob.tsx`

This first task renders the Knob with correct visuals, fixed positioning, and ResizeObserver tracking — but no rotation yet. This lets us verify the extract-and-track part works before adding motion.

- [ ] **Step 1: Scaffold `components/Knob.tsx`**

Create the file with this exact content:

```tsx
"use client"

import { type RefObject, useEffect, useState } from "react"

type Props = {
  containerRef: RefObject<HTMLDivElement | null>
}

const SVG_SIZE = 100
const VIEWBOX_W = 900
const VIEWBOX_H = 1100
const KNOB_LOCAL_X = 450
const KNOB_LOCAL_Y = 210

export function Knob({ containerRef }: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [isMeasured, setIsMeasured] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      setRect(el.getBoundingClientRect())
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
  }, [containerRef])

  const position = rect ? computePosition(rect) : { left: 0, top: 0 }

  return (
    <svg
      aria-hidden="true"
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`-${SVG_SIZE / 2} -${SVG_SIZE / 2} ${SVG_SIZE} ${SVG_SIZE}`}
      style={{
        position: "fixed",
        left: position.left,
        top: position.top,
        pointerEvents: "none",
        zIndex: 30,
        opacity: isMeasured ? 1 : 0,
      }}
    >
      <defs>
        <radialGradient id="knobBody" cx="40%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#5AA8FF" />
          <stop offset="40%" stopColor="#2E86F0" />
          <stop offset="80%" stopColor="#1A63C4" />
          <stop offset="100%" stopColor="#0D3F86" />
        </radialGradient>
        <radialGradient id="knobTop" cx="45%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#6FB0FF" />
          <stop offset="55%" stopColor="#2E86F0" />
          <stop offset="100%" stopColor="#164F9E" />
        </radialGradient>
        <filter id="knobShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
          <feOffset dx="0" dy="3" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.45" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#knobShadow)">
        <g>
          <circle cx="0" cy="0" r="44" fill="#000" opacity="0.45" />
          <circle cx="0" cy="0" r="42" fill="url(#knobBody)" />
          <circle cx="0" cy="0" r="34" fill="url(#knobTop)" />
          <circle cx="0" cy="0" r="34" fill="none" stroke="#0A2D5C" strokeOpacity="0.35" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="2.2" fill="#F4F6FA" opacity="0.95" />
          <rect x="-1.8" y="-30" width="3.6" height="11" rx="1.6" fill="#F4F6FA" opacity="0.9" />
        </g>
      </g>
    </svg>
  )
}

function computePosition(rect: DOMRect) {
  const containerAspect = rect.width / rect.height
  const svgAspect = VIEWBOX_W / VIEWBOX_H
  const widthConstrained = containerAspect < svgAspect
  const scale = widthConstrained ? rect.width / VIEWBOX_W : rect.height / VIEWBOX_H
  const renderedW = VIEWBOX_W * scale
  const renderedH = VIEWBOX_H * scale
  const offsetX = (rect.width - renderedW) / 2
  const offsetY = (rect.height - renderedH) / 2
  const knobCenterX = rect.left + offsetX + KNOB_LOCAL_X * scale
  const knobCenterY = rect.top + offsetY + KNOB_LOCAL_Y * scale
  return {
    left: knobCenterX - SVG_SIZE / 2,
    top: knobCenterY - SVG_SIZE / 2,
  }
}
```

- [ ] **Step 2: Commit the scaffold**

```bash
git add components/Knob.tsx
git commit -m "feat(knob): scaffold standalone Knob component (static, no rotation)"
```

---

### Task 2: Forward ref in `HeroMachine.tsx`

**Files:**
- Modify: `components/HeroMachine.tsx`

- [ ] **Step 1: Read current `HeroMachine.tsx`**

Run: `cat components/HeroMachine.tsx`

The file is a thin wrapper around `WashingMachine`. It should currently look roughly like:

```tsx
"use client"
import { WashingMachine } from "@/components/WashingMachine"

export function HeroMachine() {
  return (
    <div className="relative w-full" aria-hidden="true">
      <WashingMachine className="block h-auto w-full" />
    </div>
  )
}
```

- [ ] **Step 2: Convert to `forwardRef`**

Replace the file contents with:

```tsx
"use client"

import { forwardRef } from "react"
import { WashingMachine } from "@/components/WashingMachine"

export const HeroMachine = forwardRef<HTMLDivElement>(function HeroMachine(_, ref) {
  return (
    <div ref={ref} className="relative w-full" aria-hidden="true">
      <WashingMachine className="block h-auto w-full" />
    </div>
  )
})
```

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: PASS (no new errors).

- [ ] **Step 4: Commit**

```bash
git add components/HeroMachine.tsx
git commit -m "feat(hero): forward ref on HeroMachine for knob overlay tracking"
```

---

### Task 3: Wire shared ref + mount `<Knob />` in `HeroSection.tsx`

**Files:**
- Modify: `components/sections/HeroSection.tsx`

- [ ] **Step 1: Add ref and mount Knob**

Edit `components/sections/HeroSection.tsx` to:
1. Add `"use client"` directive (already present).
2. Import `useRef` from react and `Knob` from `@/components/Knob`.
3. Create a ref and pass it to `HeroMachine`.
4. Mount `<Knob containerRef={ref} />` after the main grid (as sibling inside `SectionReveal`).

Final file content:

```tsx
"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { HeroMachine } from "@/components/HeroMachine"
import { Knob } from "@/components/Knob"

export function HeroSection() {
  const machineRef = useRef<HTMLDivElement>(null)

  return (
    <SectionReveal
      id="basla"
      ariaLabel="Başla"
      className="relative flex min-h-screen items-center pb-24 pt-16 pl-6 pr-6 lg:pl-[80px] lg:pr-[80px]"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT: machine photo */}
        <motion.div variants={revealItem} className="order-1 lg:order-1">
          <HeroMachine ref={machineRef} />
        </motion.div>

        {/* RIGHT: text stack */}
        <div className="order-2 lg:order-2">
          <motion.div
            variants={revealItem}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#2798ff] opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#2798ff]" />
            </span>
            Çekmeköy • 08:00–22:00
          </motion.div>

          <motion.h1
            variants={revealItem}
            className="text-5xl font-bold leading-[0.98] tracking-[-0.028em] text-[#0F172A] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={{ fontVariationSettings: "'opsz' 32" }}
          >
            Tertemiz. Kapında.
            <br />
            24 saatte.
          </motion.h1>

          <motion.p
            variants={revealItem}
            className="mt-8 max-w-xl text-base leading-relaxed text-[#64748B] sm:text-lg"
          >
            Evden çamaşır toplama, yıkama, ütüleme ve kapıya teslim hizmeti.
            Kilo bazlı fiyatlandırma, 24–48 saat teslim. Çekmeköy genelinde hizmet veriyoruz.
          </motion.p>

          <motion.div variants={revealItem} className="mt-16 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#64748B]">
            <span>Programı seç</span>
            <ChevronDown className="size-3.5 animate-bounce" aria-hidden="true" />
          </motion.div>
        </div>
      </div>

      <Knob containerRef={machineRef} />
    </SectionReveal>
  )
}
```

- [ ] **Step 2: Browser verification (static position)**

Run: `npm run dev` (or existing dev command)
Open `http://localhost:3000`.
Expected:
- The blue knob appears sitting on the washing machine's control panel at page load — no flash at (0,0).
- The old in-SVG knob is still present (we haven't removed it yet), so there will temporarily be TWO knobs overlapping at the same position. This is expected at this step.
- Scroll the page — the new knob (fixed) should visibly track the machine's position as the page scrolls.
- Resize the browser window — the knob repositions smoothly.

**Critical stacked-knob outcome (how to read this verification):**
- ✅ **If you see ONE knob** (the two knobs are stacked pixel-identical and visually merge): positioning math is correct. Proceed to Task 4.
- ❌ **If you see TWO distinct knobs** (offset in position, different sizes, or visibly misaligned): positioning math is wrong. Fix `computePosition` before Task 4. Deleting the old knob while the new one is misaligned would leave the page with a visibly broken knob.

If the knob is offset or in the wrong place, fix the `computePosition` math before proceeding.

- [ ] **Step 3: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "feat(hero): mount Knob overlay with shared machine ref"
```

---

### Task 4: Remove the old knob from `WashingMachine.tsx`

**Files:**
- Modify: `components/WashingMachine.tsx`

- [ ] **Step 1: Locate the knob group**

Grep for the knob block:

Run: `grep -n "translate(450 210)" components/WashingMachine.tsx`
Expected: one line — the outer `<g transform="translate(450 210)" filter="url(#knobShadow)">`. Note the line number.

- [ ] **Step 2: Remove the knob group**

Delete the entire knob block — the outer `<g transform="translate(450 210)" filter="url(#knobShadow)">` through its closing `</g>`, including the nested `<motion.g transform={knobRotate}>…</motion.g>`. This is roughly lines 517-532 of the current file.

The block to remove looks like:

```tsx
<g transform="translate(450 210)" filter="url(#knobShadow)">
  <motion.g transform={knobRotate}>
    <circle cx="0" cy="0" r="44" fill="#000" opacity="0.45" />
    <circle cx="0" cy="0" r="42" fill="url(#knobBody)" />
    <circle cx="0" cy="0" r="34" fill="url(#knobTop)" />
    <circle cx="0" cy="0" r="34" fill="none" stroke="#0A2D5C" strokeOpacity="0.35" strokeWidth="0.8" />
    <circle cx="0" cy="0" r="2.2" fill="#F4F6FA" opacity="0.95" />
    <rect x="-1.8" y="-30" width="3.6" height="11" rx="1.6" fill="#F4F6FA" opacity="0.9" />
  </motion.g>
</g>
```

Delete all of it.

- [ ] **Step 3: Remove the `knobRotate` MotionValue**

Find and remove the line that declares `knobRotate`. It currently reads:

```tsx
const knobRotate = useMotionTemplate`rotate(${angle} 0 0)`
```

Delete this line. Keep all other MotionValues (`drumTransform`, `doorTransform`, `bodyOpacity`, `effectiveBodyOpacity`, `angle`, `smooth`, `rawAngle`).

- [ ] **Step 4: Remove knob-related `<defs>` from WashingMachine**

The `knobBody`, `knobTop`, and `knobShadow` defs live in `WashingMachine.tsx`'s `<defs>` block (around lines 108-153). Since the Knob component now has its own copies in its own SVG's defs, the ones in `WashingMachine.tsx` are unused. Delete them:

- `<radialGradient id="knobBody">…</radialGradient>`
- `<radialGradient id="knobTop">…</radialGradient>`
- `<filter id="knobShadow">…</filter>`

Keep all other defs (drum gradients, door gradients, body gradients, `doorShadow` filter, etc.) intact.

- [ ] **Step 5: Type check**

Run: `npx tsc --noEmit`
Expected: PASS. No references to `knobRotate`, `knobBody`, `knobTop`, `knobShadow` should remain in `WashingMachine.tsx`.

Run: `grep -nE "knobRotate|knobBody|knobTop|knobShadow" components/WashingMachine.tsx`
Expected: no matches.

- [ ] **Step 6: Browser verification (only one knob)**

Reload the browser.
Expected:
- There is now exactly ONE knob — the new fixed-positioned one. It still sits on the control panel (pointer at 12 o'clock, not yet rotating).
- Drum and door still rotate on scroll (regression check).
- Machine body still fades on scroll (regression check).

- [ ] **Step 7: Commit**

```bash
git add components/WashingMachine.tsx
git commit -m "refactor(machine): remove in-SVG knob (now owned by Knob overlay)"
```

---

### Task 5: Add scroll-driven rotation to `Knob.tsx`

**Files:**
- Modify: `components/Knob.tsx`

- [ ] **Step 1: Add motion imports and rotation wiring**

Edit `components/Knob.tsx`:

1. Add imports:
```tsx
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion"
```

2. Inside the `Knob` function body, before the return, add:
```tsx
const prefersReducedMotion = useReducedMotion()
const { scrollYProgress } = useScroll()
const rawAngle = useTransform(scrollYProgress, [0, 1], [0, 1080])
const smoothAngle = useSpring(rawAngle, { stiffness: 50, damping: 20 })
const angle = prefersReducedMotion ? 0 : smoothAngle
```

3. Change the inner static `<g>` wrapping the six circles/rect to `<motion.g>` with `style={{ rotate: angle }}`:

Before:
```tsx
<g filter="url(#knobShadow)">
  <g>
    <circle cx="0" cy="0" r="44" fill="#000" opacity="0.45" />
    ...
  </g>
</g>
```

After:
```tsx
<g filter="url(#knobShadow)">
  <motion.g style={{ rotate: angle }}>
    <circle cx="0" cy="0" r="44" fill="#000" opacity="0.45" />
    ...
  </motion.g>
</g>
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Browser verification (rotation)**

Reload the browser.
Expected:
- Page load (scrollY = 0): knob sits on control panel, pointer at 12 o'clock.
- Scroll down slowly: the knob's pointer rotates clockwise smoothly with spring physics.
- At end of hero (scrollYProgress ≈ 1): knob has rotated ~3 turns (1080°), with settling spring overshoot.
- DevTools → Rendering → emulate `prefers-reduced-motion: reduce` → knob holds static at 0°.

- [ ] **Step 4: Commit**

```bash
git add components/Knob.tsx
git commit -m "feat(knob): add scroll-driven rotation with spring (3 turns, reduced-motion aware)"
```

---

## Browser Verification Checklist (end-to-end)

Perform all of these manually. Check off each row only after verifying in the browser.

| Scenario | Expected Behavior |
|---|---|
| Page load (scrollY = 0) | Knob sits on machine control panel, pointer at 12 o'clock, no flash to (0,0), fully opaque |
| Mid-hero scroll (scrollY ≈ 400) | Knob rotated ~540° (1.5 turns), machine body opacity ≈ 0.05, knob still tracks control-panel position |
| End of hero scroll (scrollY ≈ 800) | Knob rotated ~1080° (3 turns) with settling spring overshoot, machine body opacity 0, knob still tracks the (now-faded) machine container position |
| Browser resize (drag window width) | Knob repositions smoothly without flash, tracks the machine's control panel at all widths |
| Reduced-motion (DevTools emulate `prefers-reduced-motion: reduce`) | Knob held static at 0° rotation from page load, machine body opacity 0 from page load, knob visible at control-panel position |
| Mobile viewport (375px, DevTools device toolbar) | Knob tracks machine correctly; layout stacked (machine above text); knob still positioned on control panel |
| Scroll-then-resize | After scrolling halfway, resize window: knob snaps to new position without visual glitch; rotation state preserved |

---

## Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| ResizeObserver fires too late (knob flashes at wrong position) | Medium | `isMeasured` gate: `opacity: 0` until first measurement, then flip to `opacity: 1`. Also call `update()` synchronously in the effect before attaching the observer, so the first paint after mount is already measured. |
| Machine container ref not threaded (knob has no target to track) | Low | `HeroMachine` uses `forwardRef` with explicit TypeScript ref typing. `HeroSection` uses `useRef<HTMLDivElement>(null)` and passes it directly. TypeScript enforces match. |
| z-index conflict with SiteNav (knob overlays nav) | Medium | Knob `zIndex: 30`. SiteNav is higher (z-40+). Verify in browser that SiteNav stays on top when scrolling. |
| Filter region clipping (drop-shadow clipped by SVG viewBox) | Low | Knob SVG is 100×100 with viewBox `-50 -50 100 100`. Shadow circle is r=44. Filter region `x=-50% y=-50% width=200% height=200%` gives 100px padding in each direction — well over the shadow's 3px offset + blur. Verify visually. |
| Hydration mismatch (SSR renders knob at wrong coords) | Medium | Knob is `"use client"` and renders at `opacity: 0` until `isMeasured` is `true`. First server render has `rect = null → left: 0, top: 0, opacity: 0` (invisible). Client hydration measures and flips opacity. No visible mismatch. |
| Passive scroll listener performance regression | Low | `window.scroll` listener is `{ passive: true }` and only calls `getBoundingClientRect()` + `setState`. Modern browsers handle this at >60fps for a single observer. If jank appears, switch to `useMotionValueEvent(scrollY, "change", update)` — framer-motion batches these via RAF. |
| SVG defs collision (two SVGs both define `knobBody` etc.) | Low | Task 4 removes the defs from `WashingMachine.tsx`. After that task, only `Knob.tsx`'s defs exist. Verify via grep. |
| `transform: rotate` on `motion.g` doesn't apply (same bug as before) | Medium | The original bug was caused by `motion.g` being nested inside a parent `<g transform>`. In `Knob.tsx`, the `motion.g` is at the SVG root with no parent transform — matches the working drum/door pattern. |

---

## Rollback Plan

If 2.4a is merged and a showstopper appears in production, revert the merge commit. The four files affected:

- `components/Knob.tsx` (delete — file is new)
- `components/WashingMachine.tsx` (restore knob group + knobRotate MotionValue + knobBody/knobTop/knobShadow defs)
- `components/HeroMachine.tsx` (remove forwardRef, restore plain function component)
- `components/sections/HeroSection.tsx` (remove useRef, Knob import, `<Knob />` mount)

```bash
git revert <merge-commit-sha>
```

Since the 2.4a tasks commit one file at a time (5 commits total), a more granular rollback is also possible: `git revert <task-5>..HEAD` to drop rotation only, keeping the extraction. But simplest is revert-the-merge.

---

## Acceptance Criteria

Check off each after browser verification passes:

- [ ] There is exactly ONE knob visible on the page at all times (no duplicates, no ghosts)
- [ ] At page load, the knob sits pixel-aligned on the washing machine's control panel
- [ ] At page load, the knob is fully opaque (no fade-in from 0, no flash at viewport origin)
- [ ] Scrolling the page rotates the knob smoothly with visible spring physics
- [ ] At end of hero scroll, the knob has rotated ~3 full turns (1080°) with spring overshoot
- [ ] Resizing the browser repositions the knob correctly without visual glitch
- [ ] `prefers-reduced-motion: reduce` holds the knob static at 0°
- [ ] The washing machine drum and door still rotate correctly (regression check)
- [ ] The machine body still fades on scroll (regression check)
- [ ] No new TypeScript errors (`npx tsc --noEmit` passes)
- [ ] Git history has 5 clean commits matching the task commit messages
- [ ] `grep -rE "knobRotate|knobBody|knobTop|knobShadow" components/WashingMachine.tsx` returns no matches

---

## Not in This Plan (future work — do not sneak in)

**2.4b — viewport-edge morph:** When user scrolls past the hero section, the knob should morph its position from "on the control panel" to a viewport-pinned position (left-edge on desktop, top-edge on mobile). This requires interpolating the `computePosition` output against a viewport-pinned target based on scroll progress past a threshold. Not in this plan.

**2.4c — label ring + click navigation:** Eight section labels laid out radially around the knob in a polar arrangement, each a clickable anchor to a page section. Requires active-section tracking via `IntersectionObserver`. Click handlers go on labels, NOT on the knob body. Not in this plan.

Anything that isn't "extract the knob into a standalone component and apply scroll-driven rotation" does not belong in this 2.4a plan.
