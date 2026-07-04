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
