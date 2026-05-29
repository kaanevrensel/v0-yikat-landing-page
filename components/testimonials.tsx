"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

/** Placeholder copy until 3 written-consent reviews land (Brief §10.3). */
const reviews = [
  {
    quote:
      "Sabah kapıdan aldılar, ertesi gün ütülü teslim. Haftada birkaç saatimi geri kazandım — artık düşünmüyorum bile.",
    name: "A.K.",
    area: "Çekmeköy",
    initials: "AK",
  },
  {
    quote:
      "Takım elbiselerim ilk günkü gibi döndü. Parça parça fotoğraflı liste gelince içim rahat etti. Kalite gerçekten farklı.",
    name: "S.D.",
    area: "Ataşehir",
    initials: "SD",
  },
  {
    quote:
      "Her hafta tekrarlayan siparişimi uygulamadan kuruyorum. Tek dokunuş, gerisini onlar hallediyor.",
    name: "M.E.",
    area: "Kadıköy",
    initials: "ME",
  },
]

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const card = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Testimonials() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl tracking-tight text-foreground sm:text-4xl"
        >
          Müşterilerimiz ne diyor
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {reviews.map((r) => (
            <motion.figure
              key={r.name}
              variants={card}
              className="flex flex-col rounded-2xl border border-border bg-card p-7"
            >
              <div className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber text-amber" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty text-[15px] italic leading-relaxed text-foreground">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-accent text-xs font-medium text-primary">
                  {r.initials}
                </span>
                <span className="text-sm text-muted-foreground">
                  {r.name}, {r.area}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
