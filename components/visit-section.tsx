"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"
import BlurText from "@/components/blur-text"
import Magnet from "@/components/magnet"
import { useDirectionsUrl } from "@/hooks/use-directions-url"

// Gerçek İstanbul saatine göre açık/kapalı durumu. SSR + ilk render nötr metin basar
// (hydration uyuşmazlığı olmaz); durum yalnız mount sonrası hesaplanır.
function OpenStatus() {
  const prefersReduced = useReducedMotion()
  const [status, setStatus] = useState<"unknown" | "open" | "closed">("unknown")
  const [opensToday, setOpensToday] = useState(false)

  useEffect(() => {
    const compute = () => {
      const hour = Number(
        new Intl.DateTimeFormat("tr-TR", { hour: "numeric", hour12: false, timeZone: "Europe/Istanbul" }).format(new Date()),
      )
      setStatus(hour >= 9 && hour < 20 ? "open" : "closed")
      setOpensToday(hour < 9)
    }
    compute()
    const id = setInterval(compute, 60_000)
    return () => clearInterval(id)
  }, [])

  if (status === "unknown")
    return (
      <span className="flex flex-col gap-1">
        <span>{siteConfig.hours.label}</span>
        <span aria-hidden className="invisible flex items-center gap-2 text-sm">
          <span className="size-2.5" />
          Şu an açık, 20:00'ye kadar bırakabilirsin
        </span>
      </span>
    )

  return (
    <span className="flex flex-col gap-1">
      <span>{siteConfig.hours.label}</span>
      <span className="flex items-center gap-2 text-sm">
        <span className="relative flex size-2.5">
          {status === "open" && !prefersReduced && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 [animation-duration:2s]" />
          )}
          <span className={`relative inline-flex size-2.5 rounded-full ${status === "open" ? "bg-emerald-400" : "bg-white/60"}`} />
        </span>
        {/* Saks (#2563eb) üzerinde emerald-300 3.39:1 kalıyor; emerald-50 ≈4.9:1 (AA) — yeşil sinyal nokta + tonda sürüyor */}
        {status === "open" ? (
          <span className="text-emerald-50">Şu an açık — 20:00'ye kadar bırakabilirsin</span>
        ) : (
          <span className="text-white">{`Şu an kapalı — ${opensToday ? "bugün" : "yarın"} 09:00'da açılıyor`}</span>
        )}
      </span>
    </span>
  )
}

export function VisitSection() {
  const directionsUrl = useDirectionsUrl()
  return (
    <section id="ziyaret" className="scroll-mt-20 bg-navy py-20 text-navy-foreground sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <BlurText
            as="h2"
            text="Dükkana bekleriz"
            animateBy="words"
            delay={60}
            className="text-3xl font-semibold tracking-tight md:text-4xl"
          />
          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-[#9cc3f5]" />
              <span>{siteConfig.address.full}</span>
            </li>
            <li className="flex items-start gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-[#9cc3f5]" />
              <OpenStatus />
            </li>
            <li className="flex items-start gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-[#9cc3f5]" />
              <a href={siteConfig.phoneHref} className="hover:underline" onClick={() => track("visit_call_click")}>
                {siteConfig.phone}
              </a>
            </li>
          </ul>
          {/* Doğal konum paragrafı (tek, gerçek) — programatik mahalle sayfası ASLA açılmaz (spec). */}
          <p className="mt-6 max-w-md text-sm text-white">
            İstanbul Caddesi'nin bir alt sokağındayız. Bakırköy ve Yenimahalle Marmaray istasyonlarının
            ikisine de 8 dakika uzaklıkta. Marmaray'dan inip bırak, dönüşte tertemiz al.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnet maxShift={8}>
              <Button asChild size="lg" className="cta-ripple rounded-full bg-white text-navy hover:bg-white/90">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("visit_directions_click")}
                >
                  <MapPin className="size-4" /> Yol Tarifi Al
                </a>
              </Button>
            </Magnet>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="cta-ripple rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={siteConfig.phoneHref} onClick={() => track("visit_call_click")}>
                <Phone className="size-4" /> Ara
              </a>
            </Button>
            {/* WhatsApp CTA — dolgu markanın koyu yeşili: açık yeşil #25D366 üstünde beyaz 2.0:1
                kalır (AA/axe geçmez), #0f8442 beyazla ≈4.8:1. Logo Simple Icons (CC0). */}
            <Button asChild size="lg" className="cta-ripple rounded-full bg-[#0f8442] text-white hover:bg-[#0c6f37]">
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("visit_whatsapp_click")}
              >
                <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp'tan yaz
              </a>
            </Button>
          </div>
          <a
            href={siteConfig.appleDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("visit_apple_maps_click")}
            className="mt-3 inline-block text-sm text-white underline-offset-4 hover:text-white hover:underline"
          >
            Apple Haritalar'da aç
          </a>
        </motion.div>

        {/* Gerçek statik harita (Carto/OSM render'ı, pin: siteConfig.geo — 2026-07-12) */}
        <motion.a
          href={siteConfig.mapsPlaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("visit_map_click")}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-white/15"
          aria-label="Haritada aç: YIKAT Bakırköy"
        >
          <img
            src="/images/map/dukkan-harita.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {/* OSM/CARTO atıfı — lisans gereği kaldırılamaz (ODbL); en silik meşru biçim: minik köşe etiketi */}
          <span className="absolute bottom-1.5 right-2 rounded bg-white/60 px-1.5 py-0.5 text-[9px] leading-none text-[#1F2937]/75">
            © OSM · CARTO
          </span>
          <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1d4fc4] shadow-lg">
            <MapPin className="size-4" /> Haritada aç
          </span>
        </motion.a>
      </div>
    </section>
  )
}
