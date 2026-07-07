"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronsLeftRight } from "lucide-react"
import BlurText from "@/components/blur-text"
import CircularText from "@/components/circular-text"
import { results, type ResultPair } from "@/lib/site"

type Bubble = { id: number; xPct: number; topPct: number; size: number }

function CompareCard({ pair }: { pair: ResultPair }) {
  const { label } = pair
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
        <Image alt="" fill sizes="(min-width: 768px) 672px, 100vw" className="object-cover" src={pair.after} />
        {/* Üst katman: kirli — clip-path ile soldan pct% görünür */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          <Image alt="" fill sizes="(min-width: 768px) 672px, 100vw" className="object-cover" src={pair.before} />
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
        {/* bg-[#1f5eb8]: markanın gradyan tonu — #4A8CFF üstünde beyaz 12px 3.23:1 kalıyordu (AA 4.5). */}
        <span className="absolute right-3 top-3 z-10 rounded-full bg-[#1f5eb8] px-2.5 py-0.5 text-xs font-bold text-white">
          TEMİZ
        </span>
      </div>
      {/* representative=false yalnız sahip onaylı GERÇEK müşteri fotoğrafında kullanılır. */}
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {label} · {pair.representative ? "Temsili görsel" : "Gerçek müşteri sonucu"}
      </p>
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
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Çizgiyi sürükle — sol kirli, sağ YIKAT sonrası.
        </p>
        <div className="mx-auto mt-12 max-w-2xl">
          {results.map((pair) => (
            <CompareCard key={pair.label} pair={pair} />
          ))}
        </div>
      </div>
    </section>
  )
}
