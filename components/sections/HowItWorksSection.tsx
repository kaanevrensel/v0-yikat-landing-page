"use client"

import { motion } from "framer-motion"
import { SectionReveal, revealItem } from "@/components/SectionReveal"

const steps = [
  { num: "01", title: "Sipariş ver", desc: "WhatsApp'tan sipariş ver." },
  { num: "02", title: "Kuryemiz gelir", desc: "Kuryemiz kapından alır." },
  { num: "03", title: "Tertemiz teslim", desc: "24–48 saatte tertemiz teslim." },
]

export function HowItWorksSection() {
  return (
    <SectionReveal
      id="nasil"
      ariaLabel="Nasıl çalışır"
      className="relative py-24 pl-6 pr-6 md:py-32 lg:pl-[480px] lg:pr-[10vw]"
    >
      <span id="nasil-calisir" aria-hidden="true" className="absolute -top-24" />
      <div className="mx-auto max-w-4xl">
        <motion.h2
          variants={revealItem}
          className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
        >
          Nasıl çalışır
        </motion.h2>

        <div className="mt-20 space-y-16">
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={revealItem}
              className="grid grid-cols-[auto_1fr] items-start gap-8 border-t border-[#E5E7EB] pt-8 md:grid-cols-[120px_1fr]"
            >
              <span className="font-serif text-3xl text-[#2798ff] md:text-4xl">
                {step.num}
              </span>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#0F172A] md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-base text-[#64748B] md:text-lg">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}
