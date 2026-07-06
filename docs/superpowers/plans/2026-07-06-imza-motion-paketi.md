# İmza Motion Paketi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** BubbleCursor (site-geneli fısıltı dozunda sabun baloncuğu imleç izi) + Hero ScrollFloat (sahne 1-3 başlıklarında scrub'lı karakter süzülmesi) + Liquid-Glass PillNav (yüzen cam hap navigasyon) — üçü de temiz-oda, sıfır yeni bağımlılık.

**Architecture:** Spec: `docs/superpowers/specs/2026-07-06-imza-motion-paketi-design.md`. BubbleCursor imperatif DOM + CSS keyframe (rAF yok, spawn başına render yok). ScrollFloat karakter-başına `useTransform`'lu `FloatChar` alt bileşenleri (hook disiplini), hero'nun mevcut WINDOWS pencerelerine bağlı. PillNav mevcut navbar'ın cam katmanlarını yüzen hap biçimine taşır; `layoutId`'li vurgu hapı hover/aktif bölüme akar.

**Tech Stack:** Next.js 16, React 19, framer-motion 11, Tailwind v4 (CSS-first, app/globals.css). Test suite yok — doğrulama `npx tsc --noEmit` + `pnpm build` + scratchpad'deki playwright-core headless sürüşü (sistem Chrome, `executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`, dev sunucu 3001'e düşer çünkü 3000 dolu).

**Ortak kurallar:** RB kaynağı kopyalanmaz; dosya başı ilham atfı. Karakter span'leri `inline-block whitespace-pre`. Reduced-motion: JS kapısı + CSS kemeri. SVG displacement yasak.

---

### Task 1: BubbleCursor

**Files:**
- Create: `components/bubble-cursor.tsx`
- Modify: `app/globals.css` (dosya sonuna ekle)
- Modify: `app/page.tsx` (import + mount)

- [ ] **Step 1.1: Bileşeni yaz**

`components/bubble-cursor.tsx`:

```tsx
"use client"

// reactbits.dev imleç-izi ailesinden (TextCursor vb.) konsept ilhamıyla temiz-oda yazım (RB lisansı
// MIT+Commons Clause olduğundan kaynak kopyalanmadı). İz öğesi metin değil, marka kimliğinin (su/köpük)
// sabun baloncuğu. İmperatif DOM: spawn başına React render yok, rAF döngüsü yok — imleç durunca
// maliyet sıfır. Yalnız (hover:hover)+(pointer:fine) + reduced-motion kapalı + gerçek farede var olur.
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

const SPAWN_DISTANCE = 90 // bu kadar px imleç yolu başına 1 baloncuk (fısıltı dozu)
const MAX_BUBBLES = 10 // eşzamanlı tavan — doluysa spawn atlanır

export function BubbleCursor() {
  const prefersReduced = useReducedMotion()
  const [finePointer, setFinePointer] = useState(false)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    setFinePointer(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setFinePointer(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const enabled = finePointer && !prefersReduced

  useEffect(() => {
    if (!enabled) return
    const layer = layerRef.current
    if (!layer) return
    let last: { x: number; y: number } | null = null
    let travelled = 0

    const spawn = (x: number, y: number) => {
      if (layer.childElementCount >= MAX_BUBBLES) return
      const size = 6 + Math.random() * 8
      const b = document.createElement("span")
      b.className = "cursor-bubble"
      b.style.width = `${size}px`
      b.style.height = `${size}px`
      b.style.left = `${x + (Math.random() * 16 - 8)}px`
      b.style.top = `${y + (Math.random() * 16 - 8)}px`
      b.style.animationDuration = `${1100 + Math.random() * 300}ms`
      b.addEventListener("animationend", () => b.remove())
      layer.appendChild(b)
    }

    const onMove = (e: PointerEvent) => {
      // Hibrit cihaz guard'ı (spotlight-card emsali): parmak/kalem izi bırakmaz.
      if (e.pointerType !== "mouse") return
      if (last) {
        travelled += Math.hypot(e.clientX - last.x, e.clientY - last.y)
        if (travelled >= SPAWN_DISTANCE) {
          travelled = 0
          spawn(e.clientX, e.clientY)
        }
      }
      last = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      layer.replaceChildren()
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden motion-reduce:hidden"
    />
  )
}
```

- [ ] **Step 1.2: CSS'i ekle**

`app/globals.css` dosya sonuna (`.shine-band` bloğundan sonra):

```css
/* BubbleCursor (RB imleç-izi ailesinden konsept ilhamı, temiz-oda): imleç yolunda sabun baloncuğu.
   transform+opacity-only; animationend'de node JS'le silinir. Çift halka (beyaz + primer) hem açık
   hem navy zeminde okunur. */
.cursor-bubble {
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
  border: 1px solid rgb(255 255 255 / 0.5);
  box-shadow: 0 0 0 1px rgb(74 140 255 / 0.15), inset 0 0 4px rgb(255 255 255 / 0.3);
  background: radial-gradient(circle at 30% 30%, rgb(255 255 255 / 0.55), rgb(255 255 255 / 0) 45%),
    radial-gradient(circle, rgb(74 140 255 / 0.1), rgb(74 140 255 / 0.04));
  opacity: 0;
  transform: translateY(0) scale(0.6);
  animation: bubble-rise 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  will-change: transform, opacity;
}
@keyframes bubble-rise {
  12% { opacity: 0.8; }
  100% { opacity: 0; transform: translateY(-36px) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .cursor-bubble { display: none; }
}
```

- [ ] **Step 1.3: Mount et**

`app/page.tsx`: import listesine `import { BubbleCursor } from "@/components/bubble-cursor"` ekle; JSX'te `<MotionProvider>` açılışının hemen ardından, `<Navbar />` üstüne `<BubbleCursor />` satırı ekle.

- [ ] **Step 1.4: Doğrula**

Run: `npx tsc --noEmit` → çıktı boş (exit 0).
Headless sürüş (dev sunucu 3001'de, scratchpad drive deseni): `mouse.move` ile ~600px zikzak → `document.querySelectorAll(".cursor-bubble").length` 1..10 arasında; 2 sn bekleyince 0 (animationend temizliği). Reduced-motion context'te `.cursor-bubble` hiç oluşmaz ve overlay div yok.

- [ ] **Step 1.5: Commit**

```bash
git add components/bubble-cursor.tsx app/globals.css app/page.tsx
git commit -m "feat: bubble cursor — fısıltı dozunda sabun baloncuğu imleç izi (clean-room)"
```

---

### Task 2: Hero ScrollFloat

**Files:**
- Create: `components/scroll-float-text.tsx`
- Modify: `components/hero-scroll-story.tsx:235-258` (sahne metin bloğu)

- [ ] **Step 2.1: Bileşeni yaz**

`components/scroll-float-text.tsx`:

```tsx
"use client"

// reactbits.dev ScrollFloat deseninden ilhamla temiz-oda yazım (RB lisansı MIT+Commons Clause
// olduğundan kaynak kopyalanmadı; orijinal gsap+ScrollTrigger tabanlıydı — framer-motion'a yeniden
// tasarlandı). Yumuşatılmış doz: squash-stretch (scaleY 2.3) ve back-overshoot bilinçle yok;
// karakterler verilen scroll penceresine scrub'lı, kademeli süzülür. Hook disiplini: karakter başına
// hook'lar FloatChar alt bileşeninde yaşar (sabit text → sabit eleman sayısı).
import { motion, useTransform, type MotionValue } from "framer-motion"

type ScrollFloatTextProps = {
  text: string
  progress: MotionValue<number>
  /** Kaskadın yaşadığı scroll penceresi (progress 0-1 uzayında): [girişBaşı, tamGörünür]. */
  range: readonly [number, number]
}

function FloatChar({
  char,
  progress,
  from,
  to,
}: {
  char: string
  progress: MotionValue<number>
  from: number
  to: number
}) {
  const y = useTransform(progress, [from, to], ["0.6em", "0em"])
  const opacity = useTransform(progress, [from, to], [0, 1])
  const scaleY = useTransform(progress, [from, to], [1.12, 1])
  return (
    // whitespace-pre: inline-block span sondaki boşluğu kırpar (2026-07-06 BlurText dersi).
    <motion.span className="inline-block origin-bottom whitespace-pre" style={{ y, opacity, scaleY }}>
      {char}
    </motion.span>
  )
}

export function ScrollFloatText({ text, progress, range }: ScrollFloatTextProps) {
  const chars = Array.from(text)
  const [start, end] = range
  const windowSize = end - start
  // Her karakter pencerenin %55'ini kullanır; başlangıç anları kalan %45'e eşit yayılır —
  // son karakter tam `end`'de yerine oturur (blok, sahnenin "tam görünür" anıyla senkron).
  const charSpan = windowSize * 0.55
  const step = chars.length > 1 ? (windowSize - charSpan) / (chars.length - 1) : 0
  return (
    <>
      {/* Ekran okuyucu bütün metni buradan okur; animasyonlu span'ler dekoratif.
          (aria-label <p> üzerinde güvenilmez — blur-text.tsx'teki not.) */}
      <span className="sr-only">{text}</span>
      <span aria-hidden className="contents">
        {chars.map((c, i) => (
          <FloatChar
            key={`${c}-${i}`}
            char={c}
            progress={progress}
            from={start + i * step}
            to={start + i * step + charSpan}
          />
        ))}
      </span>
    </>
  )
}
```

- [ ] **Step 2.2: Hero'ya bağla**

`components/hero-scroll-story.tsx`:

1. Import ekle: `import { ScrollFloatText } from "@/components/scroll-float-text"`
2. Sahne metin bloğunda (satır ~236) blok stilinden `filter` kaldırılır, blur YALNIZ alt metne iner ve sahne 1-3 başlık içeriği ScrollFloatText olur:

```tsx
{SCENES.map((scene, i) => (
  <motion.div
    key={scene.key}
    className="col-start-1 row-start-1"
    style={{ opacity: textOpacities[i], y: textYs[i] }}
  >
    {i === 0 ? (
      <h1 className={`text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl ${LIGHT_SHADOW}`}>
        {scene.title}
      </h1>
    ) : (
      <p
        className={`text-balance text-4xl font-semibold tracking-tight md:text-5xl ${
          scene.dark ? `text-white ${DARK_SHADOW}` : `text-foreground ${LIGHT_SHADOW}`
        }`}
      >
        {/* Karakter kaskadı sahnenin giriş penceresinde ([fadeInStart, fullStart]) yaşar. */}
        <ScrollFloatText text={scene.title} progress={scrollYProgress} range={[WINDOWS[i][0], WINDOWS[i][1]]} />
      </p>
    )}
    {/* Blur bloğun tamamından alt metne indi: karakter kaskadı parent filter altında çamurlaşmasın.
        Sahne 0'ın blur'u sabit blur(0px) — bağlamak zararsız, hook sırası sabit kalır. */}
    <motion.p
      style={{ filter: textBlurs[i] }}
      className={`mt-3 text-lg ${scene.dark ? `text-white/85 ${DARK_SHADOW}` : `text-muted-foreground ${LIGHT_SHADOW}`}`}
    >
      {scene.sub}
    </motion.p>
  </motion.div>
))}
```

(Not: eski kodda başlık+sub tek `motion.div` içindeydi ve `filter: textBlurs[i]` blok stilindeydi; tek değişen bu ikisi. `textBlurs` hook'ları aynen kalır.)

- [ ] **Step 2.3: Doğrula**

Run: `npx tsc --noEmit` → boş.
Headless sürüş: sayfayı hero içinde kademeli scroll'la (`window.scrollTo(0, h*0.3)` vb.), her sahne anında ekran görüntüsü al ve BAK: karakterler kademeli süzülüyor mu, "Aynı gün tertemiz teslim." mobil genişlikte (390px viewport) düzgün sarıyor mu (çirkinse kelime-bazı fallback: `Array.from(text)` yerine `text.split(/(?<= )/)`). `sr-only` metnin DOM'da olduğunu doğrula.

- [ ] **Step 2.4: Commit**

```bash
git add components/scroll-float-text.tsx components/hero-scroll-story.tsx
git commit -m "feat: hero başlıklarına scrub'lı karakter süzülmesi (ScrollFloat clean-room, yumuşatılmış doz)"
```

---

### Task 3: Liquid-Glass PillNav

**Files:**
- Modify: `components/navbar.tsx` (tam yeniden biçim — dosya değişir, export adı `Navbar` kalır)

- [ ] **Step 3.1: Navbar'ı yüzen hapa dönüştür**

`components/navbar.tsx` tam içerik:

```tsx
"use client"

// Liquid-glass PillNav — reactbits.dev PillNav deseninden konsept ilhamıyla temiz-oda biçim
// (bileşen MCP kataloğunda yok; kaynak kopyalanmadı). Cam dili önceki full-width navbar'ın
// kanıtlanmış katmanları: blur+saturate iki yoğunluk, rim ışığı, üst sheen. Ağır SVG displacement
// bilinçle yok — hero videosu üstünde her frame yeniden hesaplanıp jank yaratırdı.
// "Liquid" davranış: link grubunun arkasındaki tek vurgu hapı layoutId ile hover/aktif bölüme akar.
import { useEffect, useRef, useState } from "react"
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
  const [active, setActive] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const visibleIds = useRef(new Set<string>())
  const solid = scrolled || open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // Aktif bölüm takibi: viewport ortasındaki dar bantla kesişen anchor hedefi kazanır;
  // hiçbiri kesişmiyorsa (hero, footer) vurgu hapı görünmez.
  useEffect(() => {
    const targets = NAV_LINKS.map((l) => document.querySelector<HTMLElement>(l.href)).filter(
      (t): t is HTMLElement => t !== null,
    )
    if (!targets.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = `#${e.target.id}`
          if (e.isIntersecting) visibleIds.current.add(id)
          else visibleIds.current.delete(id)
        }
        setActive(NAV_LINKS.map((l) => l.href).find((h) => visibleIds.current.has(h)) ?? null)
      },
      { rootMargin: "-40% 0px -55% 0px" },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  const glass: React.CSSProperties = solid
    ? {
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        background: "rgba(255,255,255,0.75)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.65), inset 0 -1px 0 0 rgba(255,255,255,0.15), 0 8px 30px rgba(4,44,83,0.12)",
      }
    : {
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)",
        background: "rgba(255,255,255,0.35)",
        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.5), 0 4px 20px rgba(4,44,83,0.08)",
      }

  const liquidTarget = hovered ?? active

  return (
    <header className="fixed inset-x-3 top-3 z-50 md:inset-x-0 md:mx-auto md:w-fit">
      <div
        style={glass}
        className={cn(
          "relative overflow-hidden rounded-full border transition-all duration-300",
          solid ? "border-white/50" : "border-white/25",
        )}
      >
        {/* Cam sheeni: üst yarıda ince ışıma (liquid glass speküler yüzeyi) */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-full bg-gradient-to-b from-white/25 to-transparent" />
        {/* Alt specular çizgi — kaydırınca belirir */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-300",
            solid ? "opacity-100" : "opacity-0",
          )}
        />
        <nav className="relative z-10 flex h-12 items-center gap-1 pl-4 pr-2 md:gap-2">
          <Link href="/" aria-label="YIKAT ana sayfa" className="flex items-center gap-2 pr-1">
            <Image src="/images/yikat-logo-blue.png" alt="" width={24} height={24} priority className="size-6" />
            <span className="text-base font-semibold tracking-tight text-foreground">YIKAT</span>
          </Link>

          <div className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onPointerEnter={() => setHovered(l.href)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  liquidTarget === l.href ? "text-foreground" : solid ? "text-muted-foreground" : "text-foreground/80",
                )}
              >
                {liquidTarget === l.href && (
                  <motion.span
                    layoutId="nav-liquid-pill"
                    transition={{ type: "spring", duration: 0.45, bounce: 0 }}
                    className="absolute inset-0 rounded-full bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_6px_rgba(4,44,83,0.08)]"
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
          </div>

          <a
            href={siteConfig.phoneHref}
            aria-label={`Ara: ${siteConfig.phone}`}
            onClick={() => track("nav_call_click")}
            className={cn(
              "hidden rounded-full p-2 transition-colors hover:text-foreground md:block",
              solid ? "text-muted-foreground" : "text-foreground/80",
            )}
          >
            <Phone className="size-4" />
          </a>
          <Button asChild size="sm" className="hidden rounded-full md:inline-flex">
            <a
              href={siteConfig.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("nav_directions_click")}
            >
              <MapPin className="size-4" /> Yol Tarifi
            </a>
          </Button>

          <button
            className="ml-auto p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menü"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>

      {/* Mobil menü: hapın altına kopuk cam kart */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              background: "rgba(255,255,255,0.85)",
              boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.65), 0 12px 40px rgba(4,44,83,0.14)",
            }}
            className="mt-2 overflow-hidden rounded-2xl border border-white/50 md:hidden"
          >
            <nav aria-label="Mobil menü" className="flex flex-col gap-1 px-3 py-3">
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
                    onClick={() => {
                      setOpen(false)
                      track("nav_directions_click_mobile")
                    }}
                  >
                    <MapPin className="size-4" /> Yol Tarifi
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                  <a
                    href={siteConfig.phoneHref}
                    onClick={() => {
                      setOpen(false)
                      track("nav_call_click_mobile")
                    }}
                  >
                    <Phone className="size-4" /> Ara
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

- [ ] **Step 3.2: Navbar tüketicilerini kontrol et**

Run: `grep -rn "components/navbar" app/` — `/kvkk` ve `/mesafeli-satis-sozlesmesi` da render ediyorsa beyaz zeminde solid cam durumu devrededir, ek iş gerekmez; render etmiyorlarsa dokunma.

- [ ] **Step 3.3: Doğrula**

Run: `npx tsc --noEmit` → boş. Headless sürüş: (a) hap üstte ortalanmış ve kenarlardan kopuk (ekran görüntüsüne BAK), (b) `#nasil-calisir`'a scroll → vurgu hapı "Nasıl Çalışır"da; hero'ya dön → vurgu yok, (c) link hover → hap spring'le kayıyor, (d) 390px viewport: hamburger açılır cam kart, Escape kapatır, (e) `scroll-padding-top: 5rem` ile anchor hedefleri hapın altında kalmıyor.

- [ ] **Step 3.4: Commit**

```bash
git add components/navbar.tsx
git commit -m "feat: liquid-glass pill nav — yüzen cam hap + layoutId vurgu hapı + aktif bölüm takibi"
```

---

### Task 4: Paket doğrulaması + dokümantasyon

**Files:**
- Modify: `CLAUDE.md` (cila paketi satırı)
- Scratchpad: sürüş scriptleri

- [ ] **Step 4.1: Tam doğrulama**

Run: `npx tsc --noEmit && pnpm build` → ikisi de temiz. Headless tam tur: üç özellik + mevcutlar (spotlight, shine, cta-ripple) birlikte; `console --errors` boş; reduced-motion'da üç yeni özellik de kapalı (bubble overlay yok, hero StaticHero, pill nav statik ama işlevsel).

- [ ] **Step 4.2: CLAUDE.md güncelle**

Cila paketi cümlesine `bubble-cursor`/`scroll-float-text` eklenir; navbar cümlesi "yüzen liquid-glass hap (PillNav konsepti, layoutId vurgu hapı + IntersectionObserver aktif bölüm)" olarak güncellenir. RB fit analizi notuna sahip kararıyla eklenen imleç istisnası bir cümleyle işlenir.

- [ ] **Step 4.3: Code review**

superpowers:code-reviewer subagent'ına son 3 feat commit'i + çalışma ağacı verilir; Critical/Important bulgular düzeltilir.

- [ ] **Step 4.4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: imza motion paketi CLAUDE.md güncellemesi"
```
