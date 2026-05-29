"use client"

import { motion } from "framer-motion"
import { StoreBadges } from "@/components/store-badges"

export function AppBand() {
  return (
    <section className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8 rounded-3xl bg-card px-6 py-10 text-center shadow-sm sm:px-12 lg:flex-row lg:justify-between lg:text-left"
        >
          <div>
            <h2 className="text-2xl tracking-tight text-foreground sm:text-3xl">
              Tüm sipariş akışı uygulamada
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              Adres, takip, ödeme, abonelik — telefonundan.
            </p>
          </div>
          <StoreBadges className="justify-center" />
        </motion.div>
      </div>
    </section>
  )
}
