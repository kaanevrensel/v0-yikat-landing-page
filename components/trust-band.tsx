"use client"

import { motion } from "framer-motion"
import { trustStats } from "@/lib/site"

export function TrustBand() {
  return (
    <section className="bg-muted py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-16"
        >
          {trustStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl tracking-tight text-foreground sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
