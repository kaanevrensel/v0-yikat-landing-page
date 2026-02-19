"use client"

import { motion } from "framer-motion"
import { Truck, Sparkles, Shirt, PackageCheck } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: Truck,
    title: "Teslim Alıyoruz",
    desc: "Çamaşırlarınızı kapınızdan alıyoruz. Size uygun zamanda geliyoruz.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "Yıkıyoruz",
    desc: "Profesyonel ekibimiz özenle yıkıyor, kurutuyor ve katlıyor.",
  },
  {
    num: "03",
    icon: Shirt,
    title: "İsterseniz Ütü",
    desc: "Ütü seçeneğiyle kıyafetleriniz kullanıma hazır şekilde teslim edilir.",
  },
  {
    num: "04",
    icon: PackageCheck,
    title: "Teslim Ediyoruz",
    desc: "Tertemiz çamaşırlarınızı paketli olarak kapınıza teslim ediyoruz.",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {"Nasıl Çalışır?"}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {"Dört basit adımda çamaşır derdinizden kurtulun"}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={cardVariants}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              {/* Step number badge */}
              <div className="absolute -top-3 right-4 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {step.num}
              </div>

              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
