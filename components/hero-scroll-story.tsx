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
