"use client"

import { motion } from "framer-motion"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { SECTIONS } from "@/lib/sections"
import { SectionEyebrow } from "@/components/SectionEyebrow"
import { SectionEmoji } from "@/components/SectionEmoji"

export function PricingSection() {
  return (
    <SectionReveal
      id="fiyatlar"
      ariaLabel="Fiyatlar"
      className="bg-[#F5F5F2] py-24 pl-6 pr-6 md:py-40 lg:pl-[480px] lg:pr-[10vw]"
    >
      <div className="mx-auto max-w-4xl">
        {(() => {
          const idx = SECTIONS.findIndex(s => s.id === "fiyatlar")
          const meta = SECTIONS[idx]!
          const sectionIndex = idx - 1  // -1 to skip hero for phase-offset purposes
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-6 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <motion.h2
                    variants={revealItem}
                    className="text-6xl font-bold leading-none tracking-[-0.035em] text-[#0F172A] sm:text-7xl md:text-[8rem] lg:text-[10rem]"
                    style={{ fontVariationSettings: "'opsz' 32" }}
                  >
                    110 TL
                    <span className="text-3xl font-normal text-[#64748B] sm:text-4xl md:text-5xl"> / kg</span>
                  </motion.h2>

                  <motion.p
                    variants={revealItem}
                    className="mt-8 max-w-md text-base text-[#64748B] sm:text-lg"
                  >
                    4 kg üstü alma-teslim ücretsiz.
                  </motion.p>

                  <motion.p
                    variants={revealItem}
                    className="mt-4 max-w-md text-sm text-[#64748B]"
                  >
                    Ütü 30 TL/parça. Nevresim ve ayakkabı için fiyat teklifi WhatsApp üzerinden alınır.
                  </motion.p>
                </div>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>
            </>
          )
        })()}
      </div>
    </SectionReveal>
  )
}
