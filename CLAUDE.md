# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page marketing site for **YIKAT**, a physical shoe-washing store (ayakkabı yıkama dükkanı) at Cevizlik Mah. İskele Cd. No: 15C, Bakırköy, İstanbul. All UI copy is Turkish. The store is walk-in only with same-day turnaround — there is no app, no online ordering, and no forms. Every conversion path is "get directions" or "call," not app download.

## Business context: master plan vs. current pivot

**Master plan (long-term, paused):** an app-first aggregator routing door-to-door orders (kapıdan alım, kapıya teslim) to vetted partner dry cleaners, covering five services (kuru temizleme, çamaşır, ütü, ayakkabı, hacimli tekstil) across İstanbul Anadolu Yakası. That build was fully removed from the working tree (see history below) but is **not cancelled** — it's represented on-site only by `components/coming-soon-band.tsx`.

**ACTIVE SHORT-TERM PIVOT (implemented July 2026):** the site IS now the single-page site of the physical shoe-washing store at Cevizlik Mah. İskele Cd. 15C, Bakırköy (European side — all old "Anadolu Yakası" positioning is gone). Rules locked in the approved spec (`docs/superpowers/specs/2026-07-05-ayakkabi-pivot-design.md`):

- Walk-in only, same-day turnaround ("aynı gün teslim" is THE value prop), open every day 09:00–20:00, cash+card.
- Zero old data: no Çekmeköy, no laundry-era stats (1.500+ orders etc.). Trust is value-prop based until real shoe-order numbers accumulate.
- The old aggregator site was removed (full rebuild decision by owner) — old pages/components/API routes live only in git history; old routes 301 to /. Legal pages (/kvkk, /mesafeli-satis-sozlesmesi) stay live with outdated text until the owner delivers new legal copy.
- Prices are placeholders (`price: null` in lib/site.ts priceMenu) until the owner delivers the menu.
- Master plan (app + aggregator) is NOT cancelled; it is represented on-site only by the coming-soon band.

The full task-by-task history of the pivot is in `docs/superpowers/plans/2026-07-05-ayakkabi-pivot.md`; the design rationale is in `docs/superpowers/specs/2026-07-05-ayakkabi-pivot-design.md`. Treat those as the detail source — this file stays a map.

## Working method (mandatory)

- **Use superpowers skills for every task**: brainstorming before any creative/feature work, writing-plans → executing-plans for multi-step work, test-driven-development where applicable, verification-before-completion before claiming done, requesting-code-review after major steps.
- **Design language**: all UI/visual/motion work goes through the `design-motion-principles` and `impeccable` skills. Invoke them before designing or changing any interface or animation.

## Commands

Package manager is **pnpm** (both lockfiles exist, but node_modules is pnpm-installed).

- `pnpm dev` — dev server
- `pnpm build` — production build. **`next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so a green build does NOT mean type-safe.** Run `pnpm typecheck` to actually typecheck.
- Kalite kapıları (2026-07-08'den beri gerçek): `pnpm lint` (ESLint 9 flat, next/core-web-vitals + jsx-a11y; `components/ui/**` bilinçle dışarıda; iki gerekçeli kural istisnası eslint.config.mjs'te), `pnpm typecheck`, `pnpm test` (Playwright smoke + axe, sistem Chrome `channel`, port 3210), `pnpm perf` (Lighthouse CI; `CHROME_PATH` ortam değişkeni ister; eşikler baseline-ratchet: LCP<5.5s, CLS<0.1, ağırlık<1MB, a11y≥95).

No env vars are required — the `RESEND_API_KEY`-backed `/api/partner` route and its dependency were removed in the pivot (verify: `grep -r RESEND .` and `grep resend package.json` both come back empty).

## Architecture

Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind CSS v4 + shadcn/ui (new-york) + framer-motion. Path alias `@/*` → repo root.

**Routes**: only three pages exist — `/` (the single-page site), `/kvkk`, `/mesafeli-satis-sozlesmesi`. All pre-pivot routes (`/hizmetler`, `/nasil-calisir`, `/partnerlik`, `/sss`, `/iletisim`) and `/api/*` were deleted; `next.config.mjs` 308-redirects the five old routes to `/`. There are no API routes and no forms anywhere in the app.

**`lib/site.ts`** is the single source of truth for site data: `siteConfig` (phone/email/address/hours/Maps deep links/geo coords + boş `socialLinks` — dolunca JSON-LD `sameAs` otomatik üretilir), `valueProps` (3 trust-band items, no numbers), `priceMenu` (array of `{ category, note, price }`; `price: null` renders as "Menü yakında"; LocalBusiness `hasOfferCatalog` da buradan türer, fiyatsız), `results` (before-after çiftleri; `representative` bayrağı rozet metnini seçer) ve `faqs` (9 items — accordion + FAQPage JSON-LD'nin TAMAMI, slice yok). Sahip girdisi bekleyen her şey `docs/superpowers/plans/owner-blockers.md`'de. iOS'ta yol tarifi `hooks/use-directions-url.ts` ile Apple Haritalar'a gider (hydration-güvenli). `lib/analytics.ts` re-exports `track` from `@vercel/analytics` as the one shared analytics helper (no gtag/GA anywhere in the site).

**Section components** (`components/*.tsx`, one per homepage section, composed in `app/page.tsx`): `navbar`, `hero-scroll-story`, `value-band`, `how-it-works`, `before-after`, `price-menu`, `visit-section`, `faq-section`, `coming-soon-band`, `foam-divider`, `footer`. All are `"use client"` except `footer.tsx`. `components/motion-provider.tsx` wraps the whole page in `<MotionConfig reducedMotion="user">` (framer-motion respects the OS reduced-motion setting globally). Cila paketi (2026-07-06): `blur-text`/`magnet`/`circular-text`/`spotlight-card`/`shiny-text`/`bubble-cursor`/`scroll-float-text` temiz-oda motion yardımcıları (React Bits lisansı MIT+Commons Clause olduğundan kaynak kopyalanmadı — dosya başlarında ilham atfı). Başlık reveal'leri BlurText'le, ana CTA'lar Magnet+cta-ripple ile sarılıdır. `CardSpotlight` yalnız 4 kartta (how-it-works ×3 + coming-soon navy kartı), `ShinyText` yalnız coming-soon rozetinde — RB fit analizinin (2026-07-06, çift-mercek adversarial doğrulama) onayladığı yerleşimler; başka bölüme yaymayın. `BubbleCursor` sahip kararıyla eklenen tek imleç-efekti istisnası (imleç oyuncakları kategorisi analizde reddedilmişti; baloncuk marka kimliği olduğu için fısıltı dozunda, `app/page.tsx`'te site-geneli): ~90px imleç yolu başına 1 baloncuk, tavan 10, yalnız ince-imleç+gerçek fare, reduced-motion'da yok — dozunu artırmadan önce spec'e bakın (`docs/superpowers/specs/2026-07-06-imza-motion-paketi-design.md`). Gelecek-koşullu adaylar: Count Up (yalnız gerçek sipariş rakamları birikip sahibi onaylayınca, value-band'e), Carousel/Stack (yalnız 3+ gerçek önce/sonra çifti gelince; kıyas kaydırıcısının pointer-capture'ıyla drag çakışması önlenmek şartıyla). `coming-soon-band` artık akan şerit değil, master-plan uygulama teaser kartı (navy gradyan + süzülen telefon açılış mockup'ı, form yok). `components/ui/marquee.tsx` (Magic UI, MIT) vendorlandı ama şu an bağlı değil — kullanılmayan shadcn/ui iskelesi gibi ileride kullanılmak üzere duruyor. Navbar (2026-07-07): yüzen liquid-glass hap (PillNav konsepti, temiz-oda) — "blur-first, lens-enhancement" mimarisi (spec: `docs/superpowers/specs/2026-07-07-liquid-glass-navbar-design.md`): temel frost+rim+sheen her motorda; GERÇEK lensing (`components/liquid-lens.tsx`, SDF displacement haritası + `backdrop-filter: url()`) yalnız Chromium md+ — Safari/Firefox backdrop'ta SVG filtre çizmez ve Safari `@supports`'ta yanlış-pozitif verdiğinden kapı `navigator.userAgentData` motor tespitidir. `.liquid-glass` sınıfı reduced-transparency/contrast kemerlerini taşır (globals.css). Link grubunun arkasında TEK kalıcı vurgu hapı ölçülen konuma (x/width) spring'le kayar — hover/klavye odağı/aktif bölüm ve tıklama (optimistic aktif) dahil her geçiş kesintisizdir (IntersectionObserver bölümü doğrular; hero'da vurgu sönük); jel basış `motion-reduce`'ta kapalı; mobil menü hapın altına kopuk cam kart olarak açılır.

**Hero (`hero-scroll-story.tsx`)**: the 4-scene scroll story (sokak → çamur → yıkat → temiz) is now told with real Higgsfield composite keyframe photography (`public/images/hero/`, desktop+mobile WebP pairs) and, on desktop, a scroll-scrubbed video (`components/hero-scrub-video.tsx`, `public/videos/hero-scrub.mp4`, ~12s/9.2MB) that progressively enhances in on `md+` viewports after `canplaythrough`, using a LINEAR scroll→time mapping driven by an rAF lerp loop. Mobile, and the fallback before the video has buffered, use the same keyframe-crossfade path. `StaticHero` (reduced-motion fallback) renders the clean-shoe ("temiz") photo statically. Sahne 1-3 başlıkları (sahne 0 hariç — LCP) `scroll-float-text.tsx` ile karakter karakter scrub'a bağlı süzülür (RB ScrollFloat'un yumuşatılmış, gsap'siz temiz-oda portu); blok blur'u başlıklı sahnelerde yalnız alt metne iner. The emoji/gradient placeholder era is over — the Higgsfield asset phase is complete (plan: `docs/superpowers/plans/2026-07-05-hero-scrub-video.md`, production manifest: `docs/superpowers/plans/2026-07-05-hero-scrub-video-assets.md`).

## SEO layout

- Metadata lives in `app/layout.tsx`: Bakırköy-targeted title/description/keywords, OG/Twitter tags (`og:image` now set to `public/images/og.jpg`, a 1200×630 export of the keyframe-temiz hero photo), Google verification token, self-canonical to the homepage.
- `app/layout.tsx` also inlines a `LocalBusiness` JSON-LD block (with `@id`, `hasMap`, `address`, `openingHoursSpecification`, and `geo` coordinates) on every page. **The `geo` lat/long in `lib/site.ts` is an approximation — verify it against the store's real Google Maps pin before launch.**
- `app/page.tsx` inlines a separate `FAQPage` JSON-LD (`faqs`'ın TAMAMI, 9 madde) — homepage-only, not in the root layout. LocalBusiness şeması `paymentAccepted`/`currenciesAccepted`/`hasOfferCatalog` (fiyatsız) taşır; `sameAs` yalnız `socialLinks` dolunca üretilir. CWV telemetrisi `components/web-vitals-reporter.tsx` → `track()`.
- `app/robots.ts` and `app/sitemap.ts` are dynamic (no more static hand-maintained `public/robots.txt`/`public/sitemap.xml`); the sitemap lists `/`, `/kvkk`, `/mesafeli-satis-sozlesmesi`.
- `/kvkk` and `/mesafeli-satis-sozlesmesi` each set their own `alternates.canonical` (self-canonical, not inherited from root).

## Design system

Active stylesheet is **`app/globals.css`** (Tailwind v4 CSS-first: `@theme inline`, no tailwind.config). **`styles/globals.css` is a dead legacy file — editing it does nothing.**

- Brand palette: primary `#4A8CFF`, navy `#042C53` (custom `bg-navy`/`text-navy-foreground` tokens — used by `footer.tsx`), accent `#E6F1FB`, muted/band `#F3F4F6`, text `#1F2937`, amber `#BA7517`. Radius base `0.875rem`. Light-only — no `.dark` palette is defined.
- Typography (2026-07-10, sahip kararı): **Bricolage Grotesque** her yerde — `next/font/google` (`latin-ext`), değişken font (opsz/wdth/wght), `--font-bricolage` → `--font-sans`. SIL OFL 1.1 (lisans temiz). Inter kaldırıldı; gövde letter-spacing 0, h1–h4 600/-0.02em.
- **MADE Okine Sans**: 12 .otf files still sit in `public/fonts/` but remain wired to nothing (no `@font-face`, no `next/font/local` — verified via repo-wide grep) — intended future display face. Filenames say PERSONAL USE license; resolve licensing before shipping it.
- Recurring visuals: rounded-full pill CTAs, rounded-2xl/3xl cards, the hero's 4-scene Higgsfield keyframe photography + desktop scroll-scrub video, amber-accented value-band icons. globals.css ayrıca marquee keyframe'lerini ve `.cta-ripple` utility'sini içerir.

## Known gotchas

- `/kvkk` and `/mesafeli-satis-sozlesmesi` still describe the **old pre-pivot aggregator/laundry business** (web/WhatsApp orders, own facility, door-to-door pickup, fixed package prices). They were deliberately left untouched during the pivot — kept live (not deleted) because a legal page existing with stale text beats no legal page — until the owner supplies new legal copy that matches the shoe-wash-store model.
- `priceMenu` prices in `lib/site.ts` are all `price: null` placeholders ("Menü yakında") until the owner delivers the real price list.
- `before-after.tsx` artık `lib/site.ts` `results` dizisinden beslenir (bugün tek temsili çift); gerçek müşteri fotoğrafı eklemek SAHİP ONAYI ister (`representative: false`).
- `images.unoptimized: true` in next.config.mjs is deliberate (kept from the pre-pivot config). Hero sahne görselleri `<picture>` art-direction ile tek varyant indirir. Scrub videosu ORİJİNAL kalitede (1920×1080, 9.2MB — sahip kararı 2026-07-08: kalite > ağırlık; sıkıştırma denemesi geri alındı), `src` window `load` sonrası atanır. Mobil keyframe'ler Higgsfield outpaint+downscale ile 9:16 1170×2096 (ayakkabı kadraja tam sığar, retina-net); mobilde sahne metinleri CLEAR liquid-glass kartta (`hero-glass-card`, reduced-transparency kemeri globals.css'te).
- `components/ui/` budandı (2026-07-08): yalnız `button`/`accordion` kullanımda + `marquee` bilinçli vendorlu; `styles/globals.css`, `use-toast`, `theme-provider` ve ~25 kullanılmayan paket silindi, npm lockfile kaldırıldı (pnpm tek yönetici).
- Marka mavisi `#4A8CFF` + beyaz, 18px altı metinde WCAG AA'yı geçemez — küçük metinli dolgularda `#1f5eb8` kullanılır (owner-blockers #8'de sistemik karar bekliyor).
