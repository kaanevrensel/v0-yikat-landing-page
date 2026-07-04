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
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-4 pt-16" style={{ background: scene.bg }}>
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
