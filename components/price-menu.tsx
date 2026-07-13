"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { priceMenu, siteConfig } from "@/lib/site"
import { services } from "@/lib/services"
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
          Sneaker yıkamadan süet temizliğine, kategoriye göre sabit fiyat,{" "}
          <span className="font-semibold text-foreground">{siteConfig.priceRangeLabel}</span> aralığında. Kesin
          menü çok yakında burada.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {priceMenu.map((item, i) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border bg-card transition-shadow hover:shadow-md"
            >
              {(() => {
                const svc = services.find((sv) => sv.priceCategory === item.category)
                const inner = (
                  <span className="flex items-center justify-between px-5 py-4">
                    <span>
                      <h3 className="font-semibold">{item.category}</h3>
                      <p className="text-sm text-muted-foreground">{item.note}</p>
                      {svc && <span className="mt-1 inline-block text-sm font-medium text-[#1d4fc4]">Detaylı bilgi →</span>}
                    </span>
                    {item.price ? (
                      <span className="text-lg font-semibold">{item.price}</span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                        Menü yakında
                      </span>
                    )}
                  </span>
                )
                return svc ? <Link href={`/${svc.slug}`} className="block rounded-2xl">{inner}</Link> : inner
              })()}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
