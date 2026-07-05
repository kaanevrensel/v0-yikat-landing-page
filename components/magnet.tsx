"use client"

// reactbits.dev Magnet deseninden ilhamla temiz-oda yazım. İmleç öğe üzerindeyken merkeze göre
// en fazla maxShift px kayma; ayrılınca spring ile yerine oturur. Dokunmatikte kendiliğinden etkisiz.
import { useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type MagnetProps = { children: React.ReactNode; maxShift?: number; className?: string }

export default function Magnet({ children, maxShift = 8, className }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const prefersReduced = useReducedMotion()

  if (prefersReduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        setOffset({ x: (dx / (r.width / 2)) * maxShift, y: (dy / (r.height / 2)) * maxShift })
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  )
}
