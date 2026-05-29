"use client"

import { motion } from "framer-motion"
import { Smartphone, Truck, Sparkles, Home } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: Smartphone,
    desc: "Uygulamadan sipariş ver — adres, hizmet, parça ve randevu penceresi.",
  },
  {
    num: "02",
    icon: Truck,
    desc: "Kurye kapından alır — seçtiğin saatte, paketli bir şekilde.",
  },
  {
    num: "03",
    icon: Sparkles,
    desc: "Partner profesyonel temizler — parça başı kalite kontrolü ve fotoğraflı liste.",
  },
  {
    num: "04",
    icon: Home,
    desc: "24–48 saat içinde kapına — paketli, ütülü, kullanıma hazır.",
  },
]

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const card = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="bg-muted py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl tracking-tight text-foreground sm:text-4xl"
        >
          Dört adımda, kapıdan kapıya
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <motion.div key={step.num} variants={card} className="flex flex-col">
              <span className="text-5xl font-medium tracking-tight text-primary/20">
                {step.num}
              </span>
              <div className="mt-3 flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                <step.icon className="size-6" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
