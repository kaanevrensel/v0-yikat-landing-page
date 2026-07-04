"use client"

import { motion } from "framer-motion"
import { Clock, Gem, ShieldCheck } from "lucide-react"
import { valueProps } from "@/lib/site"

const ICONS = { clock: Clock, shield: ShieldCheck, gem: Gem } as const

export function ValueBand() {
  return (
    <section className="bg-muted py-12">
      <h2 className="sr-only">Neden YIKAT</h2>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        {valueProps.map((v, i) => {
          const Icon = ICONS[v.icon]
          return (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-4"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
