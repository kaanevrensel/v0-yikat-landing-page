# Hero Scrub Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **UYARI — Görev 1–6 subagent'a DEVREDİLEMEZ:** Higgsfield üretim görevleri kullanıcı onay kapılıdır (her üretim çıktısı kullanıcıya gösterilir, onaysız ilerlenmez). Bu görevler ana oturumda inline yürütülür. Görev 7+ normal şekilde yürütülebilir.

**Goal:** Hero'ya gerçek Higgsfield görselleri bağlamak — masaüstünde scroll-scrub video, mobilde statik keyframe crossfade (spec: `docs/superpowers/specs/2026-07-05-hero-scrub-video-design.md`).

**Architecture:** 4 kompozit keyframe karesi Nano Banana Pro edit zinciriyle üretilir (kadraj kilitli), aralarındaki 3 geçiş Seedance 2.0 ile start+end frame kontrollü klip olarak üretilir, ffmpeg ile tek keyframe-yoğun MP4'e birleştirilir. Kodda statik keyframe katmanları tek yol (mobil + masaüstü fallback); `HeroScrubVideo` md+ ve `canplaythrough` sonrası üstüne biner, `scrollYProgress` parçalı doğrusal eşlemeyle `currentTime`'ı sürer. `WINDOWS` zamanlaması değişmez.

**Tech Stack:** Higgsfield MCP (nano_banana_pro, seedance_2_0, job_status/job_display), ffmpeg, Next.js 16 + framer-motion (mevcut), next/image.

**Model politikası (bağlayıcı):** Plus planında unlimited kapsamındaki en yüksek kaliteli model önceliklidir. Üretim anında model unlimited değilse kredi maliyeti onay sırasında kullanıcıya söylenir. Bakiye 2026-07-05: 654 kredi.

---

## Dosya haritası

| Dosya | Sorumluluk |
|---|---|
| `components/hero-scrub-video.tsx` (yeni) | Masaüstü scrub video katmanı: md+ gate, canplaythrough gate, rAF lerp scrub, parçalı scroll→zaman eşlemesi |
| `components/hero-scroll-story.tsx` (değişir) | Emoji/overlay sistemi kalkar; kompozit keyframe `<Image>` katmanları; metin alt üçte-bire iner; `HeroScrubVideo` mount |
| `app/layout.tsx` (değişir) | og:image metadata |
| `public/images/hero/keyframe-{sokak,camur,yikat,temiz}{,-mobile}.webp` (yeni, 8 dosya) | Kompozit kareler (1920×1080 + 828×1104) |
| `public/videos/hero-scrub.mp4` (yeni) | ~12 sn birleşik geçiş videosu |
| `public/images/og.png` (yeni) | keyframe-temiz'den 1200×630 |
| `docs/superpowers/plans/2026-07-05-hero-scrub-video-assets.md` (yeni) | Onaylı üretim manifesti (id/url/prompt) |
| `.hero-work/` (geçici, gitignore) | İndirme/encode ara dosyaları |

---

### Görev 0: Araç ve çalışma alanı hazırlığı

**Files:**
- Modify: `.gitignore`
- Create: `.hero-work/` (geçici dizin)

- [ ] **Adım 1: ffmpeg/ffprobe kontrolü**

Run: `ffmpeg -version | head -1 && ffprobe -version | head -1`
Expected: iki sürüm satırı. Yoksa: `brew install ffmpeg` çalıştır, tekrar doğrula.

- [ ] **Adım 2: Çalışma dizini + gitignore**

```bash
mkdir -p .hero-work public/images/hero public/videos
grep -qx '.hero-work/' .gitignore || echo '.hero-work/' >> .gitignore
```

- [ ] **Adım 3: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore hero asset work dir"
```

---

### Görev 1: Temel kompozit kare — keyframe-sokak (ONAY KAPILI)

**Files:**
- Create: `docs/superpowers/plans/2026-07-05-hero-scrub-video-assets.md`

- [ ] **Adım 1: Üretim**

`mcp__higgsfield__generate_image` çağır: `model: "nano_banana_pro"`, `aspect_ratio: "16:9"`, `resolution: "2k"`, prompt:

> Photorealistic product photograph, eye-level side view of a single light gray and white running sneaker standing centered on a clean Istanbul sidewalk pavement, soft morning daylight, quiet residential street softly blurred in the background, the sneaker positioned slightly above the vertical center of the frame, the bottom third of the frame is clean empty pavement with negative space, locked-off fixed camera framing, no people, no text, no logos, no watermark

Not: Araç unlimited kapsamı/kredi maliyeti dönerse kaydet; unlimited değilse maliyeti onay adımında kullanıcıya söyle.

- [ ] **Adım 2: Sonucu bekle ve göster**

`job_status` ile tamamlanana dek bekle (~10–15 sn arayla), sonra `job_display` ile çıktıyı göster.

- [ ] **Adım 3: KULLANICI ONAYI (kapı)**

Çıktıyı kullanıcıya göster; kadraj/ayakkabı/ışık değerlendirmesini iste. **Onay gelmeden Görev 2'ye geçme.** Red gelirse: geri bildirimi prompt'a işle, Adım 1'e dön.

- [ ] **Adım 4: Manifesti başlat ve commit**

`docs/superpowers/plans/2026-07-05-hero-scrub-video-assets.md` oluştur:

```markdown
# Hero Scrub Video — Onaylı Üretim Manifesti

| Asset | Model | Job/Generation ID | URL | Onay |
|---|---|---|---|---|
| keyframe-sokak | nano_banana_pro | <id> | <url> | 2026-07-05 |
```

```bash
git add docs/superpowers/plans/2026-07-05-hero-scrub-video-assets.md
git commit -m "assets: approve hero base keyframe (sokak)"
```

---

### Görev 2: Edit zinciri — çamur, yıkama, temiz kareleri (HER BİRİ ONAY KAPILI)

Üç üretim, üçü de `nano_banana_pro`, `aspect_ratio: "16:9"`, `resolution: "2k"`, referans görselle (image-to-image). Zincir: **çamur ← sokak**, **yıkama ← çamur**, **temiz ← sokak** (drift'i sınırlamak için temiz kare temele döner).

- [ ] **Adım 1: keyframe-camur üret** — medias: onaylı sokak karesi. Prompt:

> Edit this image, keep the exact same sneaker, same camera angle, same framing: the sidewalk is now wet and muddy after heavy rain, dark mud splashes cover the sides and sole of the sneaker, small dirty puddles on the pavement, overcast moody light, the bottom third of the frame remains relatively clean wet ground with negative space, no people, no text, no watermark

- [ ] **Adım 2: Göster + KULLANICI ONAYI (kapı)** — `job_status` → `job_display` → onay bekle. Red → geri bildirimle Adım 1'e dön. Onaysız Adım 3'e geçme.

- [ ] **Adım 3: keyframe-yikat üret** — medias: onaylı çamur karesi. Prompt:

> Edit this image, keep the exact same sneaker, same camera angle, same framing: a professional shoe-washing scene, the muddy sneaker is now covered in thick white soap foam with water droplets and gentle splashes around it, the background is a deep brand-blue professional wash station (gradient from #042C53 through #1F5EB8 to #4A8CFF), the bottom third of the frame stays clean for text, no people, no text, no watermark

- [ ] **Adım 4: Göster + KULLANICI ONAYI (kapı)** — aynı prosedür.

- [ ] **Adım 5: keyframe-temiz üret** — medias: onaylı sokak karesi. Prompt:

> Edit this image, keep the exact same sneaker, same camera angle, same framing: the sneaker is now spotless and looks brand new with a subtle clean sheen, standing on an elegant warm interior floor of an upscale lobby, soft warm bokeh lights in the softly blurred background, bright airy mood, the bottom third of the frame is clean elegant floor with negative space, no people, no text, no watermark

- [ ] **Adım 6: Göster + KULLANICI ONAYI (kapı)** — aynı prosedür. Ek kontrol: 4 kareyi yan yana göster — ayakkabı kimliği ve kadraj 4 karede tutarlı mı? Kullanıcı setin bütününü onaylamalı.

- [ ] **Adım 7: Manifeste 3 satır ekle + commit**

```bash
git add docs/superpowers/plans/2026-07-05-hero-scrub-video-assets.md
git commit -m "assets: approve hero keyframes (camur, yikat, temiz)"
```

---

### Görev 3: Keyframe dosyaları — indir, WebP, mobil dikey set (ONAY KAPILI)

**Files:**
- Create: `public/images/hero/keyframe-{sokak,camur,yikat,temiz}.webp` + `-mobile.webp` (8 dosya)

- [ ] **Adım 1: Onaylı kareleri indir**

Manifestteki URL'lerle (dört kare için):

```bash
cd .hero-work
curl -L -o keyframe-sokak-raw.png "<sokak-url>"
curl -L -o keyframe-camur-raw.png "<camur-url>"
curl -L -o keyframe-yikat-raw.png "<yikat-url>"
curl -L -o keyframe-temiz-raw.png "<temiz-url>"
```

Doğrula: `file *.png` → dördü de görüntü dosyası, 0 bayt yok.

- [ ] **Adım 2: Masaüstü WebP seti (1920×1080)**

Her kare için (sokak örneği; camur/yikat/temiz aynı kalıp):

```bash
ffmpeg -y -i keyframe-sokak-raw.png -vf "scale=1920:1080:flags=lanczos" -c:v libwebp -quality 82 ../public/images/hero/keyframe-sokak.webp
```

- [ ] **Adım 3: Mobil dikey set (merkez kırpma → 828×1104)**

```bash
ffmpeg -y -i keyframe-sokak-raw.png -vf "scale=1920:1080:flags=lanczos,crop=810:1080:(iw-810)/2:0,scale=828:1104:flags=lanczos" -c:v libwebp -quality 82 ../public/images/hero/keyframe-sokak-mobile.webp
```

(4 kare için tekrarla.)

- [ ] **Adım 4: KULLANICI ONAYI (kapı) — mobil kadraj**

8 dosyayı kullanıcıya göster (özellikle dikey kırpmalarda ayakkabının ve alt-üçte-bir boşluğun korunduğunu). Kırpma dar geldiyse: ilgili kareyi `outpaint_image` ile dikeye genişlet (yeni üretim = yeni onay kapısı), sonra bu adımı tekrarla.

- [ ] **Adım 5: Commit**

```bash
git add public/images/hero/
git commit -m "assets: hero keyframe webp sets (desktop + mobile)"
```

---

### Görev 4: Geçiş klipleri — 3 × Seedance 2.0 (HER BİRİ ONAY KAPILI)

Üç klip, hepsi: `model: "seedance_2_0"`, `mode: "std"`, `resolution: "1080p"`, `duration: 4`, `aspect_ratio: "16:9"`, `generate_audio: false`, medias: `start_image` + `end_image` = onaylı keyframe'ler.

- [ ] **Adım 1: Klip 1 (sokak→çamur)** — start: sokak, end: çamur. Prompt:

> Locked-off static camera, the sneaker stays perfectly centered and still in the exact same framing; rain begins to fall, the pavement gradually darkens and turns muddy, mud splashes progressively onto the sneaker until it is visibly dirty, smooth continuous photorealistic transition, no camera movement, no zoom, no people, no text

- [ ] **Adım 2: Göster + KULLANICI ONAYI (kapı)** — `job_status` → `job_display` → onay bekle. Kontrol listesi: kamera sabit mi, ayakkabı kimliği korunuyor mu, ilk/son kare keyframe'lerle örtüşüyor mu? Red → prompt/seed güncelle, tekrar üret.

- [ ] **Adım 3: Klip 2 (çamur→yıkama)** — start: çamur, end: yıkama. Prompt:

> Locked-off static camera, the sneaker stays perfectly centered and still in the exact same framing; the scene transitions into a professional shoe-washing station with a deep blue background, thick white soap foam builds up over the muddy sneaker, gentle water splashes rinse around it, smooth continuous photorealistic transition, no camera movement, no zoom, no people, no text

- [ ] **Adım 4: Göster + KULLANICI ONAYI (kapı)** — aynı prosedür.

- [ ] **Adım 5: Klip 3 (yıkama→temiz)** — start: yıkama, end: temiz. Prompt:

> Locked-off static camera, the sneaker stays perfectly centered and still in the exact same framing; the soap foam rinses away revealing a spotless like-new sneaker with a subtle sheen, the background transitions into an elegant warm interior floor with soft bokeh lights, smooth continuous photorealistic transition, no camera movement, no zoom, no people, no text

- [ ] **Adım 6: Göster + KULLANICI ONAYI (kapı)** — aynı prosedür.

- [ ] **Adım 7: Manifeste 3 klip satırı ekle + commit**

```bash
git add docs/superpowers/plans/2026-07-05-hero-scrub-video-assets.md
git commit -m "assets: approve hero transition clips (3x seedance)"
```

---

### Görev 5: ffmpeg — birleştir, scrub encode'u, süre sabitleri

**Files:**
- Create: `public/videos/hero-scrub.mp4`

- [ ] **Adım 1: Klipleri indir**

```bash
cd .hero-work
curl -L -o clip1.mp4 "<klip1-url>"
curl -L -o clip2.mp4 "<klip2-url>"
curl -L -o clip3.mp4 "<klip3-url>"
```

- [ ] **Adım 2: Klip sürelerini ölç**

```bash
for f in clip1 clip2 clip3; do ffprobe -v error -show_entries format=duration -of csv=p=0 $f.mp4; done
```

Üç süreyi not et (ör. 4.0, 4.0, 4.0). Kümülatif sınırlar `CLIP_BOUNDS` olur: `[0, d1, d1+d2, d1+d2+d3]` (Görev 7'de koda yazılır).

- [ ] **Adım 3: Birleştir + keyframe-yoğun encode**

```bash
printf "file 'clip1.mp4'\nfile 'clip2.mp4'\nfile 'clip3.mp4'\n" > concat.txt
ffmpeg -y -f concat -safe 0 -i concat.txt -an \
  -vf "scale=1920:1080:flags=lanczos,fps=30" \
  -c:v libx264 -profile:v high -preset slow -crf 20 \
  -g 4 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p \
  -movflags +faststart ../public/videos/hero-scrub.mp4
```

- [ ] **Adım 4: Boyut bütçesi kontrolü**

Run: `du -h public/videos/hero-scrub.mp4`
Expected: ≤ 10 MB. Aşarsa sırayla: (a) `-crf 23` ile tekrar encode; (b) hâlâ aşıyorsa 1600×900'e düşme kararını **kullanıcıya sor** (spec §6 riski).

- [ ] **Adım 5: Scrub duman testi**

`open public/videos/hero-scrub.mp4` ile QuickTime'da aç; zaman çubuğunu elle ileri-geri sür — her konumda anında net kare görünmeli (keyframe-yoğun encode kanıtı).

- [ ] **Adım 6: Commit**

```bash
git add public/videos/hero-scrub.mp4
git commit -m "assets: stitched scrub-friendly hero video"
```

---

### Görev 6: og:image + metadata

**Files:**
- Create: `public/images/og.png`
- Modify: `app/layout.tsx` (metadata bloğu)

- [ ] **Adım 1: keyframe-temiz'den 1200×630 üret**

```bash
ffmpeg -y -i .hero-work/keyframe-temiz-raw.png -vf "scale=1200:675:flags=lanczos,crop=1200:630:0:22" public/images/og.png
```

- [ ] **Adım 2: layout.tsx metadata**

`app/layout.tsx` içinde `openGraph` nesnesine ekle:

```ts
images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "YIKAT — Ayakkabı Yıkama Bakırköy" }],
```

ve `twitter` nesnesine ekle:

```ts
images: ["/images/og.png"],
```

- [ ] **Adım 3: Doğrula + commit**

Run: `npx tsc --noEmit` → hatasız.

```bash
git add public/images/og.png app/layout.tsx
git commit -m "pivot: add og image from hero clean keyframe"
```

---

### Görev 7: `HeroScrubVideo` bileşeni

**Files:**
- Create: `components/hero-scrub-video.tsx`

Bu repoda test altyapısı yok (CLAUDE.md); doğrulama `npx tsc --noEmit` + Görev 9 manuel kontrolleriyle yapılır.

- [ ] **Adım 1: Bileşeni yaz**

`components/hero-scrub-video.tsx` (tam içerik — `CLIP_BOUNDS` değerlerini Görev 5 Adım 2'deki ölçümle güncelle):

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { useMotionValueEvent, type MotionValue } from "framer-motion"

// Görev 5'te ffprobe ile ölçülen kümülatif klip sınırları (saniye).
const CLIP_BOUNDS = [0, 4, 8, 12] as const

// WINDOWS crossfade pencereleriyle hizalı parçalı eşleme (spec §3):
// hold aralığında video keyframe'de durur, crossfade penceresinde ilgili klip oynar.
const SCROLL_STOPS = [0.19, 0.25, 0.44, 0.5, 0.69, 0.75] as const
const TIME_STOPS = [
  CLIP_BOUNDS[0], CLIP_BOUNDS[1],
  CLIP_BOUNDS[1], CLIP_BOUNDS[2],
  CLIP_BOUNDS[2], CLIP_BOUNDS[3],
] as const

function scrollToTime(v: number): number {
  if (v <= SCROLL_STOPS[0]) return TIME_STOPS[0]
  for (let i = 1; i < SCROLL_STOPS.length; i++) {
    if (v <= SCROLL_STOPS[i]) {
      const f = (v - SCROLL_STOPS[i - 1]) / (SCROLL_STOPS[i] - SCROLL_STOPS[i - 1])
      return TIME_STOPS[i - 1] + f * (TIME_STOPS[i] - TIME_STOPS[i - 1])
    }
  }
  return TIME_STOPS[TIME_STOPS.length - 1]
}

// Masaüstü scrub katmanı: SSR'da ve <md'de hiç render edilmez (hydration güvenli);
// canplaythrough gelene dek görünmez — altındaki statik keyframe katmanları tam deneyim sunar.
export function HeroScrubVideo({ progress }: { progress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTime = useRef(0)
  const [ready, setReady] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useMotionValueEvent(progress, "change", (v) => {
    targetTime.current = scrollToTime(v)
  })

  // Seek gecikmesini maskeleyen lerp: her frame hedefe %18 yaklaş.
  useEffect(() => {
    if (!isDesktop || !ready) return
    const video = videoRef.current
    if (!video) return
    targetTime.current = scrollToTime(progress.get())
    let raf = 0
    const tick = () => {
      const diff = targetTime.current - video.currentTime
      if (Math.abs(diff) > 0.01) video.currentTime = video.currentTime + diff * 0.18
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isDesktop, ready, progress])

  if (!isDesktop) return null

  return (
    <video
      ref={videoRef}
      aria-hidden
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      onCanPlayThrough={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      src="/videos/hero-scrub.mp4"
    />
  )
}
```

- [ ] **Adım 2: Tip kontrolü**

Run: `npx tsc --noEmit`
Expected: hatasız (bileşen henüz mount edilmedi, sadece derlenebilirlik).

- [ ] **Adım 3: Commit**

```bash
git add components/hero-scrub-video.tsx
git commit -m "pivot: hero scrub video component (md+ progressive enhancement)"
```

---

### Görev 8: `hero-scroll-story.tsx` — keyframe katmanları + video mount

**Files:**
- Modify: `components/hero-scroll-story.tsx` (tam yeniden yazım aşağıda)

Değişenler: emoji ayakkabı + çamur/köpük/ışıltı overlay sistemi ve `MUD_RINSE`/`SHOE_CLEAN`/ilgili transform'lar kalkar; `SCENES`'e `img`/`imgMobile` girer; metin bloğu alt üçte-bire iner (kompozit karede ayakkabı merkezde — metin üstüne binmemeli); `HeroScrubVideo` bg katmanlarının üstüne, içerikten (z-10) altta mount edilir. `WINDOWS`, metin hook'ları, `CTA_GATE`, analytics aynen kalır.

- [ ] **Adım 1: Dosyayı aşağıdaki içerikle değiştir**

```tsx
"use client"

import { useRef } from "react"
import Image from "next/image"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { ChevronDown, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroScrubVideo } from "@/components/hero-scrub-video"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"

// Sabit kamera kuralı (spec §4): ayakkabı hep merkezde, sadece arka plan + durum değişir.
// Kareler Higgsfield kompozit keyframe'leri; gradyan görsel yüklenene dek fallback zemin.
export const SCENES = [
  {
    key: "sokak",
    bg: "linear-gradient(160deg, #d7dde4 0%, #eef1f4 60%, #f8fafc 100%)",
    img: "/images/hero/keyframe-sokak.webp",
    imgMobile: "/images/hero/keyframe-sokak-mobile.webp",
    title: "Ayakkabın ilk günkü gibi.",
    sub: "Bakırköy'de profesyonel ayakkabı yıkama",
    dark: false,
  },
  {
    key: "camur",
    bg: "linear-gradient(160deg, #3f3122 0%, #6b4a2b 55%, #8a6237 100%)",
    img: "/images/hero/keyframe-camur.webp",
    imgMobile: "/images/hero/keyframe-camur-mobile.webp",
    title: "Sokak zor.",
    sub: "Çamur, toz, leke…",
    dark: true,
  },
  {
    key: "yikat",
    bg: "linear-gradient(160deg, #042c53 0%, #1f5eb8 55%, #4a8cff 100%)",
    img: "/images/hero/keyframe-yikat.webp",
    imgMobile: "/images/hero/keyframe-yikat-mobile.webp",
    title: "YIKAT yıkar.",
    sub: "Malzemesine uygun, profesyonel yıkama",
    dark: true,
  },
  {
    key: "temiz",
    bg: "linear-gradient(160deg, #e6f1fb 0%, #f3f8ff 55%, #ffffff 100%)",
    img: "/images/hero/keyframe-temiz.webp",
    imgMobile: "/images/hero/keyframe-temiz-mobile.webp",
    title: "Aynı gün tertemiz teslim.",
    sub: "Sabah bırak, akşam 20:00'ye kadar al.",
    dark: false,
  },
] as const

// Fotoğraf üstünde okunabilirlik: koyu sahnede koyu, açık sahnede açık ışıma.
const DARK_SHADOW = "[text-shadow:0_2px_24px_rgba(4,44,83,0.55)]"
const LIGHT_SHADOW = "[text-shadow:0_1px_16px_rgba(255,255,255,0.65)]"

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
    <section
      className="relative flex min-h-dvh flex-col items-center justify-end overflow-hidden px-4 pb-[12vh] pt-16"
      style={{ background: scene.bg }}
    >
      <Image alt="" fill priority sizes="100vw" className="hidden object-cover md:block" src={scene.img} />
      <Image alt="" fill priority sizes="100vw" className="object-cover md:hidden" src={scene.imgMobile} />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className={`text-balance text-center text-4xl font-semibold tracking-tight text-foreground md:text-5xl ${LIGHT_SHADOW}`}>
          Ayakkabın ilk günkü gibi.
        </h1>
        <p className={`mt-3 text-center text-lg text-muted-foreground ${LIGHT_SHADOW}`}>
          Bakırköy'de profesyonel ayakkabı yıkama — aynı gün teslim.
        </p>
        <div className="mt-8">
          <HeroCtas eventPrefix="hero_static" />
        </div>
      </div>
    </section>
  )
}

// Sahne pencereleri (scrollYProgress 0..1): her sahne ~%25'lik dilim, %6 crossfade.
const WINDOWS = [
  [0, 0, 0.19, 0.25],
  [0.19, 0.25, 0.44, 0.5],
  [0.44, 0.5, 0.69, 0.75],
  [0.69, 0.75, 1, 1],
] as const

const CTA_GATE = 0.72

// Arka planlar yalnız fade-IN yapar; sonraki opak katman öncekini örter (DOM sırası).
function useSceneBgOpacity(progress: MotionValue<number>, i: number) {
  return useTransform(
    progress,
    i === 0 ? [0, 1] : [WINDOWS[i][0], WINDOWS[i][1]],
    i === 0 ? [1, 1] : [0, 1],
  )
}

function useSceneTextOpacity(progress: MotionValue<number>, i: number) {
  const [fadeInStart, fullStart, fullEnd, fadeOutEnd] = WINDOWS[i]
  const input = i === 0 ? [0, fullEnd, fadeOutEnd] : i === 3 ? [fadeInStart, fullStart, 1] : [fadeInStart, fullStart, fullEnd, fadeOutEnd]
  const output = i === 0 ? [1, 1, 0] : i === 3 ? [0, 1, 1] : [0, 1, 1, 0]
  return useTransform(progress, input, output)
}

// Jakub kalıbı: giren metin 24px yükselir, çıkan metin -24px ile sahneyi terk eder.
function useSceneTextY(progress: MotionValue<number>, i: number) {
  const [fadeInStart, fullStart, fullEnd, fadeOutEnd] = WINDOWS[i]
  const input = i === 0 ? [fullEnd, fadeOutEnd] : i === 3 ? [fadeInStart, fullStart] : [fadeInStart, fullStart, fullEnd, fadeOutEnd]
  const output = i === 0 ? [0, -24] : i === 3 ? [24, 0] : [24, 0, 0, -24]
  return useTransform(progress, input, output)
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

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  // Görünmezken klavye odağından da çıkar (WCAG 2.4.7) — pointerEvents yerine visibility.
  const ctaVisibility = useTransform(scrollYProgress, (v) => (v > CTA_GATE ? "visible" : "hidden"))

  if (prefersReduced) return <StaticHero />

  return (
    // Scrub mesafesi = yükseklik − 1 ekran → mobil ~1.6, masaüstü ~2.2 ekran (spec §4).
    <section ref={ref} aria-label="YIKAT hikayesi" className="relative h-[260vh] md:h-[320vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* Statik keyframe katmanları — mobilde deneyimin kendisi, masaüstünde video fallback'i */}
        {SCENES.map((scene, i) => (
          <motion.div
            key={scene.key}
            aria-hidden
            className="absolute inset-0"
            style={{ background: scene.bg, opacity: bgOpacities[i] }}
          >
            <Image alt="" fill priority={i === 0} sizes="100vw" className="hidden object-cover md:block" src={scene.img} />
            <Image alt="" fill priority={i === 0} sizes="100vw" className="object-cover md:hidden" src={scene.imgMobile} />
          </motion.div>
        ))}

        {/* Masaüstü scrub videosu — md+ ve canplaythrough sonrası statiklerin üstüne biner */}
        <HeroScrubVideo progress={scrollYProgress} />

        {/* Metin + CTA alt üçte-birde: kompozit karede ayakkabı merkezde, üstüne binmez */}
        <div className="absolute inset-x-0 bottom-[10vh] z-10 flex flex-col items-center">
          <div className="grid w-full max-w-2xl px-4 text-center">
            {SCENES.map((scene, i) => (
              <motion.div
                key={scene.key}
                className="col-start-1 row-start-1"
                style={{ opacity: textOpacities[i], y: textYs[i], filter: textBlurs[i] }}
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
                    {scene.title}
                  </p>
                )}
                <p className={`mt-3 text-lg ${scene.dark ? `text-white/85 ${DARK_SHADOW}` : `text-muted-foreground ${LIGHT_SHADOW}`}`}>
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

- [ ] **Adım 2: Tip kontrolü + build**

Run: `npx tsc --noEmit && pnpm build`
Expected: ikisi de hatasız. (`ignoreBuildErrors: true` nedeniyle yeşil build tek başına yeterli değildir — tsc şart.)

- [ ] **Adım 3: Commit**

```bash
git add components/hero-scroll-story.tsx
git commit -m "pivot: wire hero keyframes + scrub video into scroll story"
```

---

### Görev 9: Doğrulama (verification-before-completion)

- [ ] **Adım 1: Masaüstü scrub kontrolü**

`pnpm dev` çalışırken **hem Chrome hem Safari'de** (≥768px pencere): yavaş aşağı kaydır — crossfade pencerelerinde (~%19–25, %44–50, %69–75) video geçiş klipleri oynamalı, hold aralıklarında kare durmalı; yukarı kaydırınca geri sarmalı. Safari'de scrub takılıyorsa lerp katsayısını 0.18 → 0.12'ye düşür (spec §6). Video yüklenene dek statik keyframe'ler görünmeli (Network'te throttle ile doğrula).

- [ ] **Adım 2: Mobil kontrol**

DevTools mobil emülasyon (390px): video isteği HİÇ atılmamalı (Network'te hero-scrub.mp4 yok), dikey keyframe'ler crossfade etmeli, metin okunabilir olmalı.

- [ ] **Adım 3: Reduced-motion kontrolü**

DevTools → Rendering → `prefers-reduced-motion: reduce`: StaticHero (temiz kare + başlık + CTA) görünmeli, pin/animasyon olmamalı.

- [ ] **Adım 4: Lighthouse mobil**

```bash
npx lighthouse http://localhost:3000 --only-categories=performance --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless"
```

Expected: Performance ≥ 90. Altındaysa: LCP elemanını raporda kontrol et (statik keyframe olmalı, video OLMAMALI); keyframe WebP kalitesini 75'e düşürmeyi dene.

- [ ] **Adım 5: Kod incelemesi**

superpowers:requesting-code-review skill'i ile Görev 7–8 diff'ini incelet; bulguları receiving-code-review disipliniyle ele al.

---

### Görev 10: Dokümantasyon senkronu

**Files:**
- Modify: `docs/superpowers/plans/2026-07-05-ayakkabi-pivot.md` (Faz 2)
- Modify: `CLAUDE.md` (hero + gotcha satırları)

- [ ] **Adım 1: Eski planın Faz 2'sini güncelle**

Faz 2 giriş tablosundaki hero satırlarını (4 sahne arka planı, 4 ayakkabı durumu, OG görseli) ve Görev 16–18'i şu notla işaretle: "**Yerini aldı (2026-07-05):** hero asset + og işleri `2026-07-05-hero-scrub-video.md` planına taşındı; before/after çiftleri ve statik harita bu planda kalır." Before/after + harita satırlarına dokunma.

- [ ] **Adım 2: CLAUDE.md güncelle**

- "Hero (`hero-scroll-story.tsx`)" paragrafındaki "CSS gradients + emoji placeholder … separate, not-yet-done phase" cümlelerini yeni mimariyle değiştir: masaüstü scrub video (`hero-scrub-video.tsx`, parçalı scroll→zaman eşlemesi), mobil/fallback kompozit keyframe crossfade, `WINDOWS` değişmedi.
- "Known gotchas"tan emoji-hero maddesi varsa kaldır; `og:image` eksik notunu layout bölümünden düş.

- [ ] **Adım 3: Commit**

```bash
git add docs/superpowers/plans/2026-07-05-ayakkabi-pivot.md CLAUDE.md
git commit -m "docs: sync plans and CLAUDE.md with hero scrub video"
```
