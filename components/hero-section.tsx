"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection({ whatsappUrl }: { whatsappUrl: string }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.93 0.03 230) 0%, oklch(0.97 0.01 240) 50%, oklch(0.99 0.002 240) 100%)",
        }}
      />
      {/* Subtle decorative circles */}
      <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {"Şimdi hizmet veriyoruz"}
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {"Çamaşır yükünü"}
            <br />
            <span className="text-primary">{"biz alalım."}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {"Çamaşır yıkama, katlama ve ütüleme işlerini bize bırakın."}
            <br className="hidden sm:block" />
            {"Zamanınızı kendinize ayırın, biz gerisini halledelim."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {"Sipariş Ver"}
                <ArrowRight className="ml-1 size-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-full border-border px-7 text-base font-semibold text-foreground"
            >
              <a href="#nasil-calisir">{"Nasıl Çalışır?"}</a>
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex items-center gap-4"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((letter) => (
                <div
                  key={letter}
                  className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-semibold text-secondary-foreground"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {"500+"}
              </span>
              <span className="text-sm text-muted-foreground">
                {"mutlu müşteri"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
