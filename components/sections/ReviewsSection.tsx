"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { SECTIONS } from "@/lib/sections"
import { SectionEyebrow } from "@/components/SectionEyebrow"
import { SectionEmoji } from "@/components/SectionEmoji"

const reviews = [
  {
    quote: "Böyle bir hizmetin olduğunu bilseydim evime çamaşır makinesi almazdım, mükemmel servis.",
    author: "Yusuf H.",
  },
  {
    quote: "Kıyafetlerim tertemiz ve hiç leke kalmamış. Paketleme çok özenli. Ayrıca 1 gün sonra geri teslim aldım, çok hızlıydı.",
    author: "Adem Y.",
  },
  {
    quote: "Teslimat çok hızlıydı ve paket acayip güzel kokuyordu.",
    author: "Mehmet M.",
  },
]

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

              <motion.div
                variants={revealItem}
                className="mt-16 grid gap-6 sm:grid-cols-3"
              >
                {reviews.map((review) => (
                  <div
                    key={review.author}
                    className="rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col gap-4"
                  >
                    <span className="sr-only">5 yıldız</span>
                    <div className="flex gap-0.5" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((s) => (
                        <Star key={s} className="size-4" fill="#2798ff" color="#2798ff" />
                      ))}
                    </div>
                    <p className="text-base leading-relaxed text-[#0F172A]/80 flex-1">{review.quote}</p>
                    <p className="text-sm font-medium text-[#0F172A]">{review.author}</p>
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
