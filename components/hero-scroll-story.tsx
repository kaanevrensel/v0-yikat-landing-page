"use client"

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
import { HeroScrubVideo } from "@/components/hero-scrub-video"
import Magnet from "@/components/magnet"
import { ScrollFloatText } from "@/components/scroll-float-text"
import { useDirectionsUrl } from "@/hooks/use-directions-url"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"

// Sabit kadrajlı takip çekimi (spec + 2026-07-05 konsept revizyonu): ayakkabılar giyili,
// kadraj sabit, sahneden sahneye dünya ilerler. Kareler Higgsfield kompozit keyframe'leri;
// gradyan yalnız görsel yüklenene dek fallback zemin.
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

// LCP karesi için art-direction: <picture> tarayıcının preload tarayıcısına tek doğru
// kırpımı erken keşfettirir — çift <Image priority> her cihazda iki eager indirme yapıyordu.
// images.unoptimized: true olduğundan next/image burada ek değer katmıyor.
function SceneLcpPicture({ scene }: { scene: (typeof SCENES)[number] }) {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={scene.img} />
      <img
        src={scene.imgMobile}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  )
}

export function HeroCtas({ eventPrefix }: { eventPrefix: string }) {
  const directionsUrl = useDirectionsUrl()
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Magnet maxShift={8}>
        <Button asChild size="lg" className="cta-ripple rounded-full">
          <a
            href={directionsUrl}
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

// Reduced-motion ve düşük güç fallback'i: final sahnesi statik (spec §4).
export function StaticHero() {
  const scene = SCENES[3]
  return (
    <section
      className="relative flex min-h-dvh flex-col items-center justify-end overflow-hidden px-4 pb-[12vh] pt-16"
      style={{ background: scene.bg }}
    >
      <SceneLcpPicture scene={scene} />
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

// Sahne pencereleri (scrollYProgress 0..1) — videonun doğrusal zamanına hizalı:
// sahne "anları" videoda %0 / %33 / %66 / %100'de (3 geçiş klibinin sınırları).
// Metinler o anların çevresinde okunur; video hiç durmaz (doğrusal scrub).
const WINDOWS = [
  [0, 0, 0.1, 0.17],
  [0.26, 0.33, 0.41, 0.48],
  [0.59, 0.66, 0.74, 0.81],
  [0.9, 0.96, 1, 1],
] as const

// Metin fade-in başlangıcıyla (0.90) hizalı — gate daha geç olursa CTA yarı-opak "pat" diye belirir.
const CTA_GATE = 0.9

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
            {i === 0 ? (
              <SceneLcpPicture scene={scene} />
            ) : (
              // <picture> art-direction: CSS'le gizlenen çift <Image> (unoptimized=düz img)
              // her cihazda İKİ varyantı da indiriyordu; source/media tek doğru kırpımı seçer.
              <picture>
                <source media="(min-width: 768px)" srcSet={scene.img} />
                <img
                  src={scene.imgMobile}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </picture>
            )}
          </motion.div>
        ))}

        {/* Masaüstü scrub videosu — md+ ve canplaythrough sonrası statiklerin üstüne biner */}
        <HeroScrubVideo progress={scrollYProgress} />

        {/* Metin + CTA alt üçte-birde: kompozit karede ayakkabılar merkezde, üstüne binmez */}
        <div className="absolute inset-x-0 bottom-[10vh] z-10 flex flex-col items-center">
          <div className="grid w-full max-w-2xl px-4 text-center">
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
                {/* Blur bloğun tamamından alt metne indi: karakter kaskadı parent filter altında
                    çamurlaşmasın. Sahne 0'ın blur'u sabit blur(0px) — bağlamak zararsız. */}
                <motion.p
                  style={{ filter: textBlurs[i] }}
                  className={`mt-3 text-lg ${scene.dark ? `text-white/85 ${DARK_SHADOW}` : `text-muted-foreground ${LIGHT_SHADOW}`}`}
                >
                  {scene.sub}
                </motion.p>
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
