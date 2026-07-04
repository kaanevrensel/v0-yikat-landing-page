"use client"

import { motion } from "framer-motion"
import { Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"

export function VisitSection() {
  return (
    <section id="ziyaret" className="scroll-mt-20 bg-navy py-20 text-navy-foreground sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Dükkana bekleriz</h2>
          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-[#9cc3f5]" />
              <span>{siteConfig.address.full}</span>
            </li>
            <li className="flex items-start gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-[#9cc3f5]" />
              <span>{siteConfig.hours.label}</span>
            </li>
            <li className="flex items-start gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-[#9cc3f5]" />
              <a href={siteConfig.phoneHref} className="hover:underline" onClick={() => track("visit_call_click")}>
                {siteConfig.phone}
              </a>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-white text-navy hover:bg-white/90">
              <a
                href={siteConfig.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("visit_directions_click")}
              >
                <MapPin className="size-4" /> Yol Tarifi Al
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={siteConfig.phoneHref} onClick={() => track("visit_call_click")}>
                <Phone className="size-4" /> Ara
              </a>
            </Button>
          </div>
          <a
            href={siteConfig.appleDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("visit_apple_maps_click")}
            className="mt-3 inline-block text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
          >
            Apple Haritalar'da aç
          </a>
        </motion.div>

        {/* Statik harita placeholder'ı — tıklayınca Google Maps (spec §3.6). Gerçek statik harita görseli Görev 17'de. */}
        <motion.a
          href={siteConfig.mapsPlaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("visit_map_click")}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white/5 transition-colors hover:bg-white/10"
          aria-label="Haritada aç: YIKAT Bakırköy"
        >
          <div className="text-center">
            <MapPin className="mx-auto size-10 text-[#9cc3f5]" />
            <p className="mt-3 font-semibold">İskele Cd. 15C, Bakırköy</p>
            <p className="mt-1 text-sm text-white/70">Haritada açmak için tıkla</p>
          </div>
        </motion.a>
      </div>
    </section>
  )
}
