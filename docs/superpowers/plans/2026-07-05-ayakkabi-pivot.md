# YIKAT Ayakkabı Yıkama Pivotu — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** yikat.tech'i Bakırköy'deki fiziki ayakkabı yıkama dükkanının tek sayfalık sitesine dönüştürmek (spec: `docs/superpowers/specs/2026-07-05-ayakkabi-pivot-design.md`).

**Architecture:** Tek sayfalık Next.js 16 App Router sitesi; bölüm başına bir client component, merkezi veri `lib/site.ts`te. Hero, framer-motion `useScroll` ile scroll'a bağlı 4 sahnelik pinned hikaye. Eski rotalar `next.config.mjs` redirects ile ana sayfaya kalıcı yönlendirilir; yasal 2 sayfa dokunulmadan kalır.

**Tech Stack:** Next.js 16.1.6, React 19, Tailwind v4 (CSS-first, `app/globals.css`), framer-motion 11, shadcn/ui (Accordion), lucide-react, pnpm.

**Doğrulama stratejisi (TDD yerine):** Repo'da test altyapısı yok ve iş sunumsal (landing page). Her görev şu üçlüyle doğrulanır: `npx tsc --noEmit` (tip), `pnpm build` (derleme), tarayıcı/curl kontrolü (davranış). Her görev kendi commit'iyle biter. Sahte/atlanan doğrulama yasak — komut çıktısı beklenen sonucu vermeden görev "bitti" sayılmaz.

**Değişmeyenler:** `app/globals.css` (tasarım token'ları), `app/kvkk/`, `app/mesafeli-satis-sozlesmesi/`, `components/ui/*`, `hooks/*`, `lib/utils.ts`, `public/images/yikat-logo-*.png`, Inter fontu.

---

## Dosya haritası

| Dosya | İşlem | Sorumluluk |
|---|---|---|
| `lib/site.ts` | Yeniden yaz | Tüm site verisi: dükkan bilgileri, değer önerileri, fiyat menüsü, SSS — tek doğruluk kaynağı |
| `lib/analytics.ts` | Yeni | Paylaşılan `track()` gtag yardımcıcı (eski kopya-yapıştır çözülür) |
| `app/layout.tsx` | Yeniden yaz | Metadata (Bakırköy SEO), LocalBusiness + FAQPage JSON-LD |
| `app/page.tsx` | Yeniden yaz | Bölüm kompozisyonu |
| `app/robots.ts`, `app/sitemap.ts` | Yeni | Dinamik robots/sitemap (statik dosyalar silinir) |
| `next.config.mjs` | Değiştir | Eski rotalara kalıcı yönlendirme |
| `components/navbar.tsx` | Yeniden yaz | Anchor linkler + Yol Tarifi CTA |
| `components/hero-scroll-story.tsx` | Yeni | 4 sahnelik scroll hikayesi + statik fallback |
| `components/value-band.tsx` | Yeni | 3 değer önerisi (rakamsız) |
| `components/how-it-works.tsx` | Yeniden yaz | 3 adımlı dükkan akışı |
| `components/before-after.tsx` | Yeni | Sürüklenebilir önce/sonra kartları |
| `components/price-menu.tsx` | Yeni | Fiyat menüsü (placeholder fiyatlar) |
| `components/visit-section.tsx` | Yeni | Konum, saatler, yol tarifi CTA'ları (navy) |
| `components/faq-section.tsx` | Yeniden yaz | `lib/site.ts`teki 8 SSS'ten accordion |
| `components/coming-soon-band.tsx` | Yeni | App vizyonu tek satır bant |
| `components/footer.tsx` | Yeniden yaz | Adres/saat/telefon/yasal |
| `CLAUDE.md` | Değiştir | Pivot kararlarının güncellenmesi |
| Silinecekler | Sil | Görev 2'deki liste |

Sahne görselleri: Higgsfield asset'leri hazır olana kadar CSS gradyan arka planlar + emoji ayakkabı placeholder. Asset entegrasyonu ayrı fazda (Görev 16-18) hazır kod diff'leriyle bekler.

---

### Görev 1: Çalışma dalını aç

**Files:** yok (git)

- [ ] **Adım 0: Bağımlılıkları garantile**

```bash
cd /Users/kaanevrensel/v0-yikat-landing-page-1
pnpm install --frozen-lockfile
```

Beklenen: hatasız biter (taze klonlarda node_modules kurulur, mevcutta hızla doğrulanır).

- [ ] **Adım 1: Dal oluştur**

```bash
git checkout -b pivot-ayakkabi
```

- [ ] **Adım 2: Doğrula**

Çalıştır: `git branch --show-current`
Beklenen: `pivot-ayakkabi`

---

### Görev 2: Eski siteyi temizle + geçici kabuk

Amaç: derlemeyi hiç bozmadan eski sayfaları/bileşenleri kaldırmak. Önce `app/page.tsx` bağımsız hale getirilir, sonra silme yapılır.

**Files:**
- Modify: `app/page.tsx` (geçici kabuk)
- Delete: aşağıdaki liste

- [ ] **Adım 1: `app/page.tsx`i geçici kabukla değiştir**

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">YIKAT — yeni site kuruluyor</p>
    </main>
  )
}
```

- [ ] **Adım 2: Eski sayfa ve bileşenleri sil**

```bash
git rm -r app/hizmetler app/nasil-calisir app/partnerlik app/sss app/iletisim app/api
git rm components/hero-section.tsx components/trust-band.tsx components/services-section.tsx \
  components/how-it-works.tsx components/why-yikat.tsx components/area-teaser.tsx \
  components/testimonials.tsx components/app-band.tsx components/partner-cta.tsx \
  components/faq-section.tsx components/app-download-button.tsx components/store-badges.tsx \
  components/contact-form.tsx components/partner-form.tsx components/navbar.tsx components/footer.tsx
git rm public/sitemap.xml public/robots.txt public/videos/laundry-bg.mp4
```

Not: `app/kvkk` ve `app/mesafeli-satis-sozlesmesi` SİLİNMEZ (yasal zorunluluk, kendi başlıkları var, silinen bileşen import etmezler). `components/ui/`, `theme-provider.tsx`, `hooks/`, logolar kalır.

- [ ] **Adım 2b: Kullanılmayan resend bağımlılığını kaldır** (tek kullanıcısı silinen /api/partner idi)

```bash
pnpm remove resend
```

- [ ] **Adım 3: Tip + derleme kontrolü**

Çalıştır: `npx tsc --noEmit && pnpm build`
Beklenen: ikisi de hatasız. (Hata çıkarsa: silinen bir bileşene başka bir import kalmıştır — hatadaki dosyayı aç, importu kaldır.)

- [ ] **Adım 4: Commit**

```bash
git add -A && git commit -m "pivot: remove aggregator-era pages and components, temp shell"
```

---

### Görev 3: `lib/site.ts` — yeni veri modeli

**Files:**
- Modify: `lib/site.ts` (tam değişim)
- Create: `lib/analytics.ts`

- [ ] **Adım 1: `lib/site.ts`i tamamen şu içerikle değiştir**

```ts
// Merkezi site verisi — ayakkabı yıkama pivotu.
// Spec: docs/superpowers/specs/2026-07-05-ayakkabi-pivot-design.md
// Kural: Çekmeköy/eski döneme ait hiçbir veri ve rakam kullanılmaz (spec §2).

export const siteConfig = {
  name: "YIKAT",
  url: "https://www.yikat.tech",
  phone: "0850 303 31 93",
  phoneHref: "tel:+908503033193",
  email: "destek@yikat.tech",
  address: {
    street: "Cevizlik Mah. İskele Cd. No: 15C",
    district: "Bakırköy",
    city: "İstanbul",
    postalCode: "34142",
    full: "Cevizlik Mah. İskele Cd. No: 15C, 34142 Bakırköy/İstanbul",
  },
  hours: { label: "Her gün 09:00 – 20:00", opens: "09:00", closes: "20:00" },
  // Google/Apple Maps derin linkleri (Yol Tarifi CTA'ları)
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Cevizlik+Mah.+%C4%B0skele+Cd.+15C+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  mapsPlaceUrl:
    "https://www.google.com/maps/search/?api=1&query=Cevizlik+Mah.+%C4%B0skele+Cd.+15C+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  appleDirectionsUrl:
    "https://maps.apple.com/?daddr=Cevizlik+Mah.+%C4%B0skele+Cd.+15C+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  // Yaklaşık konum — açılıştan önce dükkanın gerçek Google Maps pin'iyle doğrulanacak
  geo: { latitude: 40.9781, longitude: 28.8724 },
} as const

// Güven şeridi — rakamsız değer önerileri (spec §2.2)
export const valueProps = [
  {
    title: "Aynı Gün Teslim",
    description: "Sabah bırak, akşam al. Ayakkabın aynı gün tertemiz hazır.",
  },
  {
    title: "YIKAT Garantisi",
    description: "Memnun kalmazsan ücretsiz tekrar yıkarız.",
  },
  {
    title: "Malzeme Uzmanlığı",
    description: "Süet, deri, spor — her malzemeye kendine uygun yöntem.",
  },
] as const

// Fiyat menüsü — price null iken "Menü yakında" gösterilir; menü gelince "499 ₺" gibi doldurulur.
export type PriceItem = { category: string; note: string; price: string | null }
export const priceMenu: PriceItem[] = [
  { category: "Spor Ayakkabı", note: "Kumaş, mesh ve karışık malzeme", price: null },
  { category: "Deri Ayakkabı", note: "Klasik ve günlük deri modeller", price: null },
  { category: "Süet & Nubuk", note: "Hassas yüzeylere özel bakım", price: null },
  { category: "Çocuk Ayakkabısı", note: "Tüm çocuk modelleri", price: null },
]

// SSS — hem sayfadaki accordion hem layout'taki FAQPage JSON-LD buradan beslenir.
export const faqs = [
  {
    q: "Hangi ayakkabılar yıkanıyor?",
    a: "Spor ayakkabı, deri, süet/nubuk ve çocuk ayakkabıları. Her malzemeye kendine uygun yöntem ve ürün kullanıyoruz.",
  },
  {
    q: "Süet ve nubuk ayakkabı yıkanır mı?",
    a: "Evet. Süet ve nubuk, hassas yüzeye özel fırça ve ürünlerle, suya boğmadan temizlenir.",
  },
  {
    q: "Ne kadar sürede teslim ediyorsunuz?",
    a: "Aynı gün. Sabah bıraktığın ayakkabıyı aynı gün akşam 20:00'ye kadar teslim alabilirsin.",
  },
  {
    q: "Memnun kalmazsam ne oluyor?",
    a: "YIKAT Garantisi: Sonuçtan memnun kalmazsan ücretsiz tekrar yıkıyoruz.",
  },
  {
    q: "Fiyatlar ne kadar?",
    a: "Fiyat menümüz dükkanda; yakında bu sayfada da yayınlanacak. Kategoriye (spor, deri, süet/nubuk, çocuk) göre sabit fiyat uygulanır.",
  },
  {
    q: "Çalışma saatleriniz ne?",
    a: "Her gün 09:00 – 20:00. Pazar günleri de açığız.",
  },
  {
    q: "Ödeme nasıl yapılıyor?",
    a: "Nakit ve kart geçerli.",
  },
  {
    q: "Neredesiniz?",
    a: "Cevizlik Mah. İskele Cd. No: 15C, Bakırköy/İstanbul. Bakırköy çarşı bölgesinde, iskeleye yürüme mesafesinde.",
  },
] as const
```

- [ ] **Adım 2: `lib/analytics.ts` oluştur**

```ts
// Paylaşılan analytics yardımcısı. Sitede gtag/GA yükleyici YOK — eski koddaki
// window.gtag kalıbı hiçbir event göndermiyordu. Vercel Analytics layout'ta zaten
// kurulu; custom event'ler onun track() API'siyle gider (yalnız client bileşenlerde çağrılır).
export { track } from "@vercel/analytics"
```

- [ ] **Adım 3: Doğrula ve commit**

Çalıştır: `npx tsc --noEmit`
Beklenen: hatasız.

```bash
git add lib/site.ts lib/analytics.ts && git commit -m "pivot: new site data model (store info, value props, price menu, faqs)"
```

---

### Görev 4: `app/layout.tsx` — metadata + JSON-LD

**Files:**
- Modify: `app/layout.tsx` (tam değişim)

- [ ] **Adım 1: Dosyayı şu içerikle değiştir**

```tsx
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { siteConfig, faqs } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Ayakkabı Yıkama Bakırköy — YIKAT | Aynı Gün Teslim",
  description:
    "Bakırköy İskele Caddesi'nde profesyonel ayakkabı yıkama. Spor, deri, süet — malzemesine uygun yıkama, aynı gün teslim, YIKAT Garantisi. Her gün 09:00–20:00.",
  keywords: [
    "ayakkabı yıkama bakırköy",
    "ayakkabı temizleme",
    "sneaker yıkama",
    "süet ayakkabı temizliği",
    "deri ayakkabı bakımı",
    "YIKAT",
  ],
  icons: { icon: "/images/yikat-logo-blue.png", apple: "/images/yikat-logo-blue.png" },
  alternates: { canonical: siteConfig.url },
  robots: { index: true, follow: true },
  verification: { google: "STVQceqys-HuTc9IuB8MElUcaltLIoRKCwBQ-FkwUYA" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: "YIKAT",
    locale: "tr_TR",
    title: "Ayakkabı Yıkama Bakırköy — YIKAT",
    description: "Ayakkabın ilk günkü gibi. Aynı gün teslim, YIKAT Garantisi.",
    // og:image Higgsfield asset'i üretilince eklenecek (Görev 18)
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayakkabı Yıkama Bakırköy — YIKAT",
    description: "Ayakkabın ilk günkü gibi. Aynı gün teslim.",
  },
}

export const viewport: Viewport = {
  themeColor: "#4A8CFF",
  width: "device-width",
  initialScale: 1,
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "YIKAT",
  alternateName: "Yıkat Ayakkabı Yıkama",
  description:
    "Bakırköy'de profesyonel ayakkabı yıkama dükkanı. Spor, deri, süet ve çocuk ayakkabıları için malzemesine uygun yıkama, aynı gün teslim.",
  url: siteConfig.url,
  telephone: "+908503033193",
  email: siteConfig.email,
  image: `${siteConfig.url}/images/yikat-logo-blue.png`,
  priceRange: "₺₺",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.district,
    addressRegion: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressCountry: "TR",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: siteConfig.hours.opens,
    closes: siteConfig.hours.closes,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Bakırköy" },
    { "@type": "City", name: "İstanbul" },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.slice(0, 4).map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Adım 2: Doğrula ve commit**

Çalıştır: `npx tsc --noEmit && pnpm build`
Beklenen: hatasız.

```bash
git add app/layout.tsx && git commit -m "pivot: bakırköy shoe-wash metadata + LocalBusiness/FAQ JSON-LD"
```

---

### Görev 5: robots.ts, sitemap.ts, yönlendirmeler

**Files:**
- Create: `app/robots.ts`, `app/sitemap.ts`
- Modify: `next.config.mjs`

- [ ] **Adım 1: `app/robots.ts`**

```ts
import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

- [ ] **Adım 2: `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/kvkk`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    {
      url: `${siteConfig.url}/mesafeli-satis-sozlesmesi`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]
}
```

- [ ] **Adım 3: `next.config.mjs`i şu içerikle değiştir**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  async redirects() {
    // Pivot: agregatör dönemi rotaları ana sayfaya (kalıcı — Next 308 döner, SEO'da 301 ile eşdeğer)
    return ["/hizmetler", "/nasil-calisir", "/partnerlik", "/sss", "/iletisim"].map((source) => ({
      source,
      destination: "/",
      permanent: true,
    }))
  },
}

export default nextConfig
```

- [ ] **Adım 4: Doğrula**

```bash
pnpm build
pnpm start & SERVER_PID=$!
sleep 4
curl -sI http://localhost:3000/hizmetler | head -2
curl -sI http://localhost:3000/partnerlik | head -2
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml | head -5
kill $SERVER_PID
```

Beklenen: iki curl'de `HTTP/1.1 308 Permanent Redirect` + `location: /`; robots.txt içinde `Sitemap: https://www.yikat.tech/sitemap.xml`; sitemap.xml'de 3 URL.

- [ ] **Adım 5: Commit**

```bash
git add app/robots.ts app/sitemap.ts next.config.mjs && git commit -m "pivot: dynamic robots/sitemap + permanent redirects for old routes"
```

---

### Görev 6: Navbar

**Files:**
- Create: `components/navbar.tsx`

- [ ] **Adım 1: Dosyayı oluştur**

```tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Menu, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "#nasil-calisir", label: "Nasıl Çalışır" },
  { href: "#sonuclar", label: "Sonuçlar" },
  { href: "#fiyatlar", label: "Fiyatlar" },
  { href: "#sss", label: "SSS" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b bg-background/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="YIKAT ana sayfa">
          <Image src="/images/yikat-logo-blue.png" alt="YIKAT" width={96} height={28} priority className="h-7 w-auto" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={siteConfig.phoneHref}
            aria-label={`Ara: ${siteConfig.phone}`}
            onClick={() => track("nav_call_click")}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="size-4" />
          </a>
          <Button asChild size="sm" className="rounded-full">
            <a
              href={siteConfig.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("nav_directions_click")}
            >
              <MapPin className="size-4" /> Yol Tarifi
            </a>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Menü"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Button asChild size="sm" className="flex-1 rounded-full">
                  <a
                    href={siteConfig.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("nav_directions_click_mobile")}
                  >
                    <MapPin className="size-4" /> Yol Tarifi
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                  <a href={siteConfig.phoneHref} onClick={() => track("nav_call_click_mobile")}>
                    <Phone className="size-4" /> Ara
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

- [ ] **Adım 2: Doğrula ve commit**

Çalıştır: `npx tsc --noEmit`
Beklenen: hatasız.

```bash
git add components/navbar.tsx && git commit -m "pivot: navbar with anchor links + directions/call CTAs"
```

---

### Görev 7: Hero — statik iskelet ve reduced-motion fallback

Hero iki görevde yapılır: önce sahne yapısı + statik fallback (bu görev), sonra scroll koreografisi (Görev 8).

**Files:**
- Create: `components/hero-scroll-story.tsx`

- [ ] **Adım 1: Dosyayı oluştur (statik sürüm — scroll bağları Görev 8'de eklenecek)**

```tsx
"use client"

import { motion, useReducedMotion } from "framer-motion"
import { MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"

// Sabit kamera kuralı (spec §4): ayakkabı hep merkezde, sadece arka plan + durum değişir.
// Higgsfield görselleri gelene kadar: arka plan CSS gradyanı, ayakkabı emoji placeholder (Görev 17'de değişecek).
export const SCENES = [
  {
    key: "sokak",
    bg: "linear-gradient(160deg, #d7dde4 0%, #eef1f4 60%, #f8fafc 100%)",
    title: "Ayakkabın ilk günkü gibi.",
    sub: "Bakırköy'de profesyonel ayakkabı yıkama",
    dark: false,
  },
  {
    key: "camur",
    bg: "linear-gradient(160deg, #3f3122 0%, #6b4a2b 55%, #8a6237 100%)",
    title: "Sokak zor.",
    sub: "Çamur, toz, leke…",
    dark: true,
  },
  {
    key: "yikat",
    bg: "linear-gradient(160deg, #042c53 0%, #1f5eb8 55%, #4a8cff 100%)",
    title: "YIKAT yıkar.",
    sub: "Malzemesine uygun, profesyonel yıkama",
    dark: true,
  },
  {
    key: "temiz",
    bg: "linear-gradient(160deg, #e6f1fb 0%, #f3f8ff 55%, #ffffff 100%)",
    title: "Aynı gün tertemiz teslim.",
    sub: "Sabah bırak, akşam 20:00'ye kadar al.",
    dark: false,
  },
] as const

export function HeroCtas({ eventPrefix }: { eventPrefix: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button asChild size="lg" className="rounded-full">
        <a
          href={siteConfig.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(`${eventPrefix}_directions_click`)}
        >
          <MapPin className="size-4" /> Yol Tarifi Al
        </a>
      </Button>
      <Button asChild size="lg" variant="outline" className="rounded-full bg-background/70">
        <a href={siteConfig.phoneHref} onClick={() => track(`${eventPrefix}_call_click`)}>
          <Phone className="size-4" /> {siteConfig.phone}
        </a>
      </Button>
    </div>
  )
}

// Reduced-motion ve düşük güç fallback'i: final sahnesi statik (spec §4).
export function StaticHero() {
  const scene = SCENES[3]
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16" style={{ background: scene.bg }}>
      <span aria-hidden className="text-[120px] leading-none drop-shadow-xl md:text-[160px]">👟</span>
      <h1 className="mt-6 text-balance text-center text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        Ayakkabın ilk günkü gibi.
      </h1>
      <p className="mt-3 text-center text-lg text-muted-foreground">
        Bakırköy'de profesyonel ayakkabı yıkama — aynı gün teslim.
      </p>
      <div className="mt-8">
        <HeroCtas eventPrefix="hero_static" />
      </div>
    </section>
  )
}

export function HeroScrollStory() {
  const prefersReduced = useReducedMotion()
  if (prefersReduced) return <StaticHero />
  // Görev 8'de scroll koreografisiyle değişecek geçici içerik:
  return <StaticHero />
}
```

- [ ] **Adım 2: Doğrula ve commit**

Çalıştır: `npx tsc --noEmit`
Beklenen: hatasız.

```bash
git add components/hero-scroll-story.tsx && git commit -m "pivot: hero skeleton with scenes data + static/reduced-motion fallback"
```

---

### Görev 8: Hero — scroll koreografisi

**Files:**
- Modify: `components/hero-scroll-story.tsx` (yalnız `HeroScrollStory` fonksiyonu değişir + importlar genişler)

- [ ] **Adım 1: Dosyanın import satırlarını şununla değiştir**

```tsx
import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { ChevronDown, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"
```

- [ ] **Adım 2: `HeroScrollStory` fonksiyonunu şununla değiştir**

```tsx
// Sahne pencereleri (scrollYProgress 0..1): her sahne ~%25'lik dilim, %6 crossfade.
const WINDOWS = [
  [0, 0, 0.19, 0.25],
  [0.19, 0.25, 0.44, 0.5],
  [0.44, 0.5, 0.69, 0.75],
  [0.69, 0.75, 1, 1],
] as const

function sceneOpacity(progress: MotionValue<number>, i: number) {
  const [fadeInStart, fullStart, fullEnd, fadeOutEnd] = WINDOWS[i]
  // İlk sahne başta görünür, son sahne sonda görünür kalır
  return useTransform(progress, [fadeInStart, fullStart, fullEnd, fadeOutEnd], [i === 0 ? 1 : 0, 1, 1, i === 3 ? 1 : 0])
}

function sceneTextY(progress: MotionValue<number>, i: number) {
  const [fadeInStart, fullStart] = WINDOWS[i]
  return useTransform(progress, [fadeInStart, fullStart], [i === 0 ? 0 : 24, 0])
}

function sceneTextBlur(progress: MotionValue<number>, i: number) {
  const [fadeInStart, fullStart] = WINDOWS[i]
  return useTransform(progress, [fadeInStart, fullStart], [i === 0 ? "blur(0px)" : "blur(8px)", "blur(0px)"])
}

export function HeroScrollStory() {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })

  // Not: sabit sayıda (4) sahne olduğu için hook çağrı sırası her render'da aynıdır.
  const bg0 = sceneOpacity(scrollYProgress, 0)
  const bg1 = sceneOpacity(scrollYProgress, 1)
  const bg2 = sceneOpacity(scrollYProgress, 2)
  const bg3 = sceneOpacity(scrollYProgress, 3)
  const bgOpacities = [bg0, bg1, bg2, bg3]

  // Metin girişleri — Jakub kalıbı: opacity + translateY + blur (spec §4)
  const ty0 = sceneTextY(scrollYProgress, 0)
  const ty1 = sceneTextY(scrollYProgress, 1)
  const ty2 = sceneTextY(scrollYProgress, 2)
  const ty3 = sceneTextY(scrollYProgress, 3)
  const tb0 = sceneTextBlur(scrollYProgress, 0)
  const tb1 = sceneTextBlur(scrollYProgress, 1)
  const tb2 = sceneTextBlur(scrollYProgress, 2)
  const tb3 = sceneTextBlur(scrollYProgress, 3)
  const textYs = [ty0, ty1, ty2, ty3]
  const textBlurs = [tb0, tb1, tb2, tb3]

  // Ayakkabı durum katmanları
  const mudOpacity = useTransform(scrollYProgress, [0.19, 0.25, 0.6, 0.72], [0, 1, 1, 0])
  const foamOpacity = useTransform(scrollYProgress, [0.44, 0.5, 0.69, 0.75], [0, 1, 1, 0])
  const waveX = useTransform(scrollYProgress, [0.44, 0.75], ["-120%", "120%"])
  const sparkleOpacity = useTransform(scrollYProgress, [0.75, 0.82, 1], [0, 1, 1])
  const shoeFilter = useTransform(
    scrollYProgress,
    [0.19, 0.25, 0.62, 0.74],
    ["brightness(1) sepia(0)", "brightness(0.75) sepia(0.6)", "brightness(0.75) sepia(0.6)", "brightness(1) sepia(0)"],
  )
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  const ctaPointer = useTransform(scrollYProgress, (v) => (v > 0.72 ? "auto" : "none"))

  if (prefersReduced) return <StaticHero />

  return (
    // Pin alanı: mobil 160vh, md+ 220vh (spec §4)
    <section ref={ref} aria-label="YIKAT hikayesi" className="relative h-[160vh] md:h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Arka plan katmanları */}
        {SCENES.map((scene, i) => (
          <motion.div
            key={scene.key}
            aria-hidden
            className="absolute inset-0"
            style={{ background: scene.bg, opacity: bgOpacities[i] }}
          />
        ))}

        {/* Sabit kadraj: ayakkabı + durum katmanları */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <motion.span
              aria-hidden
              className="block text-[120px] leading-none drop-shadow-xl md:text-[180px]"
              style={{ filter: shoeFilter }}
            >
              👟
            </motion.span>
            {/* Çamur sıçramaları */}
            <motion.div aria-hidden style={{ opacity: mudOpacity }}>
              <span className="absolute -bottom-1 left-4 h-3 w-8 rounded-full bg-[#5b4226]" />
              <span className="absolute bottom-3 right-6 h-2.5 w-5 rounded-full bg-[#6b4a2b]" />
              <span className="absolute -bottom-2 right-14 h-2 w-6 rounded-full bg-[#4d3b28]" />
            </motion.div>
            {/* Köpük + su dalgası */}
            <motion.div aria-hidden className="absolute inset-0 overflow-hidden" style={{ opacity: foamOpacity }}>
              <motion.div
                className="absolute inset-y-0 w-[140%] bg-gradient-to-r from-transparent via-white/70 to-transparent"
                style={{ x: waveX, skewX: "-12deg" }}
              />
              <span className="absolute left-2 top-2 size-4 rounded-full bg-white/80" />
              <span className="absolute right-4 top-8 size-3 rounded-full bg-white/70" />
              <span className="absolute bottom-6 left-10 size-2.5 rounded-full bg-white/60" />
            </motion.div>
            {/* Işıltı */}
            <motion.div aria-hidden style={{ opacity: sparkleOpacity }}>
              <span className="absolute -left-6 top-2 text-2xl">✨</span>
              <span className="absolute -right-5 top-10 text-xl">✨</span>
            </motion.div>
          </div>

          {/* Sahne metinleri — tek h1 ilk sahnede (spec §4) */}
          <div className="relative mt-8 h-28 w-full max-w-2xl px-4 text-center">
            {SCENES.map((scene, i) => (
              <motion.div
                key={scene.key}
                className="absolute inset-x-0 top-0"
                style={{ opacity: bgOpacities[i], y: textYs[i], filter: textBlurs[i] }}
              >
                {i === 0 ? (
                  <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                    {scene.title}
                  </h1>
                ) : (
                  <p
                    className={`text-balance text-4xl font-semibold tracking-tight md:text-5xl ${
                      scene.dark ? "text-white" : "text-foreground"
                    }`}
                  >
                    {scene.title}
                  </p>
                )}
                <p className={`mt-3 text-lg ${scene.dark ? "text-white/80" : "text-muted-foreground"}`}>
                  {scene.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Final CTA'ları — yalnız son sahnede tıklanabilir */}
          <motion.div className="mt-4" style={{ opacity: bg3, pointerEvents: ctaPointer }}>
            <HeroCtas eventPrefix="hero" />
          </motion.div>
        </div>

        {/* Kaydırma ipucu */}
        <motion.div
          aria-hidden
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground"
          style={{ opacity: hintOpacity }}
        >
          <ChevronDown className="size-6 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}
```

Not — `sceneOpacity` bir custom hook'tur ve `HeroScrollStory` içinde sabit sırayla 4 kez çağrılır; `SCENES.map` içinde ÇAĞRILMAZ (React hook kuralı). `prefersReduced` erken dönüşü hook çağrılarından SONRA durur — kod yukarıdaki sırayla yazılmalı… DİKKAT: yukarıdaki kodda `if (prefersReduced) return <StaticHero />` hook çağrılarından sonra yer alıyor; bu sıra korunmalı.

- [ ] **Adım 3: Görsel doğrulama**

```bash
pnpm dev
```

`http://localhost:3000` aç (page.tsx henüz kabuk — geçici olarak kabuğa `<HeroScrollStory />` ekleyip bak, sonra geri al; ya da Görev 13'ü bekle). Kontrol listesi:
- Kaydırdıkça 4 sahne sırayla geçiyor (gri sokak → kahve çamur → mavi YIKAT → beyaz temiz)
- Ayakkabı hep merkezde, çamur/köpük/ışıltı doğru anlarda
- Son sahnede CTA'lar tıklanabilir, öncesinde değil
- macOS: Sistem Ayarları → Erişilebilirlik → Ekran → Hareketi azalt AÇIK iken statik hero geliyor

- [ ] **Adım 4: Commit**

```bash
git add components/hero-scroll-story.tsx && git commit -m "pivot: hero scroll story choreography (4 scenes, fixed-camera)"
```

---

### Görev 8b: Hero düzeltmeleri (Görev 8 kalite review bulguları)

**Files:** Modify `components/hero-scroll-story.tsx`

Bulgular: C1 mobil scrub mesafesi çok kısa; I1 görünmez CTA'lar klavyeyle odaklanabiliyor; I2 çift yönlü crossfade'de sayfa zemini %25 sızıyor; I3 `h-28` metin kabı mobilde CTA'larla çakışıyor; I4 `drop-shadow-xl` animasyonlu filter tarafından eziliyor; M1 magic number'lar; M2 çıkan metinde exit hareketi yok; M3 `h-screen` iOS chrome sorunu; M4 helper isimleri `use` önekli değil.

- [ ] **Adım 1: `StaticHero` içinde** `min-h-screen` → `min-h-dvh`.

- [ ] **Adım 2: `const WINDOWS` satırından dosya sonuna kadar olan HER ŞEYİ şu blokla değiştir:**

```tsx
// Sahne pencereleri (scrollYProgress 0..1): her sahne ~%25'lik dilim, %6 crossfade.
const WINDOWS = [
  [0, 0, 0.19, 0.25],
  [0.19, 0.25, 0.44, 0.5],
  [0.44, 0.5, 0.69, 0.75],
  [0.69, 0.75, 1, 1],
] as const

// Çamurun yıkama ortasında temizlenme aralığı ve CTA eşiği — WINDOWS ile birlikte okunur.
const MUD_RINSE = [0.6, 0.72] as const
const SHOE_CLEAN = [0.62, 0.74] as const
const CTA_GATE = 0.72

// Arka planlar yalnız fade-IN yapar; sonraki opak katman öncekini örter (DOM sırası).
// Çift yönlü crossfade'de iki katman 0.5 opaklıkta binişince sayfa zemini sızıyordu.
function useSceneBgOpacity(progress: MotionValue<number>, i: number) {
  return useTransform(
    progress,
    i === 0 ? [0, 1] : [WINDOWS[i][0], WINDOWS[i][1]],
    i === 0 ? [1, 1] : [0, 1],
  )
}

function useSceneTextOpacity(progress: MotionValue<number>, i: number) {
  const [fadeInStart, fullStart, fullEnd, fadeOutEnd] = WINDOWS[i]
  if (i === 0) return useTransform(progress, [0, fullEnd, fadeOutEnd], [1, 1, 0])
  if (i === 3) return useTransform(progress, [fadeInStart, fullStart, 1], [0, 1, 1])
  return useTransform(progress, [fadeInStart, fullStart, fullEnd, fadeOutEnd], [0, 1, 1, 0])
}

// Jakub kalıbı: giren metin 24px yükselir, çıkan metin -24px ile sahneyi terk eder.
function useSceneTextY(progress: MotionValue<number>, i: number) {
  const [fadeInStart, fullStart, fullEnd, fadeOutEnd] = WINDOWS[i]
  if (i === 0) return useTransform(progress, [fullEnd, fadeOutEnd], [0, -24])
  if (i === 3) return useTransform(progress, [fadeInStart, fullStart], [24, 0])
  return useTransform(progress, [fadeInStart, fullStart, fullEnd, fadeOutEnd], [24, 0, 0, -24])
}

function useSceneTextBlur(progress: MotionValue<number>, i: number) {
  return useTransform(
    progress,
    i === 0 ? [0, 1] : [WINDOWS[i][0], WINDOWS[i][1]],
    i === 0 ? ["blur(0px)", "blur(0px)"] : ["blur(8px)", "blur(0px)"],
  )
}

export function HeroScrollStory() {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })

  // Sabit sayıda (4) sahne — hook çağrı sırası her render'da aynıdır; helper'lar map İÇİNDE ÇAĞRILMAZ.
  const bg0 = useSceneBgOpacity(scrollYProgress, 0)
  const bg1 = useSceneBgOpacity(scrollYProgress, 1)
  const bg2 = useSceneBgOpacity(scrollYProgress, 2)
  const bg3 = useSceneBgOpacity(scrollYProgress, 3)
  const bgOpacities = [bg0, bg1, bg2, bg3]

  const to0 = useSceneTextOpacity(scrollYProgress, 0)
  const to1 = useSceneTextOpacity(scrollYProgress, 1)
  const to2 = useSceneTextOpacity(scrollYProgress, 2)
  const to3 = useSceneTextOpacity(scrollYProgress, 3)
  const textOpacities = [to0, to1, to2, to3]

  const ty0 = useSceneTextY(scrollYProgress, 0)
  const ty1 = useSceneTextY(scrollYProgress, 1)
  const ty2 = useSceneTextY(scrollYProgress, 2)
  const ty3 = useSceneTextY(scrollYProgress, 3)
  const textYs = [ty0, ty1, ty2, ty3]

  const tb0 = useSceneTextBlur(scrollYProgress, 0)
  const tb1 = useSceneTextBlur(scrollYProgress, 1)
  const tb2 = useSceneTextBlur(scrollYProgress, 2)
  const tb3 = useSceneTextBlur(scrollYProgress, 3)
  const textBlurs = [tb0, tb1, tb2, tb3]

  const mudOpacity = useTransform(
    scrollYProgress,
    [WINDOWS[1][0], WINDOWS[1][1], MUD_RINSE[0], MUD_RINSE[1]],
    [0, 1, 1, 0],
  )
  const foamOpacity = useTransform(
    scrollYProgress,
    [WINDOWS[2][0], WINDOWS[2][1], WINDOWS[2][2], WINDOWS[2][3]],
    [0, 1, 1, 0],
  )
  const waveX = useTransform(scrollYProgress, [WINDOWS[2][0], WINDOWS[2][3]], ["-120%", "120%"])
  const sparkleOpacity = useTransform(scrollYProgress, [WINDOWS[3][1], 0.82, 1], [0, 1, 1])
  const shoeFilter = useTransform(
    scrollYProgress,
    [WINDOWS[1][0], WINDOWS[1][1], SHOE_CLEAN[0], SHOE_CLEAN[1]],
    ["brightness(1) sepia(0)", "brightness(0.75) sepia(0.6)", "brightness(0.75) sepia(0.6)", "brightness(1) sepia(0)"],
  )
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  // Görünmezken klavye odağından da çıkar (WCAG 2.4.7) — pointerEvents yerine visibility.
  const ctaVisibility = useTransform(scrollYProgress, (v) => (v > CTA_GATE ? "visible" : "hidden"))

  if (prefersReduced) return <StaticHero />

  return (
    // Scrub mesafesi = yükseklik − 1 ekran → mobil ~1.6, masaüstü ~2.2 ekran (spec §4).
    <section ref={ref} aria-label="YIKAT hikayesi" className="relative h-[260vh] md:h-[320vh]">
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
        {/* Arka plan katmanları — yalnız fade-in, sonraki katman öncekini örter */}
        {SCENES.map((scene, i) => (
          <motion.div
            key={scene.key}
            aria-hidden
            className="absolute inset-0"
            style={{ background: scene.bg, opacity: bgOpacities[i] }}
          />
        ))}

        {/* Sabit kadraj: ayakkabı + durum katmanları */}
        <div className="relative z-10 flex flex-col items-center">
          {/* drop-shadow sarmalayıcıda: içteki animasyonlu filter onu ezemez */}
          <div className="relative drop-shadow-xl">
            <motion.span
              aria-hidden
              className="block text-[120px] leading-none md:text-[180px]"
              style={{ filter: shoeFilter, willChange: "filter" }}
            >
              👟
            </motion.span>
            {/* Çamur sıçramaları */}
            <motion.div aria-hidden style={{ opacity: mudOpacity }}>
              <span className="absolute -bottom-1 left-4 h-3 w-8 rounded-full bg-[#5b4226]" />
              <span className="absolute bottom-3 right-6 h-2.5 w-5 rounded-full bg-[#6b4a2b]" />
              <span className="absolute -bottom-2 right-14 h-2 w-6 rounded-full bg-[#4d3b28]" />
            </motion.div>
            {/* Köpük + su dalgası */}
            <motion.div aria-hidden className="absolute inset-0 overflow-hidden" style={{ opacity: foamOpacity }}>
              <motion.div
                className="absolute inset-y-0 w-[140%] bg-gradient-to-r from-transparent via-white/70 to-transparent"
                style={{ x: waveX, skewX: "-12deg" }}
              />
              <span className="absolute left-2 top-2 size-4 rounded-full bg-white/80" />
              <span className="absolute right-4 top-8 size-3 rounded-full bg-white/70" />
              <span className="absolute bottom-6 left-10 size-2.5 rounded-full bg-white/60" />
            </motion.div>
            {/* Işıltı */}
            <motion.div aria-hidden style={{ opacity: sparkleOpacity }}>
              <span className="absolute -left-6 top-2 text-2xl">✨</span>
              <span className="absolute -right-5 top-10 text-xl">✨</span>
            </motion.div>
          </div>

          {/* Grid yığını: kapsayıcı en uzun sahne metnine göre boyutlanır — CTA ile çakışamaz (eski h-28 taşıyordu) */}
          <div className="mt-8 grid w-full max-w-2xl px-4 text-center">
            {SCENES.map((scene, i) => (
              <motion.div
                key={scene.key}
                className="col-start-1 row-start-1"
                style={{ opacity: textOpacities[i], y: textYs[i], filter: textBlurs[i] }}
              >
                {i === 0 ? (
                  <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                    {scene.title}
                  </h1>
                ) : (
                  <p
                    className={`text-balance text-4xl font-semibold tracking-tight md:text-5xl ${
                      scene.dark ? "text-white" : "text-foreground"
                    }`}
                  >
                    {scene.title}
                  </p>
                )}
                <p className={`mt-3 text-lg ${scene.dark ? "text-white/80" : "text-muted-foreground"}`}>
                  {scene.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Final CTA'ları — yalnız son sahnede görünür VE odaklanabilir */}
          <motion.div className="mt-4" style={{ opacity: to3, visibility: ctaVisibility }}>
            <HeroCtas eventPrefix="hero" />
          </motion.div>
        </div>

        {/* Kaydırma ipucu — konum dış div'de, animasyon içte (transform çakışması olmaz) */}
        <div aria-hidden className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground">
          <motion.div
            style={{ opacity: hintOpacity }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="size-6" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

Not: helper'lardaki `if (i === ...)` dalları hook kuralını bozmaz — her helper çağrısı tam olarak BİR useTransform çağrısı yapar ve `i` her çağrı noktasında sabittir; çağrı sırası/sayısı her render'da aynıdır.

- [ ] **Adım 3: Doğrula + commit**

`npx tsc --noEmit` temiz; geçici olarak page.tsx'e ekleyip dev server ile render kontrolü (sonra `git checkout -- app/page.tsx`); `git add components/hero-scroll-story.tsx && git commit -m "pivot: hero polish — mobile scrub length, a11y focus gate, fade-in-only bg, grid text stack"`

---

### Görev 9: Değer şeridi + Nasıl Çalışır

**Files:**
- Create: `components/value-band.tsx`
- Create: `components/how-it-works.tsx`

- [ ] **Adım 1: `components/value-band.tsx`**

```tsx
"use client"

import { motion } from "framer-motion"
import { Clock, Gem, ShieldCheck } from "lucide-react"
import { valueProps } from "@/lib/site"

const ICONS = [Clock, ShieldCheck, Gem]

export function ValueBand() {
  return (
    <section className="bg-muted py-12">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        {valueProps.map((v, i) => {
          const Icon = ICONS[i]
          return (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-4"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Adım 2: `components/how-it-works.tsx`**

```tsx
"use client"

import { motion } from "framer-motion"
import { Clock, Footprints, Sparkles } from "lucide-react"

const STEPS = [
  {
    no: "01",
    icon: Footprints,
    title: "Getir",
    text: "Ayakkabını dükkana bırak. İki dakikanı alır.",
  },
  {
    no: "02",
    icon: Sparkles,
    title: "Yıkayalım",
    text: "Malzemesine uygun yöntemle derin temizlik yapalım.",
  },
  {
    no: "03",
    icon: Clock,
    title: "Aynı gün teslim al",
    text: "Akşam 20:00'ye kadar tertemiz hazır. Beklerken Bakırköy çarşıda işini gör.",
  },
] as const

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Üç adımda, aynı gün
        </motion.h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-3xl border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                  <s.icon className="size-5" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">{s.no}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Adım 3: Doğrula ve commit**

Çalıştır: `npx tsc --noEmit`
Beklenen: hatasız.

```bash
git add components/value-band.tsx components/how-it-works.tsx && git commit -m "pivot: value band + 3-step how-it-works"
```

---

### Görev 10: Önce/Sonra bölümü

**Files:**
- Create: `components/before-after.tsx`

- [ ] **Adım 1: Dosyayı oluştur**

```tsx
"use client"

import { useCallback, useRef, useState } from "react"
import { motion } from "framer-motion"

// Placeholder panel — Higgsfield/gerçek fotoğraflar gelince <Image> ile değişecek (Görev 17).
function ShoePanel({ dirty }: { dirty: boolean }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        background: dirty
          ? "linear-gradient(160deg, #ded5c6, #eae3d6)"
          : "linear-gradient(160deg, #e6f1fb, #ffffff)",
      }}
    >
      <span
        aria-hidden
        className="text-[96px] leading-none"
        style={dirty ? { filter: "sepia(0.85) brightness(0.7)" } : undefined}
      >
        👟
      </span>
    </div>
  )
}

function CompareCard({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(50)
  const dragging = useRef(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPct(Math.min(95, Math.max(5, next)))
  }, [])

  return (
    <div>
      <div
        ref={ref}
        role="slider"
        aria-label={`${label} — kirli/temiz karşılaştırma`}
        aria-valuemin={5}
        aria-valuemax={95}
        aria-valuenow={Math.round(pct)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPct((p) => Math.max(5, p - 5))
          if (e.key === "ArrowRight") setPct((p) => Math.min(95, p + 5))
        }}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          updateFromClientX(e.clientX)
        }}
        onPointerMove={(e) => dragging.current && updateFromClientX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        className="relative aspect-[4/3] cursor-ew-resize touch-none select-none overflow-hidden rounded-3xl border"
      >
        {/* Alt katman: temiz */}
        <div className="absolute inset-0">
          <ShoePanel dirty={false} />
        </div>
        {/* Üst katman: kirli — tam boyut, clip-path ile soldan pct% görünür (katmanlar hep hizalı, GPU dostu) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          <ShoePanel dirty />
        </div>
        {/* Ayırıcı çizgi + tutamaç */}
        <div className="absolute inset-y-0 z-10" style={{ left: `${pct}%` }}>
          <div className="h-full w-0.5 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(4,44,83,0.4)]" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-navy shadow-md">
            ⇔
          </div>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-[#8a6237] px-2.5 py-0.5 text-xs font-bold text-white">
          KİRLİ
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">
          TEMİZ
        </span>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">{label} · Temsili görsel</p>
    </div>
  )
}

export function BeforeAfter() {
  return (
    <section id="sonuclar" className="scroll-mt-20 bg-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Farkı kendin gör
        </motion.h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Çizgiyi sürükle — sol kirli, sağ YIKAT sonrası.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <CompareCard label="Spor ayakkabı" />
          <CompareCard label="Süet bot" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Adım 2: Doğrula ve commit**

Çalıştır: `npx tsc --noEmit`
Beklenen: hatasız.

```bash
git add components/before-after.tsx && git commit -m "pivot: draggable before/after comparison section"
```

---

### Görev 11: Fiyat menüsü + Yakında bandı

**Files:**
- Create: `components/price-menu.tsx`
- Create: `components/coming-soon-band.tsx`

- [ ] **Adım 1: `components/price-menu.tsx`**

```tsx
"use client"

import { motion } from "framer-motion"
import { priceMenu } from "@/lib/site"

export function PriceMenu() {
  return (
    <section id="fiyatlar" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Fiyat menüsü
        </motion.h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Kategoriye göre sabit fiyat. Menü çok yakında burada — şimdilik dükkanda.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {priceMenu.map((item, i) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center justify-between rounded-2xl border bg-card px-5 py-4"
            >
              <div>
                <h3 className="font-semibold">{item.category}</h3>
                <p className="text-sm text-muted-foreground">{item.note}</p>
              </div>
              {item.price ? (
                <span className="text-lg font-semibold">{item.price}</span>
              ) : (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Menü yakında
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Adım 2: `components/coming-soon-band.tsx`**

```tsx
export function ComingSoonBand() {
  return (
    <section className="border-y bg-muted py-6">
      <p className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        Kapıdan alım ve tüm tekstil bakımı, <span className="font-semibold text-foreground">YIKAT uygulamasıyla</span> yakında.
      </p>
    </section>
  )
}
```

- [ ] **Adım 3: Doğrula ve commit**

Çalıştır: `npx tsc --noEmit`
Beklenen: hatasız.

```bash
git add components/price-menu.tsx components/coming-soon-band.tsx && git commit -m "pivot: price menu (placeholder prices) + app coming-soon band"
```

---

### Görev 12: Konum & Ziyaret + SSS + Footer

**Files:**
- Create: `components/visit-section.tsx`
- Create: `components/faq-section.tsx`
- Create: `components/footer.tsx`

- [ ] **Adım 1: `components/visit-section.tsx`**

```tsx
"use client"

import { motion } from "framer-motion"
import { Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"

export function VisitSection() {
  return (
    <section id="ziyaret" className="scroll-mt-20 bg-navy py-20 text-navy-foreground sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Dükkana bekleriz</h2>
          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-[#9cc3f5]" />
              <span>{siteConfig.address.full}</span>
            </li>
            <li className="flex items-start gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-[#9cc3f5]" />
              <span>{siteConfig.hours.label}</span>
            </li>
            <li className="flex items-start gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-[#9cc3f5]" />
              <a href={siteConfig.phoneHref} className="hover:underline" onClick={() => track("visit_call_click")}>
                {siteConfig.phone}
              </a>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-white text-navy hover:bg-white/90">
              <a
                href={siteConfig.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("visit_directions_click")}
              >
                <MapPin className="size-4" /> Yol Tarifi Al
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={siteConfig.phoneHref} onClick={() => track("visit_call_click")}>
                <Phone className="size-4" /> Ara
              </a>
            </Button>
          </div>
          <a
            href={siteConfig.appleDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("visit_apple_maps_click")}
            className="mt-3 inline-block text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
          >
            Apple Haritalar'da aç
          </a>
        </motion.div>

        {/* Statik harita placeholder'ı — tıklayınca Google Maps (spec §3.6). Gerçek statik harita görseli Görev 17'de. */}
        <motion.a
          href={siteConfig.mapsPlaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("visit_map_click")}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white/5 transition-colors hover:bg-white/10"
          aria-label="Haritada aç: YIKAT Bakırköy"
        >
          <div className="text-center">
            <MapPin className="mx-auto size-10 text-[#9cc3f5]" />
            <p className="mt-3 font-semibold">İskele Cd. 15C, Bakırköy</p>
            <p className="mt-1 text-sm text-white/70">Haritada açmak için tıkla</p>
          </div>
        </motion.a>
      </div>
    </section>
  )
}
```

- [ ] **Adım 2: `components/faq-section.tsx`**

```tsx
"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/lib/site"

export function FaqSection() {
  return (
    <section id="sss" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Sıkça sorulan sorular
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Adım 3: `components/footer.tsx` (server component — "use client" YOK)**

```tsx
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/lib/site"

export function Footer() {
  return (
    <footer className="bg-navy py-12 text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Image src="/images/yikat-logo-white.png" alt="YIKAT" width={110} height={32} className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Bakırköy'de profesyonel ayakkabı yıkama. Aynı gün teslim.
            </p>
          </div>
          <div className="text-sm text-white/70">
            <p>{siteConfig.address.full}</p>
            <p className="mt-2">{siteConfig.hours.label}</p>
            <p className="mt-2">
              <a href={siteConfig.phoneHref} className="hover:text-white">
                {siteConfig.phone}
              </a>
              {" · "}
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <Link href="/kvkk" className="hover:text-white">
              KVKK Aydınlatma Metni
            </Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-white">
              Mesafeli Satış Sözleşmesi
            </Link>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © 2026 YIKAT. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Adım 4: Doğrula ve commit**

Çalıştır: `npx tsc --noEmit`
Beklenen: hatasız.

```bash
git add components/visit-section.tsx components/faq-section.tsx components/footer.tsx && git commit -m "pivot: visit/location section, shoe faq, simplified footer"
```

---

### Görev 13: Ana sayfa kompozisyonu

**Files:**
- Modify: `app/page.tsx` (kabuğu gerçek kompozisyonla değiştir)

- [ ] **Adım 1: `app/page.tsx`i şu içerikle değiştir**

```tsx
import { Navbar } from "@/components/navbar"
import { HeroScrollStory } from "@/components/hero-scroll-story"
import { ValueBand } from "@/components/value-band"
import { HowItWorks } from "@/components/how-it-works"
import { BeforeAfter } from "@/components/before-after"
import { PriceMenu } from "@/components/price-menu"
import { VisitSection } from "@/components/visit-section"
import { FaqSection } from "@/components/faq-section"
import { ComingSoonBand } from "@/components/coming-soon-band"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroScrollStory />
        <ValueBand />
        <HowItWorks />
        <BeforeAfter />
        <PriceMenu />
        <VisitSection />
        <FaqSection />
        <ComingSoonBand />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Adım 1b: Görev 4 review bulgularını uygula** (kalite denetçisi önerileri)

1. `faqJsonLd` objesini ve onu basan `<script>` etiketini `app/layout.tsx`ten `app/page.tsx`e taşı (FAQ içeriği yalnız ana sayfada görünür — Google kuralı: işaretlenen içerik o sayfada görünmeli). `localBusinessJsonLd` layout'ta kalır.
2. Her iki JSON-LD basımında `JSON.stringify(x)` yerine `JSON.stringify(x).replace(/</g, "\\u003c")` kullan (script-breakout sertleştirmesi).
3. `lib/site.ts` siteConfig'e `phoneE164: "+908503033193",` alanı ekle (phoneHref'in hemen üstüne); layout'taki JSON-LD `telephone` alanı `siteConfig.phoneE164` olsun.
4. `localBusinessJsonLd`e ekle: `"@id": siteConfig.url,` ve `hasMap: siteConfig.mapsPlaceUrl,`.
5. Yasal sayfalara self-canonical ekle (sitemap-canonical çelişkisini çözer): `app/kvkk/page.tsx` metadata'sına `alternates: { canonical: "https://www.yikat.tech/kvkk" }`, `app/mesafeli-satis-sozlesmesi/page.tsx`e `alternates: { canonical: "https://www.yikat.tech/mesafeli-satis-sozlesmesi" }` — sayfaların başka hiçbir yerine dokunma.

- [ ] **Adım 2: Tam doğrulama**

```bash
npx tsc --noEmit && pnpm build && pnpm dev
```

Tarayıcı kontrol listesi (`http://localhost:3000`):
- Hero hikayesi akıyor; sonrasında bölümler sırayla: değer şeridi → nasıl çalışır → sonuçlar → fiyatlar → lacivert ziyaret → SSS → yakında bandı → footer
- Navbar linkleri (#nasil-calisir, #sonuclar, #fiyatlar, #sss) doğru bölüme kaydırıyor (scroll-mt-20 sayesinde başlık header altında kalmıyor)
- Önce/sonra kartında çizgi sürükleniyor (mouse + dokunmatik), ok tuşları çalışıyor
- Mobil görünüm (devtools, 390px): menü açılıyor, hero taşmıyor, tüm bölümler düzgün
- Kaynakta tek `<h1>` var (hero sahne 1)

- [ ] **Adım 3: Commit**

```bash
git add app/page.tsx && git commit -m "pivot: assemble single-page shoe-wash homepage"
```

---

### Görev 13b: Navbar cilası + erişilebilirlik (Görev 6 review bulguları)

**Files:** Modify `components/navbar.tsx`, Modify `app/globals.css`

- [ ] **Adım 1: `components/navbar.tsx` düzeltmeleri** (tam eşleşen string değişimleri):

1. Kontrast + border pop + açık menü dikişi: `const [open, setOpen] = useState(false)` satırından sonra `const solid = scrolled || open` ekle; header className'ını şununla değiştir:
```tsx
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        solid ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
```
Desktop nav linklerinin ve telefon ikonunun rengi: `text-muted-foreground` → `cn(solid ? "text-muted-foreground" : "text-foreground/80")` (hover sınıfları kalır).
2. Logo: kare asset 96×28 ile ezilmesin — logo satırını şununla değiştir:
```tsx
        <Link href="/" aria-label="YIKAT ana sayfa" className="flex items-center gap-2">
          <Image src="/images/yikat-logo-blue.png" alt="" width={28} height={28} priority className="size-7" />
          <span className="text-lg font-semibold tracking-tight text-foreground">YIKAT</span>
        </Link>
```
3. Hamburger: `className="md:hidden"` → `className="-m-2 p-2 md:hidden"`, butona `aria-controls="mobile-menu"` ekle; `motion.div`e `id="mobile-menu"` ekle; içindeki `<div className="flex flex-col gap-1 px-4 py-3">` → `<nav aria-label="Mobil menü" className="flex flex-col gap-1 px-4 py-3">` (kapanışı `</nav>`).
4. Escape ile kapanma — mevcut scroll useEffect'inin altına:
```tsx
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])
```
5. Mobil CTA'lar menüyü kapatsın: mobil Yol Tarifi onClick → `() => { setOpen(false); track("nav_directions_click_mobile") }`; mobil Ara onClick → `() => { setOpen(false); track("nav_call_click_mobile") }`.

- [ ] **Adım 2: `app/globals.css` reduced-motion smooth-scroll koruması** — `html { scroll-behavior: smooth; ... }` bloğunun altına:
```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Adım 2b: MotionConfig sarmalayıcı** (Görev 9 review: whileInView bölümleri reduced-motion'a saygı duymuyor) — `components/motion-provider.tsx` oluştur:
```tsx
"use client"

import { MotionConfig } from "framer-motion"

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
```
Görev 13'te app/page.tsx kompozisyonu `<MotionProvider>` ile sarılacak (Navbar dahil, Footer hariç olabilir — hepsini sarmak da güvenli).

- [ ] **Adım 2c: ValueBand ikon-veri bağlaşımı + başlık hiyerarşisi** (Görev 9 review):
1. `lib/site.ts` valueProps öğelerine `icon` alanı ekle: sırasıyla `icon: "clock",`, `icon: "shield",`, `icon: "gem",` (title satırının üstüne).
2. `components/value-band.tsx`te `const ICONS = [Clock, ShieldCheck, Gem]` → 
```tsx
const ICONS = { clock: Clock, shield: ShieldCheck, gem: Gem } as const
```
ve `const Icon = ICONS[i]` → `const Icon = ICONS[v.icon]`; map imzasından kullanılmayan `i` parametresini ve delay'i koruyarak (`delay: i * 0.08` kalır) düzenle.
3. ValueBand section'ının başına görünmez başlık ekle (belge hiyerarşisi h1→h3 atlamasın): `<h2 className="sr-only">Neden YIKAT</h2>`.

- [ ] **Adım 2d: Hero koşullu hook düzleştirme** (hero re-review nit; eslint gelecek-uyumluluğu) — `components/hero-scroll-story.tsx`te `useSceneTextOpacity` ve `useSceneTextY` if-dallarını, diğer iki helper gibi önce dizileri hesaplayıp TEK koşulsuz `useTransform` çağrısına çevir:
```tsx
function useSceneTextOpacity(progress: MotionValue<number>, i: number) {
  const [fadeInStart, fullStart, fullEnd, fadeOutEnd] = WINDOWS[i]
  const input = i === 0 ? [0, fullEnd, fadeOutEnd] : i === 3 ? [fadeInStart, fullStart, 1] : [fadeInStart, fullStart, fullEnd, fadeOutEnd]
  const output = i === 0 ? [1, 1, 0] : i === 3 ? [0, 1, 1] : [0, 1, 1, 0]
  return useTransform(progress, input, output)
}

function useSceneTextY(progress: MotionValue<number>, i: number) {
  const [fadeInStart, fullStart, fullEnd, fadeOutEnd] = WINDOWS[i]
  const input = i === 0 ? [fullEnd, fadeOutEnd] : i === 3 ? [fadeInStart, fullStart] : [fadeInStart, fullStart, fullEnd, fadeOutEnd]
  const output = i === 0 ? [0, -24] : i === 3 ? [24, 0] : [24, 0, 0, -24]
  return useTransform(progress, input, output)
}
```

- [ ] **Adım 2e: BeforeAfter mobil kaydırma tuzağı + slider cilası** (Görev 10 review) — `components/before-after.tsx` CompareCard'da:
1. Kart className'inde `touch-none` → `touch-pan-y` (dikey kaydırma sayfayı kaydırır, yatay sürükleme slider'ı sürer).
2. `onPointerUp` satırının altına `onPointerCancel={() => (dragging.current = false)}` ekle (pan-y ile tarayıcı scroll devralınca cancel gelir — ikisi birlikte şart).
3. Slider div'ine `aria-valuetext={`%${Math.round(pct)} kirli görünümde`}` ve className'e `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary` ekle.
4. Tutamaçtaki `⇔` metni yerine lucide `ChevronsLeftRight` ikonu (`<ChevronsLeftRight className="size-3.5" />`, import ekle) — platformlar arası tutarlı glif.

- [ ] **Adım 3: Doğrula + commit**

`npx tsc --noEmit` temiz; `git add components/navbar.tsx app/globals.css components/motion-provider.tsx components/value-band.tsx components/before-after.tsx components/hero-scroll-story.tsx lib/site.ts && git commit -m "pivot: a11y/motion polish — navbar contrast, MotionConfig, icon keys, touch-pan-y, hook flatten"`

---

### Görev 14: CLAUDE.md güncellemesi

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Adım 1: "Business context" bölümündeki pivot paragrafını güncelle**

`CLAUDE.md`de "**ACTIVE SHORT-TERM PIVOT (as of July 2026):**" ile başlayan blok ve altındaki maddeleri şununla değiştir:

```markdown
**ACTIVE SHORT-TERM PIVOT (implemented July 2026):** the site IS now the single-page site of the physical shoe-washing store at Cevizlik Mah. İskele Cd. 15C, Bakırköy (European side — all old "Anadolu Yakası" positioning is gone). Rules locked in the approved spec (`docs/superpowers/specs/2026-07-05-ayakkabi-pivot-design.md`):

- Walk-in only, same-day turnaround ("aynı gün teslim" is THE value prop), open every day 09:00–20:00, cash+card.
- Zero old data: no Çekmeköy, no laundry-era stats (1.500+ orders etc.). Trust is value-prop based until real shoe-order numbers accumulate.
- The old aggregator site was removed (full rebuild decision by owner) — old pages/components/API routes live only in git history; old routes 301 to /. Legal pages (/kvkk, /mesafeli-satis-sozlesmesi) stay live with outdated text until the owner delivers new legal copy.
- Prices are placeholders (`price: null` in lib/site.ts priceMenu) until the owner delivers the menu.
- Master plan (app + aggregator) is NOT cancelled; it is represented on-site only by the coming-soon band.
```

- [ ] **Adım 2: Yapı bölümlerini gerçeğe uydur**

Aynı dosyada "## Architecture", "## SEO layout" ve "## Known gotchas" bölümlerinde artık geçersiz olan satırları güncelle: rota listesi (`/` + 2 yasal sayfa), `lib/site.ts`in yeni içeriği (siteConfig/valueProps/priceMenu/faqs), API rotalarının ve formların kaldırıldığı, `RESEND_API_KEY`in artık kullanılmadığı, dinamik sitemap/robots, redirects. Kısa tut — CLAUDE.md haritadır, spec detay kaynağıdır.

- [ ] **Adım 3: Commit**

```bash
git add CLAUDE.md && git commit -m "pivot: update CLAUDE.md for shoe-wash store site"
```

---

### Görev 15: Son doğrulama + kullanıcı önizlemesi

**Files:** yok

- [ ] **Adım 1: Tam kontrol**

```bash
npx tsc --noEmit
pnpm build
```

Beklenen: ikisi de hatasız. (Not: `pnpm lint` ÇALIŞTIRILMAZ — repoda eslint kurulu/konfigüre değil, komut "command not found" verir; tsc + build kapıyı tutar.)

- [ ] **Adım 2: Redirect + SEO smoke test**

```bash
pnpm start & SERVER_PID=$!
sleep 4
for r in hizmetler nasil-calisir partnerlik sss iletisim; do curl -so /dev/null -w "/$r -> %{http_code} %{redirect_url}\n" http://localhost:3000/$r; done
curl -s http://localhost:3000 | grep -o '<title>[^<]*</title>'
curl -s http://localhost:3000 | grep -o 'application/ld+json' | wc -l
kill $SERVER_PID
```

Beklenen: 5 rota `308` + `http://localhost:3000/`; title `Ayakkabı Yıkama Bakırköy — YIKAT | Aynı Gün Teslim`; JSON-LD sayısı `2`.

- [ ] **Adım 2b: Lighthouse (spec §10)**

Chrome DevTools → Lighthouse → Mobile, `http://localhost:3000` (production `pnpm start` üzerinde). Beklenen: Performance ≥ 90, SEO ≥ 95. Altındaysa en büyük maliyeti raporla ve düzelt (tipik şüpheli: hero katman sayısı/repaint — `will-change: opacity` yalnızca sahne katmanlarına eklenebilir).

- [ ] **Adım 3: Kullanıcı önizlemesi**

Kullanıcıya söyle: `pnpm dev` çalışırken `http://localhost:3000`i incele. Onay gelmeden main'e merge YOK. Geri bildirimler bu planın revizyonu olarak işlenir.

---

## Faz 2 — Asset entegrasyonu (Higgsfield oturumu sonrası; kod hazır, dosya bekliyor)

Bu fazın ön koşulu: yeni Claude oturumunda `/mcp` ile Higgsfield OAuth girişi. Üretilecek set (hepsi aynı kadraj/açı — sabit kamera kuralı):

| Asset | Dosya | Kullanım |
|---|---|---|
| 4 sahne arka planı (sokak, çamurlu zemin, mavi yıkama, şık mekan) | `public/images/hero/bg-{sokak,camur,yikat,temiz}.webp` (1920×1080) + `bg-*-mobile.webp` (828×1104 dikey) | Hero arka plan katmanları (masaüstü/mobil çifti — spec §4 mobil hafif set) |
| 4 ayakkabı durumu (temiz, çamurlu, köpüklü, ışıl ışıl — aynı ayakkabı, aynı açı) | `public/images/hero/shoe-{temiz,camur,kopuk,parlak}.webp` (1024×1024, transparan) | Hero ayakkabı katmanı |
| 2 önce/sonra çifti | `public/images/results/{spor,suet}-{once,sonra}.webp` (1200×900) | BeforeAfter kartları |
| OG görseli | `public/images/og.png` (1200×630) | metadata |
| Statik harita | `public/images/map-bakirkoy.webp` (1200×900) | VisitSection |

### Görev 16: Higgsfield üretimi

- [ ] Yeni oturumda Higgsfield MCP araçlarıyla yukarıdaki tabloyu üret (Soul/tutarlı obje modu; prompt'larda "same shoe, same camera angle, fixed framing" zorunlu). Dosyaları tabloda verilen adlarla kaydet.

### Görev 17: Görselleri bağla

- [ ] `hero-scroll-story.tsx` arka planlar: her sahne katmanı (`motion.div`, zaten `absolute inset-0` — `fill` için geçerli konumlu ebeveyn) içine masaüstü/mobil çifti: `<Image alt="" fill className="hidden object-cover md:block" src="/images/hero/bg-<sahne>.webp" />` + `<Image alt="" fill className="object-cover md:hidden" src="/images/hero/bg-<sahne>-mobile.webp" />`. Gradyan `bg` fallback olarak kalır.
- [ ] `hero-scroll-story.tsx` ayakkabı: emoji `<span>` yerine sabit ölçülü sarmalayıcı `<div className="relative h-[220px] w-[220px] md:h-[300px] md:w-[300px]">` içinde üst üste `<Image alt="" fill className="object-contain" src="/images/hero/shoe-*.webp" />` katmanları (temiz kare hep altta ve opak; `mudOpacity` → çamurlu, `foamOpacity` → köpüklü, `sparkleOpacity` → parlak karenin `motion.div` sarmalayıcısına bağlanır). `shoeFilter` kaldırılır. DİKKAT: `fill` kullanılan her katmanın ebeveyni bu sabit ölçülü `relative` div'dir — aksi halde görsel sayfaya taşar.
- [ ] `before-after.tsx`: `ShoePanel` yerine `<Image>` çiftleri (`CompareCard`ın iki katman div'i zaten `absolute inset-0` — `fill` + `object-cover` doğrudan çalışır); "Temsili görsel" ibaresi gerçek fotoğraf gelene kadar kalır.
- [ ] `visit-section.tsx`: harita kartı `motion.a` zaten `relative overflow-hidden` — içine `<Image src="/images/map-bakirkoy.webp" alt="YIKAT Bakırköy konumu" fill className="object-cover" />`; içindeki metin bloğu görsel üstünde rozet olarak kalır (`relative z-10` ver) ya da kaldırılır.
- [ ] Doğrula: `pnpm build` + görsel kontrol + **Lighthouse tekrarı** (mobil, Performance ≥ 90 — gerçek görseller LCP'yi değiştirir). Not: `images.unoptimized: true` bilinçli olarak kalıyor; görseller zaten önceden boyutlandırılmış WebP. Commit: `pivot: wire higgsfield hero/results/map assets`.

### Görev 18: og:image

- [ ] `app/layout.tsx` openGraph'a ekle: `images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "YIKAT — Ayakkabı Yıkama Bakırköy" }]` ve twitter'a `images: ["/images/og.png"]`. Commit: `pivot: add og image`.

---

## Faz 3 — Sahibinden gelecek içerik (bloklu görevler)

- [ ] Fiyat menüsü gelince: `lib/site.ts` `priceMenu` price alanları doldurulur (ör. `"499 ₺"`), başka değişiklik gerekmez.
- [ ] Yasal metinler gelince: `app/kvkk/page.tsx` ve `app/mesafeli-satis-sozlesmesi/page.tsx` içerikleri değiştirilir.
- [ ] Gerçek önce/sonra fotoğrafları gelince: `public/images/results/*` değiştirilir, "Temsili görsel" ibaresi kaldırılır.
- [ ] Merge onayı: kullanıcı onayıyla `git checkout main && git merge pivot-ayakkabi && git push` (canlıya çıkış).
