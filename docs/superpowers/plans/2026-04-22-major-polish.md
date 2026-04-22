# Major Landing Polish (Washing Machine Swap + Top Nav + Section Transitions + Emoji Shrink)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Model tier:** see [docs/superpowers/project-rules.md](../project-rules.md) — Opus 4.7 PRIMARY for all code-writing subagents (implementer, spec reviewer, code quality reviewer). Haiku 4.5 BANNED. The controller must announce the tier per dispatch and ask before any downgrade.

**Goal:** Replace the placeholder hero machine with the Claude Design SVG washing machine, add a top navigation bar, make sections materialize/dematerialize in place on scroll, and shrink the section emojis.

**Architecture:**
- **Washing Machine:** New self-contained React component `WashingMachine.tsx` ports the Claude Design SVG verbatim. Scroll drives `drumRotor` + `doorRotor` rotations via `useScroll → useSpring` mapped to SVG `transform="rotate(deg 450 590)"`. The existing DialNavigator stays as a separate overlay — only its knob *visual* adopts the design's blue knob spec; its morph/rotation/click logic is untouched.
- **Top Nav:** New `SiteNav.tsx` component mounted in `app/page.tsx` above `<main>`. Fixed-top, `z-50` (above dial's `z-40`). Desktop: wordmark + links + CTA. Mobile: wordmark + CTA + hamburger → slide-down drawer.
- **Section transitions:** Extend the existing `SectionReveal` component with a scroll-driven outer motion transform (opacity + scale) scoped to each section's viewport travel. Existing staggered child reveal (`revealItem`, `whileInView`, `once: true`) is preserved unchanged. No per-section file refactor required.
- **Emoji shrink:** One CSS edit to `app/globals.css`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.7, Tailwind v4, framer-motion 11.

---

## Design Decisions

### Section transition approach
Chose **per-section `useScroll` with ref target** over CSS scroll-snap, CSS `animation-timeline: view()`, and Intersection Observer. Reasons:

- Coexists with the DialNavigator's existing global `useScroll` — both read `scrollY` independently, no shared state.
- Document scrolls normally (no sticky/snap layout changes that would conflict with `scrollIntoView` used by the dial click handler).
- Continuous progress → smooth enter AND exit fade (Intersection Observer gives binary state only).
- Works in Safari/WebKit today (CSS `animation-timeline` does not reliably as of 2026).
- Preserves the existing staggered child reveal — parent wrapper opacity/scale compose cleanly with child `whileInView` one-shot animations.

Map: `useScroll({ target: ref, offset: ["start end", "end start"] })` → `progress`.
- `opacity = useTransform(progress, [0, 0.18, 0.82, 1], [0, 1, 1, 0])`
- `scale   = useTransform(progress, [0, 0.18, 0.82, 1], [0.94, 1, 1, 0.98])`
- For `prefersReducedMotion`: skip the transforms, render at opacity 1, scale 1.

### Washing machine SVG port
The design HTML file at `/tmp/claude-design-washing-machine/laundry-machine/project/Washing Machine.html` is the source of truth. Port its SVG verbatim into a React component, preserving:
- viewBox `0 0 900 1100`
- All `<defs>` (gradients, filters, clipPaths)
- `#drumRotor`, `#doorRotor`, `#laundryPile`, `#glassClip` IDs → converted to `<motion.g>` elements where rotation is needed
- Panel knob at `translate(450, 210)` — preserved as-is since the DialNavigator overlays it
- Drain cover, control panel, gasket ring, paddle pattern, laundry pile paths

Scroll → rotation: map `scrollY` across the page (0 to `documentHeight - viewportHeight`) to 0–1080° rotation (3 full turns), applied to both `drumRotor` and `doorRotor` via `useMotionTemplate` → `transform="rotate(${deg} 450 590)"`. Smoothed with `useSpring({ stiffness: 50, damping: 20 })`. `prefersReducedMotion`: hold at 0°.

### Knob visual update
The Claude Design knob spec (at `translate(450, 210)`):
- Outer circle `r=42` with linear gradient `#5AA8FF → #2E86F0 → #1A63C4 → #0D3F86`
- Top cap `r=34` with a highlight gradient
- Center dot `r=2.2` fill `#F4F6FA`
- Pointer indicator rect `(x=-1.8, y=-30, w=3.6, h=11, rx=1.6)` fill `#F4F6FA` opacity `0.9`

We map this to our DialNavigator geometry (`CX=250, CY=250, KNOB_R=160`) by scaling 160/42 ≈ 3.81×:
- Body circle `r=160` at (250, 250), filled with the new 4-stop blue gradient
- Top cap circle `r=130` (34×3.81) at (250, 250), filled with the highlight gradient
- Center dot `r=8.4` at (250, 250)
- Pointer rect width=13.7, height=42, rx=6.1, positioned so tip sits at (250, 250 - 115) and root at (250, 250 - 73) — replaces the current white indicator line

The rotation wrapper that currently rotates the indicator continues to work (wrap the pointer rect in the existing rotating `<motion.g>` or keep the indicator in the rotation ring; today's line sits in the outer SVG, not inside the ring — we'll move it into the ring so the knob rotates with the section change like the current visual).

### Dial/machine knob alignment at hero state
Machine viewBox knob center: 450/900 = 50% X, 210/1100 = 19% Y.
At hero, dial sits at `HERO_LEFT_VW=30vw` and `HERO_TOP_PCT=40%` with `HERO_SCALE=0.22` (≈110px diameter). The machine renders in the left column of the hero grid. After mounting, visually verify the dial's knob overlays the machine's panel knob. Tune `HERO_LEFT_VW`, `HERO_TOP_PCT`, `HERO_SIZE` only if misaligned. Expected ballpark after the machine switch: `HERO_LEFT_VW ≈ 22–28`, `HERO_TOP_PCT ≈ 24–32`, `HERO_SIZE ≈ 95–120` — implementer picks values that visually align.

---

## Task Breakdown

**Execution status:**
- ✅ Phase 1 (Washing Machine SVG swap) — commits `4479c27`, `b8eb72a`, `517e917`, `9e8431a`, `a34969a`
- ✅ Phase 2 (Top Nav) — commits `19a6f0e`, `e220a6f`, `dcf5c5e` (a11y follow-up), `920eb3d`, `aecf6c1` (scroll-padding follow-up)
- ⏳ Phase 2.5 (Knob Unification regression fix) — 2.4a in progress; 2.4b, 2.4c pending
- ⏳ Phase 3 (Section transitions)
- ⏳ Phase 4 (Emoji shrink)
- ⏳ Phase 5 (Verify + push)

---

### Task 1.1: Port Washing Machine SVG (static)

**Files:**
- Create: `components/WashingMachine.tsx`
- Reference: `/tmp/claude-design-washing-machine/laundry-machine/project/Washing Machine.html`

- [ ] **Step 1: Create the component file** with a static SVG port of the design. Preserve the viewBox, all `<defs>` (gradients, filters, clipPaths), cabinet, control panel, knob, door assembly, drum rotor, laundry pile, tinted glass overlay, drain cover, and floor shadow exactly as in the HTML. Use React-style camelCase attribute names (`strokeWidth`, `stopColor`, `clipPath`, `xlinkHref` → `href`, etc.). Wrap groups that will rotate (`drumRotor`, `doorRotor`) as plain `<g id="drumRotor">` / `<g id="doorRotor">` for now — motion wiring comes in Task 1.2. Export named `WashingMachine`. Accept a `className?: string` prop for sizing.

```tsx
"use client"

import { motion } from "framer-motion"

interface WashingMachineProps {
  className?: string
}

export function WashingMachine({ className }: WashingMachineProps) {
  return (
    <svg
      viewBox="0 0 900 1100"
      className={className}
      role="img"
      aria-label="Çamaşır makinesi illüstrasyonu"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Port all gradients/filters/clipPaths from the HTML verbatim */}
        {/* ... */}
      </defs>

      {/* Floor shadow */}
      {/* Cabinet (bodyGrad, bodyGradV) */}
      {/* Detergent drawer */}
      {/* Control panel with centered blue knob at translate(450, 210) */}
      {/* Door assembly: gasket ring, inner ring, tick mark — all in <g id="doorRotor"> */}
      {/* Drum: holes, paddles, laundry pile — all in <g id="drumRotor"> */}
      {/* Tinted glass overlay, radial vignette, reflection sweep */}
      {/* Drain cover (bottom-right, minimal) */}
    </svg>
  )
}
```

  The full JSX must be a faithful port. Implementer should open the HTML, copy the `<svg>...</svg>` body, convert each attribute (`stroke-width` → `strokeWidth`, `stop-color` → `stopColor`, `clip-path` → `clipPath`, `xlink:href` → `href`), and wrap in the function above. Do NOT port the CSS `.sticky-wrap`/`body` styles or the `<script>` block — rotation wiring is a React concern handled in Task 1.2.

- [ ] **Step 2: Verify TypeScript build** via `pnpm exec tsc --noEmit`. Fix any attribute-name or JSX errors.

- [ ] **Step 3: Commit**

```bash
git add components/WashingMachine.tsx
git commit -m "feat(machine): port Claude Design washing machine SVG (static)"
```

### Task 1.2: Scroll-driven drum + door rotation

**Files:**
- Modify: `components/WashingMachine.tsx`

- [ ] **Step 1: Add scroll-driven motion values.** Import `useScroll`, `useTransform`, `useSpring`, `useMotionTemplate`, `useReducedMotion` from `framer-motion`. Inside the component:

```tsx
const prefersReducedMotion = useReducedMotion()
const { scrollYProgress } = useScroll()
// 3 full turns across the page
const rawAngle = useTransform(scrollYProgress, [0, 1], [0, 1080])
const smooth = useSpring(rawAngle, { stiffness: 50, damping: 20 })
const angle = prefersReducedMotion ? 0 : smooth
const drumTransform = useMotionTemplate`rotate(${angle} 450 590)`
const doorTransform = useMotionTemplate`rotate(${angle} 450 590)`
```

- [ ] **Step 2: Change `<g id="drumRotor">` and `<g id="doorRotor">` to `<motion.g>`** and pass `transform={drumTransform}` / `transform={doorTransform}`. Example:

```tsx
<motion.g id="drumRotor" transform={drumTransform}>
  {/* paddles, pile, holes */}
</motion.g>

<motion.g id="doorRotor" transform={doorTransform}>
  {/* gasket, inner ring, tick */}
</motion.g>
```

  Note: `prefersReducedMotion` returns `true | null` from framer-motion; when `true`, pass the literal `0` to `useMotionTemplate` instead of the spring. Handle this by conditionally defining `angle`:

```tsx
const angle = prefersReducedMotion ? 0 : smooth
```

  The template tag accepts both a number and a MotionValue. Verify by TypeScript build.

- [ ] **Step 3: Verify build** — `pnpm exec tsc --noEmit` and `pnpm build`. Fix any errors.

- [ ] **Step 4: Commit**

```bash
git add components/WashingMachine.tsx
git commit -m "feat(machine): drive drum and door rotation from scroll"
```

### Task 1.3: Replace HeroMachine with WashingMachine

**Files:**
- Modify: `components/HeroMachine.tsx`

- [ ] **Step 1: Replace contents.** Remove the `<Image>` and drum overlay. Render `<WashingMachine>` inside the existing motion wrapper. Preserve the scroll-driven opacity fade (the section is supposed to recede as the user scrolls past hero). Change aspect ratio so the portrait SVG (900×1100) isn't squished — switch from `aspect-[4/3]` to allowing natural SVG scaling.

```tsx
"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { WashingMachine } from "@/components/WashingMachine"

export function HeroMachine() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 380], [1, 0], { clamp: true })
  const effectiveOpacity = prefersReducedMotion ? 0 : opacity

  return (
    <motion.div
      className="relative w-full"
      style={{ opacity: effectiveOpacity }}
      aria-hidden="true"
    >
      <WashingMachine className="block h-auto w-full" />
    </motion.div>
  )
}
```

- [ ] **Step 2: Verify build** — `pnpm build`. Fix any errors.

- [ ] **Step 3: Commit**

```bash
git add components/HeroMachine.tsx
git commit -m "feat(hero): mount WashingMachine SVG in hero slot"
```

### Task 1.4: DialNavigator knob visual update

**Files:**
- Modify: `components/DialNavigator.tsx`

- [ ] **Step 1: Replace knob `<defs>` and circle + indicator** in both the desktop and mobile SVG blocks with the new knob spec scaled to `KNOB_R=160`. Do NOT change `CX`, `CY`, `KNOB_R`, any morph/rotation/scale logic, or the `<motion.div>` ring wrapper. Only the SVG visuals inside the outer motion div change.

  New defs (desktop block):
```tsx
<defs>
  <linearGradient id="knobBody" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%"   stopColor="#5AA8FF" />
    <stop offset="40%"  stopColor="#2E86F0" />
    <stop offset="75%"  stopColor="#1A63C4" />
    <stop offset="100%" stopColor="#0D3F86" />
  </linearGradient>
  <linearGradient id="knobTop" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%"   stopColor="#6EB6FF" />
    <stop offset="100%" stopColor="#1E6DCC" />
  </linearGradient>
</defs>
```

  New body + top cap + center dot:
```tsx
<circle cx={CX} cy={CY} r={KNOB_R} fill="url(#knobBody)" />
<circle cx={CX} cy={CY} r={130} fill="url(#knobTop)" />
<circle cx={CX} cy={CY} r={8.4} fill="#F4F6FA" />
```

  Replace the existing `<motion.line>` indicator with a `<motion.rect>` pointer:
```tsx
<motion.rect
  x={CX - 6.85}
  y={CY - 115}
  width={13.7}
  height={42}
  rx={6.1}
  fill="#F4F6FA"
  opacity={0.9}
  style={{ opacity: effectiveIndicatorOpacity }}
/>
```

  The mobile block uses separate `<defs>` ids (`knobBody-mobile`, `knobTop-mobile`) — duplicate the gradients under those ids to avoid SSR-hydration clashes, then reference them. The mobile indicator already points DOWN (INNER_R / OUTER_R on the +Y axis). Mirror the rect: `y={CY + 73}` pointing down from center. Keep the existing `effectiveIndicatorOpacity` wiring.

  **Important — rotation:** the current indicator line sits in the outer SVG (not inside the rotating ring wrapper), so it does NOT rotate with section changes; only the labels rotate. Keep this behavior — place the new pointer rect in the same outer SVG. This is the visual the chat transcript settled on (fixed indicator, rotating ring of labels).

- [ ] **Step 2: Verify build** — `pnpm build`. Fix any errors.

- [ ] **Step 3: Commit**

```bash
git add components/DialNavigator.tsx
git commit -m "feat(dial): adopt Claude Design blue knob with pointer rect"
```

### Task 1.5: Tune hero-state dial placement

**Files:**
- Modify: `components/DialNavigator.tsx` (constants only)

- [ ] **Step 1: Open the dev server** (`pnpm dev`) and view the hero at a desktop viewport (≥1024px). Inspect where the DialNavigator's knob sits relative to the Washing Machine's panel knob.

- [ ] **Step 2: Tune constants** if misaligned. The knob on the SVG is at 50% X / 19% Y of the viewBox. When the SVG renders in the left column of a `max-w-[1400px]` `grid-cols-2`, the machine's knob screen position depends on column width. Start with:

```tsx
const HERO_LEFT_VW = 24     // was 30 — knob is slightly left of column midline
const HERO_TOP_PCT = 28     // was 40 — panel is in upper third of the machine
const HERO_SIZE = 100        // was 110 — slightly smaller to match panel knob
```

  Adjust iteratively until the dial's hero-state circle visually overlays the machine's panel knob (±10px is fine). Mobile constants (`MOBILE_HERO_DIAL_VW`, `MOBILE_HERO_TOP_PCT`) may also need tuning — check on a narrow viewport.

- [ ] **Step 3: Verify build** — `pnpm build`.

- [ ] **Step 4: Commit**

```bash
git add components/DialNavigator.tsx
git commit -m "feat(dial): align hero-state knob overlay with new machine panel"
```

### Task 2.1: Create SiteNav component (desktop shell)

**Files:**
- Create: `components/SiteNav.tsx`

- [ ] **Step 1: Implement fixed-top nav** with the WhatsApp CTA URL matching `app/page.tsx`. The hamburger + drawer come in Task 2.2 — keep this task focused on the desktop shell + mobile CTA-only layout (no drawer yet).

```tsx
"use client"

import Image from "next/image"

const WHATSAPP_URL =
  "https://wa.me/908503033193?text=Merhaba%2C%20sipari%C5%9F%20vermek%20istiyorum."

const links = [
  { label: "Hizmetler",    href: "#hizmetler" },
  { label: "Nasıl Çalışır", href: "#nasil" },
  { label: "Fiyatlar",     href: "#fiyatlar" },
  { label: "SSS",          href: "#sss" },
] as const

export function SiteNav() {
  return (
    <header
      role="banner"
      className="fixed inset-x-0 top-0 z-50 h-14 border-b border-[#E5E7EB] bg-[#FAFAF7] md:h-16"
    >
      <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-6 lg:px-[80px]">
        <a href="#basla" aria-label="YIKAT ana sayfa" className="flex items-center">
          <Image
            src="/images/yikat-logo-black.png"
            alt="YIKAT"
            width={80}
            height={32}
            className="h-6 w-auto md:h-7"
            priority
          />
        </a>

        <nav aria-label="Ana gezinti" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#0F172A] transition-colors hover:text-[#2798ff]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center rounded-full bg-[#2798ff] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1a7de8] md:h-10 md:px-5"
          >
            Sipariş Ver
          </a>
        </div>
      </div>
    </header>
  )
}
```

  Check: `public/images/yikat-logo-black.png` must exist. If not, use the white logo on a dark background OR add a sibling logo. Implementer should grep `ls public/images/` and pick the correct file name — adjust the `src` accordingly.

- [ ] **Step 2: Verify build** — `pnpm build`.

- [ ] **Step 3: Commit**

```bash
git add components/SiteNav.tsx
git commit -m "feat(nav): add SiteNav shell (desktop + mobile CTA)"
```

### Task 2.2: Mobile hamburger + drawer

**Files:**
- Modify: `components/SiteNav.tsx`

- [ ] **Step 1: Add state + hamburger button + drawer.** The drawer is a full-width overlay that slides down from below the top-bar when open, showing the 4 links stacked. Close on link click or Escape. Use framer-motion's `AnimatePresence` for the slide-in/out.

```tsx
"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

// ... (WHATSAPP_URL, links unchanged)

export function SiteNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <header
        role="banner"
        className="fixed inset-x-0 top-0 z-50 h-14 border-b border-[#E5E7EB] bg-[#FAFAF7] md:h-16"
      >
        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-6 lg:px-[80px]">
          {/* logo ... (unchanged) */}

          <nav aria-label="Ana gezinti" className="hidden items-center gap-8 md:flex">
            {/* links ... (unchanged) */}
          </nav>

          <div className="flex items-center gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="...">
              Sipariş Ver
            </a>
            <button
              type="button"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-9 items-center justify-center rounded-md text-[#0F172A] transition-colors hover:bg-[#F5F5F2] md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-14 z-40 border-b border-[#E5E7EB] bg-[#FAFAF7] md:hidden"
          >
            <nav aria-label="Mobil gezinti" className="mx-auto max-w-[1400px] px-6 py-4">
              <ul className="flex flex-col gap-2" role="list">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2 py-3 text-base font-medium text-[#0F172A] hover:bg-[#F5F5F2]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

  Note the drawer's `z-40` (below the header's `z-50`) so the header sits above it but both are above the dial/content. Sipariş Ver remains visible at all times (both in the header AND the drawer) — that's intentional per the spec.

- [ ] **Step 2: Verify build** — `pnpm build`.

- [ ] **Step 3: Commit**

```bash
git add components/SiteNav.tsx
git commit -m "feat(nav): add mobile hamburger drawer"
```

### Task 2.3: Mount SiteNav in page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Import + mount** `<SiteNav />` above `<main>`, below `<DialNavigator />`.

```tsx
import { SiteNav } from "@/components/SiteNav"

// ...inside MotionConfig:
<DialNavigator />
<SiteNav />
<main>...</main>
```

- [ ] **Step 2: Verify build** — `pnpm build`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(nav): mount SiteNav on landing page"
```

---

## Phase 2.5 — Knob Unification (regression fix)

**Context:** After Phase 1 + Phase 2, two blue knobs were visible at the hero on both desktop and mobile:
- The **DialNavigator overlay** — its own SVG circle rendered fixed, intended to overlay the machine's panel knob at hero and morph into a large nav dial on scroll.
- The **WashingMachine SVG's own panel knob** — static visual inside the SVG at `translate(450 210)`.

On desktop these landed close but misaligned; on mobile the DialNavigator's 70vw diameter dwarfed the machine's panel knob. User direction: collapse to a **single knob** — the WashingMachine SVG's own panel knob becomes the navigation dial. All DialNavigator behaviors attach to this single element. `DialNavigator.tsx` is deleted.

**Non-negotiable constraints:**
- Panel knob visual (gradients, shadow, pointer rect, center dot, groove) stays exactly as it is in `components/WashingMachine.tsx:237-250`.
- No second rendering of the knob anywhere — one element, one identity, one transform chain.
- All DialNavigator behaviors port onto this element: scroll-rotation, scroll-morph to viewport-left (desktop) / viewport-top (mobile), 8-label ring, click-to-section on labels, click-to-top on the knob itself, active-section highlighting, mobile variant, reduced-motion handling.

**Architecture approach:**
- WashingMachine becomes `position: fixed` with an invisible spacer in the hero grid reserving layout footprint (2.4b).
- Non-knob SVG elements wrapped in `<motion.g id="machineBody">` with scroll-driven opacity 1 → 0 (2.4a).
- Knob `<motion.g>` gains scroll-driven rotation (2.4a) + scroll-driven translate/scale to viewport-left-center target computed from measured SVG rect (2.4b).
- 8-label ring rendered as HTML fixed overlay (via React portal) anchored to the knob's live screen position (2.4c).

**Split:** 2.4a (remove overlay, add rotation + machine-body fade) → verify → 2.4b (position:fixed + knob morph) → verify → 2.4c (label ring + click handlers + active-section).

---

### Task 2.4a: Remove DialNavigator; add scroll-rotation + machine-body-fade to SVG knob

**Files:**
- Delete: `components/DialNavigator.tsx`
- Modify: `app/page.tsx`, `components/HeroMachine.tsx`, `components/WashingMachine.tsx`
- Keep alive for 2.4c (do NOT delete yet): `components/DialProgram.tsx`, `hooks/use-active-section.ts`, `lib/sections.ts`

**Steps:**

1. Delete `components/DialNavigator.tsx` entirely.

2. `app/page.tsx`: remove `import { DialNavigator } from "@/components/DialNavigator"` and the `<DialNavigator />` mount.

3. `components/HeroMachine.tsx`: remove the scroll-driven opacity fade (the `useScroll`, `useTransform`, `useReducedMotion`, and `style={{ opacity }}` wiring). The wrapper becomes a plain `<div>` (or a `motion.div` with no scroll-opacity style) — the fade is now per-element inside WashingMachine.

4. `components/WashingMachine.tsx`:
   - Wrap all non-knob machine elements (floor shadow, cabinet, detergent drawer, drain cover, door assembly, drum + clothes, hinge, side-edge highlights — everything EXCEPT the knob group) in a single `<motion.g>` with `opacity` bound to `useTransform(scrollY, [0, 380], [1, 0], { clamp: true })`. For reduced motion: hold at opacity 1 (align with `SectionReveal`'s convention — machine stays fully visible, no scroll-driven fade).
   - Convert the existing knob group `<g filter="url(#knobShadow)" transform="translate(450 210)">` (lines 237-250) to `<motion.g>` with a combined transform template: `translate(450 210) rotate(${knobAngle})`. Use the same scroll-driven 3-turn rotation pattern as the drum/door (`useTransform(scrollYProgress, [0, 1], [0, 1080])` + `useSpring`). Reduced-motion: hold rotation at 0.
   - Knob group visual (circles, pointer rect, groove, shadow filter) unchanged.

5. Verify: `pnpm exec tsc --noEmit` clean + `pnpm build` passes.

6. Commit: `feat(machine): unify knob — remove DialNavigator, rotate & fade in place`

**Outcome:** One knob on screen (the machine's panel knob), rotates with scroll like the drum. Machine body/drum/door/display fade around it as the user scrolls past hero. Navigation works via SiteNav only during this intermediate state (no labels yet, no morph-to-viewport-left yet — those come in 2.4b and 2.4c).

---

### Task 2.4b: Position:fixed WashingMachine; morph knob to viewport-left / mobile-top

**Files:**
- Modify: `components/HeroMachine.tsx`, `components/sections/HeroSection.tsx`, `components/WashingMachine.tsx`

**Steps (scope — refined after 2.4a verification):**

1. Wrap WashingMachine in a `position: fixed` container whose hero-state position matches the hero left-column natural rendering. Add invisible spacer in HeroSection's left grid column so the right-column text doesn't reflow.
2. In WashingMachine: add a ref on the SVG + ResizeObserver + resize listener to track `svgRect`. Compute knob's scrolled-state target in viewBox coordinates:
   - Desktop target X = `-svgRect.left / scale`, Y = `(viewportHeight/2 - svgRect.top) / scale`, scale ≈ `(viewportHeight * 0.4) / 84`
   - Mobile target X = `(vw/2 - svgRect.left) / scale`, Y = `(SCROLLED_MOBILE_TOP - svgRect.top) / scale` where SCROLLED_MOBILE_TOP is below the 56px nav
3. Animate the knob's `<motion.g>` transform through scrollY range (TBD thresholds) interpolating translate + scale to target. Rotation from 2.4a continues.
4. Reduced-motion: hold knob at hero position (no morph).

**Commit:** `feat(machine): morph knob to viewport-left on scroll (desktop + mobile)`

**Outcome:** Knob is visually continuous from hero panel position to scrolled nav position. No labels yet.

---

### Task 2.4c: Port 8-label ring as fixed HTML overlay anchored to knob screen position

**Files:**
- Modify: `components/WashingMachine.tsx` (expose knob screen center as shared `MotionValue<{x, y, radius}>`)
- Create: new `components/DialLabelRing.tsx` (or rewritten DialProgram consumer)
- Modify: `app/page.tsx` (mount DialLabelRing as sibling of `<main>`)
- Cleanup: delete `hooks/use-active-section.ts` if no other consumers, delete `components/DialProgram.tsx` if replaced, keep `lib/sections.ts` (consumed by section components)

**Steps (scope — refined after 2.4b verification):**

1. Expose the knob's current screen center + radius from WashingMachine via a shared `MotionValue` (or a ref callback).
2. New `DialLabelRing` component renders 8 `<button>` labels positioned around the knob's screen center at `radius × 1.35` (or whatever lands outside the knob body). Uses React portal to `document.body` for fixed positioning.
3. Labels rotate with the knob's scroll-rotation; text inside each label counter-rotates to stay upright (matches old DialProgram pattern).
4. Click handlers: each label calls `document.getElementById(id).scrollIntoView({ behavior, block: "start" })`.
5. Knob itself gets `onClick`: scroll to `#basla`.
6. Active-section highlighting: use `useActiveSection` hook, active label gets brand highlight.
7. Mobile: +90° rotation offset so active label lands at 6 o'clock (matches old DialNavigator mobile behavior).
8. Labels opacity: hidden at hero state (scrollY < threshold), fade in as knob morphs.
9. Reduced-motion: labels rendered as static fixed elements (no rotation, no scroll-driven fade), knob held at hero position.

**Commit:** `feat(nav): add knob label ring + click-to-section handlers`

**Outcome:** Full nav parity with the old DialNavigator. Single SVG knob + HTML label ring.

---

### Task 3.1: Scroll-driven enter/exit on SectionReveal

**Files:**
- Modify: `components/SectionReveal.tsx`

- [ ] **Step 1: Extend SectionReveal** with a `ref`-targeted `useScroll` and transforms for opacity + scale. Preserve `variants={container}` + `whileInView` + `viewport={{ once: true, amount: 0.3 }}` for the existing staggered child reveal. Respect `useReducedMotion` — skip the transforms and render at opacity 1, scale 1 when reduced.

```tsx
"use client"

import {
  motion,
  type Variants,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion"
import { useRef, type ReactNode } from "react"

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0 },
  },
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

interface SectionRevealProps {
  id: string
  ariaLabel?: string
  className?: string
  children: ReactNode
}

export function SectionReveal({ id, ariaLabel, className, children }: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.94, 1, 1, 0.98])

  const effectiveOpacity = prefersReducedMotion ? 1 : opacity
  const effectiveScale = prefersReducedMotion ? 1 : scale

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={className}
      style={{
        opacity: effectiveOpacity,
        scale: effectiveScale,
        transformOrigin: "center",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </motion.section>
  )
}
```

  **Hero consideration:** The hero section sits at the very top. At load, `scrollYProgress` is ≈ 0.5 (section spans from viewport top to viewport bottom roughly midway through the "start end"→"end start" range). The map `[0, 0.18, 0.82, 1] → [0, 1, 1, 0]` gives opacity 1 at 0.5 — hero is fully visible on load. ✓ No special case needed.

- [ ] **Step 2: Verify build** — `pnpm build`.

- [ ] **Step 3: Commit**

```bash
git add components/SectionReveal.tsx
git commit -m "feat(sections): scroll-driven enter/exit fade+scale on section wrappers"
```

### Task 4.1: Shrink section emojis

**Files:**
- Modify: `app/globals.css:128-145`

- [ ] **Step 1: Edit the emoji size rules.** Change mobile from 110px → 80px and desktop (≥768px) from 180px → 120px. No other changes.

```css
.emoji-breathe,
.emoji-static {
  font-size: 80px;
  line-height: 1;
}
@media (min-width: 768px) {
  .emoji-breathe,
  .emoji-static {
    font-size: 120px;
  }
}
```

- [ ] **Step 2: Verify build** — `pnpm build`.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style(emoji): shrink section emojis (80px / 120px)"
```

### Task 5.1: Final verification + push

**Files:** none (verify + push only)

- [ ] **Step 1: Run full build** — `pnpm build`. Must succeed with no type errors, no runtime errors. If errors, dispatch a fix subagent.

- [ ] **Step 2: Visual smoke check.** Start `pnpm dev`, open `http://localhost:3000`:
  - Hero renders new washing machine SVG
  - Dial's blue knob overlays machine panel knob at hero state
  - Scrolling: dial morphs, drum + door rotate, sections fade in/out with subtle scale
  - Top nav fixed at top; desktop shows links; mobile shows hamburger → drawer opens/closes
  - Emojis are visibly smaller (80/120 instead of 110/180)
  - No console errors, no layout shifts

- [ ] **Step 3: Push to origin**

```bash
git push origin feat/landing-redesign
```

- [ ] **Step 4: Confirm push** — `git log origin/feat/landing-redesign -12 --oneline` should show the 12 new commits from this plan.

---

## Self-Review

- **Spec coverage:**
  - Item 1 (washing machine swap) → Tasks 1.1, 1.2, 1.3, 1.4, 1.5 ✓
  - Item 2 (top nav) → Tasks 2.1, 2.2, 2.3 ✓
  - Item 3 (section transitions) → Task 3.1 ✓
  - Item 4 (emoji shrink) → Task 4.1 ✓
  - Verify + push → Task 5.1 ✓
- **Placeholder scan:** No TBDs. Every code step has concrete code.
- **Type consistency:** `WashingMachine` props interface (`className?: string`) used in 1.1 and consumed identically in 1.3. `SectionReveal` public interface (`id, ariaLabel, className, children`) unchanged in 3.1 — no section file edits needed.
- **Model tier:** References `docs/superpowers/project-rules.md` per project rules.

---

## Execution notes

- Tasks run **sequentially** (12 tasks). Subagent-driven: implementer → spec reviewer → code quality reviewer per task.
- Phase 1 tasks (1.1→1.5) must stay ordered (1.2 depends on 1.1; 1.3 depends on 1.2; etc.).
- Phase 2 (2.1→2.3) is independent of Phase 1 and 3 but we'll run it after Phase 1 completes to keep sequencing simple.
- Phase 3 (3.1) is independent of 1 and 2. Will run after Phase 2.
- Phase 4 (4.1) is trivial and independent. Will run after Phase 3.
- Phase 5 (verify + push) runs last.
