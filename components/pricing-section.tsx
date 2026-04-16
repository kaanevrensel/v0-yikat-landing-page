"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Clock, Footprints, MessageCircle, Weight, Sofa, Shirt } from "lucide-react"

const services = [
  {
    name: "Kiloyla Yıkat",
    icon: Weight,
    price: "110",
    unit: "TL / kg",
    description: "4 kg ve üstü siparişlerde servis ücretsiz.",
    recommended: false,
    features: [
      "Yıkama ve kurutma",
      "Katlama",
      "Özel kıyafet bakımı",
    ],
  },
  {
    name: "Hacimli Yıkama",
    icon: Sofa,
    description: "Yorgan, çarşaf ve benzeri hacimli ürünler için.",
    recommended: false,
    cta: true,
    features: [
      "Yorgan yıkama",
      "Çarşaf & nevresim",
      "Battaniye",
      "Perde yıkama",
    ],
  },
  {
    name: "Ütü Hizmeti",
    icon: Shirt,
    price: "30",
    unit: "TL / parça",
    description: "Kıyafetleriniz için profesyonel ütü hizmeti.",
    recommended: false,
    features: [
      "Gömlek & bluz",
      "Pantolon & etek",
      "Takım elbise",
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
           {"Çamaşır ve Ayakkabı Yıkama Hizmetleri & Fiyatlar"}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {"Kilo bazlı çamaşır yıkama, ütü ve ayakkabı temizleme. Çekmeköy'e kapıdan teslim"}
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((svc) => (
            <motion.div
              key={svc.name}
              variants={itemVariants}
              className={`relative flex flex-col rounded-2xl border bg-card p-7 transition-shadow hover:shadow-md ${
                svc.recommended
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {svc.icon && (
                <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svc.icon className="size-5" />
                </div>
              )}

              {/* Content grows so the CTA buttons align across grid rows */}
              <div className="flex flex-1 flex-col">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">
                    {svc.name}
                  </h3>
                  {svc.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{svc.description}</p>
                  )}
                </div>

                {svc.price && (
                  <div className="mt-6 text-center">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                      {svc.price}
                    </span>
                    <span className="ml-1 text-lg font-semibold text-muted-foreground">
                      {svc.unit}
                    </span>
                  </div>
                )}

                {/* Features */}
                {svc.features && (
                  <ul className="mt-5 space-y-2.5" role="list">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-center justify-center gap-2 text-sm text-foreground">
                        <Check className="size-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Delivery badge */}
                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                    <Clock className="size-3" />
                    {"24-48 saat arası teslim"}
                  </div>
                </div>
              </div>

              {svc.cta ? (
                <Button
                  asChild
                  className="mt-7 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 size-4" />
                    {"Teklif Al"}
                  </a>
                </Button>
              ) : (
                <Button
                  asChild
                  className="mt-7 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    {"Sipariş Ver"}
                  </a>
                </Button>
              )}
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
              className="mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold"
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
