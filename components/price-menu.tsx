"use client"

import { motion } from "framer-motion"
import { priceMenu } from "@/lib/site"
import BlurText from "@/components/blur-text"

export function PriceMenu() {
  return (
    <section id="fiyatlar" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <BlurText
          as="h2"
          text="Fiyat menüsü"
          animateBy="words"
          delay={60}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Kategoriye göre sabit fiyat. Menü çok yakında burada — şimdilik dükkanda.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {priceMenu.map((item, i) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center justify-between rounded-2xl border bg-card px-5 py-4"
            >
              <div>
                <h3 className="font-semibold">{item.category}</h3>
                <p className="text-sm text-muted-foreground">{item.note}</p>
              </div>
              {item.price ? (
                <span className="text-lg font-semibold">{item.price}</span>
              ) : (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Menü yakında
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
