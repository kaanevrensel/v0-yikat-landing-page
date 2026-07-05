"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Köpük bölüm ayracı (su kimliği): dalga + kabarcık kenarı. Rengi currentColor'dan alır —
// kullanım: <FoamDivider className="text-muted" /> (çizilen köpüğün rengi verilir).
// flip: ayracı dikeyde aynalar (muted bölümden açık bölüme geçerken).
export function FoamDivider({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div aria-hidden className={cn("relative -mb-px h-10 overflow-hidden sm:h-14", flip && "rotate-180", className)}>
      <motion.svg
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.3 }}
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full fill-current"
      >
        <path d="M0,56 L0,34 C80,22 160,42 240,36 C320,30 400,14 480,20 C560,26 640,44 720,40 C800,36 880,18 960,22 C1040,26 1120,40 1200,32 L1200,56 Z" />
        <circle cx="150" cy="26" r="5" />
        <circle cx="245" cy="18" r="3" />
        <circle cx="470" cy="10" r="4" />
        <circle cx="530" cy="18" r="2.5" />
        <circle cx="760" cy="24" r="5" />
        <circle cx="915" cy="10" r="3" />
        <circle cx="1060" cy="20" r="4" />
      </motion.svg>
    </div>
  )
}
