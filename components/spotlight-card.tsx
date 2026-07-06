"use client"

// reactbits.dev SpotlightCard deseninden ilhamla temiz-oda yazım (RB lisansı MIT+Commons Clause
// olduğundan kaynak kopyalanmadı). Fark: kart sarmalayıcısı değil, kartın İÇİNE bırakılan overlay —
// pointer dinleyicilerini parent karta kendisi bağlar, imleç konumu state yerine doğrudan
// style.transform ile yazılır (move başına render yok, CSS var cascade'i yok).
// Yalnız (hover:hover)+(pointer:fine) ve reduced-motion kapalıyken var olur; dokunmatikte hiç render edilmez.
// Düşük alfa nedeniyle glow'un statik içeriğin üstünde boyanması bilinçli (yüzey parıltısı etkisi).
// Host kart sözleşmesi: parent position:relative olmalı (inset-0 ona göre çözülür) ve glow'un
// köşelerden taşmaması için border-radius taşımalı (overlay rounded-[inherit] ile devralır).
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

type CardSpotlightProps = {
  /** Glow'un radyal merkez rengi — düşük alfa şart (açık kartta primer ~%10, koyu kartta beyaz ~%7). */
  glowColor?: string
  /** Glow çapı (px). */
  size?: number
}

export function CardSpotlight({ glowColor = "rgba(74, 140, 255, 0.1)", size = 340 }: CardSpotlightProps) {
  const prefersReduced = useReducedMotion()
  const [finePointer, setFinePointer] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

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
    const parent = overlayRef.current?.parentElement
    const glow = glowRef.current
    if (!parent || !glow) return
    const half = size / 2

    const move = (e: PointerEvent) => {
      // Hibrit cihaz (ince imleç birincil + dokunmatik ekran): matchMedia kapısı geçer ama
      // parmak dokunuşu da pointer event üretir — glow yalnız gerçek fare için.
      if (e.pointerType !== "mouse") return
      const rect = parent.getBoundingClientRect()
      glow.style.transform = `translate3d(${e.clientX - rect.left - half}px, ${e.clientY - rect.top - half}px, 0)`
    }
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      move(e)
      glow.style.opacity = "1"
    }
    const leave = () => {
      glow.style.opacity = "0"
    }

    parent.addEventListener("pointerenter", enter)
    parent.addEventListener("pointermove", move)
    parent.addEventListener("pointerleave", leave)
    return () => {
      parent.removeEventListener("pointerenter", enter)
      parent.removeEventListener("pointermove", move)
      parent.removeEventListener("pointerleave", leave)
    }
  }, [enabled, size])

  if (!enabled) return null

  return (
    <div
      ref={overlayRef}
      aria-hidden
      // motion-safe: JS gate'ine (useReducedMotion) ek CSS emniyeti — tercih oturum ORTASINDA
      // değişirse hook güncellenmese bile overlay media query ile anında gizlenir.
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] motion-reduce:hidden"
    >
      <div
        ref={glowRef}
        className="absolute left-0 top-0 rounded-full opacity-0"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle closest-side, ${glowColor}, transparent 78%)`,
          transform: "translate3d(-9999px, -9999px, 0)",
          transition: "opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  )
}
