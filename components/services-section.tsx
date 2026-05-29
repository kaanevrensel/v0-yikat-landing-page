"use client"

import { motion } from "framer-motion"
import { Shirt, WashingMachine, Footprints, BedDouble } from "lucide-react"

/** Thin-line iron icon — lucide has no iron; matches the outline set (Brief §8.4). */
function IronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 16a8 8 0 0 1 8-8h7a3 3 0 0 1 3 3v5z" />
      <path d="M3 16v2a1 1 0 0 0 1 1h16" />
      <path d="M16 8V6a2 2 0 0 0-2-2H9" />
    </svg>
  )
}

/** Kuru Temizleme always first; equal weight, icon + name only (Brief §5.4). */
const services = [
  { name: "Kuru Temizleme", Icon: Shirt },
  { name: "Çamaşır", Icon: WashingMachine },
  { name: "Ütü", Icon: IronIcon },
  { name: "Ayakkabı", Icon: Footprints },
  { name: "Hacimli", Icon: BedDouble },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export function ServicesSection() {
  return (
    <section id="hizmetler" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl tracking-tight text-foreground sm:text-4xl"
        >
          Tek uygulamadan tüm tekstil bakımı
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {services.map(({ name, Icon }) => (
            <motion.div
              key={name}
              variants={item}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-7 text-center transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-7" />
              </div>
              <span className="text-sm font-medium text-foreground sm:text-base">
                {name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Single deliberate-openness line (Brief §5.4 / §8.5) */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Hizmet detayları uygulamada — adresini gir, sana uygun olanı keşfet.
        </p>
      </div>
    </section>
  )
}
