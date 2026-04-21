"use client"

import { motion } from "framer-motion"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { SECTIONS } from "@/lib/sections"
import { SectionEyebrow } from "@/components/SectionEyebrow"
import { SectionEmoji } from "@/components/SectionEmoji"

export function ReviewsSection() {
  return (
    <SectionReveal
      id="yorumlar"
      ariaLabel="Yorumlar"
      className="py-24 pl-6 pr-6 md:py-32 lg:pl-[480px] lg:pr-[10vw]"
    >
      <div className="mx-auto max-w-4xl">
        {(() => {
          const idx = SECTIONS.findIndex(s => s.id === "yorumlar")
          const meta = SECTIONS[idx]!
          const sectionIndex = idx - 1  // -1 to skip hero for phase-offset purposes
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <motion.h2
                  variants={revealItem}
                  className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  Yorumlar
                </motion.h2>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

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
            </>
          )
        })()}
      </div>
    </SectionReveal>
  )
}
