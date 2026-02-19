"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaBand({ whatsappUrl }: { whatsappUrl: string }) {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.58 0.19 250) 0%, oklch(0.52 0.2 245) 100%)",
      }}
    >
      {/* Subtle decorative */}
      <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-white/5 blur-2xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {"Bugün dene, ilk siparişini ver."}
          </h2>
          <p className="mt-3 text-base text-white/80 sm:text-lg">
            {"Hayatınızı kolaylaştırmak için bir sipariş kadar yakınsınız."}
          </p>
          <Button
            asChild
            size="lg"
            className="mt-7 rounded-full border border-white/20 bg-white px-7 text-base font-semibold text-foreground hover:bg-white/90"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              {"Sipariş Ver"}
              <ArrowRight className="ml-1 size-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
