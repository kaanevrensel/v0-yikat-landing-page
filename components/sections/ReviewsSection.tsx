"use client"

import { motion } from "framer-motion"
import { SectionReveal, revealItem } from "@/components/SectionReveal"

export function ReviewsSection() {
  return (
    <SectionReveal
      id="yorumlar"
      ariaLabel="Yorumlar"
      className="py-24 pl-6 pr-6 md:py-32 lg:pl-[480px] lg:pr-[10vw]"
    >
      <div className="mx-auto max-w-4xl">
        <motion.h2
          variants={revealItem}
          className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
        >
          Yorumlar
        </motion.h2>

        {/* Reserved-space placeholder sized to match a future 3-card grid,
            so real reviews drop in without CLS. */}
        <motion.div
          variants={revealItem}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] bg-white p-8 text-center"
            >
              <p className="text-sm text-[#64748B]">
                Yakında müşteri yorumları burada.
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </SectionReveal>
  )
}
