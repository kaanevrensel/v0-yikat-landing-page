"use client"

import { motion } from "framer-motion"
import { Home, Clock, Sparkles, Tag } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { SECTIONS } from "@/lib/sections"
import { SectionEyebrow } from "@/components/SectionEyebrow"
import { SectionEmoji } from "@/components/SectionEmoji"

const points = [
  { icon: Home,     title: "Kapıdan teslim",        desc: "Alma da teslim de kapından." },
  { icon: Clock,    title: "08:00 – 22:00 hizmet",   desc: "Haftanın her günü çalışıyoruz." },
  { icon: Sparkles, title: "Profesyonel temizlik",  desc: "Özenli yıkama, hassas bakım." },
  { icon: Tag,      title: "Şeffaf fiyatlandırma",  desc: "Sürpriz yok. Kilo bazlı fiyat." },
]

export function WhyUsSection() {
  return (
    <SectionReveal
      id="neden"
      ariaLabel="Neden YIKAT"
      className="py-24 pl-6 pr-6 md:py-32 lg:pl-[480px] lg:pr-[10vw]"
    >
      <div className="mx-auto max-w-4xl">
        {(() => {
          const idx = SECTIONS.findIndex(s => s.id === "neden")
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
                  Neden YIKAT
                </motion.h2>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <div className="mt-16 grid gap-8 sm:grid-cols-2">
                {points.map((p) => (
                  <motion.div
                    key={p.title}
                    variants={revealItem}
                    className="border-t border-[#E5E7EB] pt-8"
                  >
                    <p.icon className="size-6 text-[#2798ff]" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="mt-5 text-2xl font-semibold tracking-[-0.01em] text-[#0F172A]">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                      {p.desc}
                    </p>
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
