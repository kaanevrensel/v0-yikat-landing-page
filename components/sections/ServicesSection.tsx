"use client"

import { motion } from "framer-motion"
import { Shirt, Wind, Bed, Footprints } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { SECTIONS } from "@/lib/sections"
import { SectionEyebrow } from "@/components/SectionEyebrow"
import { SectionEmoji } from "@/components/SectionEmoji"

const services = [
  {
    icon: Shirt,
    title: "Çamaşır",
    price: "110 TL/kg",
    description: "Yıkama, kurutma, katlama.",
  },
  {
    icon: Wind,
    title: "Ütü",
    price: "30 TL/parça",
    description: "Gömlek, pantolon, takım.",
  },
  {
    icon: Bed,
    title: "Nevresim",
    price: "Fiyat teklif",
    description: "Yorgan, çarşaf, battaniye.",
  },
  {
    icon: Footprints,
    title: "Ayakkabı",
    price: "Fiyat teklif",
    description: "Spor, klasik, bot.",
  },
]

export function ServicesSection() {
  return (
    <SectionReveal
      id="hizmetler"
      ariaLabel="Hizmetler"
      className="relative py-24 pl-6 pr-6 md:py-32 lg:pl-[480px] lg:pr-[10vw]"
    >
      {/* Backwards-compat anchor for existing footer links (#paketler) */}
      <span id="paketler" aria-hidden="true" className="absolute -top-24" />

      <div className="mx-auto max-w-4xl">
        {(() => {
          const idx = SECTIONS.findIndex(s => s.id === "hizmetler")
          const meta = SECTIONS[idx]!
          const sectionIndex = idx - 1  // -1 to skip hero for phase-offset purposes
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <motion.h2
                    variants={revealItem}
                    className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
                    style={{ fontVariationSettings: "'opsz' 32" }}
                  >
                    Hizmetler
                  </motion.h2>
                  <motion.p
                    variants={revealItem}
                    className="mt-4 max-w-xl text-base text-[#64748B] sm:text-lg"
                  >
                    Her şey tek yerde. Çamaşırdan ayakkabıya, kapıdan kapıya.
                  </motion.p>
                </div>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <div className="mt-16 grid gap-6 sm:grid-cols-2">
                {services.map((s) => (
                  <motion.div
                    key={s.title}
                    variants={revealItem}
                    className="group rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  >
                    <s.icon className="size-6 text-[#0F172A]" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="mt-6 text-2xl font-semibold tracking-[-0.01em] text-[#0F172A]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#64748B]">{s.description}</p>
                    <p className="mt-6 text-base font-medium text-[#0F172A]">{s.price}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )
        })()}
      </div>
    </SectionReveal>
  )
}
