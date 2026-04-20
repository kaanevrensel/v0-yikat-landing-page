"use client"

import { motion } from "framer-motion"
import { Shirt, Wind, Bed, Footprints } from "lucide-react"
import { SectionReveal, revealItem } from "@/components/SectionReveal"

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
        <motion.h2
          variants={revealItem}
          className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
        >
          Hizmetler
        </motion.h2>
        <motion.p
          variants={revealItem}
          className="mt-4 max-w-xl text-base text-[#64748B] sm:text-lg"
        >
          Her şey tek yerde. Çamaşırdan ayakkabıya, kapıdan kapıya.
        </motion.p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={revealItem}
              className="group rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <s.icon className="size-6 text-[#0F172A]" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-6 font-serif text-2xl font-semibold text-[#0F172A]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-[#64748B]">{s.description}</p>
              <p className="mt-6 text-base font-medium text-[#0F172A]">{s.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}
