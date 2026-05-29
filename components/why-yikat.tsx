"use client"

import { motion } from "framer-motion"
import { Clock, ShieldCheck, Camera, Store } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Zamanını geri ver",
    desc: "Sipariş, takip, teslim — hepsi telefonundan. WhatsApp’a, telefona, randevuya gerek yok.",
  },
  {
    icon: ShieldCheck,
    title: "YIKAT Garantisi",
    desc: "Memnun değilsen ücretsiz tekrar temizleriz. Hasarda açık iade prosedürü.",
  },
  {
    icon: Camera,
    title: "Parça parça şeffaflık",
    desc: "Sipariş alındığında tüm parçaların fotoğraflı listesi mailine gelir.",
  },
  {
    icon: Store,
    title: "Mahalle ustalığı",
    desc: "Tek bir merkez değil — İstanbul’un seçilmiş partner dükkanlarıyla.",
  },
]

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const card = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function WhyYikat() {
  return (
    <section id="neden-yikat" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl tracking-tight text-foreground sm:text-4xl"
        >
          Neden YIKAT
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-6 sm:grid-cols-2"
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={card}
              className="flex gap-5 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                <b.icon className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {b.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
