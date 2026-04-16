"use client"

import { motion } from "framer-motion"
import { Truck, Sparkles, Shirt, PackageCheck } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: Truck,
    title: "Kapınızdan Teslim Alıyoruz",
    desc: "Çamaşır toplama servisiyle kapınıza geliyoruz. Siz saati seçin, biz gelip alalım.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "Profesyonelce Yıkıyoruz",
    desc: "Çamaşırlarınızı profesyonel ekibimiz özenle yıkıyor, kurutuyor ve katlıyor.",
  },
  {
    num: "03",
    icon: Shirt,
    title: "İsterseniz Ütülüyoruz",
    desc: "Ütü hizmeti seçeneğiyle kıyafetleriniz kullanıma hazır şekilde teslim edilir.",
  },
  {
    num: "04",
    icon: PackageCheck,
    title: "Kapınıza Teslim Ediyoruz",
    desc: "Tertemiz çamaşırlarınızı 24-48 saat içinde paketli olarak kapınıza teslim ediyoruz.",
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
           {"Kapıdan çamaşır toplama, yıkama ve teslim. 4 basit adımda."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
           <span>✓ 24–48 saat teslim</span>
           <span>✓ Kilo bazlı fiyat</span>
           <span>✓ WhatsApp ile hızlı sipariş</span>
          </div>
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
