# Site Cilası & Motion Paketleri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 4 onaylı motion paketini uygulamak: gerçek before/after (tek kart) + köpük patlaması, su kimliği aksanları, akış/canlılık dokunuşları, RB/MUI vendorlu şerit & rozetler (spec: `docs/superpowers/specs/2026-07-05-site-polish-motion-design.md`).

**Architecture:** React Bits bileşenleri (BlurText, Magnet, CircularText) resmî repodan gerçek kaynak koduyla `components/reactbits/` altına vendorlanır; Magic UI Marquee registry'den `components/ui/` altına alınır. Özel parçalar (köpük ayracı, köpük patlaması, akan çizgi, açık/kapalı nabzı) mevcut framer-motion diliyle yazılır. Hero mimarisi dokunulmaz; her animasyon transform/opacity/filter + reduced-motion güvenli.

**Tech Stack:** Next.js 16, Tailwind v4 (CSS-first, `app/globals.css`), framer-motion (paket adı `framer-motion` — `motion/react` DEĞİL), shadcn/ui, lucide-react. Test altyapısı yok; doğrulama `npx tsc --noEmit` + `pnpm build` + görsel kontrol.

**Kurallar:** Kredi harcaması yok. Her görev sonunda commit. Vendorlanan dosyalarda iç mantık değiştirilmez; yalnız (a) `motion/react` → `framer-motion` import düzeltmesi, (b) marka token/props ayarı yapılabilir — her dosyanın başına kaynak URL + lisans yorum satırı eklenir.

---

## Dosya haritası

| Dosya | Sorumluluk | Görev |
|---|---|---|
| `components/reactbits/blur-text.tsx` (vendor) | kelime bazlı h2 reveal | 1 |
| `components/reactbits/magnet.tsx` (vendor) | CTA mıknatıs sarmalayıcı | 1 |
| `components/reactbits/circular-text.tsx` (vendor) | dönen damga | 1 |
| `components/ui/marquee.tsx` (vendor) | coming-soon şeridi | 1 |
| `app/globals.css` | marquee + ripple keyframe/utility | 2 |
| `components/before-after.tsx` | gerçek görseller, tek kart, köpük patlaması, damga, BlurText h2 | 3 |
| `components/foam-divider.tsx` (yeni) | SVG köpük ayracı | 4 |
| `app/page.tsx` | 2 ayraç yerleşimi | 4 |
| `components/navbar.tsx` | alt ışıltı çizgisi | 4 |
| `components/hero-scroll-story.tsx` | HeroCtas ripple + Magnet | 4 |
| `components/how-it-works.tsx` | akan çizgi + ikon spring + BlurText | 5 |
| `components/visit-section.tsx` | açık/kapalı nabzı + ripple + Magnet + BlurText | 5 |
| `components/faq-section.tsx` | içerik enter reçetesi + BlurText | 5 |
| `components/price-menu.tsx` | BlurText h2 | 5 |
| `components/coming-soon-band.tsx` | Marquee yeniden yazımı | 6 |

Görev sırası bağımlılığı: 1 → 2 → (3,4,5,6 sırayla; hepsi 1-2'ye bağımlı) → 7 doğrulama.

---

### Görev 1: RB/MUI kaynaklarını vendorla (lisans kontrolü dahil)

**Files:**
- Create: `components/reactbits/blur-text.tsx`, `components/reactbits/magnet.tsx`, `components/reactbits/circular-text.tsx`, `components/ui/marquee.tsx`

- [ ] **Adım 1: React Bits lisansını doğrula**

```bash
curl -sL https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md | head -30
```

Beklenen: MIT (veya MIT+attribution). Metinde "Commons Clause", "non-commercial" veya ticari kullanımı kısıtlayan ifade görürsen **DUR ve BLOCKED raporla** (fallback kararı kullanıcının: desen olarak yeniden yazım).

- [ ] **Adım 2: Bileşen dosya yollarını bul**

```bash
curl -sL "https://api.github.com/repos/DavidHDev/react-bits/git/trees/main?recursive=1" \
  | python3 -c "import json,sys; [print(p['path']) for p in json.load(sys.stdin)['tree'] if any(k in p['path'].lower() for k in ('blurtext','magnet','circulartext'))]"
```

TS + Tailwind varyantını seç (yol adında `ts-tailwind` / `tailwind` + `.tsx` geçen). Aday yollar (ağaçta doğrula): `src/ts-tailwind/TextAnimations/BlurText/BlurText.tsx`, `src/ts-tailwind/Animations/Magnet/Magnet.tsx`, `src/ts-tailwind/TextAnimations/CircularText/CircularText.tsx`.

- [ ] **Adım 3: Üçünü raw indir ve vendorla**

Her biri için (BlurText örneği):

```bash
curl -sL "https://raw.githubusercontent.com/DavidHDev/react-bits/main/<AĞAÇTAN-GELEN-YOL>" -o components/reactbits/blur-text.tsx
```

Sonra her dosyanın en üstüne şu başlığı ekle (yolu gerçek yolla doldur):

```tsx
// Vendorlandı: https://github.com/DavidHDev/react-bits — <yol>@main (MIT)
// YIKAT 2026-07-05. İç mantık değiştirilmedi; yalnız import/marka ayarı.
```

İzinli uyarlamalar: `motion/react` importu varsa `framer-motion` yap (motion paketi kurulu değil, API aynı); `"use client"` yoksa dosya başına ekle (App Router).

- [ ] **Adım 4: Magic UI Marquee'yi registry'den al**

```bash
curl -sL "https://magicui.design/r/marquee" -o /tmp/marquee.json
python3 -c "
import json
d = json.load(open('/tmp/marquee.json'))
f = d['files'][0]
open('components/ui/marquee.tsx','w').write(f.get('content') or f.get('code'))
print('yazıldı')"
```

JSON şeması farklıysa (`files` yoksa) `https://magicui.design/r/marquee.json` dene; ikisi de olmazsa BLOCKED raporla. Dosya başına: `// Vendorlandı: https://magicui.design/r/marquee (MIT) — YIKAT 2026-07-05`. İçindeki `import { cn } from "@/lib/utils"` bu repoda mevcut, dokunma.

- [ ] **Adım 5: Derleme kontrolü + commit**

```bash
npx tsc --noEmit
```

Vendor dosyalarından tip hatası gelirse yalnız import/`"use client"` düzeyinde düzelt; mantığa dokunma. Sonra:

```bash
git add components/reactbits/ components/ui/marquee.tsx
git commit -m "feat: vendor react-bits (blur-text, magnet, circular-text) + magicui marquee"
```

Rapora ekle: her bileşenin gerçek export şekli (default mı named mı) ve prop isimleri — sonraki görevler bunu kullanacak. (Plan sonraki görevlerde `BlurText` default export + `text/delay/animateBy/className` propları, `Magnet` default export, `CircularText` default export varsayar; farklıysa çağrı yerlerini gerçek API'ye uyarla ve raporla.)

---

### Görev 2: globals.css — marquee + ripple

**Files:**
- Modify: `app/globals.css` (dosya sonuna ekle)

- [ ] **Adım 1: Keyframe ve utility'leri ekle**

`app/globals.css` sonuna aynen ekle:

```css
/* --- Site cilası: marquee (MUI) + CTA ripple (su kimliği) --- */
@theme inline {
  --animate-marquee: marquee var(--duration, 40s) linear infinite;
  --animate-marquee-vertical: marquee-vertical var(--duration, 40s) linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% - var(--gap, 1rem))); }
}
@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% - var(--gap, 1rem))); }
}

/* CTA ripple: tıklama anında içten dışa tek su halkası. Saf CSS — yüksek frekanslı öğede JS yok. */
.cta-ripple { position: relative; overflow: hidden; }
.cta-ripple::after {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: 130%;
  aspect-ratio: 1;
  border-radius: 9999px;
  background: radial-gradient(circle, rgb(255 255 255 / 0.45) 0%, transparent 62%);
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
}
.cta-ripple:active::after { animation: cta-ripple 420ms ease-out; }
@keyframes cta-ripple {
  0% { transform: scale(0); opacity: 0.85; }
  100% { transform: scale(1.7); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .cta-ripple:active::after { animation: none; }
}
```

- [ ] **Adım 2: Build kontrolü + commit**

```bash
pnpm build 2>&1 | tail -3
git add app/globals.css
git commit -m "feat: marquee keyframes + cta ripple utility"
```

---

### Görev 3: Before/After — gerçek görseller, tek kart, köpük patlaması, damga

**Files:**
- Modify: `components/before-after.tsx` (tam yeniden yazım aşağıda)
- Görseller hazır: `public/images/results/spor-{once,sonra}.webp` (commit'li)

- [ ] **Adım 1: Dosyayı aşağıdaki içerikle değiştir**

(`CircularText` prop adları Görev 1 raporundaki gerçek API'ye göre uyarlanabilir — hedef: ~96px, 30s'de tam tur, `md+` görünür.)

```tsx
"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronsLeftRight } from "lucide-react"
import BlurText from "@/components/reactbits/blur-text"
import CircularText from "@/components/reactbits/circular-text"

type Bubble = { id: number; xPct: number; topPct: number; size: number }

function CompareCard({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(50)
  const dragging = useRef(false)
  const prefersReduced = useReducedMotion()

  // Köpük patlaması: yalnız pointer sürüklemesinde, 70ms throttle, ≤12 eşzamanlı kabarcık.
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const lastSpawn = useRef(0)
  const bubbleId = useRef(0)

  const spawnBubbles = useCallback(
    (xPct: number) => {
      if (prefersReduced) return
      const now = performance.now()
      if (now - lastSpawn.current < 70) return
      lastSpawn.current = now
      setBubbles((prev) => {
        const fresh: Bubble[] = Array.from({ length: 2 }, () => ({
          id: bubbleId.current++,
          xPct: xPct + (Math.random() - 0.5) * 6,
          topPct: 18 + Math.random() * 60,
          size: 5 + Math.random() * 9,
        }))
        return [...prev, ...fresh].slice(-12)
      })
    },
    [prefersReduced],
  )

  const updateFromClientX = useCallback(
    (clientX: number, spawn: boolean) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const next = ((clientX - rect.left) / rect.width) * 100
      const clamped = Math.min(95, Math.max(5, next))
      setPct(clamped)
      if (spawn) spawnBubbles(clamped)
    },
    [spawnBubbles],
  )

  return (
    <div>
      <div
        ref={ref}
        role="slider"
        aria-label={`${label} — kirli/temiz karşılaştırma`}
        aria-valuemin={5}
        aria-valuemax={95}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`%${Math.round(pct)} kirli görünümde`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPct((p) => Math.max(5, p - 5))
          if (e.key === "ArrowRight") setPct((p) => Math.min(95, p + 5))
        }}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          updateFromClientX(e.clientX, true)
        }}
        onPointerMove={(e) => dragging.current && updateFromClientX(e.clientX, true)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-3xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {/* Alt katman: temiz (YIKAT sonrası) */}
        <Image alt="" fill sizes="(min-width: 768px) 672px, 100vw" className="object-cover" src="/images/results/spor-sonra.webp" />
        {/* Üst katman: kirli — clip-path ile soldan pct% görünür */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          <Image alt="" fill sizes="(min-width: 768px) 672px, 100vw" className="object-cover" src="/images/results/spor-once.webp" />
        </div>
        {/* Köpük patlaması */}
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.span
              key={b.id}
              aria-hidden
              initial={{ opacity: 0.95, y: 0, scale: 0.4 }}
              animate={{ opacity: 0, y: -46, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() => setBubbles((prev) => prev.filter((x) => x.id !== b.id))}
              className="pointer-events-none absolute z-20 rounded-full bg-white/85 shadow-[0_0_6px_rgba(255,255,255,0.6)]"
              style={{ left: `${b.xPct}%`, top: `${b.topPct}%`, width: b.size, height: b.size }}
            />
          ))}
        </AnimatePresence>
        {/* Ayırıcı çizgi + tutamaç */}
        <div className="absolute inset-y-0 z-10" style={{ left: `${pct}%` }}>
          <div className="h-full w-0.5 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(4,44,83,0.4)]" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-navy shadow-md">
            <ChevronsLeftRight className="size-3.5" />
          </div>
        </div>
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#8a6237] px-2.5 py-0.5 text-xs font-bold text-white">
          KİRLİ
        </span>
        <span className="absolute right-3 top-3 z-10 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">
          TEMİZ
        </span>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">{label} · Temsili görsel</p>
    </div>
  )
}

export function BeforeAfter() {
  return (
    <section id="sonuclar" className="relative scroll-mt-20 bg-muted py-20 sm:py-28">
      {/* Dönen damga — md+ (mobilde kalabalık) */}
      <div aria-hidden className="pointer-events-none absolute right-8 top-8 hidden text-amber-700 md:block lg:right-16">
        <CircularText text="AYNI GÜN TESLİM • YIKAT • AYNI GÜN TESLİM • " spinDuration={30} className="size-24 text-[11px] font-bold tracking-widest" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BlurText
          as="h2"
          text="Farkı kendin gör"
          animateBy="words"
          delay={60}
          className="justify-center text-center text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Çizgiyi sürükle — sol kirli, sağ YIKAT sonrası.
        </p>
        <div className="mx-auto mt-12 max-w-2xl">
          <CompareCard label="Spor ayakkabı" />
        </div>
      </div>
    </section>
  )
}
```

Not: `BlurText`'in `as` propu yoksa (Görev 1 raporuna bak) başlığı şöyle sar: `<h2 className="text-center ..."><BlurText text="Farkı kendin gör" ... /></h2>` — görsel sonuç aynı olsun; sayfada h2 sayısı değişmemeli.

- [ ] **Adım 2: Doğrula + commit**

```bash
npx tsc --noEmit && pnpm build 2>&1 | tail -3
git add components/before-after.tsx
git commit -m "feat: real before/after single card + foam burst + spinning badge"
```

---

### Görev 4: Su kimliği — köpük ayracı, navbar ışıltısı, CTA ripple + Magnet

**Files:**
- Create: `components/foam-divider.tsx`
- Modify: `app/page.tsx`, `components/navbar.tsx`, `components/hero-scroll-story.tsx`

- [ ] **Adım 1: FoamDivider bileşenini yaz**

`components/foam-divider.tsx` (tam içerik):

```tsx
"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Köpük bölüm ayracı (su kimliği): dalga + kabarcık kenarı. Rengi currentColor'dan alır —
// kullanım: <FoamDivider className="text-muted" /> (alttaki bölümün zemin rengi verilir).
// flip: ayracı dikeyde aynalar (muted bölümden açık bölüme geçerken).
export function FoamDivider({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div aria-hidden className={cn("relative -mb-px h-10 overflow-hidden sm:h-14", flip && "rotate-180", className)}>
      <motion.svg
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.3 }}
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full fill-current"
      >
        <path d="M0,56 L0,34 C80,22 160,42 240,36 C320,30 400,14 480,20 C560,26 640,44 720,40 C800,36 880,18 960,22 C1040,26 1120,40 1200,32 L1200,56 Z" />
        <circle cx="150" cy="26" r="5" />
        <circle cx="245" cy="18" r="3" />
        <circle cx="470" cy="10" r="4" />
        <circle cx="530" cy="18" r="2.5" />
        <circle cx="760" cy="24" r="5" />
        <circle cx="915" cy="10" r="3" />
        <circle cx="1060" cy="20" r="4" />
      </motion.svg>
    </div>
  )
}
```

- [ ] **Adım 2: page.tsx yerleşimi**

`app/page.tsx`'te import ekle: `import { FoamDivider } from "@/components/foam-divider"` ve `<main>` içini şöyle güncelle (yalnız iki ayraç eklenir, sıra değişmez):

```tsx
<main>
  <HeroScrollStory />
  <FoamDivider className="text-muted" />
  <ValueBand />
  <HowItWorks />
  <BeforeAfter />
  <FoamDivider flip className="text-muted" />
  <PriceMenu />
  <VisitSection />
  <FaqSection />
  <ComingSoonBand />
</main>
```

(İlk ayraç: beyaz hero altından muted value-band'e köpük yükselir. İkinci: muted before-after'dan beyaz price-menu'ye — flip ile muted köpük aşağı sarkar; ayraç `text-muted` kalır çünkü iki durumda da muted rengi çiziyoruz.)

- [ ] **Adım 3: Navbar alt ışıltı çizgisi**

`components/navbar.tsx`'te `<header className={cn("fixed ...` öğesinin İÇİNE, `<nav ...>`'dan önce ekle (header zaten positioned — `fixed`):

```tsx
<span
  aria-hidden
  className={cn(
    "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-300",
    solid ? "opacity-100" : "opacity-0",
  )}
/>
```

Mevcut blur/bg davranışına dokunma (ıslak cam zaten var).

- [ ] **Adım 4: HeroCtas — ripple + Magnet**

`components/hero-scroll-story.tsx`'te: import ekle `import Magnet from "@/components/reactbits/magnet"` ve `HeroCtas` gövdesini şöyle güncelle (Button className'lerine `cta-ripple` eklenir, birincil CTA Magnet'e sarılır; Magnet prop adlarını Görev 1 raporuna göre uyarla — hedef ≤8px kayma):

```tsx
export function HeroCtas({ eventPrefix }: { eventPrefix: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Magnet padding={40} magnetStrength={12}>
        <Button asChild size="lg" className="cta-ripple rounded-full">
          <a
            href={siteConfig.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(`${eventPrefix}_directions_click`)}
          >
            <MapPin className="size-4" /> Yol Tarifi Al
          </a>
        </Button>
      </Magnet>
      <Button asChild size="lg" variant="outline" className="cta-ripple rounded-full bg-background/70">
        <a href={siteConfig.phoneHref} onClick={() => track(`${eventPrefix}_call_click`)}>
          <Phone className="size-4" /> {siteConfig.phone}
        </a>
      </Button>
    </div>
  )
}
```

(Magnet dokunmatikte kendiliğinden etkisiz — mousemove yok; ekstra gate gerekmez. `magnetStrength` RB'de "böl" katsayısıdır: büyük değer = az kayma; 8px hedefi için değeri raporlanan API'ye göre seç.)

- [ ] **Adım 5: Doğrula + commit**

```bash
npx tsc --noEmit && pnpm build 2>&1 | tail -3
git add components/foam-divider.tsx app/page.tsx components/navbar.tsx components/hero-scroll-story.tsx
git commit -m "feat: foam dividers, navbar shimmer line, cta ripple + magnet"
```

---

### Görev 5: Akış & canlılık — how-it-works çizgisi, açık/kapalı nabzı, FAQ cilası

**Files:**
- Modify: `components/how-it-works.tsx`, `components/visit-section.tsx`, `components/faq-section.tsx`, `components/price-menu.tsx`

- [ ] **Adım 1: how-it-works — akan çizgi + ikon spring + BlurText**

Dosyayı şu içerikle değiştir:

```tsx
"use client"

import { motion } from "framer-motion"
import { Clock, Footprints, Sparkles } from "lucide-react"
import BlurText from "@/components/reactbits/blur-text"

const STEPS = [
  { no: "01", icon: Footprints, title: "Getir", text: "Ayakkabını dükkana bırak. İki dakikanı alır." },
  { no: "02", icon: Sparkles, title: "Yıkayalım", text: "Malzemesine uygun yöntemle derin temizlik yapalım." },
  { no: "03", icon: Clock, title: "Aynı gün teslim al", text: "Akşam 20:00'ye kadar tertemiz hazır. Beklerken Bakırköy çarşıda işini gör." },
] as const

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BlurText
          text="Üç adımda, aynı gün"
          animateBy="words"
          delay={60}
          className="justify-center text-center text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <div className="relative mt-12">
          {/* Akan çizgi (md+): kartların ikon hizasında, soldan sağa dolar — "Getir → Yıkayalım → Teslim al" akışı */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="pointer-events-none absolute left-[14%] right-[14%] top-[52px] hidden h-0.5 origin-left rounded-full bg-gradient-to-r from-primary/50 via-primary/25 to-primary/50 md:block"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.no}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative rounded-3xl border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.6, delay: 0.2 + i * 0.3 }}
                    className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary"
                  >
                    <s.icon className="size-5" />
                  </motion.div>
                  <span className="text-sm font-semibold text-muted-foreground">{s.no}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

(BlurText h2 uyarlaması Görev 3'teki notla aynı: `as="h2"` yoksa `<h2>` ile sar. İkon delay'i 0.2+0.3i — çizginin o karta varış anına yaklaşık senkron.)

- [ ] **Adım 2: visit-section — açık/kapalı nabzı + ripple + Magnet + BlurText**

Dosyada şu değişiklikleri yap:

(a) importlara ekle:

```tsx
import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import BlurText from "@/components/reactbits/blur-text"
import Magnet from "@/components/reactbits/magnet"
```

(b) dosyaya (export'tan önce) şu bileşeni ekle:

```tsx
// Gerçek İstanbul saatine göre açık/kapalı durumu. SSR + ilk render nötr metin basar
// (hydration uyuşmazlığı olmaz); durum yalnız mount sonrası hesaplanır.
function OpenStatus() {
  const prefersReduced = useReducedMotion()
  const [status, setStatus] = useState<"unknown" | "open" | "closed">("unknown")

  useEffect(() => {
    const compute = () => {
      const hour = Number(
        new Intl.DateTimeFormat("tr-TR", { hour: "numeric", hour12: false, timeZone: "Europe/Istanbul" }).format(new Date()),
      )
      setStatus(hour >= 9 && hour < 20 ? "open" : "closed")
    }
    compute()
    const id = setInterval(compute, 60_000)
    return () => clearInterval(id)
  }, [])

  if (status === "unknown") return <span>{siteConfig.hours.label}</span>

  return (
    <span className="flex flex-col gap-1">
      <span>{siteConfig.hours.label}</span>
      <span className="flex items-center gap-2 text-sm">
        <span className="relative flex size-2.5">
          {status === "open" && !prefersReduced && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 [animation-duration:2s]" />
          )}
          <span className={`relative inline-flex size-2.5 rounded-full ${status === "open" ? "bg-emerald-400" : "bg-white/40"}`} />
        </span>
        {status === "open" ? (
          <span className="text-emerald-300">Şu an açık — 20:00'ye kadar bırakabilirsin</span>
        ) : (
          <span className="text-white/70">Şu an kapalı — yarın 09:00'da açılıyor</span>
        )}
      </span>
    </span>
  )
}
```

(c) `<Clock ...>` satırındaki `<span>{siteConfig.hours.label}</span>` → `<OpenStatus />`.

(d) h2'yi BlurText'e çevir (koyu zeminde beyaz kalır): `<BlurText text="Dükkana bekleriz" animateBy="words" delay={60} className="text-3xl font-semibold tracking-tight md:text-4xl" />` (as="h2" notu geçerli).

(e) İki CTA Button'ına `cta-ripple` sınıfı ekle; birincil (Yol Tarifi Al) Button'ı `<Magnet padding={40} magnetStrength={12}>...</Magnet>` ile sar (Görev 4'teki HeroCtas kalıbıyla aynı).

- [ ] **Adım 3: faq-section — içerik enter reçetesi + BlurText**

(a) h2 → BlurText (aynı kalıp, `text="Sıkça sorulan sorular"`).
(b) `AccordionContent` içeriğini Jakub enter reçetesiyle sar:

```tsx
<AccordionContent className="text-muted-foreground">
  <motion.div
    initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {f.a}
  </motion.div>
</AccordionContent>
```

(Radix content her açılışta mount olur → animate her açılışta oynar; MotionConfig reduced-motion'ı halleder.)

- [ ] **Adım 4: price-menu — yalnız h2 BlurText**

h2'yi aynı BlurText kalıbına çevir (`text="Fiyat menüsü"`); başka değişiklik yok.

- [ ] **Adım 5: Doğrula + commit**

```bash
npx tsc --noEmit && pnpm build 2>&1 | tail -3
git add components/how-it-works.tsx components/visit-section.tsx components/faq-section.tsx components/price-menu.tsx
git commit -m "feat: flow line, open-now pulse, faq enter polish, blurtext headings"
```

---

### Görev 6: Coming-soon Marquee

**Files:**
- Modify: `components/coming-soon-band.tsx` (tam yeniden yazım)

- [ ] **Adım 1: Dosyayı değiştir**

```tsx
import { Marquee } from "@/components/ui/marquee"

// Master plan (uygulama + kapıdan alım) sinyali — sessiz akan hizmet şeridi.
// Erişilebilirlik: tam cümle aria-label'da; akan kopya dekoratif (aria-hidden Marquee içinde).
const SERVICES = ["Kapıdan alım", "Kuru temizleme", "Çamaşır", "Ütü", "Hacimli tekstil"]

export function ComingSoonBand() {
  return (
    <section
      aria-label="Kapıdan alım ve tüm tekstil bakımı, YIKAT uygulamasıyla yakında."
      className="border-y bg-muted py-4"
    >
      <div aria-hidden className="relative mx-auto max-w-6xl overflow-hidden motion-reduce:overflow-x-auto">
        <Marquee pauseOnHover className="[--duration:36s] motion-reduce:[&_*]:!animate-none">
          {SERVICES.map((s) => (
            <span key={s} className="mx-6 flex items-center gap-2 text-sm text-muted-foreground">
              {s}
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                yakında
              </span>
            </span>
          ))}
          <span className="mx-6 text-sm font-semibold text-foreground">YIKAT uygulamasıyla</span>
        </Marquee>
        {/* Kenar yumuşatma */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-muted to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-muted to-transparent" />
      </div>
    </section>
  )
}
```

(Vendorlanan Marquee `"use client"` içeriyorsa bu dosya server component kalabilir; Marquee named export değilse importu gerçek export'a uyarla.)

- [ ] **Adım 2: Doğrula + commit**

```bash
npx tsc --noEmit && pnpm build 2>&1 | tail -3
git add components/coming-soon-band.tsx
git commit -m "feat: coming-soon services marquee"
```

---

### Görev 7: Doğrulama + code review + doküman senkronu

- [ ] **Adım 1: Tam doğrulama**

```bash
npx tsc --noEmit && pnpm build 2>&1 | tail -3
```

Dev sunucuda (localhost:3001) görsel tur: (1) navbar scroll ışıltısı, (2) köpük ayraçları iki noktada, (3) how-it-works çizgi+ikon senkronu, (4) before/after gerçek görseller + sürüklemede kabarcıklar + dönen damga (md+), (5) fiyat/visit/faq başlık reveal'leri, (6) visit'te açık/kapalı satırı (saat 09-20 ise yeşil nabız), (7) CTA'da tıklama ripple + hover mıknatıs, (8) coming-soon şeridi akışı ve hover'da durması.

- [ ] **Adım 2: Reduced-motion smoke testi**

DevTools → Rendering → `prefers-reduced-motion: reduce`: kabarcık yok, nabız statik, marquee durur/statik, BlurText düz görünür, ripple oynamaz. 

- [ ] **Adım 3: Lighthouse gerilemesi yok**

```bash
npx lighthouse http://localhost:3002 --only-categories=performance --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless" 2>&1 | tail -5
```

(Önce `pnpm build && npx next start -p 3002`.) Taban: 82. 79 altına düşerse nedenini bul (muhtemel şüpheli: marquee'nin sonsuz animasyonu — content-visibility veya viewport-pause değerlendir), raporla.

- [ ] **Adım 4: Code review**

superpowers:requesting-code-review ile Görev 1-6 diff'ini incelet; Important+ bulguları düzelt, commit'le.

- [ ] **Adım 5: Doküman senkronu + commit**

- `CLAUDE.md`: Section components listesine `foam-divider`, `components/reactbits/*` (vendor, kaynak+lisans başlıkları içerir) ve `components/ui/marquee` notu; before-after satırını güncelle ("tek kart, gerçek AI-türetilmiş çift; ikinci kart gerçek fotoğraf bekliyor"); "Known gotchas"taki before-after emoji maddesini kaldır.
- `docs/superpowers/plans/2026-07-05-ayakkabi-pivot.md` Faz 3: "gerçek önce/sonra fotoğrafları gelince" maddesine "(şimdilik tek kart AI-türetilmiş çiftle canlı; ikinci kart fotoğrafla eklenecek)" notu.

```bash
git add CLAUDE.md docs/superpowers/plans/2026-07-05-ayakkabi-pivot.md
git commit -m "docs: sync CLAUDE.md and pivot plan with polish packages"
```
