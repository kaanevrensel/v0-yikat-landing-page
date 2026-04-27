# Emoji swap — inventory pass (2026-04-27)

> **Status:** Pre-implementation. No code changed. Awaiting custom PNG assets from Claude Design.
> **Scope:** Hizmetler (çanta/bag) + Nasıl Çalışır (telefon/phone) sections only.

---

## Current state — Hizmetler section

**Component:** `components/sections/ServicesSection.tsx` line 73
```tsx
<SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
```

**Emoji value:** `🧺` (laundry basket) — defined at `lib/sections.ts` line 20, field `emoji`.  
**Section id:** `"hizmetler"` — determines PNG path at `/public/emojis/hizmetler.png`.  
**Render method:** Native emoji string (`🧺`) inside `<span>` inside `motion.div`. See `components/SectionEmoji.tsx` line 50: `{emoji}`.  
**Current dimensions:**
- Mobile (< 768px): `font-size: 110px` — `globals.css` line 140
- Desktop (≥ 768px): `font-size: 180px` — `globals.css` line 146

**Responsive logic:** Tailwind-via-globals.css media query on `.emoji-breathe` / `.emoji-static` classes. No Tailwind responsive prefix, no framer-motion responsive variants.  
**Alt / aria:** `alt` defaults to `""` → `aria-hidden="true"`, `role` omitted. Decorative. No accessible label currently.  
**Motion interaction:** `<SectionEmoji>` is wrapped in a `motion.div` with `variants={revealItem}` (`SectionEmoji.tsx` line 31). This div is a direct child of `SectionReveal` (`SectionReveal.tsx`), so it participates in the One Beat cascade (item 6): wrapper rises y:28 first, then children (including this emoji div) stagger in. Swapping the inner `<span>{emoji}</span>` for `<img>` does not affect this — the motion lives on the parent `motion.div`.

---

## Current state — Nasıl Çalışır section

**Component:** `components/sections/HowItWorksSection.tsx` line 41
```tsx
<SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
```

**Emoji value:** `📱` (phone) — defined at `lib/sections.ts` line 21, field `emoji`.  
**Section id:** `"nasil"` — determines PNG path at `/public/emojis/nasil.png`.  
**Render method:** Same as Hizmetler — native emoji string inside `<span>`.  
**Current dimensions:** Same — 110px mobile / 180px desktop.  
**Responsive logic:** Same — CSS classes in `globals.css`.  
**Alt / aria:** Same — decorative, `aria-hidden="true"` by default.  
**Motion interaction:** Same — `motion.div` with `variants={revealItem}`, participates in One Beat cascade. Swap does not affect choreography.

---

## SectionEmoji component — full render path

**File:** `components/SectionEmoji.tsx`

The component receives `emoji`, `id`, `index`, `alt`. Currently renders:
```tsx
<motion.div variants={revealItem} className="flex items-start justify-center md:justify-end">
  <span
    aria-hidden={alt === "" || undefined}
    className={prefersReducedMotion ? "emoji-static" : "emoji-breathe"}
    style={{ display: "inline-block", transformOrigin: "center", willChange: "transform",
             animationDelay: phaseDelay }}
  >
    {emoji}  {/* ← this is the only thing that changes in the swap */}
  </span>
</motion.div>
```

The `id` prop is already present and reserved for the PNG swap. The `public/emojis/README.md` documents the exact swap procedure (`<span>` → `<img>`). **Implementation delta is ~10 LOC in one file.**

The breathing animation (`emoji-breathe` keyframe, `scale(1) ↔ scale(1.03)`, 3.5s) lives on the CSS class. It will apply to the `<img>` the same way it applies to the `<span>` — no animation changes needed during the swap.

---

## Asset destination

**Directory:** `/public/emojis/` — already exists. Contains `README.md` with original spec (180px targets). No PNG files present.

| Section | File path | Current subject | New subject (item 7) |
|---|---|---|---|
| Hizmetler | `/public/emojis/hizmetler.png` | laundry basket 🧺 | **çanta (bag)** |
| Nasıl Çalışır | `/public/emojis/nasil.png` | phone 📱 | telefon (phone) — subject unchanged |

Note: `lib/sections.ts` `emoji` field (`🧺`, `📱`) remains as native emoji fallback — it is still rendered if the PNG file is absent. After PNG swap, the `emoji` field becomes unused by `SectionEmoji` but stays in the data model for any other consumers (label ring tooltip, etc.). No change to `sections.ts` required.

---

## Master plan item 7 — size targets

| | Current | Item 7 target |
|---|---|---|
| Desktop (≥ 768px) | `font-size: 180px` | `font-size: 120px` |
| Mobile (< 768px) | `font-size: 110px` | `font-size: 80px` |

**Implementation note (not a code change now):** When item 7 lands, two places change:
1. `globals.css` lines 140 and 146 — update `font-size` values (or rename to `width`/`height` once `<span>` → `<img>` since `font-size` has no effect on replaced elements).
2. `public/emojis/README.md` `<img width={180} height={180}>` → `width={120} height={120}`.

The `<img>` in `SectionEmoji` will need explicit `width`/`height` for the CSS sizing — `font-size` is meaningless on `<img>`. Implementation must switch to `width`/`height` CSS properties (or Tailwind `w-[120px] md:w-[180px]`) at swap time.

---

## PNG specs to forward to Claude Design

These are the specs the custom assets must meet when delivered:

| Field | Spec |
|---|---|
| **Format** | PNG, transparent background (no white rectangle, no shadow halo) |
| **Style** | 3D glossy, full-color, dimensional — Apple/Telegram emoji aesthetic. Not flat, not line-art. |
| **Source dimensions** | **360 × 360 px** at 72 ppi |
| **Why 360px** | Serves 3× retina at 120px desktop target (120 × 3 = 360) and 4.5× for 80px mobile — full coverage |
| **Color profile** | sRGB. No pure-black outlines — soft rim lights are fine. |
| **File weight** | Aim < 80 KB each after pngquant / TinyPNG compression |
| **Canvas** | Subject centered, breathing room ≥ 20px on each edge |
| **Filenames** | `hizmetler.png` (çanta/bag), `nasil.png` (telefon/phone) |

**Hizmetler asset brief:** A bag — çanta. 3D style, warm colors consistent with laundry/service brand. No text.  
**Nasıl Çalışır asset brief:** A phone/telefon. 3D style, could show WhatsApp green glow or neutral modern phone. No text.

---

## Open questions

None blocking. All wiring is pre-built (`id` prop reserved, `/public/emojis/` directory exists, swap procedure documented in `README.md`). Implementation is mechanical once assets land.

---

## Self-check

- [x] Both section files found, line numbers exact
- [x] Render method: native emoji string in `<span>` (not Image, not SVG)
- [x] Dimensions: 110px mobile / 180px desktop from globals.css lines 140+146
- [x] Responsive: CSS class media query — not Tailwind responsive prefix, not framer-motion
- [x] Alt/aria: decorative aria-hidden by default
- [x] Motion: participates in One Beat cascade via parent `motion.div variants={revealItem}`. Swap does not affect choreography.
- [x] Asset path: `/public/emojis/{id}.png` — pre-documented, directory exists
- [x] PNG spec: 360×360px, transparent, sRGB, < 80 KB
- [x] Item 7 size targets: 120px desktop / 80px mobile confirmed
- [x] Implementation delta: ~10 LOC in `SectionEmoji.tsx` + 2 CSS value updates in `globals.css`
