"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Minimal navy partner signal box (Brief §5.10). Detail lives on /partnerlik. */
export function PartnerCta() {
  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-8 rounded-3xl bg-navy px-7 py-10 text-navy-foreground sm:px-12 sm:py-12 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-widest text-primary">
              Kuru temizlemeci misiniz?
            </span>
            <h2 className="mt-3 text-2xl leading-snug tracking-tight text-white sm:text-3xl">
              Yıkat ile dükkanınıza istikrarlı sipariş trafiği.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Sıfır komisyon ile başlayın. Biz size müşteri getiriyoruz, siz
              kendi fiyatınızla çalışıyorsunuz.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="shrink-0 rounded-full bg-white px-7 text-base font-medium text-navy hover:bg-white/90"
          >
            <a href="/partnerlik">
              Partner Başvurusu
              <ArrowRight className="ml-1 size-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
