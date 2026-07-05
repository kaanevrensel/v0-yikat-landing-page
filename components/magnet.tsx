"use client"

// reactbits.dev Magnet deseninden ilhamla temiz-oda yazım. Yalnız gerçek farede çalışır
// (pointerType === "mouse") — dokunmatiğin emüle ettiği hareketler kaymayı tetikleyemez.
import { useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type MagnetProps = { children: React.ReactNode; maxShift?: number; className?: string }

export default function Magnet({ children, maxShift = 8, className }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={prefersReduced ? undefined : { x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onPointerMove={(e) => {
        if (prefersReduced || e.pointerType !== "mouse") return
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        setOffset({ x: (dx / (r.width / 2)) * maxShift, y: (dy / (r.height / 2)) * maxShift })
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  )
}
