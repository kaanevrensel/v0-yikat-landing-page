"use client"

import { useCallback, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ChevronsLeftRight } from "lucide-react"

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
        aria-valuetext={`%${Math.round(pct)} kirli görünümde`}
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
        onPointerCancel={() => (dragging.current = false)}
        className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-3xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
            <ChevronsLeftRight className="size-3.5" />
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
