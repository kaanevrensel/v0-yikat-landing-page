# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Search discovery expansion — October 10, 2026

- Owner requested local/general SEO and AI discovery. Implementation and research:
  `docs/seo/2026-10-10-search-program.md` and the adjacent priority keyword CSV.
- New public destinations: `/bakirkoy-ayakkabi-temizleme`, `/ayakkabi-temizleme`,
  `/rehber` and eight statically generated `/rehber/[slug]` guides. Three existing
  material-service URLs use the same current shell. Preserve the three primary nav links.
- Owner confirmed Kaan's later hours: **every day 10:00–22:00**, superseding all
  historical 09:00–20:00 notes below. Google Maps identity and exact pin were checked
  live. Collection zones remain paused; no blanket same-day or citywide promises.
- Discovery content lives in `lib/care-guides.ts`, `lib/discovery.ts`,
  `components/discovery/`, `lib/services.ts` and scoped `app/discovery.css`.
  Keep visible answers/citations/server HTML, distinct self-canonicals, accurate
  dates and schema parity. Do not invent prices, reviews or service availability.
- Both Google URL-prefix Search Console and Bing Webmaster ownership are verified.
  Existing Google profile management and Apple Business sign-in await Kaan's help.
  Never create a duplicate place or call a submission proof of indexing/ranking.
- IndexNow: `node scripts/submit-indexnow.mjs /changed/path` checks live URLs/key
  without submission; add `--submit` only after the actual release is verified.
- Quality: full local lint/typecheck/build/46 tests pass with one worker. CI retains
  the two-worker gate; local multiworker teardown can hang for five minutes.

## Active website redesign — October 10, 2026

This section supersedes the July pivot descriptions below. The owner explicitly authorized committing, pushing and publishing the reviewed redesign on October 10. The user requested a website version of the current app with Home, Product and Partners pages; the iOS app is live and Android has no announced date. App collection is currently paused; keep WhatsApp and shop directions usable.

- Local checkout: `/Users/emrebenian/Developer/yikat-website-local`, branch `design/website-20261007`. The cloud-backed original was preserved because several files were offloaded.
- Run `pnpm dev:local` for `http://127.0.0.1:3210`. Tests build into `.next-test` and serve on port 3211, independently of the preview.
- Main routes: `/`, `/urun`, `/partnerler`. Shared navigation contains only those three. Existing service, legal, contact and account-deletion routes remain accessible.
- Active website components: `components/website/*`. Styling loads `globals.css`, `marketing.css`, `centered.css`, `editorial.css`, `objects.css`, `craft.css`, then `experiences.css`. Original app artwork is in `public/images/services/`.
- Latest copy direction: no visible homepage slogan; service choices lead. Center the marketing text. Use natural Turkish sentences, not successive one-word slogans separated by periods. Keep “yıkat” as an action.
- October 9 steering: text adds friction. Home now starts with the five original service images as working buttons; all choices fit in the first screen. A selection opens a short native action sheet. The earlier illustrated cleaning-scene demonstration is preserved in source but unmounted; the later owner request adds a separate real workshop process section. Keep Home copy brief and preserve the original liquid-glass navbar and the three page routes.
- October 10 refinement: service labels are visibly raised button pills with a next-step chevron. Partner hero uses the owner's supplied “Verdiğin hizmeti…” copy; remove the old headline, panel caption and three-step introduction. The form heading is “Başvur”, without the paragraph or preview banner. Development receipts explain local-only storage; published receipts confirm submission only after the intake system returns an application ID.
- Latest October 10 steering supersedes the finite/pointer-only background: Home now has continuously deforming water and rising soap lenses, also on touch. Canvas is capped at 30fps and 1.5 DPR; reduced motion is still, hidden/offscreen work pauses, and SVG remains the no-JS/context fallback. New original artwork and components: seven care glyphs, storefront, folded real map, perforated service ticket, time dial, care-stage rail, and asymmetric partner map/workboard/calendar. See `app/craft.css`, `components/website/brand-art.tsx`, `partner-art.tsx` and `docs/design/2026-10-10-living-water-and-brand-components.md`. Keep copy sparse.
- Latest owner feedback: removed “Boşver, yıkat” from Home, Product closing, footer and metadata. Home has five new image_gen hero sculptures (`public/images/services/hero-v2/`); small-format original SVG service illustrations are in `service-art.tsx`, used for tickets, the Product page and Partners. Phone previews retain original app artwork. Home shop section uses an actual owner-uploaded August 2026 shop photograph; provenance is in `public/images/shop/SOURCE.md`. Contact links have raised surfaces and pressed states. Plan and prompt manifest: `docs/design/2026-10-10-service-art-families.md`, `assets-2026-10-10.json`.
- October 10 expansion supersedes visible Product/Partner opening headlines: both now lead with illustrated controls. Home has five sections: wider service hero with lower desktop contact buttons, a blue app pocket with a genuine published app screen, washing process with real shop footage, actual shop/map, and a separate partnership invitation. New camera/print, care parcel/tag and hanging rail mechanisms animate continuously while visible. Mobile Product controls sit above the phone. Kaan's shared Drive supplied a night shop photo and the walking-route film; the film loads only on request and pauses on close/hidden tab. Keep source/provenance in `public/images/shop/SOURCE.md`, and implementation notes in `docs/design/2026-10-10-visual-sections.md`. Do not add hero paragraphs back.
- Design history: `docs/design/2026-10-07-editorial-reset.md` and `docs/design/2026-10-07-centered-direction.md`. Product context: `PRODUCT.md`.
- `/api/partner-applications` validates same-origin requests, consent, contact fields, service choices and a honeypot. Local development saves isolated receipts under ignored `.local-data/partner-applications/`. Published environments call the existing `submit_partner_application` RPC using server-only `YIKAT_PARTNER_SUPABASE_URL` and `YIKAT_PARTNER_ANON_KEY`; never use a privileged key. Production targets the live system, Vercel previews target TEST. The RPC enforces duplicate/cooldown limits. No new database schema or email integration. See `docs/design/2026-10-10-production-release.md`.
- Preserve generated legal content and business contact data. No invented reviews, statistics, prices, guaranteed service areas or partner earnings. App download target is stored in `components/website/shared.tsx`.
- Quality gates: `pnpm lint`, `pnpm typecheck`, `pnpm test --workers=2`, plus browser inspection of the three new routes and local partner form. Test output and screenshots stay ignored.
- October 10 playback correction: the care film plays once with replay, resumes user-requested playback after an offscreen pause, and preserves manual pause. Product's four steps advance every 1.5 seconds with short transitions and an animated washer drum; the illustration itself controls visibility. Partner sequence timing stays unchanged. Home partnership CTA is “İşini büyüt”. See `docs/design/2026-10-10-playback-fixes.md`.

## Historical July implementation context

## What this is

Single-page marketing site for **YIKAT**, a physical shoe-washing store (ayakkabı yıkama dükkanı) at Sakızağacı Mahallesi İskele Caddesi No:15-B, Bakırköy, İstanbul (address corrected 2026-08-26; the old "Cevizlik Mah. İskele Cd. No: 15C" wording lives only in history docs). All UI copy is Turkish. The store is walk-in only with same-day turnaround — there is no app, no online ordering, and no forms. Every conversion path is "get directions" or "call," not app download.

## Business context: master plan vs. current pivot

**Master plan (long-term, paused):** an app-first aggregator routing door-to-door orders (kapıdan alım, kapıya teslim) to vetted partner dry cleaners, covering five services (kuru temizleme, çamaşır, ütü, ayakkabı, hacimli tekstil) across İstanbul Anadolu Yakası. That build was fully removed from the working tree (see history below) but is **not cancelled** — it's represented on-site only by `components/coming-soon-band.tsx`.

**ACTIVE SHORT-TERM PIVOT (implemented July 2026):** the site IS now the single-page site of the physical shoe-washing store at Sakızağacı Mahallesi İskele Caddesi No:15-B, Bakırköy (European side — all old "Anadolu Yakası" positioning is gone). Rules locked in the approved spec (`docs/superpowers/specs/2026-07-05-ayakkabi-pivot-design.md`):

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
- `pnpm build` — production build, including the Next.js TypeScript gate. `ignoreBuildErrors` was removed in the 2026-09-05 audit. Keep `pnpm typecheck` as the fast standalone check and CI gate.
- Kalite kapıları GitHub Actions'ta da koşar (`.github/workflows/quality.yml`: lint+typecheck+Playwright; push/PR). Yerelde: `pnpm lint` (ESLint 9 flat, next/core-web-vitals + jsx-a11y; `components/ui/**` bilinçle dışarıda; iki gerekçeli kural istisnası eslint.config.mjs'te), `pnpm typecheck`, `pnpm test` (Playwright smoke + axe, sistem Chrome `channel`, port 3210), `pnpm perf` (Lighthouse CI; `CHROME_PATH` ortam değişkeni ister; eşikler baseline-ratchet: LCP<5.5s, CLS<0.1, ağırlık<1MB, a11y≥95).

No env vars are required — the `RESEND_API_KEY`-backed `/api/partner` route and its dependency were removed in the pivot (verify: `grep -r RESEND .` and `grep resend package.json` both come back empty).

## Architecture

Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind CSS v4 + shadcn/ui (new-york) + framer-motion. Path alias `@/*` → repo root.

**Routes**: `/` (ana tek-sayfa) + 3 hizmet sayfası (`/sneaker-yikama`, `/suet-nubuk-temizleme`, `/deri-ayakkabi-bakimi` — 2026-07-12 sahip onayıyla Faz 6 erken açıldı; veri `lib/services.ts`, şablon `components/service-page.tsx`; içerik yalnız doğrulanmış beyanlar + dürüst/hedged genel bilgiler, Service+Breadcrumb JSON-LD, fiyat = genel aralık) + `/kvkk`, `/mesafeli-satis-sozlesmesi`, özel `not-found`. Navbar anchor'ları kök-mutlak (`/#fiyatlar`) — hizmet sayfalarından da çalışır. All pre-pivot routes (`/hizmetler`, `/nasil-calisir`, `/partnerlik`, `/sss`, `/iletisim`) and `/api/*` were deleted; `next.config.mjs` 308-redirects the five old routes to `/`. There are no API routes and no forms anywhere in the app.

**`lib/site.ts`** is the single source of truth for site data: `siteConfig` (phone/email/address/hours/Maps deep links/geo coords + boş `socialLinks` — dolunca JSON-LD `sameAs` otomatik üretilir), `valueProps` (3 trust-band items, no numbers), `priceMenu` (array of `{ category, note, price }`; `price: null` renders as "Menü yakında"; LocalBusiness `hasOfferCatalog` da buradan türer, fiyatsız) ve `faqs` (9 items — accordion + FAQPage JSON-LD'nin TAMAMI, slice yok). Sahip girdisi bekleyen her şey `docs/superpowers/plans/owner-blockers.md`'de. iOS'ta yol tarifi `hooks/use-directions-url.ts` ile Apple Haritalar'a gider (hydration-güvenli). `whatsappHref` (wa.me) footer+visit'te izlenen linklerle kullanılır; ziyaret bölümündeki harita kartı GERÇEK statik harita görselidir (`public/images/map/dukkan-harita.webp`, Carto/OSM render — atıf kartın üstünde; pin değişirse yeniden üret). Favicon seti `public/icons/` (16→512 + apple-touch; eski v0 placeholder ikonları silindi). `lib/analytics.ts` re-exports `track` from `@vercel/analytics` as the one shared analytics helper (no gtag/GA anywhere in the site).

**Section components** (`components/*.tsx`, one per homepage section, composed in `app/page.tsx`): `navbar`, `hero-scroll-story`, `value-band`, `how-it-works`, `price-menu`, `visit-section`, `faq-section`, `coming-soon-band`, `foam-divider`, `footer`. All are `"use client"` except `footer.tsx`. `components/motion-provider.tsx` wraps the whole page in `<MotionConfig reducedMotion="user">` (framer-motion respects the OS reduced-motion setting globally). Cila paketi (2026-07-06): `blur-text`/`magnet`/`circular-text`/`spotlight-card`/`shiny-text`/`bubble-cursor`/`scroll-float-text` temiz-oda motion yardımcıları (React Bits lisansı MIT+Commons Clause olduğundan kaynak kopyalanmadı — dosya başlarında ilham atfı). Başlık reveal'leri BlurText'le, ana CTA'lar Magnet+cta-ripple ile sarılıdır. `CardSpotlight` yalnız 4 kartta (how-it-works ×3 + coming-soon navy kartı), `ShinyText` yalnız coming-soon rozetinde — RB fit analizinin (2026-07-06, çift-mercek adversarial doğrulama) onayladığı yerleşimler; başka bölüme yaymayın. `BubbleCursor` sahip kararıyla eklenen tek imleç-efekti istisnası (imleç oyuncakları kategorisi analizde reddedilmişti; baloncuk marka kimliği olduğu için fısıltı dozunda, `app/page.tsx`'te site-geneli): ~90px imleç yolu başına 1 baloncuk, tavan 10, yalnız ince-imleç+gerçek fare, reduced-motion'da yok — dozunu artırmadan önce spec'e bakın (`docs/superpowers/specs/2026-07-06-imza-motion-paketi-design.md`). Gelecek-koşullu adaylar: Count Up (yalnız gerçek sipariş rakamları birikip sahibi onaylayınca, value-band'e); Carousel/Stack notu önce/sonra bölümüyle birlikte kalktı (bölüm geri gelirse yeniden değerlendirilir). `coming-soon-band` artık akan şerit değil, master-plan uygulama teaser kartı (navy gradyan + süzülen telefon açılış mockup'ı, form yok). `components/ui/marquee.tsx` (Magic UI, MIT) vendorlandı ama şu an bağlı değil — kullanılmayan shadcn/ui iskelesi gibi ileride kullanılmak üzere duruyor. Navbar (2026-07-07): yüzen liquid-glass hap (PillNav konsepti, temiz-oda) — "blur-first, lens-enhancement" mimarisi (spec: `docs/superpowers/specs/2026-07-07-liquid-glass-navbar-design.md`): temel frost+rim+sheen her motorda; GERÇEK lensing (`components/liquid-lens.tsx`, SDF displacement haritası + `backdrop-filter: url()`) yalnız Chromium md+ — Safari/Firefox backdrop'ta SVG filtre çizmez ve Safari `@supports`'ta yanlış-pozitif verdiğinden kapı `navigator.userAgentData` motor tespitidir. `.liquid-glass` sınıfı reduced-transparency/contrast kemerlerini taşır (globals.css). Link grubunun arkasında TEK kalıcı vurgu hapı ölçülen konuma (x/width) spring'le kayar — hover/klavye odağı/aktif bölüm ve tıklama (optimistic aktif) dahil her geçiş kesintisizdir (IntersectionObserver bölümü doğrular; hero'da vurgu sönük); jel basış `motion-reduce`'ta kapalı; mobil menü hapın altına kopuk cam kart olarak açılır.

**Hero (`hero-scroll-story.tsx`)**: the 4-scene story (sokak → çamur → yıkat → temiz) is told with real Higgsfield composite keyframe photography (`public/images/hero/`, desktop+mobile WebP pairs) and an AUTOPLAYING looped video (`components/hero-scrub-video.tsx` exports `HeroAutoVideo`, `public/videos/hero-scrub.mp4`, ~12s/9.2MB, faststart) that starts playing **as soon as it can** (`canplay`, not `canplaythrough` — tam dosyayı beklemek mobil ağda uzun görsel döngü gösteriyordu; sahip geri bildirimi 2026-07-12: "direk video oynasın") on **ALL viewports** — 2026-07-12 sahip kararı: mobil de keyframe döngüsü değil videoyu oynatır, eski `md+` matchMedia kapısı kaldırıldı; görünürlük fiili oynatmaya bağlı (`playing`), autoplay reddinde donmuş kare keyframe'lerin üstünü örtmez; dikey ekranda `object-cover` merkez kırpımı 16:9 karenin ~500px'lik orta kolonunu gösterir ve ön ayakkabı 4 sahnede de o bantta (ffmpeg kare doğrulaması aynı gün), `object-position` gerekmez. **2026-07-12 sahip kararı: scroll-scrub tamamen kaldırıldı, hero otomatik akar** — section tek `h-dvh` ekran; tek doğruluk kaynağı aktif sahne indeksi. Video oynarken saat videodur (`timeToScene`: metin, sahne anlarının [0/4/8/12s] ortasında değişir). Üç hero modu (sahip, 2026-07-12: "açar açmaz video oynasın"): "bekleme" (ilk kare SABİT poster — kareler dönmez), "video", "dongu" (4sn keyframe crossfade — YALNIZ autoplay reddi/medya hatası/8sn bekleme aşımı fallback'i). CTA'lar hep görünür (son sahne beklenmez). `StaticHero` (reduced-motion fallback) renders the clean-shoe ("temiz") photo statically — autoplay da bu kapıya tabidir. `scroll-float-text.tsx` bu refaktörle bağsız kaldı (circular-text/marquee gibi vendored bekliyor). The Higgsfield asset phase is complete (plan: `docs/superpowers/plans/2026-07-05-hero-scrub-video.md`, production manifest: `docs/superpowers/plans/2026-07-05-hero-scrub-video-assets.md`).

## SEO layout

- Metadata lives in `app/layout.tsx`: Bakırköy-targeted title/description/keywords, OG/Twitter tags (`og:image` now set to `public/images/og.jpg`, a 1200×630 export of the keyframe-temiz hero photo), Google verification token, self-canonical to the homepage.
- `app/layout.tsx` also inlines a `LocalBusiness` JSON-LD block (with `@id`, `hasMap`, `address`, `openingHoursSpecification`, and `geo` coordinates) on every page. **The `geo` lat/long in `lib/site.ts` is an approximation — verify it against the store's real Google Maps pin before launch.**
- `app/page.tsx` inlines a separate `FAQPage` JSON-LD (`faqs`'ın TAMAMI, 9 madde) — homepage-only, not in the root layout. LocalBusiness şeması `paymentAccepted`/`currenciesAccepted`/`hasOfferCatalog` (fiyatsız) taşır; `sameAs` yalnız `socialLinks` dolunca üretilir. CWV telemetrisi `components/web-vitals-reporter.tsx` → `track()`.
- `app/robots.ts` and `app/sitemap.ts` are dynamic (no more static hand-maintained `public/robots.txt`/`public/sitemap.xml`); the sitemap lists `/`, `/kvkk`, `/mesafeli-satis-sozlesmesi`.
- `/kvkk` and `/mesafeli-satis-sozlesmesi` each set their own `alternates.canonical` (self-canonical, not inherited from root).

## Kopya sesi (sahip kuralı, 2026-07-11 — İHLAL ETME)

**"yıkat" marka adı bilinçli olarak emir kipinden seçildi** — kopyada YÜKLEM/eylem olarak kullanılır ("Sen yıkama, yıkat."). Marka adını özne-isim yapan kalıplar ("YIKAT yıkar", "YIKAT sizin için…") **yasak**; özne gerekiyorsa "biz/dükkânımız" kullanılır. Bu kural site, GBP, post — her kopya için geçerli.

## Design system

Active stylesheet is **`app/globals.css`** (Tailwind v4 CSS-first: `@theme inline`, no tailwind.config). **`styles/globals.css` is a dead legacy file — editing it does nothing.**

- Brand palette: primary `#4A8CFF`, navy `#042C53` (custom `bg-navy`/`text-navy-foreground` tokens — used by `footer.tsx`), accent `#E6F1FB`, muted/band `#F3F4F6`, text `#1F2937`, amber `#BA7517`. Radius base `0.875rem`. Light-only — no `.dark` palette is defined.
- Typography (2026-07-10, sahip kararı): **Bricolage Grotesque** her yerde — `next/font/google` (`latin-ext`), değişken font (opsz/wdth/wght), `--font-bricolage` → `--font-sans`. SIL OFL 1.1 (lisans temiz). Inter kaldırıldı; gövde letter-spacing 0, h1–h4 600/-0.02em.
- MADE Okine Sans dosyaları SİLİNDİ (2026-07-12 sahip onayı; PERSONAL USE lisanslıydı ve public URL'den erişilebiliyordu — git geçmişinde durur). Site yüzü Bricolage Grotesque.
- Recurring visuals: rounded-full pill CTAs, rounded-2xl/3xl cards, the hero's 4-scene Higgsfield keyframe photography + autoplay hero video (tüm ekranlar), amber-accented value-band icons. globals.css ayrıca marquee keyframe'lerini ve `.cta-ripple` utility'sini içerir.

## Known gotchas

- **Account deletion (2026-09-05):** `/hesap-silme` is a public support-request page for Yıkat Gitsin / Yıkat, linked from the footer and sitemap. It opens an email to the support mailbox; it performs no privileged write. Handling and verification requirements are in `docs/account-deletion-support.md`. Preserve the distinction between requesting deletion, the 30-day cancellation window, and retained legal records.
- **Legal pages (updated 2026-08-27, iyzico üye işyeri incelemesi eksik-belge listesi):**
  `/mesafeli-satis-sozlesmesi`, `/gizlilik-politikasi` and `/teslimat-ve-iade` render
  **generated content** from `lib/legal-content.json` via `components/legal/*` — the single
  source of truth is yikat-app `mobile/src/features/legal/docs.ts` (the iyzico-named texts
  shown in-app and on app.yikat.tech/legal/*). NEVER edit page text here; regenerate the JSON
  from docs.ts (deno-extract `COMPANY`/`LEGAL_DOCS`, pick gizlilik/mesafeli/on-bilgilendirme/
  iptal-iade + the mesafeli "İfa / Teslimat" slice) when docs.ts changes. **Künye (2026-08-29,
  sahip — yeni vergi levhası), ARTIK OVERRIDE DEĞİL:** every company address (`company.address` +
  the Adres rows in gizlilik/mesafeli/onBilgilendirme + the gizlilik contact line) carries the
  dükkân address, character-for-character equal to `siteConfig.address.full`; `company.taxOffice`
  is "Bakırköy V.D." (sahip teyidi, `taxNo` değişmedi). Bunlar aynı gün yikat-app
  `mobile/src/features/legal/docs.ts` içindeki `COMPANY`'ye de yazıldı — yani kaynak düzeltildi:
  regenerasyon aynı değerleri üretir, elle yeniden uygulanmasına gerek YOK. Kayıtlı işletme adresi
  ile dükkân adresi bugün itibarıyla aynı yer; bu yüzden tek string kuralı geçerli. `/iletisim` is a real
  page again (removed from the pivot redirects); `/gizlilik` + `/privacy` now redirect to the
  local `/gizlilik-politikasi`. The footer carries the "iyzico ile Öde" + Visa + Mastercard band
  (`components/payment-band.tsx`, official artwork in `public/images/odeme/`). `/kvkk` keeps the
  site's own aydınlatma metni; parts still describe the pre-pivot business — owner/lawyer pass
  pending.
- `priceMenu` prices in `lib/site.ts` are all `price: null` placeholders ("Menü yakında") until the owner delivers the real price list.
- Önce/sonra bölümü ("Farkı kendin gör", #sonuclar) SAHİP KARARIYLA TAMAMEN KALDIRILDI (2026-07-11): bileşen+AI görselleri silindi, nav linki çıkarıldı. Gerçek müşteri fotoğrafları birikirse bölüm sıfırdan tasarlanır (owner-blockers #6). `circular-text.tsx` bu yüzden bağsız — marquee gibi vendored bekliyor.
- `images.unoptimized: true` in next.config.mjs is deliberate (kept from the pre-pivot config). Hero sahne görselleri `<picture>` art-direction ile tek varyant indirir. Hero videosu ORİJİNAL kalitede (1920×1080, 9.2MB — sahip kararı 2026-07-08: kalite > ağırlık; sıkıştırma denemesi geri alındı), `src` SSR HTML'de gömülüdür — indirme HTML parse'ta başlar, hydration/`load` beklenmez (eski window-load kapısı sahip kararıyla kaldırıldı, 2026-07-12: video LCP'den öncelikli) ve video MOBİLDE DE oynar (9.2MB mobil veri maliyeti bilinçli kabul — video oynayana dek ilk keyframe SABİT poster, dosya faststart olduğundan `canplay` ilk saniyeler inince gelir; ayrı 9:16 mobil video varyantı YOK, merkez kırpım yeterli). `/videos/*` next.config.mjs `headers()` ile immutable+1yıl cache'lidir: video İÇERİĞİ değişirse dosya ADI da değişmeli (yoksa istemciler 1 yıl eskisini oynatır). Mobil keyframe'ler Higgsfield outpaint+downscale ile 9:16 1170×2096 (ayakkabı kadraja tam sığar, retina-net) — video devreye girince kadraj outpaint görsele göre bir kez daralır (kabul edilen geçiş); sahne metni okunabilirliğini her ekranda sahne-bazlı yumuşak text-shadow ışıması taşır (2026-07-12: cam kart çerçevesi de harf konturu da denendi, ikisi de sahip kararıyla geri alındı — yeniden önermeyin).
- `components/ui/` budandı (2026-07-08): yalnız `button`/`accordion` kullanımda + `marquee` bilinçli vendorlu; `styles/globals.css`, `use-toast`, `theme-provider` ve ~25 kullanılmayan paket silindi, npm lockfile kaldırıldı (pnpm tek yönetici).
- Marka mavisi `#4A8CFF` + beyaz, 18px altı metinde WCAG AA'yı geçemez — küçük metinli dolgularda `#1f5eb8` kullanılır (owner-blockers #8'de sistemik karar bekliyor).
