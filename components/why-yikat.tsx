"use client"

import { motion } from "framer-motion"
import { Clock, ShieldCheck, CalendarCheck } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Zaman Kazandırır",
    desc: "Çamaşır yıkama servisiyle ayda ortalama 85 saat kazanırsınız. Yıkama, kurutma ve katlama derdi artık sizin değil.",
  },
  {
    icon: ShieldCheck,
    title: "Hijyen Standartları",
    desc: "Her sipariş için sterilize edilmiş ekipman ve yüksek kaliteli deterjanlar kullanıyoruz.",
  },
  {
    icon: CalendarCheck,
    title: "Düzenli Teslimat",
    desc: "Planlı teslimat, düzenli süreç. Her siparişte aynı güvenilirlikle zamanınızı daha verimli kullanın.",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function WhyYikat() {
  return (
    <section className="bg-muted/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {"Neden YIKAT?"}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {"Güvenilir, hijyenik ve zamanında hizmet"}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-6 sm:grid-cols-3"
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={cardVariants}
              className="rounded-2xl border border-border bg-card p-7 text-center transition-shadow hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <b.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
