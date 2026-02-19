"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, Footprints } from "lucide-react"

const packages = [
  {
    name: "Küçük Paket",
    desc: "Tek kişilik veya haftalık yıkamalar için",
    price: "459",
    recommended: false,
    features: [
      "4 kg'a kadar çamaşır",
      "Yıkama ve katlama",
      "Özel kıyafet bakımı",
      "Ütü opsiyonel (+30\u20BA)",
    ],
  },
  {
    name: "Standart Paket",
    desc: "Aileler ve düzenli kullanım için",
    price: "679",
    recommended: true,
    features: [
      "10 kg'a kadar çamaşır",
      "Yıkama ve katlama",
      "Özel kıyafet bakımı",
      "Ütü opsiyonel (+30\u20BA)",
    ],
  },
]

const shoeFeatures = ["Spor Ayakkabı", "Klasik / Deri", "Bot / Kalın"]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function PricingSection({
  whatsappUrl,
}: {
  whatsappUrl: string
}) {
  return (
    <section id="paketler" className="relative overflow-hidden py-20 sm:py-28">
      {/* Ambient video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover opacity-[0.07] blur-xl motion-reduce:hidden"
        aria-hidden="true"
      >
        <source src="/videos/laundry-bg.mp4" type="video/mp4" />
      </video>
      {/* Overlay layers for readability */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {"Paketler & Fiyatlar"}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {"İhtiyacınıza uygun paketi seçin, hemen başlayın"}
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-14 grid max-w-3xl gap-6 lg:grid-cols-2"
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.name}
              variants={itemVariants}
              className={`relative rounded-2xl border bg-card p-7 transition-shadow hover:shadow-md ${
                pkg.recommended
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                    {"Önerilen"}
                  </Badge>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{pkg.desc}</p>
              </div>

              <div className="mt-6 text-center">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {pkg.price}
                </span>
                <span className="ml-1 text-lg font-semibold text-muted-foreground">
                  {"\u20BA"}
                </span>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {"/ sipariş"}
                </p>
              </div>

              {/* Delivery badge */}
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <Clock className="size-3" />
                  {"24-48 saat arası teslim"}
                </div>
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-3" role="list">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check
                      className={`size-4 shrink-0 ${
                        pkg.recommended ? "text-primary" : "text-primary/70"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`mt-7 w-full rounded-full text-sm font-semibold ${
                  pkg.recommended
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-foreground text-card hover:bg-foreground/90"
                }`}
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  {"Sipariş Ver"}
                </a>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Shoe cleaning card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-8 max-w-md"
        >
          <div className="rounded-2xl border border-border bg-card p-7 text-center transition-shadow hover:shadow-md">
            <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Footprints className="size-5" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {"Ayakkabı Yıkama"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {"Ayakkabılarınız için özel yıkama hizmeti"}
            </p>

            <ul className="mt-5 space-y-2.5" role="list">
              {shoeFeatures.map((f) => (
                <li key={f} className="flex items-center justify-center gap-2 text-sm text-foreground">
                  <Check className="size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="mt-6 w-full rounded-full bg-foreground text-card hover:bg-foreground/90 text-sm font-semibold"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {"Sipariş Ver"}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
