# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing site for **YIKAT** (yikat.tech) — a Turkish, app-first premium laundry/dry-cleaning aggregator serving İstanbul Anadolu Yakası (origin: Çekmeköy). All UI copy is Turkish. The site takes no orders and shows no prices; every conversion path funnels to mobile app download.

## Business context: master plan vs. current pivot

**Master plan (long-term, what the site currently reflects):** app-first aggregator routing door-to-door orders (kapıdan alım, kapıya teslim) to vetted partner dry cleaners. Five services: kuru temizleme, çamaşır, ütü, ayakkabı, hacimli tekstil. Dual audience: B2C homepage funnel + B2B partner recruitment (/partnerlik).

**ACTIVE SHORT-TERM PIVOT (as of July 2026):** a physical shoe-washing store (ayakkabı yıkama dükkanı) is opening. Until the mobile app ships, the business offers **only shoe washing, through the physical store**. Implications:

- Site messaging and hierarchy shift toward ayakkabı yıkama as the hero offering.
- **SEO must be re-targeted**: keywords, metadata, JSON-LD, and sitemap currently target dry-cleaning/laundry aggregator terms; they need to target shoe-washing + local-store terms (ayakkabı yıkama, ayakkabı temizleme + store location).
- The master plan is not cancelled — don't delete aggregator/partner/app infrastructure; adapt and re-weight. Expect a swing back when the app launches.

## Working method (mandatory)

- **Use superpowers skills for every task**: brainstorming before any creative/feature work, writing-plans → executing-plans for multi-step work, test-driven-development where applicable, verification-before-completion before claiming done, requesting-code-review after major steps.
- **Design language**: all UI/visual/motion work goes through the `design-motion-principles` and `impeccable` skills. Invoke them before designing or changing any interface or animation.

## Commands

Package manager is **pnpm** (both lockfiles exist, but node_modules is pnpm-installed).

- `pnpm dev` — dev server
- `pnpm build` — production build. **`next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so a green build does NOT mean type-safe.** Run `npx tsc --noEmit` to actually typecheck.
- `pnpm lint` — eslint
- No test suite exists.

Env var: `RESEND_API_KEY` (used only by `/api/partner`).

## Architecture

Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind CSS v4 + shadcn/ui (new-york) + framer-motion. Path alias `@/*` → repo root.

**Routes** (each `app/<route>/page.tsx`, no nested layouts): `/` (pure composition of section components: Hero → TrustBand → Services → HowItWorks → WhyYikat → AreaTeaser → Testimonials → AppBand → PartnerCta → Faq), `/hizmetler`, `/nasil-calisir`, `/partnerlik` (B2B, contains PartnerForm), `/sss`, `/iletisim`, `/kvkk`, `/mesafeli-satis-sozlesmesi`. The last three don't use Navbar/Footer — they have their own minimal back-link header.

**`lib/site.ts`** is the intended central config (`siteConfig`: phone/email/WhatsApp/store URLs; `trustStats`: 1.500+ sipariş, 12+ partner, 18+ mahalle, 400+ müşteri). Centralization is **partial**: `app/layout.tsx` hardcodes its own `SITE_URL`/phone/email, and `/iletisim` hardcodes contact info in a different format. App store URLs are placeholders until the app ships.

**"Brief" comments**: code comments cite a numbered spec ("Brief §5.4", "§8.1", "§9.6"...). That Brief is the content source of truth — respect existing §-constraints (e.g. §5.3: trust numbers are conservative, do not inflate; §5.4: Kuru Temizleme listed first; §10.3: testimonials are placeholder copy until written-consent reviews exist).

**Section component conventions** (components/*.tsx, one per homepage section): everything is `"use client"` except `footer.tsx`. Pattern: `<section id="turkish-slug">` → `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8` → centered H2 → grid; sections alternate `bg-background`/`bg-muted`; padding `py-20 sm:py-28`. Motion: framer-motion `whileInView` with `viewport={{ once: true, margin: "-80px" }}`, `y: 16–24`, duration 0.5, `staggerChildren` 0.08–0.12; hero uses on-mount `animate` with staggered delays instead. `motion-reduce:` respected on CSS animations.

**CTA pattern**: `AppDownloadButton` (components/app-download-button.tsx) is THE primary CTA — UA-sniffs platform (iOS/Android → store URL, desktop → dialog with both badges) and fires per-placement gtag events (`hero_app_download_click`, `nav_app_download_click`, ...). The `track()` gtag helper is copy-pasted locally in 3 files, not shared.

**API routes**: `/api/partner` actually sends email via Resend (from `yikat@yikat.tech`, to zefek10@gmail.com + ahmet@yikat.tech). **`/api/contact` is a stub — it only `console.log`s; contact submissions are not delivered anywhere.** Both use manual validation (no zod). Forms are plain-React `idle|sending|sent|error` state machines (no react-hook-form, no toasts); partner form does client-side TR phone regex validation.

## SEO layout

- All metadata lives in `app/layout.tsx`: default title/description/keywords, OG (no og:image exists anywhere despite `summary_large_image`), Google verification token, **no title template** (subpages replace the title entirely).
- Three JSON-LD blocks are inlined in the root layout, so they render on **every** page: Organization, `DryCleaningOrLaundry` (5-service offer catalog, areaServed Anadolu Yakası), and a 4-item FAQPage duplicating the first 4 of the 8 FAQs on `/sss`. The pivot's SEO work centers here.
- `public/robots.txt` and `public/sitemap.xml` are **static hand-maintained files** (no `app/sitemap.ts`); sitemap lastmod dates go stale.
- Per-page `alternates.canonical` exists only on /hizmetler, /nasil-calisir, /partnerlik, /sss. The other subpages inherit the root canonical from layout — effectively canonicalizing them to the homepage.

## Design system

Active stylesheet is **`app/globals.css`** (Tailwind v4 CSS-first: `@theme inline`, no tailwind.config). **`styles/globals.css` is a dead legacy file — editing it does nothing.**

- Brand palette (Brief §8.1): primary `#4A8CFF`, navy `#042C53` (custom `bg-navy`/`text-navy-foreground` tokens — footer, partner CTA), accent `#E6F1FB`, muted/band `#F3F4F6`, text `#1F2937`, amber `#BA7517` (`text-amber`, star ratings). Radius base `0.875rem`. Light-only — no `.dark` palette is defined.
- Typography: Inter via `next/font/google` (`latin-ext` for Turkish), `--font-sans`. Body has `font-feature-settings: 'cv11','ss01'` and tightened letter-spacing; h1–h4 are 600/-0.02em.
- **MADE Okine Sans**: 12 .otf files sit in `public/fonts/` but are wired to nothing (no `@font-face`, no `next/font/local`) — intended future display face. Filenames say PERSONAL USE license; resolve licensing before shipping it.
- Recurring visuals: rounded-full pill CTAs, rounded-2xl/3xl cards, `size-12 rounded-2xl bg-accent text-primary` icon tiles, amber 5-star rows. Custom keyframes `hero-drift-1/2` (globals.css) drive the hero's blurred orbs.

## Known gotchas

- `/kvkk` and `/mesafeli-satis-sozlesmesi` still describe the **old pre-aggregator business** ("Yıkat Laundry": web/WhatsApp orders, own facility, fixed package prices incl. Ayakkabı Yıkama 499 TL/çift). Legal entity: Yıkat Laundry – Ahmet Kaan Evrensel, Çekmeköy. These pages need rework during the pivot, not blind reuse.
- `images.unoptimized: true` in next.config — `next/image` optimization is off.
- Footer social links are `href="#"` placeholders; footer intentionally routes unbuilt pages (Basın, Kariyer, Blog) to nearest live page to avoid 404s (Brief §11).
- `hooks/use-toast.ts` and most of `components/ui/` are unused shadcn scaffolding.
