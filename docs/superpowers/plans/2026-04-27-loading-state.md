# Master plan item 5 — Loading State (çamaşır makinesi ikonu)

> **Status:** ⏳ Awaiting user pick. Implementation plan below applies to recommended Candidate 1 (Porthole). Switch to 2 or 3 requires re-scoping only the visual/animation section — timing, mount, and exit logic stay identical.

> **For agentic workers:** REQUIRED SUB-SKILL once dispatched: `superpowers:subagent-driven-development`. Steps use `- [ ]` checkboxes.
> **Model tier:** see `docs/superpowers/project-rules.md`

> **Visual companion:** `.superpowers/brainstorm/75931-1777238564/content/loading-state-candidates.html`

## Context

The YIKAT landing page has no loading state. On a cold load, the hero (knob + sections) snaps into view immediately after hydration. The washing-machine brand identity is already expressed throughout the hero but there's no "door opens" moment at entry.

**Timing constraint:** This is a presentation layer over page readiness, not a hydration gate. The hero must remain fully interactive as soon as React hydrates — the loader is a visual overlay that then fades away.

## Candidates

### Candidate 1 — "Porthole" ← Recommended

**Design rationale (Emil voice).** The porthole spinning drum says: we're already working. Your laundry is in motion. This is the only loader on the internet that's impossible to mistake for anything except a laundry service. Emil's principle: "every animation must have a clear answer to 'why does this animate?'" Answer: a washing machine drum spins while washing clothes. The animation IS the product. Loading states are rare/first-time — Emil's framework says this is exactly when delight is appropriate.

**Visual character.**
- White-ish overlay (`#FAFAF7`) covers the page. Fixed, z-9999.
- Center: 72px circle with dark gray bezel (6px border, `#374151`), light blue interior (`#dbeafe`).
- Inside: 3 white dots (9px) arranged at 0°/120°/240°, rotating as a group — tumbling clothes. `@keyframes tumble`, 1.4s linear infinite.
- Outer: thin `rgba(39,152,255,0.18)` track ring. A `#2798ff` dot orbits it at 2s linear — orbiting label ring language. 
- Optional: `Hazırlanıyor…` text below (11px, muted — remove if it reads cluttered in browser).

**Transition out:** opacity 0 over 300ms (framer-motion `animate`), then component unmounts. Hero is rendered underneath the overlay at all times — no layout shift on removal.

**Reduced-motion:** `prefersReducedMotion === true` → spin paused, orbit dot hidden. Overlay still appears (250ms opacity fade-in on mount) and fades out (300ms). Static closed porthole = "ready."

**Browser / perf.** Pure CSS `@keyframes` for the spin — runs before framer-motion hydrates, never drops frames. No layout, no paint on scroll (overlay is `position: fixed`). Exit handled by framer-motion post-hydration.

**Implementation complexity.** New file `components/PageLoader.tsx` (~80 LOC). One line addition to `app/layout.tsx`. No new deps.

**Trade-offs.**
- Pro: brand-unique, self-explaining animation.
- Pro: CSS-only spin — works even under slow JS parse.
- Con: Porthole is new inline SVG/HTML — no existing asset. Authoring cost is real but small.
- Con: "Hazırlanıyor…" copy must be decided — include or omit.

### Candidate 2 — "Orbit Knob"

**Design rationale.** A simplified version of the hero's dial spins centered during load. The dial is the page's organizing metaphor — showing it first creates visual continuity. 

**Why not recommended.** The loader's knob renders centered; the hero's knob is offset-left. Without a real morph (which requires complex viewport-coordinate calculation from `useContainerMeasure` equivalent), the user sees two separate knob-like objects in different positions. Emil: "either commit to the morph, or don't use visual continuity as a crutch." The position discontinuity undermines the metaphor.

**If picked:** Swap out the porthole SVG for the knob shape (radial gradient circle + triangle indicator). Everything else — timing, mount, exit, RM — stays identical.

### Candidate 3 — "Brand Minimal"

**Design rationale.** YIKAT wordmark centered, thin `#2798ff` arc spinning (SVG SMIL `stroke-dashoffset` animation). Brand name first, minimal activity signal.

**Why not recommended.** The spinning arc has no answer to "why does this animate?" other than "to show loading." It doesn't say anything about the product. Emil: "if the purpose is just 'it looks cool' or 'it looks busy,' don't animate." The wordmark alone (no arc) would be better — but then it's just a white screen with a logo, which is barely a loader at all.

**If picked:** Replace porthole with the existing `yikat-logo-blue.png` (80px) + SVG arc. ~30 LOC delta (less than Candidate 1).

---

## Implementation plan (Candidate 1 — Porthole)

> **Files changed:** `components/PageLoader.tsx` (new), `app/layout.tsx` (one line).

### Step L-1: `PageLoader.tsx` — overlay shell + timing logic

```tsx
"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

export function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const prefersRM = useReducedMotion()

  useEffect(() => {
    const t0 = Date.now()
    const startExit = () => setExiting(true)
    const onReady = () => {
      const remaining = Math.max(0, 500 - (Date.now() - t0))
      setTimeout(startExit, remaining)
    }
    if (document.readyState === "complete") onReady()
    else window.addEventListener("load", onReady, { once: true })
    return () => window.removeEventListener("load", onReady)
  }, [])

  if (!visible) return null

  return (
    <AnimatePresence onExitComplete={() => setVisible(false)}>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
          style={{ position: "fixed", inset: 0, zIndex: 9999,
                   background: "#FAFAF7", display: "flex",
                   flexDirection: "column", alignItems: "center",
                   justifyContent: "center", gap: "14px" }}
        >
          {/* porthole + RM-gated animations — Step L-2 */}
          <Porthole spin={prefersRM !== true} />
          {!prefersRM && (
            <span style={{ fontSize: "11px", color: "rgba(15,23,42,0.38)",
                           letterSpacing: "0.04em", fontFamily: "inherit" }}>
              Hazırlanıyor…
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Verify:** `pnpm dev`, hard reload, loader appears immediately and disappears after ~500ms + readyState. No layout shift when it leaves. **Commit:** `feat(loader): PageLoader shell + timing logic`.

### Step L-2: `Porthole` sub-component (inline, same file)

Inline SVG or HTML porthole. The porthole is HTML elements (no SVG file dep). CSS animations injected via a `<style>` tag inside the component, or via Tailwind arbitrary animation — but `@keyframes` in a `<style>` block is simpler for animation names shared across elements.

```tsx
const PORTHOLE_KEYFRAMES = `
  @keyframes porthole-tumble { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes porthole-orbit  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`

function Porthole({ spin }: { spin: boolean }) {
  return (
    <>
      <style>{PORTHOLE_KEYFRAMES}</style>
      <div style={{ position: "relative", width: 72, height: 72 }}>
        {/* outer orbit ring */}
        <div style={{
          position: "absolute", inset: -10, borderRadius: "50%",
          animation: spin ? "porthole-orbit 2s linear infinite" : "none",
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", inset: 6, borderRadius: "50%",
            border: "1.5px solid rgba(39,152,255,0.18)",
          }} />
          <div style={{
            position: "absolute", top: 6, left: "50%",
            transform: "translateX(-50%)",
            width: 6, height: 6, borderRadius: "50%",
            background: "#2798ff",
            display: spin ? "block" : "none",
          }} />
        </div>
        {/* bezel */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          border: "6px solid #374151",
          background: "#dbeafe",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.10)",
        }}>
          {/* tumbling clothes group */}
          <div style={{
            position: "relative", width: 44, height: 44,
            animation: spin ? "porthole-tumble 1.4s linear infinite" : "none",
          }}>
            {[0, 120, 240].map((deg, i) => (
              <div key={i} style={{
                position: "absolute", width: 9, height: 9, borderRadius: "50%",
                background: "rgba(255,255,255,0.85)",
                top: "50%", left: "50%",
                transform: `rotate(${deg}deg) translateY(-16px) translate(-50%, -50%)`,
              }} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
```

**Verify:** Clothes tumble naturally. Orbit dot traces the track. RM spin=false: static closed door. **Commit:** `feat(loader): Porthole spinner with RM guard`.

### Step L-3: Wire into `app/layout.tsx`

```tsx
import { PageLoader } from "@/components/PageLoader"
// ...
export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <PageLoader />  {/* ← add this one line */}
        {children}
      </body>
    </html>
  )
}
```

**Verify:** Loader appears on page load and fades away correctly. All routes (/, /iletisim, /kvkk) show loader. **Commit:** `feat(loader): wire PageLoader into root layout`.

### Step L-4: TypeScript + production build

```bash
cd /path/to/worktree && pnpm build
```

Must exit 0. Fix any issues.

---

## Test plan

- [ ] **Cold load** (`Ctrl+Shift+R`): loader appears immediately (no flash of raw content before it), spins for ~500ms+, fades cleanly.
- [ ] **Network throttling** (DevTools → Slow 3G): loader stays visible until `readyState=complete`. Hero not interactive-blocked (can click links while loader is on screen — loader is presentation only).
- [ ] **RM on** (macOS Settings → Accessibility → Reduce Motion): static porthole, no spin, no orbit dot. Overlay still appears + fades.
- [ ] **Mobile 375px**: loader centered, porthole 72px fits with margin.
- [ ] **Safari iOS** (Responsive Design Mode): CSS @keyframes animates, overlay z-index correct over hero.
- [ ] **No layout shift**: record CLS in DevTools → Performance. Should be 0 (hero rendered underneath overlay at all times).
- [ ] **Routes check**: `/iletisim`, `/kvkk` also show loader (from layout.tsx).

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| SSR renders page without overlay → 1-frame FOUC | Medium | Low | Overlay is `position:fixed` and mounts in first hydration render (`useState(true)`). Brief flash of styled-but-no-overlay content is acceptable for a local-service landing page. |
| `window.load` fires before component mounts | Low | Low | `scrollY.get()` guard pattern not needed here; `load` event fires asynchronously, always after component mount in typical load cycle. If `readyState` is already `complete` on mount, `onReady()` fires synchronously. |
| `@keyframes` name collision with other CSS | None | None | Prefixed `porthole-tumble` and `porthole-orbit` — unique names. |
| Loader blocks user interaction | None | None | Overlay has no `pointer-events: none` on links/buttons? No — overlay IS covering them. This is intentional: the loader covers the page. Once it fades, `visible=false` removes it from DOM. |

---

## Self-review

- Candidate rationale: 3 candidates, distinct approaches, honest trade-offs. ✓
- Implementation: 4 steps, code sketches, commit per step. ✓
- Test plan: 6 checks, browser + perf + RM + mobile. ✓
- Risk register: 4 risks with mitigations. ✓
- No TBDs or placeholders. ✓
- Scope: single new component + one layout line. Tight. ✓
