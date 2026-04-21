"use client"

import { motion } from "framer-motion"
import { SectionReveal, revealItem } from "@/components/SectionReveal"

export function PricingSection() {
  return (
    <SectionReveal
      id="fiyatlar"
      ariaLabel="Fiyatlar"
      className="bg-[#F5F5F2] py-24 pl-6 pr-6 md:py-40 lg:pl-[480px] lg:pr-[10vw]"
    >
      <div className="mx-auto max-w-4xl">
        <motion.p
          variants={revealItem}
          className="text-xs font-medium uppercase tracking-[0.16em] text-[#64748B]"
        >
          Fiyatlar
        </motion.p>

        <motion.h2
          variants={revealItem}
          className="mt-6 text-6xl font-bold leading-none tracking-[-0.035em] text-[#0F172A] sm:text-7xl md:text-[8rem] lg:text-[10rem]"
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
    </SectionReveal>
  )
}
