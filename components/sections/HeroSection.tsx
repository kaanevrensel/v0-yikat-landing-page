"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { HeroMachine } from "@/components/HeroMachine"
import { Knob } from "@/components/Knob"

export function HeroSection() {
  const machineRef = useRef<HTMLDivElement>(null)

  return (
    <SectionReveal
      id="basla"
      ariaLabel="Başla"
      className="relative flex min-h-screen items-center pb-24 pt-16 pl-6 pr-6 lg:pl-[80px] lg:pr-[80px]"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT: machine photo */}
        <motion.div variants={revealItem} className="order-1 lg:order-1">
          <HeroMachine ref={machineRef} />
        </motion.div>

        {/* RIGHT: text stack */}
        <div className="order-2 lg:order-2">
          <motion.div
            variants={revealItem}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#64748B]"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#2798ff] opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#2798ff]" />
            </span>
            Çekmeköy • 08:00–22:00
          </motion.div>

          <motion.h1
            variants={revealItem}
            className="text-5xl font-bold leading-[0.98] tracking-[-0.028em] text-[#0F172A] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={{ fontVariationSettings: "'opsz' 32" }}
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
      </div>

      <Knob containerRef={machineRef} />
    </SectionReveal>
  )
}
