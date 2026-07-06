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
