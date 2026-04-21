"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { SECTIONS } from "@/lib/sections"
import { SectionEyebrow } from "@/components/SectionEyebrow"
import { SectionEmoji } from "@/components/SectionEmoji"

interface CTASectionProps {
  whatsappUrl: string
}

export function CTASection({ whatsappUrl }: CTASectionProps) {
  return (
    <SectionReveal
      id="siparis"
      ariaLabel="Sipariş ver"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#2798ff] py-24 pl-6 pr-6 md:py-32 lg:pl-[480px] lg:pr-[10vw]"
    >
      <div className="mx-auto max-w-3xl">
        {(() => {
          const idx = SECTIONS.findIndex(s => s.id === "siparis")
          const meta = SECTIONS[idx]!
          const sectionIndex = idx - 1  // -1 to skip hero for phase-offset purposes
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} onDark />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <motion.h2
                  variants={revealItem}
                  className="text-5xl font-bold leading-[0.98] tracking-[-0.028em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  Hazırsan
                  <br />
                  başlayalım.
                </motion.h2>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <motion.div variants={revealItem} className="mt-12">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-lg bg-white px-8 py-4 font-medium text-[#0F172A] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2798ff]"
                >
                  WhatsApp'tan sipariş ver
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </motion.div>

              <motion.p
                variants={revealItem}
                className="mt-8 text-sm text-white/85"
              >
                Destek:{" "}
                <a href="mailto:destek@yikat.tech" className="underline underline-offset-4 hover:text-white">
                  destek@yikat.tech
                </a>
              </motion.p>
            </>
          )
        })()}
      </div>
    </SectionReveal>
  )
}
