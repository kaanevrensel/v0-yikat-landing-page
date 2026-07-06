"use client"

import { motion } from "framer-motion"
import { Clock, Footprints, Sparkles } from "lucide-react"
import BlurText from "@/components/blur-text"
import { CardSpotlight } from "@/components/spotlight-card"

const STEPS = [
  { no: "01", icon: Footprints, title: "Getir", text: "Ayakkabını dükkana bırak. İki dakikanı alır." },
  { no: "02", icon: Sparkles, title: "Yıkayalım", text: "Malzemesine uygun yöntemle derin temizlik yapalım." },
  { no: "03", icon: Clock, title: "Aynı gün teslim al", text: "Akşam 20:00'ye kadar tertemiz hazır. Beklerken Bakırköy çarşıda işini gör." },
] as const

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BlurText
          as="h2"
          text="Üç adımda, aynı gün"
          animateBy="words"
          delay={60}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <div className="relative mt-12">
          {/* Akan çizgi (md+): kartların ikon hizasında, soldan sağa dolar — "Getir → Yıkayalım → Teslim al" akışı */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="pointer-events-none absolute left-[14%] right-[14%] top-[52px] hidden h-0.5 origin-left rounded-full bg-gradient-to-r from-primary/50 via-primary/25 to-primary/50 md:block"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.no}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative rounded-3xl border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.6, delay: 0.2 + i * 0.3 }}
                    className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary"
                  >
                    <s.icon className="size-5" />
                  </motion.div>
                  <span className="text-sm font-semibold text-muted-foreground">{s.no}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                <CardSpotlight />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
