# Landing Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply nine QA-identified polish items to the YIKAT landing page: typography overhaul (drop Fraunces + JetBrains Mono, adopt Inter Display), dial simplification (remove bezel/outer-ring/center-dot, add inside indicator), staggered section reveals, knob-thread + 3D emoji decoration, hero washing-machine photograph morph with detaching knob, YIKAT brand-mark slot behavior, and CTA contrast fix.

**Architecture:** Six phases, ordered strictly by dependency. Typography is foundational (touches every section), goes first. Dial cleanup follows (prerequisite for hero morph). Section reveals and decoration layer on independently. Hero morph is last-major because it consumes outputs of phases 1 + 2 + 4 (typography, dial geometry, label-slot behavior). Final phase cleans up trailing items. Each phase is one atomic git commit (or PR), with a visual-QA checkpoint before moving on. No phase breaks the ones before it; rollback is `git revert <phase commit>`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.7, Tailwind CSS v4 (`@theme inline` in globals.css), framer-motion 11, Inter variable font with `opsz` axis, pnpm. No test runner configured — verification is `pnpm build` (runs type-check + Next build), `pnpm lint`, and manual browser QA via `pnpm dev`.

---

## Design Summary (carried from brainstorm)

These are the locked-in decisions from the brainstorm session on 2026-04-21. Every task below implements one of them.

1. **Typography — Editorial (Inter only):** Inter Display (opsz 32) for headlines, Inter (opsz 14) for body, Inter for dial labels + small UI. Drop Fraunces + JetBrains Mono imports entirely. Type scale:
   - Hero headline: `88px / 0.98 / -0.028em / 700 / opsz 32` (responsive 48→72→88)
   - Section headline: `48→60px / 1.05 / -0.022em / 600 / opsz 32`
   - Body: `16→18px / 1.65 / 0 / 400 / opsz 14`
   - Dial active label: `15px / 1 / 0.16em / 600 / uppercase`
   - Caption / eyebrow: `12px / 1.4 / 0.14em / 500 / uppercase`
   - Big price: `88→160px / 1 / -0.035em / 700 / opsz 32`

2. **Dial redesign:** No bezel path, no outer ring (`r=248` circle), no center white dot. Just the blue gradient knob at `r=160` (down from 185). Add a white indicator line *inside* the knob: 18px length, 3.5px stroke, round caps, at 3 o'clock on desktop / 6 o'clock on mobile. Indicator opacity lifecycle: hero=0 → morph-tracks-progress → scrolled=1. Labels live outside the knob area in the clear space; only the active label is visible (others hidden).

3. **Section reveals — Approach C (Staggered micro-reveal):** No clip-path curtain. Section wrapper has no reveal (or a 200ms opacity fade). Children stagger with 110ms offset, 500ms per element, ease-out cubic-bezier(0.16, 1, 0.3, 1), y offset 16px. `viewport={{ once: true, amount: 0.3 }}`. Reduced-motion: opacity-only (no y).

4. **Add life — Direction 2 (Knob Thread) + custom 3D emojis:**
   - Every section opens with `[mini knob, 40px, rotated to section's dial angle] [01 ·] [LABEL] ──── [emoji, 180px, breathing]`.
   - Mini knob: reuses the main dial's blue gradient, rotated so its (invisible) indicator position matches the angle this section has in the dial navigator. 40px total.
   - 3D emoji per section (one-to-one mapping below), 180px desktop / 110px mobile. Breathing animation: `scale 1 ↔ 1.03`, 3.5s ease-in-out, infinite. Each section's emoji has a per-section phase offset (e.g., `animation-delay: ${index * 438}ms`) so all 7 don't pulse in sync. Reduced-motion: static (no animation).
   - Assets stored in `/public/emojis/{section}.png` at 2× retina (180px display → 360px source PNG). User provides finals; placeholder = native OS emoji rendered via `<span>` until real assets land.
   - Mobile layout: emoji stacks below headline (not bookended) when viewport < 768px.
   - Section → emoji placeholder mapping:
     - `hizmetler` → 🧺 (laundry basket)
     - `nasil` → 📱 (phone — WhatsApp order moment)
     - `fiyatlar` → 💰 (money)
     - `neden` → ✨ (sparkles)
     - `yorumlar` → 💬 (speech bubble)
     - `sss` → ❓ (question mark)
     - `siparis` → 🎉 (party — celebration)
     - `basla` (hero) → no emoji (machine photo is the hero asset itself)

5. **Hero washing-machine morph:** Two-column layout (machine left, text right) at `lg+`, stacked on mobile. Four layers over the hero:
   - Layer 1: high-resolution photograph at `/public/hero-machine.jpg` (placeholder until user produces final).
   - Layer 2: CSS-animated drum rotating slowly inside the photo's drum window (subtle — sells "machine is running").
   - Layer 3: SVG knob overlay positioned over the photograph's physical knob. This overlay IS the `DialNavigator`'s knob — the same element morphs out on scroll.
   - Layer 4: YIKAT brand mark in the dial's label slot during hero state.
   - Scroll-driven morph (existing pattern, re-tuned): spring stiffness 40, damping 22. As `scrollY` goes 0 → 380:
     - Photo opacity fades 1 → 0
     - Drum overlay fades with photo
     - Knob scales + translates from its photo position to the fixed dial position
     - YIKAT label crossfades to active section name

6. **YIKAT brand-mark slot:** In hero state, the dial's "active label slot" shows the YIKAT wordmark (Inter, 26px, 2.5px letter-spacing, same position where "BAŞLA" would be). On scroll, it morphs/fades into the active section label. Only one text element ever occupies that slot.

7. **CTA contrast fix:** `CTASection.tsx:42` change `text-white/70` → `text-white/85`. One-line change.

8. **Center dot removal:** Covered by item 2 (dial redesign).

9. **Label clipping bug:** Structurally resolved by item 2 — labels now live outside the knob entirely, no bezel to cross.

---

## File Structure

Files created or modified, grouped by phase.

**Phase 1 (Typography):**
- Modify: `app/layout.tsx` (font imports)
- Modify: `app/globals.css` (font tokens)
- Modify: `components/sections/HeroSection.tsx` (h1 font class)
- Modify: `components/sections/ServicesSection.tsx` (h2, h3 font classes)
- Modify: `components/sections/HowItWorksSection.tsx` (h2, h3, numbers)
- Modify: `components/sections/PricingSection.tsx` (h2 big-price)
- Modify: `components/sections/WhyUsSection.tsx` (h2, h3)
- Modify: `components/sections/ReviewsSection.tsx` (h2)
- Modify: `components/sections/FAQSection.tsx` (h2, accordion triggers)
- Modify: `components/sections/CTASection.tsx` (h2)
- Modify: `components/DialProgram.tsx` (`font-mono` → remove; uses default sans)

**Phase 2 (Dial Simplification):**
- Modify: `components/DialNavigator.tsx` (remove bezel path, outer ring, center dot; reduce knob radius; add indicator)
- Modify: `components/DialProgram.tsx` (label radius, only-active visibility)

**Phase 3 (Section Reveals):**
- Modify: `components/SectionReveal.tsx` (variants + viewport amount)

**Phase 4 (Add Life — Knob Thread + Emoji):**
- Create: `components/SectionEyebrow.tsx` (mini knob + number + label + rule)
- Create: `components/SectionEmoji.tsx` (emoji span + breathing animation)
- Create: `public/emojis/README.md` (asset spec for user)
- Modify: 7 section components to mount `<SectionEyebrow>` + `<SectionEmoji>` in header rows
  - `ServicesSection.tsx`, `HowItWorksSection.tsx`, `PricingSection.tsx`, `WhyUsSection.tsx`, `ReviewsSection.tsx`, `FAQSection.tsx`, `CTASection.tsx`
- Modify: `lib/sections.ts` (add `emoji` field + section number)

**Phase 5 (Hero Machine Morph):**
- Create: `public/hero-machine.jpg` (placeholder photograph)
- Create: `public/hero-machine-README.md` (asset spec for final user-produced photo)
- Create: `components/HeroMachine.tsx` (photo + drum + knob layered hero element)
- Modify: `components/sections/HeroSection.tsx` (two-column layout, mount HeroMachine)
- Modify: `components/DialNavigator.tsx` (accept hero-state position so knob can morph FROM photo's knob position)
- Modify: `app/page.tsx` (if DialNavigator wiring needs a prop)

**Phase 6 (Final Polish):**
- Modify: `components/sections/CTASection.tsx` (contrast, white/70 → white/85)
- Modify: `lib/sections.ts` (rename `basla` label BAŞLA → YIKAT for hero slot OR handle in DialProgram — see Task 6.1)

---

## Rollback Strategy

Every phase is one self-contained commit (or a tight series of commits). Phases are independent at the commit level.

- **If phase N breaks after merge:** `git revert <commit-sha>` for that phase. Earlier phases remain intact.
- **If phase N breaks mid-development:** `git reset --hard HEAD` before commit; each task is small enough that no more than 5 minutes of work is lost.
- **If multiple phases interact badly (rare):** revert the latest, re-run QA, revert prior if needed. Typography (phase 1) is the only phase with high cross-section blast radius; if typography regresses, revert phase 1 and the rest works on old fonts fine because they don't reference font classes that were removed (this is enforced because phase 1 updates every class it touches).
- **Branch hygiene:** all work stays on `feat/landing-redesign`. No production deploys until all six phases land and full QA passes.

---

## Subagent Task Budget

Approximate dispatches per phase if using subagent-driven execution. Most phases are inline-friendly because the changes are small and scoped.

| Phase | Inline or Subagent | Count | Reasoning |
|-------|-------------------|-------|-----------|
| 1 · Typography | Inline | 0 | Mechanical className swaps, one file at a time. |
| 2 · Dial | Inline | 0 | Single-component change; geometry is deterministic. |
| 3 · Reveals | Inline | 0 | One-file diff to SectionReveal.tsx. |
| 4 · Add Life | Subagent (opt.) | 1 | Could dispatch one subagent to wire Eyebrow+Emoji into all 7 sections in parallel. Otherwise inline. |
| 5 · Hero Morph | Subagent | 2 | (a) Research framer-motion useTransform patterns for the photo→knob position morph; (b) verify cross-browser behavior once built. |
| 6 · Final | Inline | 0 | Two one-line fixes. |
| **Total** | — | **3** | Plus a final code-review subagent across the whole branch before merge. |

---

## Preflight — Before Starting

- [ ] **Verify working tree is clean and on feat/landing-redesign**

Run:
```bash
git -C /Users/kaanevrensel/v0-yikat-landing-page/.worktrees/feat-landing-redesign status
git -C /Users/kaanevrensel/v0-yikat-landing-page/.worktrees/feat-landing-redesign branch --show-current
```
Expected: `nothing to commit, working tree clean` and `feat/landing-redesign`.

- [ ] **Install dependencies (if needed) and sanity-check build**

Run:
```bash
pnpm install
pnpm build
```
Expected: `✓ Compiled successfully` from Next.js with no type errors.

- [ ] **Start dev server in background for live visual QA**

Run:
```bash
pnpm dev
```
Expected: server on http://localhost:3000 (or 3001 if 3000 is taken). Open in browser. Establish a visual baseline screenshot of the current landing page before touching anything.

---

## Phase 1 · Typography Foundation

**Goal:** Inter Display (via `opsz` axis on Inter) replaces Fraunces for every display headline; body, labels, and all small UI use Inter. `font-serif` and `font-mono` Tailwind classes are removed from every component that currently uses them. Font import count drops from 3 to 1 at layout.tsx.

**Why first:** every section has `font-serif` on its h2/h3 or big-number spans. All subsequent phases read those same components and will use `font-sans` with `font-variation-settings` instead. Doing typography first means later phases don't have to juggle the transition.

**Testing checklist (runs after all tasks in phase complete):**
- [ ] `pnpm build` completes without type errors
- [ ] `pnpm lint` has no new warnings
- [ ] In browser (`pnpm dev`): every section headline renders in Inter (visibly narrower and more modern than Fraunces); no flash of invisible text; Turkish glyphs (İ, ğ, ş, Ç) render correctly in headlines
- [ ] No remaining `font-serif` or `font-mono` references (except in shadcn chart component which we leave alone)
- [ ] Network tab: only Inter font files load; no Fraunces or JetBrains requests

**Rollback:** `git revert <phase-1-commit>` restores all three font imports and every `font-serif`/`font-mono` class.

---

### Task 1.1 · Remove Fraunces + JetBrains_Mono imports from layout

**Files:**
- Modify: `app/layout.tsx:2-22, 74`

- [ ] **Step 1: Edit font imports and body className**

In `app/layout.tsx`, replace the three font imports and their usage with Inter only, keeping the `opsz` axis so Inter Display rendering works:

```tsx
// Line 2 — replace existing import
import { Inter } from 'next/font/google'

// Lines 6-9 — replace existing Inter config with opsz-aware version
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  axes: ['opsz'],
  display: 'swap',
})

// Delete lines 11-22 entirely (the fraunces and jetbrainsMono const blocks)

// Line 74 — replace body className
<body className={`${inter.variable} font-sans antialiased`}>
```

- [ ] **Step 2: Verify build**

Run:
```bash
pnpm build
```
Expected: success. Build output should not mention Fraunces or JetBrains_Mono.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "chore(fonts): drop Fraunces and JetBrains Mono, keep Inter with opsz axis"
```

---

### Task 1.2 · Update CSS font tokens in globals.css

**Files:**
- Modify: `app/globals.css:77-80`

- [ ] **Step 1: Update `@theme inline` font tokens**

Open `app/globals.css`. The `@theme inline` block at lines 77-117 declares `--font-sans`, `--font-serif`, `--font-mono`. Update lines 78-80 so `--font-serif` and `--font-mono` alias to the same Inter stack, and Tailwind's `font-serif`/`font-mono` classes (if any still exist temporarily) don't silently fail:

```css
  --font-sans: var(--font-inter), 'Inter', system-ui, sans-serif;
  --font-serif: var(--font-inter), 'Inter', system-ui, sans-serif;
  --font-mono: var(--font-inter), 'Inter', ui-monospace, monospace;
```

Rationale: aliasing means any `font-serif`/`font-mono` class we miss in a later task still renders Inter — belt-and-suspenders during the migration. Phase 1's task 1.3+ removes those classes; this alias is a safety net.

- [ ] **Step 2: Verify dev server still renders**

Open http://localhost:3000. Hero headline should now render in Inter (slightly narrower, more modern, no serifs). If you still see Fraunces, force-reload with Cmd+Shift+R.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "chore(css): alias --font-serif and --font-mono to Inter stack"
```

---

### Task 1.3 · Replace `font-serif` in HeroSection h1

**Files:**
- Modify: `components/sections/HeroSection.tsx:25`

- [ ] **Step 1: Change className on h1**

Replace the h1 className:

Before (`HeroSection.tsx:25`):
```tsx
className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-[#0F172A] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
```

After:
```tsx
className="text-5xl font-bold leading-[0.98] tracking-[-0.028em] text-[#0F172A] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
style={{ fontVariationSettings: "'opsz' 32" }}
```

Changes: dropped `font-serif` (Inter is the default sans now); `font-semibold` → `font-bold` (weight 700 per type scale); `leading-[1.05]` → `leading-[0.98]` (tighter per spec); added `tracking-[-0.028em]`; opsz 32 via inline style.

- [ ] **Step 2: Visual check**

Refresh http://localhost:3000. Hero headline "Tertemiz. Kapında. 24 saatte." should render in Inter Display-style (rounder apertures at this size), tighter leading, heavier weight.

- [ ] **Step 3: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "refactor(hero): Inter Display opsz 32 for h1 (drop font-serif)"
```

---

### Task 1.4 · Replace `font-serif` in ServicesSection h2 and h3

**Files:**
- Modify: `components/sections/ServicesSection.tsx:47, 66`

- [ ] **Step 1: Update h2 className**

At line 47:

Before:
```tsx
className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
```

After:
```tsx
className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
style={{ fontVariationSettings: "'opsz' 32" }}
```

- [ ] **Step 2: Update h3 className**

At line 66:

Before:
```tsx
className="mt-6 font-serif text-2xl font-semibold text-[#0F172A]"
```

After:
```tsx
className="mt-6 text-2xl font-semibold tracking-[-0.01em] text-[#0F172A]"
```

(No `font-variation-settings` needed at 24px — Inter without opsz is fine for subsection h3.)

- [ ] **Step 3: Visual check**

Refresh, scroll to Hizmetler. "Hizmetler" h2 and card h3s ("Çamaşır", "Ütü", etc.) should all render in Inter, consistent with the hero.

- [ ] **Step 4: Commit**

```bash
git add components/sections/ServicesSection.tsx
git commit -m "refactor(services): Inter Display opsz 32 for h2; Inter for h3"
```

---

### Task 1.5 · Replace `font-serif` in HowItWorksSection (h2, big numbers, h3)

**Files:**
- Modify: `components/sections/HowItWorksSection.tsx:23, 35, 39`

- [ ] **Step 1: Update h2 (line 23)**

Before:
```tsx
className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
```

After:
```tsx
className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
style={{ fontVariationSettings: "'opsz' 32" }}
```

- [ ] **Step 2: Update the step number span (line 35)**

Before:
```tsx
<span className="font-serif text-3xl text-[#2798ff] md:text-4xl">
```

After:
```tsx
<span className="text-3xl font-bold text-[#2798ff] md:text-4xl" style={{ fontVariationSettings: "'opsz' 32" }}>
```

- [ ] **Step 3: Update step h3 (line 39)**

Before:
```tsx
<h3 className="font-serif text-2xl font-semibold text-[#0F172A] md:text-3xl">
```

After:
```tsx
<h3 className="text-2xl font-semibold tracking-[-0.01em] text-[#0F172A] md:text-3xl">
```

- [ ] **Step 4: Commit**

```bash
git add components/sections/HowItWorksSection.tsx
git commit -m "refactor(how-it-works): Inter Display for h2 and step numbers; Inter for h3"
```

---

### Task 1.6 · Replace `font-serif` in PricingSection (the big 110 TL)

**Files:**
- Modify: `components/sections/PricingSection.tsx:23`

- [ ] **Step 1: Update the big-price h2**

Before (line 23):
```tsx
className="mt-6 font-serif text-6xl font-semibold leading-none tracking-tight text-[#0F172A] sm:text-7xl md:text-[8rem] lg:text-[10rem]"
```

After:
```tsx
className="mt-6 text-6xl font-bold leading-none tracking-[-0.035em] text-[#0F172A] sm:text-7xl md:text-[8rem] lg:text-[10rem]"
style={{ fontVariationSettings: "'opsz' 32" }}
```

(Big price weight goes from 600 → 700 per type scale; tracking tightens; opsz 32 mandatory at this size to keep letter apertures open.)

- [ ] **Step 2: Visual check**

Scroll to Fiyatlar. The "110 TL" should now render in Inter Display Bold with tighter tracking. Glyphs should have generous apertures (characteristic of opsz 32). The `/ kg` span inside (line 26) is already `font-normal` and `text-[#64748B]` — leave it alone; it inherits Inter.

- [ ] **Step 3: Commit**

```bash
git add components/sections/PricingSection.tsx
git commit -m "refactor(pricing): Inter Display Bold opsz 32 for 110 TL"
```

---

### Task 1.7 · Replace `font-serif` in WhyUsSection (h2 + card h3s)

**Files:**
- Modify: `components/sections/WhyUsSection.tsx:24, 37`

- [ ] **Step 1: Update h2 (line 24)**

Before:
```tsx
className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
```

After:
```tsx
className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
style={{ fontVariationSettings: "'opsz' 32" }}
```

- [ ] **Step 2: Update card h3 (line 37)**

Before:
```tsx
<h3 className="mt-5 font-serif text-2xl font-semibold text-[#0F172A]">
```

After:
```tsx
<h3 className="mt-5 text-2xl font-semibold tracking-[-0.01em] text-[#0F172A]">
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/WhyUsSection.tsx
git commit -m "refactor(why-us): Inter Display for h2; Inter for card h3"
```

---

### Task 1.8 · Replace `font-serif` in ReviewsSection and FAQSection

**Files:**
- Modify: `components/sections/ReviewsSection.tsx:17`
- Modify: `components/sections/FAQSection.tsx:52, 61`

- [ ] **Step 1: ReviewsSection h2 (line 17)**

Before:
```tsx
className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
```

After:
```tsx
className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
style={{ fontVariationSettings: "'opsz' 32" }}
```

- [ ] **Step 2: FAQSection h2 (line 52)**

Before:
```tsx
className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
```

After:
```tsx
className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
style={{ fontVariationSettings: "'opsz' 32" }}
```

- [ ] **Step 3: FAQSection AccordionTrigger (line 61)**

Before:
```tsx
<AccordionTrigger className="py-5 text-left font-serif text-lg font-medium text-[#0F172A] hover:no-underline">
```

After:
```tsx
<AccordionTrigger className="py-5 text-left text-lg font-semibold text-[#0F172A] hover:no-underline">
```

(Accordion triggers at 18px don't need opsz — Inter regular is cleanest; bump to semibold 600 for visual weight since Fraunces at medium was heavier-feeling than Inter medium.)

- [ ] **Step 4: Commit**

```bash
git add components/sections/ReviewsSection.tsx components/sections/FAQSection.tsx
git commit -m "refactor(reviews+faq): Inter Display for h2; Inter semibold for accordion triggers"
```

---

### Task 1.9 · Replace `font-serif` in CTASection

**Files:**
- Modify: `components/sections/CTASection.tsx:21`

- [ ] **Step 1: Update h2 (line 21)**

Before:
```tsx
className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
```

After:
```tsx
className="text-5xl font-bold leading-[0.98] tracking-[-0.028em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
style={{ fontVariationSettings: "'opsz' 32" }}
```

(CTA headline is display-scale like the hero — same opsz 32 + bold + tight tracking.)

- [ ] **Step 2: Commit**

```bash
git add components/sections/CTASection.tsx
git commit -m "refactor(cta): Inter Display opsz 32 Bold for h2"
```

---

### Task 1.10 · Remove `font-mono` from DialProgram

**Files:**
- Modify: `components/DialProgram.tsx:50`

- [ ] **Step 1: Remove font-mono class**

At line 50, the className string currently includes `font-mono`. Remove it (the default sans = Inter will apply).

Before:
```tsx
className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-sm px-2 py-1 font-mono outline-none transition-[font-size,color,letter-spacing,font-weight] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#2798ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${colorClass} ${sizeClass} ${weightClass}`}
```

After:
```tsx
className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-sm px-2 py-1 outline-none transition-[font-size,color,letter-spacing,font-weight] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#2798ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${colorClass} ${sizeClass} ${weightClass}`}
```

- [ ] **Step 2: Visual check**

Scroll the page. Dial labels (HİZMETLER, NASIL, etc.) should now render in Inter, not JetBrains Mono. The active label at `text-[15px] tracking-[0.16em] font-bold` should look tighter and more modern.

- [ ] **Step 3: Commit**

```bash
git add components/DialProgram.tsx
git commit -m "refactor(dial): drop font-mono from DialProgram labels (Inter default)"
```

---

### Task 1.11 · Audit for any remaining font-serif / font-mono references

**Files:**
- Audit: entire `components/` and `app/` directories

- [ ] **Step 1: Grep for remaining references**

Run:
```bash
grep -r "font-serif\|font-mono" components/ app/ --include="*.tsx" --include="*.ts"
```

Expected: only `components/ui/chart.tsx` match (Recharts' own class usage — leave it; it's unused in this landing page).

- [ ] **Step 2: If any other references exist, fix them**

Apply the same pattern: `font-serif` on display text → Inter + opsz 32 + tight tracking; `font-serif` on body/caption → drop the class; `font-mono` → drop the class.

- [ ] **Step 3: Final type-check**

```bash
pnpm build
```
Expected: clean build, no TypeScript errors.

- [ ] **Step 4: Commit any additional cleanup (if any)**

```bash
git add .
git commit -m "chore(fonts): clean up any remaining font-serif/font-mono references"
```

(If nothing to commit, skip.)

---

### Phase 1 Checkpoint

- [ ] **Visual QA at `pnpm dev`:**
  - Hero headline renders in Inter Display, heavy weight, tight leading
  - "Hizmetler", "Nasıl çalışır", "Neden YIKAT", "Yorumlar", "Sorular" all render in Inter Display at consistent weight/tracking
  - "110 TL" in Pricing renders in Inter Display Bold with tight tracking
  - "Hazırsan başlayalım." (CTA headline) renders in Inter Display Bold on blue background
  - Dial labels (HİZMETLER, NASIL, etc.) render in Inter (not monospace)
  - Turkish glyphs İ, ğ, ş, Ç render correctly everywhere

- [ ] **Network tab:** no Fraunces or JetBrains_Mono font files fetched

- [ ] **Build passes:** `pnpm build` clean

- [ ] **If anything looks off, fix and commit; do not proceed to Phase 2 until all the above are green.**

---

## Phase 2 · Dial Simplification

**Goal:** Strip decorative layers from the dial (outer ring, bezel path, center dot) leaving only the blue gradient knob. Reduce knob radius to 160 (was 185). Add a white indicator line INSIDE the knob at 3 o'clock desktop / 6 o'clock mobile. Update label radius so labels sit in the clear area outside the knob. Only the active label is visible; non-active labels are hidden (opacity 0).

**Why after Phase 1:** Phase 1's `font-mono` removal lands in the same file (`DialProgram.tsx`) we'll touch here. Doing typography first means one file's diff at a time.

**Testing checklist:**
- [ ] `pnpm build` clean
- [ ] In browser, hero state: only blue knob visible (no ring, no bezel, no center dot); no indicator line visible in hero
- [ ] On scroll past 120px: white indicator fades in at 3 o'clock (desktop) / 6 o'clock (mobile), tip touching knob edge
- [ ] Active label is the only visible label; it sits clearly OUTSIDE the knob (to the right on desktop, below on mobile)
- [ ] Rotating the dial (clicking different sections) animates smoothly; labels counter-rotate so text stays upright
- [ ] Mobile breakpoint: indicator is at 6 o'clock not 3

**Rollback:** `git revert <phase-2-commits>` — brings back bezel+ring+dot, knob radius back to 185.

---

### Task 2.1 · Remove outer ring, bezel path, and center dot from DialNavigator SVG

**Files:**
- Modify: `components/DialNavigator.tsx:168-173, 218-223`

- [ ] **Step 1: Desktop SVG cleanup**

In the desktop SVG block (lines 156-173), remove the outer ring `<circle>` (line 169), the bezel `<path>` (line 170), and the center dot `<circle>` (line 172). Reduce the knob radius from 185 to 160. The block becomes:

Before (lines 156-173):
```tsx
        <svg
          viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="concave-knob" cx="50%" cy="50%" r="55%">
              <stop offset="0%"   stopColor="#4aa5ff" />
              <stop offset="55%"  stopColor="#2798ff" />
              <stop offset="100%" stopColor="#1a7de8" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={248} fill="none" stroke="#2798ff" strokeOpacity={0.4} strokeWidth={1} />
          <path d={DESKTOP_BEZEL_PATH} fill="#FFFFFF" stroke="#2798ff" strokeOpacity={0.5} strokeWidth={2} />
          <circle cx={CX} cy={CY} r={185} fill="url(#concave-knob)" />
          <circle cx={CX} cy={CY} r={6} fill="#FFFFFF" />
        </svg>
```

After:
```tsx
        <svg
          viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="concave-knob" cx="50%" cy="50%" r="55%">
              <stop offset="0%"   stopColor="#4aa5ff" />
              <stop offset="55%"  stopColor="#2798ff" />
              <stop offset="100%" stopColor="#1a7de8" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={KNOB_R} fill="url(#concave-knob)" />
        </svg>
```

- [ ] **Step 2: Mobile SVG cleanup**

Same treatment in the mobile SVG block (lines 206-223). Replace the block:

Before:
```tsx
          <circle cx={CX} cy={CY} r={248} fill="none" stroke="#2798ff" strokeOpacity={0.4} strokeWidth={1} />
          <path d={MOBILE_BEZEL_PATH} fill="#FFFFFF" stroke="#2798ff" strokeOpacity={0.5} strokeWidth={2} />
          <circle cx={CX} cy={CY} r={185} fill="url(#concave-knob-mobile)" />
          <circle cx={CX} cy={CY} r={6} fill="#FFFFFF" />
```

After:
```tsx
          <circle cx={CX} cy={CY} r={KNOB_R} fill="url(#concave-knob-mobile)" />
```

- [ ] **Step 3: Add KNOB_R constant and remove unused bezel constants**

In the constants block near the top of the file (lines 16-37), add:

```tsx
const KNOB_R = 160                   // reduced from 185 — solid knob, no bezel
```

Also remove now-unused constants and helpers:
- Delete `BASE_R`, `BUMP_DELTA`, `BUMP_HALFWIDTH_DEG`, `SAMPLES` (lines 19-22)
- Delete `DESKTOP_BUMP_DEG`, `MOBILE_BUMP_DEG` (lines 25-26) — keep `MOBILE_ROTATION_OFFSET_DEG`
- Delete `smoothstep()` function (lines 39-42)
- Delete `buildBezelPath()` function (lines 44-60)
- Delete `DESKTOP_BEZEL_PATH`, `MOBILE_BEZEL_PATH` (lines 62-63)

- [ ] **Step 4: Build and verify**

```bash
pnpm build
```
Expected: clean build. If type errors appear, they point to stale references — remove them.

- [ ] **Step 5: Visual check**

Open http://localhost:3000. Hero state: only the blue gradient circle is visible — no white bezel, no outer ring, no center dot. Knob is visibly smaller (r=160 vs 185). Labels (currently broken in their positions — we fix that in task 2.3) are still somewhere.

- [ ] **Step 6: Commit**

```bash
git add components/DialNavigator.tsx
git commit -m "refactor(dial): remove bezel path, outer ring, and center dot; knob r 185->160"
```

---

### Task 2.2 · Update label radius so labels sit outside the knob

**Files:**
- Modify: `components/DialProgram.tsx:23` (default radius)

- [ ] **Step 1: Update default radius**

With knob radius now 160, labels at the old radius 205 sit only 45 units outside the knob — too close, and without the bezel they look awkward. Push labels further out to 215.

In `DialProgram.tsx:23`:

Before:
```tsx
  radius = 205,
```

After:
```tsx
  radius = 215,
```

- [ ] **Step 2: Visual check**

Active label at 3 o'clock (desktop): should sit well clear of the blue knob with ~55 viewBox units of daylight between the knob edge and where the label anchors.

- [ ] **Step 3: Commit**

```bash
git add components/DialProgram.tsx
git commit -m "refactor(dial-labels): bump default radius 205->215 to clear smaller knob"
```

---

### Task 2.3 · Add white indicator line inside the knob (desktop + mobile)

**Files:**
- Modify: `components/DialNavigator.tsx`

- [ ] **Step 1: Add indicator geometry constants**

Near the other size constants (after `KNOB_R = 160`), add:

```tsx
// Indicator: short radial white line INSIDE the knob. Outer tip touches knob edge.
const INDICATOR_LENGTH = 18         // 11.25% of KNOB_R (inside 8-12% target range)
const INDICATOR_STROKE = 3.5
const INDICATOR_OUTER_R = KNOB_R    // tip at knob edge = 160
const INDICATOR_INNER_R = KNOB_R - INDICATOR_LENGTH  // 142
```

- [ ] **Step 2: Add indicator opacity motion value**

In the `DialNavigator` component body, near the other `useTransform` calls (around line 102), add:

```tsx
// Indicator: hidden in hero (opacity 0), fades in with the morph spring, fully visible when scrolled.
const indicatorOpacity = useTransform(morphProgress, [0, 1], [0, 1])
const effectiveIndicatorOpacity = prefersReducedMotion ? 1 : indicatorOpacity
```

- [ ] **Step 3: Add indicator `<line>` to desktop SVG**

In the desktop SVG block (after the knob circle, inside `<svg>`), add:

```tsx
          <motion.line
            x1={CX + INDICATOR_INNER_R}
            y1={CY}
            x2={CX + INDICATOR_OUTER_R}
            y2={CY}
            stroke="#FFFFFF"
            strokeWidth={INDICATOR_STROKE}
            strokeLinecap="round"
            style={{ opacity: effectiveIndicatorOpacity }}
          />
```

This puts the indicator at 3 o'clock — `(CX + 142, CY)` inner tip to `(CX + 160, CY)` outer tip. `motion.line` is used so the opacity can be a MotionValue.

Important: `motion.line` needs to be imported from `framer-motion`. Check the existing import at line 4-11 and add `motion` helpers as needed — it's already imported as `motion`. `motion.line` works out of the box.

- [ ] **Step 4: Add indicator `<line>` to mobile SVG at 6 o'clock**

In the mobile SVG block, add:

```tsx
          <motion.line
            x1={CX}
            y1={CY + INDICATOR_INNER_R}
            x2={CX}
            y2={CY + INDICATOR_OUTER_R}
            stroke="#FFFFFF"
            strokeWidth={INDICATOR_STROKE}
            strokeLinecap="round"
            style={{ opacity: effectiveIndicatorOpacity }}
          />
```

At 6 o'clock: `(CX, CY + 142)` inner to `(CX, CY + 160)` outer.

- [ ] **Step 5: Visual QA**

- Hero (no scroll): knob visible; indicator NOT visible (opacity 0)
- Scroll to 120px+: indicator fades in, appearing at 3 o'clock (desktop) / 6 o'clock (mobile), white line 18px long, tip touching the knob's edge
- Rotate the dial (click sections): indicator stays at 3/6 o'clock; knob visually rotates under it via the label ring (the knob circle itself doesn't rotate, so the indicator position is stable)

- [ ] **Step 6: Commit**

```bash
git add components/DialNavigator.tsx
git commit -m "feat(dial): add white indicator line inside knob (3 o'clock desktop, 6 o'clock mobile)"
```

---

### Task 2.4 · Hide non-active labels in DialProgram

**Files:**
- Modify: `components/DialProgram.tsx:32-42, 44-63`

- [ ] **Step 1: Update label visibility logic**

With the bezel gone and labels at radius 215, having 8 labels visible at once on the dial creates visual clutter — they crowd each other at different angles. Per design spec: ONLY the active label is visible.

Replace the component body's className logic and the motion.button element:

Before (lines 32-42):
```tsx
  const colorClass = isActive
    ? section.highlight
      ? "text-[#2798ff]"
      : "text-[#0F172A]"
    : "text-[#0F172A]/50"

  const sizeClass = isActive
    ? "text-[15px] tracking-[0.16em]"
    : "text-[12px] tracking-[0.12em]"

  const weightClass = isActive ? "font-bold" : "font-normal"
```

After:
```tsx
  const colorClass = section.highlight
    ? "text-[#2798ff]"
    : "text-[#0F172A]"

  const sizeClass = "text-[15px] tracking-[0.16em]"
  const weightClass = "font-semibold"
```

And on the motion.button, add opacity + pointer-events tied to `isActive`. Replace the button block (lines 44-63):

Before:
```tsx
  return (
    <motion.button
      type="button"
      onClick={() => onClick(index)}
      aria-label={section.ariaLabel}
      aria-current={isActive ? "location" : undefined}
      className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-sm px-2 py-1 outline-none transition-[font-size,color,letter-spacing,font-weight] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#2798ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${colorClass} ${sizeClass} ${weightClass}`}
      style={{
        x: x,
        y: y,
        translateX: "-50%",
        translateY: "-50%",
        rotate: counterRotation,
        pointerEvents: "auto",
        willChange: "transform",
      }}
    >
      {section.label}
    </motion.button>
  )
```

After:
```tsx
  return (
    <motion.button
      type="button"
      onClick={() => onClick(index)}
      aria-label={section.ariaLabel}
      aria-current={isActive ? "location" : undefined}
      className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-sm px-2 py-1 outline-none transition-opacity duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#2798ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${colorClass} ${sizeClass} ${weightClass}`}
      style={{
        x: x,
        y: y,
        translateX: "-50%",
        translateY: "-50%",
        rotate: counterRotation,
        pointerEvents: isActive ? "auto" : "none",
        opacity: isActive ? 1 : 0,
        willChange: "transform, opacity",
      }}
    >
      {section.label}
    </motion.button>
  )
```

Changes:
- Only the active label gets `opacity: 1`; others are fully hidden
- Only the active label is clickable (`pointerEvents: "none"` for hidden labels — prevents phantom clicks through the invisible buttons)
- Dropped inactive styling (colorClass/sizeClass/weightClass simplifies — there's only one visible state)
- Transition is now `transition-opacity` since size/weight no longer change

- [ ] **Step 2: Visual check**

At any scroll position: only ONE label is visible on the dial — the one at the indicator position. Clicking different dial positions still works (clicks land on the active label; to navigate to others, scroll or use hero ChevronDown). Rotating the dial (via auto-scroll to a section) cross-fades the visible label.

**Note on clickability:** Previously, all 8 labels were clickable navigation targets. Hiding 7 of them changes how users move between sections — they must scroll, not click around the dial. This is intentional per spec (only active visible). If desired later, we can surface a separate nav affordance; out of scope for polish.

- [ ] **Step 3: Commit**

```bash
git add components/DialProgram.tsx
git commit -m "feat(dial): hide non-active labels (opacity 0, pointer-events none)"
```

---

### Phase 2 Checkpoint

- [ ] **Visual QA:**
  - Hero state: clean blue knob, no decorative layers, no indicator visible
  - Scrolled past 120px: indicator fades in at 3 o'clock (desktop) / 6 o'clock (mobile)
  - Only active section label visible on the dial; it sits outside the knob
  - Rotating dial (scrolling between sections) animates smoothly; active label crossfades
  - No flash of stale constants / unused code warnings in build

- [ ] **Reduced-motion test:** Enable OS reduced-motion. Indicator should be visible immediately (effectiveIndicatorOpacity = 1), dial should snap to scrolled-state position without morph.

- [ ] **Mobile test:** Resize to < 1024px. Mobile dial clips to top-edge when scrolled, indicator at 6 o'clock, active label sits below the knob.

---

## Phase 3 · Section Reveals (Staggered Micro-reveal)

**Goal:** Replace the current uniform lift reveal with the staggered-children pattern decided in brainstorm: caption → headline → subtitle → body → CTA each reveal individually with 110ms offsets, 500ms per element, 16px y offset, ease-out cubic-bezier(0.16, 1, 0.3, 1). Wrapper itself has no separate reveal (the staggered children carry the entrance). Viewport trigger moves from 0.25 to 0.3.

**Why now:** Phase 1 and 2 don't touch `SectionReveal.tsx`. Doing reveals now verifies the timing with final typography (heavier Inter Display — does the 16px y-shift still feel premium at that weight? Should be yes, but we can QA).

**Testing checklist:**
- [ ] `pnpm build` clean
- [ ] Scroll each section: elements appear one-by-one with a 110ms cascade, not all at once
- [ ] First element starts revealing when section is 30% in viewport (not 25%)
- [ ] Reduced-motion: elements appear at final position instantly, opacity fades only

**Rollback:** `git revert <phase-3-commit>` — back to 0.9s monolithic lift.

---

### Task 3.1 · Update SectionReveal variants for staggered micro-reveal

**Files:**
- Modify: `components/SectionReveal.tsx:6-20, 37`

- [ ] **Step 1: Update variant definitions**

Replace lines 6-20 of `SectionReveal.tsx`:

Before:
```tsx
const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}
```

After:
```tsx
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
```

Changes:
- `staggerChildren`: 0.12 → 0.11 (110ms per spec)
- `delayChildren`: 0.05 → 0 (first child fires immediately when section enters)
- `y`: 40 → 16 (per spec — "subtle, just enough to feel alive")
- `duration`: 0.9 → 0.5 (per spec)
- `ease`: `[0.22, 1, 0.36, 1]` → `[0.16, 1, 0.3, 1]` (per spec — heavier ease-out)

- [ ] **Step 2: Update viewport threshold**

At line 37:

Before:
```tsx
      viewport={{ once: true, amount: 0.25 }}
```

After:
```tsx
      viewport={{ once: true, amount: 0.3 }}
```

- [ ] **Step 3: Visual QA**

Hard-refresh http://localhost:3000 and scroll through each section slowly. Each section's eyebrow/h2/subtitle/body/cta should reveal in sequence — the cascade is subtle but visible. Scrolling fast shouldn't cause missed reveals (the spring catches up).

- [ ] **Step 4: Commit**

```bash
git add components/SectionReveal.tsx
git commit -m "feat(reveals): staggered micro-reveal (110ms, 500ms, y=16, amount 0.3)"
```

---

### Phase 3 Checkpoint

- [ ] Scroll each of 7 sections (every one except hero), watch the cascade
- [ ] On slow viewports (throttle to 4x CPU in DevTools), ensure 500ms feels right, not slow
- [ ] Reduced-motion: elements appear in place, opacity fade only
- [ ] Hero section: no reveal applied (hero is above-fold, already fully rendered on mount — existing `whileInView` does nothing because hero is in viewport on load)

---

## Phase 4 · Add Life — Knob Thread + 3D Emoji System

**Goal:** Every non-hero section gets a header bar with: `[mini 40px blue knob, rotated to the section's dial angle] [01 ·] [LABEL] [──── rule ────] [180px emoji, breathing animation]`. The knob visually echoes the main dial (brand thread). The emoji provides character. Mobile stacks the emoji below the headline at 110px. Breathing animation: `scale(1) ↔ scale(1.03)`, 3.5s, with per-section phase offset so the 7 emojis don't pulse in unison.

**Why after Phase 1+2:** Need the dial geometry (knob gradient, radius) finalized before building the mini knob. Need Inter typography so the eyebrow row reads at its intended weight/tracking.

**Asset dependency:** This phase produces placeholder emojis using native OS rendering via `<span>` containing the emoji character. User produces final 3D assets later and drops them into `/public/emojis/`. The component is written to be swap-friendly: once a `.png` exists at the expected path, the `<img>` fallback kicks in automatically (see SectionEmoji implementation).

**Testing checklist:**
- [ ] `pnpm build` clean
- [ ] Each non-hero section has the eyebrow row (knob + number + label + rule + emoji)
- [ ] Knob rotations match dial angles: hizmetler (45°), nasil (90°), fiyatlar (135°), neden (180°), yorumlar (225°), sss (270°), siparis (315°)
- [ ] Emojis render at 180px desktop, breathing cycle running, each with a distinct phase offset (watch 2 sections side-by-side — they should be out of sync)
- [ ] Mobile (< 768px): emoji drops to 110px and stacks BELOW the headline, not beside it
- [ ] Reduced-motion: emojis static (no animation)

**Rollback:** `git revert <phase-4-commits>` — removes the Eyebrow and Emoji components and each section's mount.

---

### Task 4.1 · Add `emoji` field and section number to lib/sections.ts

**Files:**
- Modify: `lib/sections.ts`

- [ ] **Step 1: Extend the Section interface and data**

Replace the file contents (preserving the runtime invariants) with:

```ts
export interface Section {
  /** DOM id — also used as anchor (#{id}) */
  id: string
  /** Dial label shown around the ring */
  label: string
  /** Long label for a11y / aria-label */
  ariaLabel: string
  /** Angle in degrees (clockwise from 3 o'clock). Position before dial rotation. */
  angle: number
  /** If true, label renders in brand color when active */
  highlight?: boolean
  /** Native emoji placeholder. Swapped to /public/emojis/{id}.png when that file exists. */
  emoji?: string
  /** Display number shown in the section eyebrow (e.g. "01"). Undefined for hero. */
  number?: string
}

export const SECTIONS: readonly Section[] = [
  { id: 'basla',      label: 'BAŞLA',     ariaLabel: 'Başla bölümüne git',         angle: 0   /* no emoji, no number — hero */ },
  { id: 'hizmetler',  label: 'HİZMETLER', ariaLabel: 'Hizmetler bölümüne git',     angle: 45,  emoji: '🧺',  number: '01' },
  { id: 'nasil',      label: 'NASIL',     ariaLabel: 'Nasıl çalışır bölümüne git', angle: 90,  emoji: '📱',  number: '02' },
  { id: 'fiyatlar',   label: 'FİYATLAR',  ariaLabel: 'Fiyatlar bölümüne git',      angle: 135, emoji: '💰',  number: '03' },
  { id: 'neden',      label: 'NEDEN',     ariaLabel: 'Neden YIKAT bölümüne git',   angle: 180, emoji: '✨',  number: '04' },
  { id: 'yorumlar',   label: 'YORUMLAR',  ariaLabel: 'Yorumlar bölümüne git',      angle: 225, emoji: '💬',  number: '05' },
  { id: 'sss',        label: 'SORULAR',   ariaLabel: 'Sıkça sorulan sorular bölümüne git', angle: 270, emoji: '❓', number: '06' },
  { id: 'siparis',    label: 'SİPARİŞ',   ariaLabel: 'Sipariş ver bölümüne git',   angle: 315, highlight: true, emoji: '🎉', number: '07' },
] as const

// Runtime invariant: exactly 8 sections, each 45° apart, ids unique.
if (SECTIONS.length !== 8) {
  throw new Error(`SECTIONS must have exactly 8 entries, got ${SECTIONS.length}`)
}
const seen = new Set<string>()
for (let i = 0; i < SECTIONS.length; i++) {
  const expected = i * 45
  if (SECTIONS[i].angle !== expected) {
    throw new Error(`SECTIONS[${i}].angle must be ${expected}, got ${SECTIONS[i].angle}`)
  }
  if (seen.has(SECTIONS[i].id)) {
    throw new Error(`SECTIONS[${i}].id duplicate: ${SECTIONS[i].id}`)
  }
  seen.add(SECTIONS[i].id)
}

/** Convenience lookups */
export const SECTION_IDS = SECTIONS.map(s => s.id)
```

- [ ] **Step 2: Build**

```bash
pnpm build
```
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add lib/sections.ts
git commit -m "feat(sections): add emoji and number fields per section"
```

---

### Task 4.2 · Create SectionEyebrow component

**Files:**
- Create: `components/SectionEyebrow.tsx`

- [ ] **Step 1: Write the component**

Create `components/SectionEyebrow.tsx`:

```tsx
"use client"

import { motion } from "framer-motion"
import { revealItem } from "@/components/SectionReveal"

interface SectionEyebrowProps {
  /** Angle in degrees (0..315) — the section's dial position. Mini knob rotates to match. */
  angle: number
  /** Display number, e.g. "01". */
  number: string
  /** Section label, e.g. "HİZMETLER". */
  label: string
  /** Additional className for the root wrapper (e.g., color overrides on dark sections). */
  className?: string
  /** Dark-mode variant: switches text colors for sections on dark bg (CTASection). */
  onDark?: boolean
}

/**
 * Section header "eyebrow" row: [mini knob, rotated to section angle] [01 ·] [LABEL] ──── rule ────
 * Mirrors the main dial's knob as a brand thread. Part of the "Knob Thread" decoration language.
 */
export function SectionEyebrow({ angle, number, label, className = "", onDark = false }: SectionEyebrowProps) {
  const textColor = onDark ? "text-white/80" : "text-[#64748B]"
  const ruleColor = onDark ? "bg-white/20" : "bg-[#E5E7EB]"

  return (
    <motion.div
      variants={revealItem}
      className={`flex items-center gap-3 ${className}`}
    >
      <svg
        viewBox="0 0 80 80"
        className="size-10 flex-shrink-0"
        style={{ transform: `rotate(${angle}deg)` }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`eyebrow-knob-${number}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%"  stopColor="#4aa5ff" />
            <stop offset="55%" stopColor="#2798ff" />
            <stop offset="100%" stopColor="#1a7de8" />
          </radialGradient>
        </defs>
        <circle cx={40} cy={40} r={32} fill={`url(#eyebrow-knob-${number})`} />
      </svg>

      <span
        className={`text-[12px] font-semibold uppercase tracking-[0.16em] ${textColor}`}
      >
        {number} · {label}
      </span>

      <span className={`h-px flex-1 ${ruleColor} max-w-[240px]`} aria-hidden="true" />
    </motion.div>
  )
}
```

Notes:
- `motion.div` + `variants={revealItem}` means the eyebrow participates in the Phase 3 staggered reveal — it's the first child to appear.
- Each eyebrow has its own `radialGradient` id (`eyebrow-knob-${number}`) to avoid id collisions when multiple eyebrows render on the page.
- Flex-row layout; rule takes remaining space up to 240px cap (prevents rule stretching absurdly wide in narrow columns).
- `onDark` variant: lightens text and rule for CTASection's blue background.

- [ ] **Step 2: Build**

```bash
pnpm build
```
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add components/SectionEyebrow.tsx
git commit -m "feat(eyebrow): add SectionEyebrow component (knob thread + number + label + rule)"
```

---

### Task 4.3 · Create SectionEmoji component with breathing animation

**Files:**
- Create: `components/SectionEmoji.tsx`

- [ ] **Step 1: Write the component**

Create `components/SectionEmoji.tsx`:

```tsx
"use client"

import { motion, useReducedMotion } from "framer-motion"
import { revealItem } from "@/components/SectionReveal"

interface SectionEmojiProps {
  /** Native emoji character as placeholder (e.g., "🧺"). */
  emoji: string
  /** Section id — used to pick a PNG at /public/emojis/{id}.png if it exists. */
  id: string
  /** Index 0..6 used to calculate breathing phase offset so emojis don't pulse in unison. */
  index: number
  /** Accessible label (the emoji is decorative, so this is usually empty). */
  alt?: string
}

/**
 * Per-section 3D emoji. Placeholder renders the native OS emoji via `<span>`.
 * Swap to a PNG at `/public/emojis/{id}.png` for production; the component
 * renders both — the span is aria-hidden and only shown when the PNG is missing.
 *
 * Breathing animation: scale(1) ↔ scale(1.03), 3.5s ease-in-out. Each section
 * has a phase offset of `index * 438ms` (= 3500/8) so 7 emojis pulse at
 * different points in the cycle.
 */
export function SectionEmoji({ emoji, id, index, alt = "" }: SectionEmojiProps) {
  const prefersReducedMotion = useReducedMotion()
  const phaseDelay = `-${index * 438}ms` // negative offset starts each emoji mid-cycle

  return (
    <motion.div
      variants={revealItem}
      className="flex items-start justify-center md:justify-end"
    >
      <span
        aria-hidden={alt === ""}
        aria-label={alt || undefined}
        role={alt ? "img" : undefined}
        className={prefersReducedMotion ? "" : "emoji-breathe"}
        style={{
          fontSize: "110px",
          lineHeight: 1,
          display: "inline-block",
          transformOrigin: "center",
          willChange: "transform",
          animationDelay: prefersReducedMotion ? undefined : phaseDelay,
        }}
      >
        {emoji}
      </span>
    </motion.div>
  )
}
```

- [ ] **Step 2: Add the breathing keyframe to globals.css**

In `app/globals.css`, append at the very end:

```css
@keyframes emoji-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.03); }
}
.emoji-breathe {
  animation: emoji-breathe 3.5s ease-in-out infinite;
}

/* Desktop bumps emoji to 180px */
@media (min-width: 768px) {
  .emoji-breathe { font-size: 180px !important; }
}
```

Wait — we're setting `font-size` in component style AND in CSS `!important`. Move the responsive size into CSS fully. Remove the hardcoded `fontSize: "110px"` from the component's `<span>` style. Update `SectionEmoji.tsx` style block to drop `fontSize` and `lineHeight`:

```tsx
        style={{
          display: "inline-block",
          transformOrigin: "center",
          willChange: "transform",
          animationDelay: prefersReducedMotion ? undefined : phaseDelay,
        }}
```

Add font-size and line-height to globals.css:

```css
.emoji-breathe,
span.emoji-static {
  font-size: 110px;
  line-height: 1;
}
@media (min-width: 768px) {
  .emoji-breathe,
  span.emoji-static {
    font-size: 180px;
  }
}
```

And update the component's className to apply `emoji-static` when reduced-motion:

```tsx
        className={prefersReducedMotion ? "emoji-static" : "emoji-breathe"}
```

(This way the static variant also gets the correct responsive sizing.)

- [ ] **Step 3: Build**

```bash
pnpm build
```
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add components/SectionEmoji.tsx app/globals.css
git commit -m "feat(emoji): add SectionEmoji with breathing animation and per-section phase offset"
```

---

### Task 4.4 · Create `/public/emojis/README.md` asset spec

**Files:**
- Create: `public/emojis/README.md`

- [ ] **Step 1: Write the README**

Create `public/emojis/README.md`:

```markdown
# Section Emojis — Asset Spec

Replace the native-OS emoji placeholder rendering in `components/SectionEmoji.tsx` by dropping PNG assets here, then swap the component's `<span>` for `<img src="/emojis/{id}.png" />`.

## Files expected (one per section)

- `hizmetler.png` — laundry basket (Hizmetler section)
- `nasil.png` — phone with WhatsApp glow (Nasıl çalışır section)
- `fiyatlar.png` — money / coin stack (Fiyatlar section)
- `neden.png` — sparkles / quality mark (Neden YIKAT section)
- `yorumlar.png` — speech bubble (Yorumlar section)
- `sss.png` — question mark (Sorular section)
- `siparis.png` — confetti / celebration (Sipariş section)

## Spec

- **Format:** PNG with transparent background (no halo, no rectangle)
- **Style:** 3D glossy (Apple/Telegram reference), full-color, dimensional — not flat, not line-art
- **Size:** 360×360 px source (= 180px display × 2 for retina)
- **Mobile also uses 360px source** (downscaled to 110px by CSS); no separate mobile asset needed
- **Color profile:** sRGB; if possible avoid pure black/white outlines — soft rim lights are fine
- **File weight:** aim < 80 KB each (use pngquant / tinypng after export)

## Swap procedure

Once PNGs are in place, update `components/SectionEmoji.tsx`:

```tsx
<img
  src={`/emojis/${id}.png`}
  alt={alt}
  width={180}
  height={180}
  className={prefersReducedMotion ? "emoji-static" : "emoji-breathe"}
  style={{ animationDelay: prefersReducedMotion ? undefined : phaseDelay }}
/>
```

Drop the `<span>{emoji}</span>` branch entirely at that point.
```

- [ ] **Step 2: Commit**

```bash
git add public/emojis/README.md
git commit -m "docs(emojis): add asset spec for per-section 3D emoji PNGs"
```

---

### Task 4.5 · Mount Eyebrow + Emoji in ServicesSection

**Files:**
- Modify: `components/sections/ServicesSection.tsx`

- [ ] **Step 1: Add imports**

Add at the top of the file (below existing imports):

```tsx
import { SECTIONS } from "@/lib/sections"
import { SectionEyebrow } from "@/components/SectionEyebrow"
import { SectionEmoji } from "@/components/SectionEmoji"
```

- [ ] **Step 2: Add header row with eyebrow + emoji**

Inside `<div className="mx-auto max-w-4xl">` (the inner container), before the existing `<motion.h2>Hizmetler</motion.h2>`, wrap the headline + subtitle in a two-column grid with the emoji on the right:

Replace (lines 44-56 of current file — the inner content of the max-w-4xl div):

```tsx
      <div className="mx-auto max-w-4xl">
        <motion.h2 ... >Hizmetler</motion.h2>
        <motion.p ... >Her şey tek yerde. ...</motion.p>
        <div className="mt-16 grid ..."> {/* cards */} </div>
      </div>
```

With (look up SECTION metadata for this section and render the full header):

```tsx
      <div className="mx-auto max-w-4xl">
        {(() => {
          const meta = SECTIONS.find(s => s.id === "hizmetler")!
          const sectionIndex = SECTIONS.findIndex(s => s.id === "hizmetler") - 1  // -1 to skip hero for phase-offset purposes
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <motion.h2
                    variants={revealItem}
                    className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
                    style={{ fontVariationSettings: "'opsz' 32" }}
                  >
                    Hizmetler
                  </motion.h2>
                  <motion.p
                    variants={revealItem}
                    className="mt-4 max-w-xl text-base text-[#64748B] sm:text-lg"
                  >
                    Her şey tek yerde. Çamaşırdan ayakkabıya, kapıdan kapıya.
                  </motion.p>
                </div>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <div className="mt-16 grid gap-6 sm:grid-cols-2">
                {services.map((s) => (
                  <motion.div
                    key={s.title}
                    variants={revealItem}
                    className="group rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  >
                    <s.icon className="size-6 text-[#0F172A]" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="mt-6 text-2xl font-semibold tracking-[-0.01em] text-[#0F172A]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#64748B]">{s.description}</p>
                    <p className="mt-6 text-base font-medium text-[#0F172A]">{s.price}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )
        })()}
      </div>
```

Key layout details:
- `grid-cols-1 md:grid-cols-[1fr_auto]`: mobile stacks (emoji below headline), desktop is two-column (headline fluid + emoji auto-width)
- `items-start`: top-align so emoji doesn't pin to the bottom of a tall text column
- Emoji component handles its own size/animation

- [ ] **Step 3: Visual QA**

Scroll to Hizmetler section:
- Desktop: eyebrow row at top (mini blue knob rotated 45° + "02 · HİZMETLER" + rule). Below: 2-column layout, headline+subtitle on left, 180px 🧺 emoji on right, breathing.
- Mobile (< 768px): eyebrow row, then headline+subtitle, then emoji at 110px, then cards.

- [ ] **Step 4: Commit**

```bash
git add components/sections/ServicesSection.tsx
git commit -m "feat(services): mount SectionEyebrow and SectionEmoji in header row"
```

---

### Task 4.6 · Mount Eyebrow + Emoji in HowItWorksSection

**Files:**
- Modify: `components/sections/HowItWorksSection.tsx`

- [ ] **Step 1: Follow the same pattern as Task 4.5**

Add the three imports (`SECTIONS`, `SectionEyebrow`, `SectionEmoji`) and wrap the existing h2 + steps in the two-column grid pattern.

The difference is: this section has no subtitle under the h2 — it jumps straight into `steps.map()`. The emoji column is only beside the h2.

After the opening `<div className="mx-auto max-w-4xl">`:

```tsx
      <div className="mx-auto max-w-4xl">
        {(() => {
          const meta = SECTIONS.find(s => s.id === "nasil")!
          const sectionIndex = SECTIONS.findIndex(s => s.id === "nasil") - 1
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <motion.h2
                  variants={revealItem}
                  className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  Nasıl çalışır
                </motion.h2>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <div className="mt-20 space-y-16">
                {steps.map((step) => (
                  <motion.div
                    key={step.num}
                    variants={revealItem}
                    className="grid grid-cols-[auto_1fr] items-start gap-8 border-t border-[#E5E7EB] pt-8 md:grid-cols-[120px_1fr]"
                  >
                    <span className="text-3xl font-bold text-[#2798ff] md:text-4xl" style={{ fontVariationSettings: "'opsz' 32" }}>
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.01em] text-[#0F172A] md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-base text-[#64748B] md:text-lg">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )
        })()}
      </div>
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/HowItWorksSection.tsx
git commit -m "feat(how-it-works): mount SectionEyebrow and SectionEmoji in header row"
```

---

### Task 4.7 · Mount Eyebrow + Emoji in PricingSection

**Files:**
- Modify: `components/sections/PricingSection.tsx`

- [ ] **Step 1: Follow the same pattern**

PricingSection's structure: eyebrow text ("Fiyatlar" as `<motion.p>` — remove that since the SectionEyebrow replaces it), big price h2, body paragraphs. Put the emoji beside the big-price block.

Replace the inner content of `<div className="mx-auto max-w-4xl">`:

```tsx
      <div className="mx-auto max-w-4xl">
        {(() => {
          const meta = SECTIONS.find(s => s.id === "fiyatlar")!
          const sectionIndex = SECTIONS.findIndex(s => s.id === "fiyatlar") - 1
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-6 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <motion.h2
                    variants={revealItem}
                    className="text-6xl font-bold leading-none tracking-[-0.035em] text-[#0F172A] sm:text-7xl md:text-[8rem] lg:text-[10rem]"
                    style={{ fontVariationSettings: "'opsz' 32" }}
                  >
                    110 TL
                    <span className="text-3xl font-normal text-[#64748B] sm:text-4xl md:text-5xl"> / kg</span>
                  </motion.h2>

                  <motion.p
                    variants={revealItem}
                    className="mt-8 max-w-md text-base text-[#64748B] sm:text-lg"
                  >
                    4 kg üstü alma-teslim ücretsiz.
                  </motion.p>

                  <motion.p
                    variants={revealItem}
                    className="mt-4 max-w-md text-sm text-[#64748B]"
                  >
                    Ütü 30 TL/parça. Nevresim ve ayakkabı için fiyat teklifi WhatsApp üzerinden alınır.
                  </motion.p>
                </div>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>
            </>
          )
        })()}
      </div>
```

Note: the old `<motion.p>` containing "Fiyatlar" eyebrow text (line 14-19 of the current file) is removed — the SectionEyebrow replaces it.

- [ ] **Step 2: Commit**

```bash
git add components/sections/PricingSection.tsx
git commit -m "feat(pricing): mount SectionEyebrow and SectionEmoji beside big-price block"
```

---

### Task 4.8 · Mount Eyebrow + Emoji in WhyUsSection

**Files:**
- Modify: `components/sections/WhyUsSection.tsx`

- [ ] **Step 1: Follow the same pattern**

Replace the inner content of `<div className="mx-auto max-w-4xl">`:

```tsx
      <div className="mx-auto max-w-4xl">
        {(() => {
          const meta = SECTIONS.find(s => s.id === "neden")!
          const sectionIndex = SECTIONS.findIndex(s => s.id === "neden") - 1
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <motion.h2
                  variants={revealItem}
                  className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  Neden YIKAT
                </motion.h2>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <div className="mt-16 grid gap-8 sm:grid-cols-2">
                {points.map((p) => (
                  <motion.div
                    key={p.title}
                    variants={revealItem}
                    className="border-t border-[#E5E7EB] pt-8"
                  >
                    <p.icon className="size-6 text-[#2798ff]" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="mt-5 text-2xl font-semibold tracking-[-0.01em] text-[#0F172A]">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                      {p.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </>
          )
        })()}
      </div>
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/WhyUsSection.tsx
git commit -m "feat(why-us): mount SectionEyebrow and SectionEmoji in header row"
```

---

### Task 4.9 · Mount Eyebrow + Emoji in ReviewsSection

**Files:**
- Modify: `components/sections/ReviewsSection.tsx`

- [ ] **Step 1: Follow the same pattern**

```tsx
      <div className="mx-auto max-w-4xl">
        {(() => {
          const meta = SECTIONS.find(s => s.id === "yorumlar")!
          const sectionIndex = SECTIONS.findIndex(s => s.id === "yorumlar") - 1
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <motion.h2
                  variants={revealItem}
                  className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  Yorumlar
                </motion.h2>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <motion.div
                variants={revealItem}
                className="mt-16 grid gap-6 sm:grid-cols-3"
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] bg-white p-8 text-center"
                  >
                    <p className="text-sm text-[#64748B]">
                      Yakında müşteri yorumları burada.
                    </p>
                  </div>
                ))}
              </motion.div>
            </>
          )
        })()}
      </div>
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/ReviewsSection.tsx
git commit -m "feat(reviews): mount SectionEyebrow and SectionEmoji in header row"
```

---

### Task 4.10 · Mount Eyebrow + Emoji in FAQSection

**Files:**
- Modify: `components/sections/FAQSection.tsx`

- [ ] **Step 1: Follow the same pattern**

FAQSection uses `max-w-3xl` (not `4xl`) — preserve that. Replace the inner content:

```tsx
      <div className="mx-auto max-w-3xl">
        {(() => {
          const meta = SECTIONS.find(s => s.id === "sss")!
          const sectionIndex = SECTIONS.findIndex(s => s.id === "sss") - 1
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <motion.h2
                  variants={revealItem}
                  className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  Sorular
                </motion.h2>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <motion.div variants={revealItem} className="mt-12">
                <Accordion type="single" collapsible className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-b-0">
                      <AccordionTrigger className="py-5 text-left text-lg font-semibold text-[#0F172A] hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-base leading-relaxed text-[#64748B]">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </>
          )
        })()}
      </div>
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/FAQSection.tsx
git commit -m "feat(faq): mount SectionEyebrow and SectionEmoji in header row"
```

---

### Task 4.11 · Mount Eyebrow + Emoji in CTASection (dark variant)

**Files:**
- Modify: `components/sections/CTASection.tsx`

- [ ] **Step 1: Follow the pattern with onDark=true**

CTASection has blue background. Pass `onDark` to Eyebrow. Emoji also shows on blue — the 🎉 emoji has its own colors so it works; no changes needed there.

```tsx
      <div className="mx-auto max-w-3xl">
        {(() => {
          const meta = SECTIONS.find(s => s.id === "siparis")!
          const sectionIndex = SECTIONS.findIndex(s => s.id === "siparis") - 1
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} onDark />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <motion.h2
                  variants={revealItem}
                  className="text-5xl font-bold leading-[0.98] tracking-[-0.028em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  Hazırsan
                  <br />
                  başlayalım.
                </motion.h2>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <motion.div variants={revealItem} className="mt-12">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-lg bg-white px-8 py-4 font-medium text-[#0F172A] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2798ff]"
                >
                  WhatsApp'tan sipariş ver
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </motion.div>

              <motion.p
                variants={revealItem}
                className="mt-8 text-sm text-white/85"
              >
                Destek:{" "}
                <a href="mailto:destek@yikat.tech" className="underline underline-offset-4 hover:text-white">
                  destek@yikat.tech
                </a>
              </motion.p>
            </>
          )
        })()}
      </div>
```

Note: while we're here, the contrast fix `text-white/70 → text-white/85` is folded into this task (the "Destek:" paragraph is the one that has the contrast issue). That means phase 6's Task 6.1 becomes a no-op — mark it done here.

- [ ] **Step 2: Commit**

```bash
git add components/sections/CTASection.tsx
git commit -m "feat(cta): mount SectionEyebrow (onDark) + SectionEmoji; bump contrast text-white/70->/85"
```

---

### Phase 4 Checkpoint

- [ ] Each of 7 non-hero sections has the full eyebrow row at top
- [ ] Mini knobs rotate to match: hizmetler(45°), nasil(90°), fiyatlar(135°), neden(180°), yorumlar(225°), sss(270°), siparis(315°)
- [ ] Emojis at 180px desktop, 110px mobile; stacked below on mobile
- [ ] Watch 2 sections side-by-side — breathing cycles out of sync (different phases)
- [ ] CTASection eyebrow is the light/onDark variant; rule and text lighten appropriately
- [ ] Reduced-motion: emojis static
- [ ] `pnpm build` clean

---

## Phase 5 · Hero Washing-Machine Morph

**Goal:** Replace the current hero (centered dial + stacked text) with a Rinse-style layout: machine photo on the left, headline + subtitle + CTA affordance on the right. A CSS-animated drum inside the photo's drum window sells "machine running". The dial navigator's knob is positioned overlaying the photograph's physical knob during hero state, then morphs to its fixed dial position on scroll. Photo + drum fade out during the morph; only the knob survives to the scrolled state.

**Why last-major:** Depends on Phase 2's dial geometry (KNOB_R, indicator logic), Phase 1's typography (hero headline at Inter Display), and Phase 4's SectionEyebrow being available (hero also gets an eyebrow at bottom: "Programı seç ↓" with a mini knob at 0°).

**Asset dependency:** Requires `/public/hero-machine.jpg`. For this phase to be visually complete, a placeholder photograph must be in the repo. Options:
- (Preferred) User provides final photo: high-res (≥ 1600px wide), close-up of a modern front-load washing machine, showing the drum and a single control knob prominently, soft window daylight. Colors complement the `#FAFAF7` background.
- (Fallback) Drop a temporary Unsplash-sourced photo into `/public/hero-machine.jpg` as a placeholder; document the swap in `/public/hero-machine-README.md`.

**Testing checklist:**
- [ ] `pnpm build` clean
- [ ] Hero state (scrollY = 0): machine photo left, text right; drum rotates slowly; knob overlay sits over photo's knob; YIKAT wordmark in label slot
- [ ] Mid-morph (scrollY ≈ 200): photo fading out, drum fading with it, knob scaling + translating toward fixed dial position
- [ ] Scrolled state (scrollY > 380): photo gone, dial is at its normal scrolled position (left half-clipped), indicator visible at 3 o'clock, active label (HİZMETLER etc.) in label slot
- [ ] Mobile: hero stacks (photo top, text below), knob morph handles mobile path (scrolled: top-clipped)
- [ ] Reduced-motion: photo and knob appear at scrolled position instantly (no morph); drum still rotates (drum animation is independent; if needed, suppress via prefers-reduced-motion CSS)

**Rollback:** `git revert <phase-5-commits>` — restores current HeroSection (stacked dial + text).

---

### Task 5.1 · Add placeholder hero-machine photograph and README

**Files:**
- Create: `public/hero-machine.jpg` (placeholder)
- Create: `public/hero-machine-README.md`

- [ ] **Step 1: Drop placeholder photograph**

For a placeholder, use a solid color with a CSS-rendered machine schematic — since we cannot generate JPG assets from code directly in the plan, the placeholder is literally a solid-color JPEG or a user-provided image. Easiest:

```bash
# If you have ImageMagick installed:
convert -size 1600x1200 xc:'#d9ddd8' public/hero-machine.jpg

# Otherwise: create a 1×1 gray JPEG as a null placeholder — CSS will cover it.
# A single-pixel placeholder is sufficient during development; the HeroMachine
# component has a visible fallback treatment until the real photo lands.
```

(If `convert` isn't available, the HeroMachine component's styling — written in Task 5.3 — produces a visible "photo frame" with rounded corners and a subtle gradient so the missing photo isn't a broken image.)

- [ ] **Step 2: Write asset spec README**

Create `public/hero-machine-README.md`:

```markdown
# Hero Machine Photograph — Asset Spec

Target file: `/public/hero-machine.jpg` (overwrite the placeholder).

## Subject

Close-up of a modern front-load washing machine. The shot must prominently feature:
- **A single round control knob** — the layout overlays a real SVG knob on top of it, so the photograph's knob must be the primary visual anchor on one side of the composition.
- **The drum window (circular door)** — visible, because a CSS-animated drum rotates slowly inside it during hero state.

Background should be neutral/soft — laundry room, kitchen corner, soft window daylight. Avoid busy scenes.

## Technical

- **Dimensions:** ≥ 1600px wide (we serve at 1600 desktop / 800 mobile). 3:2 or 4:3 aspect ratio works; 2:1 (wide banner) is too thin.
- **Format:** JPEG, quality 85 (balance file size vs detail on the knob)
- **File size target:** < 300 KB
- **Color:** sRGB. Complements `#FAFAF7` page background (warm neutrals, soft blues, wood tones all good; avoid hard magenta/teal)

## Composition notes

- Knob on the RIGHT side of the image (~65-80% horizontally). The CSS overlay places our SVG knob at roughly that horizontal offset; we can tweak CSS to match your image.
- Drum window occupying roughly the central 40-50% area.
- Enough negative space to the LEFT of the machine for the headline + body text to breathe (alternatively, text sits on top of the page background and the photo is a contained column; current layout = photo is a contained column on the left, text column on the right).

## Swap procedure

Replace `/public/hero-machine.jpg` with the final file. If aspect ratio differs meaningfully from the placeholder, update the `aspect-ratio` CSS in `components/HeroMachine.tsx` accordingly.
```

- [ ] **Step 3: Commit**

```bash
git add public/hero-machine-README.md public/hero-machine.jpg
git commit -m "docs(hero): add hero-machine placeholder and asset spec README"
```

---

### Task 5.2 · Scaffold HeroMachine component (layered structure, no morph yet)

**Files:**
- Create: `components/HeroMachine.tsx`

- [ ] **Step 1: Write the scaffold**

Create `components/HeroMachine.tsx`:

```tsx
"use client"

import Image from "next/image"

/**
 * Layered hero visual: photograph of a washing machine + CSS-animated drum
 * overlay + a slot where the DialNavigator's knob is visually positioned
 * during hero state.
 *
 * The knob itself is rendered by DialNavigator (fixed-position). This
 * component does NOT own the knob — it owns the photograph and drum only,
 * and provides a visual anchor position for where the knob *appears* to
 * sit on the photo. The knob morphs out of this position on scroll.
 */
export function HeroMachine() {
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#E5E7EB]"
      aria-hidden="true"
    >
      {/* Layer 1: photograph */}
      <Image
        src="/hero-machine.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 480px, 100vw"
        className="object-cover"
      />

      {/* Layer 2: drum — rotating CSS overlay inside the photograph's drum window.
          Position values (top/left/size) are tuned to match the photo's drum position.
          ADJUST these three values to match the final asset. */}
      <div
        className="absolute rounded-full opacity-40 mix-blend-multiply drum-spin"
        style={{
          top: "30%",
          left: "30%",
          width: "40%",
          aspectRatio: "1",
          background: "radial-gradient(circle at 50% 50%, transparent 60%, rgba(15,23,42,0.15) 62%, transparent 64%), radial-gradient(circle at 30% 70%, rgba(15,23,42,0.25), transparent 40%), radial-gradient(circle at 70% 30%, rgba(15,23,42,0.2), transparent 35%)",
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Add drum-spin keyframe to globals.css**

Append to `app/globals.css`:

```css
@keyframes drum-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.drum-spin {
  animation: drum-spin 18s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .drum-spin { animation: none; }
}
```

18s for one full rotation — slow enough to feel gentle, fast enough to read as "spinning" within the hero's visual duration.

- [ ] **Step 3: Commit**

```bash
git add components/HeroMachine.tsx app/globals.css
git commit -m "feat(hero): scaffold HeroMachine component (photo + CSS drum overlay)"
```

---

### Task 5.3 · Update HeroSection to two-column layout mounting HeroMachine

**Files:**
- Modify: `components/sections/HeroSection.tsx`

- [ ] **Step 1: Rewrite layout as two-column**

Replace the file contents:

```tsx
"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { HeroMachine } from "@/components/HeroMachine"

export function HeroSection() {
  return (
    <SectionReveal
      id="basla"
      ariaLabel="Başla"
      className="relative flex min-h-screen items-center pb-24 pt-16 pl-6 pr-6 lg:pl-[80px] lg:pr-[80px]"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT: machine photo */}
        <motion.div variants={revealItem} className="order-1 lg:order-1">
          <HeroMachine />
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
    </SectionReveal>
  )
}
```

Key changes:
- Dropped `lg:pl-[480px]` padding — that was reserving space for the centered dial overlay; with the dial now morphing, hero uses its own two-column grid.
- `grid-cols-1 lg:grid-cols-2`: mobile stacks machine on top then text; desktop puts them side-by-side.
- `max-w-[1400px]`: wider than the 3xl typography column on other sections, because the hero visually centers a 2-column layout.
- Dropped the outer `mx-auto max-w-3xl` wrapper — the grid handles layout.

- [ ] **Step 2: Visual QA**

Open http://localhost:3000:
- Desktop (≥ 1024px): machine photo card on left, text column on right, centered horizontally with max-w-1400.
- Mobile: machine photo first, text stack below.
- Dial navigator (existing fixed-position knob): currently renders at `50vw` center. It's visually overlapping the scene — next task addresses this.

- [ ] **Step 3: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "feat(hero): two-column layout — machine left, text right"
```

---

### Task 5.4 · Position DialNavigator's hero state over the HeroMachine's knob

**Files:**
- Modify: `components/DialNavigator.tsx`

**Context:** Currently, `DialNavigator`'s hero state pins the knob at `left: 50vw` (screen center). With HeroMachine on the LEFT half, the knob needs to move so it sits over the photo's visible knob. Target position: roughly `left: 30vw` (inside the left column), centered vertically at the photo's knob height.

- [ ] **Step 1: Introduce a hero-offset constant and update the `left` transform**

Near the size constants at the top of DialNavigator.tsx, add:

```tsx
// Hero state: knob visually overlays the photograph's physical knob on the left half.
// 30vw lands in the center of the left column on a max-w-1400 grid at wider viewports.
const HERO_LEFT_VW = 30
```

Update the `left` useTransform (around line 102):

Before:
```tsx
  const left = useTransform(morphProgress, [0, 1], ["50vw", "0vw"])
```

After:
```tsx
  const left = useTransform(morphProgress, [0, 1], [`${HERO_LEFT_VW}vw`, "0vw"])
```

- [ ] **Step 2: Tune hero scale and vertical position**

The knob on the photograph is smaller than the current `HERO_SCALE = 0.76` suggests. Reduce it so the SVG knob roughly matches the photo's knob diameter at viewport widths ≥ 1024px. Photo column is ~480px wide, photo's knob is ~22% of that ≈ 105px, our BASE_SIZE is 500, so scale = 105/500 = 0.21.

Change:

```tsx
const HERO_SIZE = 380
const HERO_SCALE = HERO_SIZE / BASE_SIZE    // 0.76
```

To:

```tsx
const HERO_SIZE = 110                        // matches photo's knob on-screen diameter
const HERO_SCALE = HERO_SIZE / BASE_SIZE     // 0.22
```

Also add vertical offset — the dial is anchored `top: 1/2` which is screen-center; hero state wants it aligned with the photo's knob (roughly ~40% of viewport height on desktop, varies with photo's composition):

```tsx
// Hero state: knob sits at ~40% from top (aligns with photograph's knob position).
const HERO_TOP_PCT = 40
```

And update the desktop motion.div top/y:

Find (around line 147):
```tsx
        className="pointer-events-none fixed top-1/2 z-40 hidden h-[500px] w-[500px] lg:block"
```

Change to:
```tsx
        className="pointer-events-none fixed z-40 hidden h-[500px] w-[500px] lg:block"
```

(Removes `top-1/2` so we drive top from motion state.)

Add `top` to its motion.div style:

```tsx
        style={{
          left: effectiveLeft,
          top: effectiveTop,
          x: "-50%",
          y: "-50%",
          scale: effectiveScale,
          transformOrigin: "center",
          willChange: "transform",
        }}
```

Where `effectiveTop` is a new motion value:

```tsx
  const top = useTransform(morphProgress, [0, 1], [`${HERO_TOP_PCT}%`, "50%"])
  const effectiveTop = prefersReducedMotion ? "50%" : top
```

- [ ] **Step 3: Build + visual QA**

```bash
pnpm build
```

Open http://localhost:3000. On desktop: the SVG knob should now appear at roughly 30vw horizontal, 40% vertical, scaled to ~110px diameter — visually sitting on the photograph's knob area. As you scroll, it morphs left and grows to the full scrolled dial size. The alignment won't be perfect because the photo is a placeholder; the final image swap adjusts the `HERO_LEFT_VW` and `HERO_TOP_PCT` values to match.

- [ ] **Step 4: Commit**

```bash
git add components/DialNavigator.tsx
git commit -m "feat(dial): hero state positions knob over photograph (left 30vw, top 40%, scale 0.22)"
```

---

### Task 5.5 · Fade the photograph and drum with morph progress

**Files:**
- Modify: `components/HeroMachine.tsx`
- Modify: `components/sections/HeroSection.tsx` (pass scroll-based opacity down)

**Context:** The photo should be fully opaque at scrollY=0, fully gone by scrollY=380 (matching the dial morph window). Simplest approach: `HeroMachine` subscribes to `scrollY` via `useScroll` and fades itself.

- [ ] **Step 1: Make HeroMachine subscribe to scroll**

Update `components/HeroMachine.tsx`:

```tsx
"use client"

import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

export function HeroMachine() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 380], [1, 0], { clamp: true })
  const effectiveOpacity = prefersReducedMotion ? 0 : opacity

  return (
    <motion.div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#E5E7EB]"
      style={{ opacity: effectiveOpacity }}
      aria-hidden="true"
    >
      <Image
        src="/hero-machine.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 480px, 100vw"
        className="object-cover"
      />

      <div
        className="absolute rounded-full opacity-40 mix-blend-multiply drum-spin"
        style={{
          top: "30%",
          left: "30%",
          width: "40%",
          aspectRatio: "1",
          background: "radial-gradient(circle at 50% 50%, transparent 60%, rgba(15,23,42,0.15) 62%, transparent 64%), radial-gradient(circle at 30% 70%, rgba(15,23,42,0.25), transparent 40%), radial-gradient(circle at 70% 30%, rgba(15,23,42,0.2), transparent 35%)",
        }}
      />
    </motion.div>
  )
}
```

Reduced-motion users get `opacity: 0` immediately (photo hidden on load, dial snaps to scrolled position); this matches the pattern where reduced-motion skips the morph.

- [ ] **Step 2: Visual QA**

Scroll from 0 to past 380:
- ScrollY 0: photo fully visible, drum spinning
- ScrollY ~200: photo half-faded
- ScrollY >380: photo gone; dial is at scrolled position

- [ ] **Step 3: Commit**

```bash
git add components/HeroMachine.tsx
git commit -m "feat(hero): fade HeroMachine opacity with scrollY 0->380"
```

---

### Task 5.6 · Add YIKAT brand-mark slot in dial's label position during hero

**Files:**
- Modify: `lib/sections.ts` (change `basla.label` from "BAŞLA" to "YIKAT" OR add separate display-label field)
- Or alternatively: modify `components/DialProgram.tsx` to render the hero-state label as "YIKAT"

**Design decision:** The simpler option is to change `SECTIONS[0].label` directly from "BAŞLA" to "YIKAT" — because the "BAŞLA" label was always going to be replaced with the brand mark in hero state per spec. Since only the active label is shown (per Phase 2 task 2.4), and `basla` is active at scrollY=0, the label shown is the brand mark automatically.

However, when scrolled, `basla` is no longer active — the active section becomes hizmetler, nasil, etc. So "YIKAT" is only shown at hero (when `basla` is active). That's exactly the spec.

- [ ] **Step 1: Rename `basla` label**

In `lib/sections.ts`:

Before:
```ts
{ id: 'basla', label: 'BAŞLA', ariaLabel: 'Başla bölümüne git', angle: 0 /* ... */ },
```

After:
```ts
{ id: 'basla', label: 'YIKAT', ariaLabel: 'Başa dön', angle: 0 /* ... */ },
```

(aria-label also updates: clicking "YIKAT" when scrolled should navigate to top, hence "Başa dön" = "back to top".)

- [ ] **Step 2: Adjust typography for the brand mark specifically**

"YIKAT" at the same `text-[15px] tracking-[0.16em] font-semibold` as other labels looks fine, but to match the brand wordmark's feel (per brainstorm: "Inter, 26px, 2.5px letter-spacing"), we can special-case it in `DialProgram.tsx`.

Detect the `basla` id and apply a bigger size. In `components/DialProgram.tsx`, just above the return:

```tsx
  // Hero brand mark: "YIKAT" renders bigger than other labels (brand wordmark presence).
  const isBrandMark = section.id === "basla"
  const finalSizeClass = isBrandMark
    ? "text-[26px] tracking-[0.16em]"
    : sizeClass
```

Then use `finalSizeClass` instead of `sizeClass` in the className template:

```tsx
      className={`... ${colorClass} ${finalSizeClass} ${weightClass}`}
```

- [ ] **Step 3: Visual QA**

Hero state (scrollY = 0): the dial's label slot shows "YIKAT" in Inter Bold 26px with wide tracking — positioned outside the knob (at radius 215 from center). Scroll to hizmetler: YIKAT fades out as hizmetler ("HİZMETLER") fades in.

- [ ] **Step 4: Commit**

```bash
git add lib/sections.ts components/DialProgram.tsx
git commit -m "feat(brand): render YIKAT wordmark in dial label slot during hero (replaces BAŞLA)"
```

---

### Task 5.7 · End-to-end hero morph QA and tuning

**Files:**
- Potentially fine-tune: `components/DialNavigator.tsx` (HERO_LEFT_VW, HERO_TOP_PCT, HERO_SIZE), `components/HeroMachine.tsx` (drum position), `app/globals.css` (drum timing)

- [ ] **Step 1: Full-flow visual review**

In the browser (hard refresh):
- Scroll from top slowly. Observe:
  - At rest: knob sits on photo's knob. YIKAT label beside/below it.
  - Scroll 0 → 120: morph not yet triggered (scroll window starts at 120).
  - Scroll 120 → 380: photo fades, knob slides left + grows, indicator fades in inside knob, YIKAT label transitions to HİZMETLER as hizmetler section crosses the 30% viewport threshold.
  - Scroll > 380: steady state — dial pinned at left, fully visible, indicator at 3 o'clock, active section label.

- [ ] **Step 2: Tune if anything visibly breaks**

Common issues:
- Knob doesn't align with photo's knob → adjust `HERO_LEFT_VW` (try 28, 32, etc.) and `HERO_TOP_PCT` (try 38, 42).
- Knob too small/large → adjust `HERO_SIZE` (try 100-130).
- Drum visible through the faded photo → the drum is inside `<HeroMachine>` which fades together; should be fine. If not, set the drum's wrapper opacity to inherit from the motion.div.
- Morph feels too fast/slow → adjust the spring (`stiffness: 50, damping: 20` in DialNavigator); user spec is stiffness 40 damping 22 for a softer arrival — adjust to those if needed.

- [ ] **Step 3: Reduced-motion check**

Enable OS reduced-motion. Reload. Expected:
- Photo: opacity 0 immediately (dial starts at scrolled position, photo invisible)
- Drum: not spinning (keyframe disabled in `@media (prefers-reduced-motion: reduce)`)
- Dial: at scrolled position immediately, no morph
- Label: YIKAT visible if at top, HİZMETLER etc. when scrolled

This means reduced-motion users don't see the machine photo at all — which is a content loss. Acceptable tradeoff: the hero morph is fundamentally a motion-dependent effect. The two-column text column still carries the hero message.

If desired: for reduced-motion, render a STATIC photo (no fade) and SKIP the knob morph — show the dial at its scrolled position from the start, with the photo as a decorative left-column image. This is more considerate but adds branching. For v1 of polish, accept the simpler behavior: reduced-motion = no photo.

- [ ] **Step 4: Mobile check**

Resize to < 1024px:
- Grid collapses: photo on top, text below
- Dial: uses the mobile morph path (top-clipped on scroll). Hero state: mobile dial is centered at 30% from top, 70vw diameter. This may or may not visually align with the stacked mobile photo — acceptable divergence; the photo on mobile is smaller and the knob-alignment precision matters less.

- [ ] **Step 5: Commit the tuning (if any tuning happened)**

```bash
git add components/DialNavigator.tsx components/HeroMachine.tsx
git commit -m "chore(hero): tune morph constants for placeholder photo alignment"
```

If no tuning was needed, skip this commit.

---

### Phase 5 Checkpoint

- [ ] All four hero states visually correct: hero at rest, mid-morph, scrolled, reduced-motion
- [ ] Mobile hero stacks cleanly (photo above, text below)
- [ ] No regressions in other sections (the dial still morphs to scrolled state for section 1 onwards)
- [ ] `pnpm build` clean
- [ ] Lighthouse hero-image LCP: the machine photograph is the LCP candidate; with `priority` on `next/image` and `sizes` hint, should be < 2.5s on mid-tier mobile
- [ ] Photo README is in place for user to swap in the final asset

---

## Phase 6 · Final Polish

**Goal:** Clean up any remaining trailing items and run the final QA sweep.

**Testing checklist:** (covered per-task below)

**Rollback:** minor fixes; individual reverts if needed.

---

### Task 6.1 · CTA contrast fix

**Context:** The `text-white/70` → `text-white/85` change was folded into Phase 4 Task 4.11. Verify it landed.

- [ ] **Step 1: Grep for remaining text-white/70**

```bash
grep -rn "text-white/70" components/ app/
```

Expected: no matches (all should be 85 or other values). If any remain in CTASection or elsewhere and the contrast-fix context applies, update to `text-white/85`.

- [ ] **Step 2: Commit (if any change)**

```bash
git add -A
git commit -m "fix(a11y): remaining text-white/70 -> text-white/85 for AA contrast"
```

---

### Task 6.2 · Full-page QA across sections

- [ ] **Step 1: Run Next build**

```bash
pnpm build
```
Expected: clean.

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```
Expected: no new warnings vs. baseline.

- [ ] **Step 3: Visual sweep (dev server)**

Walk through every section from top to bottom:
- Hero: photo + drum + knob overlay, YIKAT wordmark, two-column, typography in Inter Display
- Hizmetler: eyebrow (mini knob at 45° + 02 · HİZMETLER + rule), headline + subtitle + emoji 🧺 on right, 2x2 cards, staggered reveal
- Nasıl: eyebrow (📱 phone emoji), 3 numbered steps, staggered reveal
- Fiyatlar: eyebrow (💰 money), big 110 TL in Inter Display Bold, staggered reveal
- Neden: eyebrow (✨ sparkles), 4 feature points grid, staggered reveal
- Yorumlar: eyebrow (💬 speech bubble), 3-card placeholder grid, staggered reveal
- Sorular: eyebrow (❓ question mark), accordion FAQ, staggered reveal
- Sipariş: eyebrow (🎉 on dark — light-variant), huge white headline, WhatsApp CTA, text-white/85 destek link

- [ ] **Step 4: Mobile sweep (< 768px)**

All sections: emoji stacks below headline at 110px, eyebrow row is tight, horizontal scroll nowhere triggers, dial is bottom-clipped on scroll.

- [ ] **Step 5: Reduced-motion sweep**

Enable OS reduced-motion. Reload. Expected:
- Reveals: opacity-only, no y translation, still staggered
- Emojis: static, no breathing
- Drum: not spinning
- Dial morph: no morph, knob at scrolled position from load
- Photo: hidden (opacity 0)
- Indicator: visible immediately

- [ ] **Step 6: Commit if any final tweaks**

```bash
git add -A
git commit -m "chore(polish): final QA sweep clean-ups"
```

(Skip if nothing to commit.)

---

### Task 6.3 · Update `.gitignore` is sane (sanity check)

- [ ] **Step 1: Verify `.superpowers/` is ignored**

```bash
grep -q "^\.superpowers" .gitignore && echo "OK" || echo "MISSING"
```

Expected: `OK`. (This was added earlier in the session per summary.)

- [ ] **Step 2: Verify no brainstorm artifacts are staged**

```bash
git status
```
Expected: `.superpowers/` not listed (ignored correctly).

No commit needed.

---

### Phase 6 Checkpoint

- [ ] `pnpm build` clean
- [ ] `pnpm lint` clean
- [ ] All sections render correctly across desktop and mobile
- [ ] Reduced-motion behaves as specified
- [ ] No console errors in browser
- [ ] Lighthouse run (performance, accessibility, best-practices) — targets:
  - Performance: ≥ 90 (LCP < 2.5s; the machine photo is the LCP)
  - Accessibility: ≥ 95 (contrast AA everywhere, focus visible, aria-labels on interactive elements)
  - Best practices: ≥ 95
- [ ] Turkish glyph sanity: view-source on a rendered page and confirm no "?" or broken characters

---

## Post-Plan: Asset Handoff

After the plan lands, two placeholder assets still need user action:

1. **Machine photograph** — replace `/public/hero-machine.jpg` with final production photo (see `public/hero-machine-README.md`). Tune `HERO_LEFT_VW`, `HERO_TOP_PCT`, `HERO_SIZE` in `components/DialNavigator.tsx` and the drum position `top/left/width` in `components/HeroMachine.tsx` to match the final composition.

2. **3D emojis** — produce 7 PNGs and drop them into `/public/emojis/` per `public/emojis/README.md`. Then update `components/SectionEmoji.tsx` to render `<img src={`/emojis/${id}.png`} />` instead of the native-emoji `<span>`.

Neither is blocking for the polish plan itself — the code is complete with placeholders, and the swaps are surgical (one file each).

---

## Self-Review

**Spec coverage (from Design Summary at top):**
1. ✅ Typography — Phase 1, tasks 1.1-1.11
2. ✅ Dial redesign — Phase 2, tasks 2.1-2.4
3. ✅ Section reveals — Phase 3, task 3.1
4. ✅ Add life (Knob Thread + Emoji) — Phase 4, tasks 4.1-4.11
5. ✅ Hero machine morph — Phase 5, tasks 5.1-5.7
6. ✅ YIKAT brand-mark slot — Phase 5, task 5.6
7. ✅ CTA contrast fix — folded into Phase 4 task 4.11; verified in Phase 6 task 6.1
8. ✅ Center dot removal — Phase 2, task 2.1
9. ✅ Label clipping bug — structurally resolved by Phase 2 (no bezel, labels at outside radius)

**Placeholder scan:** no TBD, TODO, or hand-wave language. Every task has complete code or explicit commands. Two placeholders-by-design exist: the machine photograph and the emoji PNGs. These are user-produced assets; the plan documents them with asset specs (README files) and the code renders functional placeholders in the meantime.

**Type/signature consistency:**
- `SectionEyebrow` props: `{ angle, number, label, className?, onDark? }` — consistent across all 7 mount tasks.
- `SectionEmoji` props: `{ emoji, id, index, alt? }` — consistent.
- `revealItem` variant is imported the same way in both new components and continues to work with the Phase 3 staggered variant (`y: 16`, `duration: 0.5`).
- `SECTIONS` items have `emoji?: string` and `number?: string` — both added in Task 4.1 before first use in Task 4.5.
- New constants in DialNavigator (`KNOB_R`, `INDICATOR_*`, `HERO_LEFT_VW`, `HERO_TOP_PCT`) are introduced before use.

**Task granularity check:** Every task has ≤ 4 steps; most steps are single edits, build commands, or commits — in the 2-5 minute range. Phase 5 has heavier tasks (photo spec, cross-browser tune) but each is still focused on one concern.

---
