# Emil Review — YIKAT Landing (commit 880b116)

## Method

Full source read across all page surfaces: `PageLoader`, `SiteNav`, `HeroSection`, `WashingMachine`, `Knob`, `LabelRing`, `SectionReveal`, `SectionEyebrow`, `SectionEmoji`, all 7 content sections, `CTASection`, `Footer`, `app/kvkk/page.tsx`, `globals.css`, and `lib/sections.ts`. Findings are drawn from code — no live render. Desktop-first, then mobile, then reduced-motion paths traced through the code.

---

## Findings — Critical

### C1. Reviews section shows three empty placeholder boxes

**What:** `ReviewsSection.tsx` renders three dashed-border cards containing "Yakında müşteri yorumları burada." — a hard-coded placeholder layout with no real content.

**Where:** `components/sections/ReviewsSection.tsx` — the entire content body below the heading.

**Why it matters:** Three empty dashed boxes are the loudest signal on the page that the product isn't ready. Every other section has earned its presence — pricing is real, steps are real, FAQ is real. Then the page hits a literal "coming soon" for its only social proof section. That break in confidence travels backward and forward in the scroll: the user wonders what else isn't done. Emil's rule: elements that don't earn their presence should be removed. An absent section is invisible; three empty boxes are actively harmful.

**Direction:** Remove the section entirely until reviews exist, or replace it with a single truthful signal of early traction (one real customer quote, a star rating, a beta-launch headline). If the section must hold space structurally, collapse it to the heading + eyebrow only with no content body — the layout gap is smaller than the trust cost of the dashed boxes.

---

### C2. Washing machine illustration is permanently hidden under reduced motion

**What:** In `WashingMachine.tsx` line 25: `const effectiveBodyOpacity = prefersReducedMotion ? 0 : bodyOpacity`. Under `prefers-reduced-motion: reduce`, `effectiveBodyOpacity` is always `0` — the machine SVG body is invisible at every scroll position.

**Where:** `components/WashingMachine.tsx:25`

**Why it matters:** A user who prefers reduced motion visits the page and sees a blank left column in the hero. The knob sits at its rest scale (tiny, in the machine's dial position) over empty space. The illustration is the hero's main visual; its disappearance isn't a graceful RM degradation — it's a broken layout. The intent was probably to skip the fade-out animation (correct), not to hide the machine entirely (incorrect).

**Direction:** Change to `const effectiveBodyOpacity = prefersReducedMotion ? 1 : bodyOpacity`. The body should be fully visible when RM is active (no fade animation, no scroll-driven opacity). BUG — also logged in the bugs section below.

---

### C3. Primary CTA button uses `transition-all`

**What:** The "WhatsApp'tan sipariş ver" button in `CTASection` has `transition-all` in its className.

**Where:** `components/sections/CTASection.tsx:49` — `transition-all hover:shadow-[...] focus-visible:...`

**Why it matters:** `transition-all` is the most important button on the page — the conversion action. `transition-all` transitions every CSS property including layout properties (`height`, `padding`, `border-width`), triggering paint and layout on every frame. It also transitions the shadow change and the focus ring simultaneously with no control over which property leads. The button's `:active` state is missing entirely — there's no scale or opacity feedback when pressed. For the most important interactive element on the page, this is the exact kind of missed detail that Emil describes: "When a feature functions exactly as someone assumes it should, they proceed without giving it a second thought." Press it and it feels slightly soft.

**Direction:** Replace `transition-all` with `transition-[background-color,box-shadow,transform]` matching the nav CTA pattern. Add `active:scale-[0.97]` to match the nav's Sipariş Ver button. The nav already gets this right — the hero CTA should match.

---

## Findings — Important

### I1. Hero scroll-cue uses Tailwind's generic bounce

**What:** `HeroSection.tsx:57-60` — `<ChevronDown className="... animate-bounce" />` uses Tailwind's `animate-bounce`, which applies a `translateY(-25%)` keyframe with no easing curve and no relationship to the page's spring-based motion language.

**Where:** `components/sections/HeroSection.tsx:59`

**Why it matters:** The bounce is visible on every page load and is one of the first animated elements a user sees after the One Beat reveal. Tailwind's default bounce is a hard-coded CSS keyframe (`translateY(-25%)` at 0%, 100% with `ease-in` in the up phase) — it looks functional but not intentional. In a system built around `cubic-bezier(0.16, 1, 0.3, 1)` spring-out curves and spring-based drum rotation, a generic bounce is a note out of key. "It looks cool" is not a valid purpose for an animation seen on every page load.

**Direction:** Replace with a gentle CSS float (translateY ±4px, ease-in-out, 2.5s infinite) that matches the emoji breathing rhythm — unhurried, organic. Or remove the animation entirely and rely on the arrow glyph alone as affordance.

---

### I2. SectionEyebrow knob indicator is missing — the "Knob Thread" is broken

**What:** Each section's eyebrow row contains a `size-10` SVG mini-knob that rotates to `angle` degrees (the section's dial position). But the fill is a radially symmetric gradient, so the rotation is visually indistinguishable. The knob reads as a plain blue circle at every angle.

**Where:** `components/SectionEyebrow.tsx:38-53` — the SVG with `transform: rotate(${angle}deg)` and no indicator line.

**Why it matters:** The comment in the code acknowledges this: "Angle rotation is a visual no-op on this radially-symmetric fill — Phase 6 will add a small white indicator line." The Knob Thread was meant to carry the dial's visual language into each section header — a small reminder of the main dial's current position, creating spatial coherence across the page. Without the pointer, the eyebrow knob is just a decorative blue dot. It's not bad, but it misses the cohesion it was designed to create. The Knob component drew this exact shape — a white pointer on a blue disc — to significant effect; the eyebrow deserves the same treatment at miniature scale.

**Direction:** Add a short white indicator line (or a tiny rounded rectangle matching the main Knob's pointer shape) to the eyebrow SVG at `cx=40, cy=8` (12 o'clock before rotation, so after `rotate(angle)` it points to the correct dial position). Length ~8 units, width ~2 units, `fill="rgba(255,255,255,0.85)"`.

---

### I3. FAQ accordion trigger has no hover affordance

**What:** `FAQSection.tsx` overrides the accordion trigger with `hover:no-underline`, and the base component doesn't apply any background on hover. Hovering an FAQ question changes nothing visually (cursor pointer is the only feedback, and that's browser-native).

**Where:** `components/sections/FAQSection.tsx:77` — `AccordionTrigger` className; `components/ui/accordion.tsx:38-46`

**Why it matters:** The FAQ section is purely text — six questions, each a tappable row. With no hover state, the rows feel static. A user pausing over a question gets no signal that it's clickable. This is especially notable because the accordion trigger is one of the most-interacted elements on a landing page — users scan FAQs actively. The gap between "looks like text" and "behaves like a button" should be closed with visible feedback.

**Direction:** Add `hover:bg-[#F5F5F2]` and `rounded-md` to the AccordionTrigger className override in FAQSection — a single line. The subtle background fill at hover is enough to signal interactivity without adding decoration.

---

### I4. PageLoader exit uses ease-in — the wrong direction

**What:** `PageLoader.tsx:60` — `transition={{ duration: 0.3, ease: "easeIn" }}` on the exit fade.

**Where:** `components/PageLoader.tsx:60`

**Why it matters:** Exit animations should use ease-out: fast start, trailing decelerate. This gives immediate feedback that the thing is leaving — the user sees motion immediately and the end resolves naturally. Ease-in does the opposite: slow start, fast end. A 300ms ease-in fade starts almost imperceptibly, making it feel like the loader is *reluctantly* disappearing rather than clearing the stage quickly. For a page load transition — where every millisecond of perceived wait counts — this is the worst place to use ease-in. The user has been waiting to see content; the loader should get out of the way as fast as possible.

**Direction:** Change `ease: "easeIn"` to `ease: [0.23, 1, 0.32, 1]` (strong ease-out). The overlay will step aside quickly and resolve softly.

---

## Findings — Minor

### M1. Footer copyright says "Yıkat" — should be "YIKAT"

**What:** `footer.tsx:103` — `"© 2026 Yıkat. Tüm hakları saklıdır."` uses mixed case.

**Where:** `components/footer.tsx:103`

**Direction:** Change "Yıkat" to "YIKAT" to match the logo and every other brand reference on the page.

---

### M2. Pricing section eyebrow gap is `mt-6`, all others are `mt-8`

**What:** `PricingSection.tsx:25` uses `mt-6` after the `SectionEyebrow`. Every other section uses `mt-8`.

**Where:** `components/sections/PricingSection.tsx:25`

**Direction:** Change `mt-6` to `mt-8`.

---

### M3. "How It Works" step numbers use brand blue — implies interactivity

**What:** `HowItWorksSection.tsx:51` — `text-[#2798ff]` on the step numbers `01`, `02`, `03`.

**Where:** `components/sections/HowItWorksSection.tsx:51`

**Why it matters:** On this page, `#2798ff` means one of: (a) brand identity, (b) interactive element (nav links, CTA buttons, label ring active labels). Step numbers are neither — they're typographic anchors. The brand blue trains the user to expect interaction; a number that looks like a link but isn't is a small lie. `#0F172A` at reduced opacity (e.g., `text-[#0F172A]/40`) would anchor the numbers as structure, not action.

**Direction:** Change to `text-[#0F172A]/30` or `text-[#64748B]/60` — visible, structural, not blue.

---

### M4. Mobile menu icon swap (Menu ↔ X) has no transition

**What:** `SiteNav.tsx:126-128` — the hamburger button swaps between `<Menu>` and `<X>` icons with no animation. The icon changes instantly on click.

**Where:** `components/SiteNav.tsx:126-128`

**Direction:** Wrap both icons in `<motion.div key={open ? "x" : "menu"} initial={{ opacity: 0, rotate: open ? -45 : 45 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: 0.15, ease: [0.16,1,0.3,1] }}>` — a 150ms rotation-fade that makes the state change feel intentional.

---

## Strengths to preserve

- **Knob morph.** Technically excellent and purposeful. A scroll-tied animation that changes the page's spatial model rather than decorating it. Do not touch the geometry, timing, or reduced-motion handling.
- **Label ring depth-of-field.** The piecewise opacity (`1.0 → 0.55 → 0` from marker outward) and scale (`1.0 → 0.78`) create exactly the right amount of depth without being showy. The 3-label window doesn't need adjustment.
- **Pricing display type.** `10rem` at desktop for the price is a brave editorial move that earns its presence. Most teams would cap it at 5xl. Don't pull back.
- **`active:scale-[0.97]` on both CTA buttons.** The nav "Sipariş Ver" button gets this exactly right. Critical C3 above is about propagating this to the hero CTA, not about questioning the pattern.
- **One Beat choreography.** Wrapper arrives → children stagger. The 220ms delay before children is what makes it feel like the section "plants" before speaking. Keep the timing.
- **Background rhythm (`#FAFAF7` → `#F5F5F2` → `#FAFAF7`).** The pricing section's off-white break is subtle enough that users don't consciously register it, but it resets attention. The aggregate effect matters.
- **`SectionEyebrow` number·label·rule format.** Distinctive. The horizontal rule with `max-w-[240px]` capping prevents it from spanning the full column on wide viewports. Keep it.
- **Glass navbar blur is always on** (`backdropFilter` applied unconditionally, only `backgroundColor`/`border`/`boxShadow` transition). This means the blur is ready before the scroll threshold — there's no layout-shift moment when blur kicks in. Smart implementation.

---

## Out of scope but worth flagging (Bugs)

- **BUG / WashingMachine RM** — Logged as C2 above. `effectiveBodyOpacity = prefersReducedMotion ? 0 : bodyOpacity` hides the machine permanently under reduced motion.
- **BUG / Footer dead link** — "Yardım Merkezi" → `href="#"`. No route exists.
- **BUG / Footer dead route** — "İletişim" → `/iletisim`. This route is not in the repo (`app/iletisim/` does not exist).
- **BUG / Footer brand link** — Logo `href="#"` has no `aria-label`. Screen readers announce it as an unlabeled link.

---

## Recommended order if user wants to address findings

**1. C2 — WashingMachine RM opacity (one-line fix, correctness before polish)**
Change `prefersReducedMotion ? 0 : bodyOpacity` to `prefersReducedMotion ? 1 : bodyOpacity`. One line. Fixes a broken hero for an entire class of users before any polish work begins. Nothing else matters if the page is broken for RM users.

**2. C1 — Reviews placeholder (highest perceived quality delta per zero LOC)**
Removing three dashed boxes requires deleting ~15 lines and optionally the entire section. The perceived quality jump is the largest single change available. Social proof is the hardest thing to fake — don't signal its absence.

**3. C3 + I4 — CTA button + loader ease-in (micro-correctness bundle)**
Both are 1-line changes. Bundle them: the CTA button touches the conversion action; the loader touches the very first second of the experience. Neither has visual scope-creep risk. Correct these two and the motion quality across the page has a noticeably more intentional feel.

---

## Resolutions

### I1 — Hero ChevronDown animation

**Resolution (2026-04-28):** Custom float (commit a976dc0) was implemented and reverted. After live testing, user judged the calm float too subtle for the chevron's purpose (draw eye downward). Reverted to original animate-bounce behavior. Emil review's diagnosis acknowledged but design call deferred to user testing. Closed as 'not actioned' rather than 'not fixed' — the bounce is now an explicit design decision, not an oversight.
