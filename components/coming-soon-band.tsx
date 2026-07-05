"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

// Master plan (uygulama + kapıdan alım) sinyali — dükkan sitesinde uygulamayı fısıldayan tek yer.
// Form yok, app-store bağlantısı yok (uygulama henüz yok): saf teaser.
const SERVICES = ["Kuru temizleme", "Çamaşır", "Ütü", "Ayakkabı", "Hacimli tekstil"]

function AppScreen() {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className="relative shrink-0"
      animate={prefersReduced ? undefined : { y: [0, -10, 0] }}
      transition={prefersReduced ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Yumuşak parıltı — telefonun arkasında derinlik */}
      <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-primary/25 blur-3xl" />
      {/* Telefon çerçevesi */}
      <div className="h-[300px] w-[150px] rounded-[2.25rem] border border-white/15 bg-navy/70 p-2 shadow-2xl">
        {/* Ekran: uygulama açılış görünümü */}
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#1f5eb8] to-[#042c53]">
          <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/30" />
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Image src="/images/yikat-logo-white.png" alt="" width={36} height={36} className="size-9" />
          </div>
          <span className="text-base font-semibold tracking-tight text-white">YIKAT</span>
          <span className="text-[11px] font-medium text-white/60">çok yakında</span>
        </div>
      </div>
    </motion.div>
  )
}

export function ComingSoonBand() {
  return (
    <section
      aria-label="YIKAT uygulaması çok yakında — kapıdan alım, kapıya teslim, tüm tekstil bakımı tek uygulamada."
      className="py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#042c53] via-[#0a3d75] to-[#1f5eb8] px-6 py-12 sm:px-12 sm:py-14"
        >
          {/* Su kimliği: köşelerde soluk kabarcıklar */}
          <span aria-hidden className="pointer-events-none absolute -right-6 -top-8 size-32 rounded-full bg-white/5" />
          <span aria-hidden className="pointer-events-none absolute bottom-4 left-1/3 size-16 rounded-full bg-white/5" />

          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/15">
                <span className="relative flex size-2">
                  <ReducedPing />
                  <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
                </span>
                Çok yakında
              </span>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
                YIKAT uygulaması çok yakında
              </h2>
              <p className="mt-3 max-w-md text-pretty text-white/75">
                Kapıdan alım, kapıya teslim. Kuru temizlemeden ayakkabı bakımına, tüm tekstil işiniz İstanbul'un her
                yerinde tek uygulamada. Bakırköy dükkanımız açık — gerisi çok yakında yanınızda.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto">
              <AppScreen />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Nabız halkası — reduced-motion'da görünmez (animate-ping kapalı).
function ReducedPing() {
  const prefersReduced = useReducedMotion()
  if (prefersReduced) return null
  return (
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70 [animation-duration:2s]" />
  )
}
