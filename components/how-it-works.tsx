"use client"

import { motion } from "framer-motion"
import { Clock, Footprints, Sparkles } from "lucide-react"

const STEPS = [
  {
    no: "01",
    icon: Footprints,
    title: "Getir",
    text: "Ayakkabını dükkana bırak. İki dakikanı alır.",
  },
  {
    no: "02",
    icon: Sparkles,
    title: "Yıkayalım",
    text: "Malzemesine uygun yöntemle derin temizlik yapalım.",
  },
  {
    no: "03",
    icon: Clock,
    title: "Aynı gün teslim al",
    text: "Akşam 20:00'ye kadar tertemiz hazır. Beklerken Bakırköy çarşıda işini gör.",
  },
] as const

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Üç adımda, aynı gün
        </motion.h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-3xl border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                  <s.icon className="size-5" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">{s.no}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
