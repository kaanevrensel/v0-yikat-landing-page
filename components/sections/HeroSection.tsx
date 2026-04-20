"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"

export function HeroSection() {
  return (
    <SectionReveal
      id="basla"
      ariaLabel="Başla"
      className="relative flex min-h-screen items-center pb-24 pt-[calc(50vw+1.25rem)] lg:pl-[480px] lg:pr-[10vw] lg:pt-0"
    >
      <div className="mx-auto max-w-3xl">
        <motion.div variants={revealItem} className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#2798ff] opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#2798ff]" />
          </span>
          Çekmeköy • 08:00–22:00
        </motion.div>

        <motion.h1
          variants={revealItem}
          className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-[#0F172A] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        >
          Tertemiz. Kapında.
          <br />
          24 saatte.
        </motion.h1>

        <motion.p
          variants={revealItem}
          className="mt-8 max-w-xl text-base leading-relaxed text-[#64748B] sm:text-lg"
        >
          Evden çamaşır toplama, yıkama, ütüleme ve kapıya teslim hizmeti.
          Kilo bazlı fiyatlandırma, 24–48 saat teslim. Çekmeköy genelinde hizmet veriyoruz.
        </motion.p>

        <motion.div variants={revealItem} className="mt-16 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#64748B]">
          <span>Programı seç</span>
          <ChevronDown className="size-3.5 animate-bounce" aria-hidden="true" />
        </motion.div>
      </div>
    </SectionReveal>
  )
}
