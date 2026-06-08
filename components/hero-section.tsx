"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, MapPin } from "lucide-react"
import { AppDownloadButton } from "@/components/app-download-button"

export function HeroSection() {
  const [address, setAddress] = useState("")
  const entered = address.trim().length > 2

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28">
      {/* Soft brand gradient + drifting accents */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, #e6f1fb 0%, #f3f8ff 45%, #ffffff 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-primary/10 blur-3xl motion-reduce:animate-none"
        style={{ animation: "hero-drift-1 28s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-24 size-80 rounded-full bg-primary/5 blur-3xl motion-reduce:animate-none"
        style={{ animation: "hero-drift-2 32s ease-in-out infinite" }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[60%_40%] lg:gap-8 lg:px-8">
        {/* Left column */}
        <div className="text-center lg:text-left">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-balance text-[2rem] leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
          >
            Siz işinize bakın.
            <br />
            <span className="text-primary">Kirliler bize emanet.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            Kuru temizleme, çamaşır, ütü ve daha fazlası. Kapıdan toplama,
            profesyonel temizlik, kapıya teslim. Profesyonel temizlik ve yıkama hizmeti
          </motion.p>

          {/* Address input + App CTA — desktop only (Brief §9.3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8"
          >
            <div className="hidden items-center gap-2 rounded-full border border-border bg-background p-1.5 shadow-sm sm:flex sm:max-w-md lg:mx-0">
              <div className="flex flex-1 items-center gap-2 pl-3 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Mahalleni yaz, başlayalım"
                  aria-label="Adres"
                  className="w-full bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <AppDownloadButton
                label="App’i İndir"
                size="default"
                showArrow={false}
                event="hero_app_download_click"
                className="px-5"
              />
            </div>

            {/* Mobile: straight to App download */}
            <div className="sm:hidden">
              <AppDownloadButton
                label="App’i İndir"
                event="hero_app_download_click"
                className="w-full justify-center"
              />
            </div>

            <p
              className="mt-2 text-center text-xs text-muted-foreground transition-opacity sm:text-left"
              style={{ opacity: entered ? 1 : 0 }}
              aria-hidden={!entered}
            >
              Adresini uygulamada gireceksin — hadi başlayalım.
            </p>
          </motion.div>

          {/* Social proof mini */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-6 flex items-center justify-center gap-2 lg:justify-start"
          >
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber text-amber" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              1.500+ sipariş · 400+ memnun müşteri
            </span>
          </motion.div>
        </div>

        {/* Right column — hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-muted shadow-xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/images/yikat-logo-blue.png"
              className="size-full object-cover motion-reduce:hidden"
            >
              <source src="/videos/laundry-bg.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
          </div>
          {/* Floating guarantee chip */}
          <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-background px-4 py-3 shadow-lg sm:block">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              YIKAT Garantisi
            </p>
            <p className="mt-0.5 text-sm text-foreground">
              Memnun kalmazsan ücretsiz tekrar
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
