"use client"

import { motion } from "framer-motion"
import { Home, Clock, Sparkles, Tag } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"

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
        <motion.h2
          variants={revealItem}
          className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
        >
          Neden YIKAT
        </motion.h2>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {points.map((p) => (
            <motion.div
              key={p.title}
              variants={revealItem}
              className="border-t border-[#E5E7EB] pt-8"
            >
              <p.icon className="size-6 text-[#2798ff]" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#0F172A]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}
