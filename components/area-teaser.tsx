"use client"

import { motion } from "framer-motion"

export function AreaTeaser() {
  return (
    <section id="bolgeler" className="bg-muted py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-sm sm:px-12"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            Hizmet bölgesi
          </span>
          <p className="mx-auto mt-5 max-w-xl text-balance text-2xl leading-snug tracking-tight text-foreground sm:text-3xl">
            Anadolu yakasına genişliyoruz. Sıradaki sizin mahalleniz olabilir.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Hangi mahallelerde olduğumuzu uygulamada adresini girince görürsün.
            Listemiz her hafta büyüyor.
          </p>

          {/* Growth indicator (not a carousel): 2 active, next one "filling", rest pending */}
          <div className="mt-8 flex items-center justify-center gap-2.5" aria-hidden="true">
            {[true, true, false, false, false].map((active, i) => {
              const isNext = i === 2 // first pending dot — pulses to signal "büyüyoruz"
              return (
                <span key={i} className="relative flex size-2.5">
                  {isNext && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
                  )}
                  <span
                    className={
                      active
                        ? "relative size-2.5 rounded-full bg-primary"
                        : isNext
                          ? "relative size-2.5 rounded-full bg-primary/50"
                          : "relative size-2.5 rounded-full bg-primary/20"
                    }
                  />
                </span>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
