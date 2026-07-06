"use client"

// Liquid-glass PillNav — reactbits.dev PillNav deseninden konsept ilhamıyla temiz-oda biçim
// (bileşen MCP kataloğunda yok; kaynak kopyalanmadı). Cam dili önceki full-width navbar'ın
// kanıtlanmış katmanları: blur+saturate iki yoğunluk, rim ışığı, üst sheen. Ağır SVG displacement
// bilinçle yok — hero videosu üstünde her frame yeniden hesaplanıp jank yaratırdı.
// "Liquid" davranış: link grubunun arkasındaki tek vurgu hapı layoutId ile hover/aktif bölüme akar.
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Menu, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LensFilter, LENS_FILTER_ID, useLensCapable, useLiquidLens } from "@/components/liquid-lens"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "#nasil-calisir", label: "Nasıl Çalışır" },
  { href: "#sonuclar", label: "Sonuçlar" },
  { href: "#fiyatlar", label: "Fiyatlar" },
  { href: "#sss", label: "SSS" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const visibleIds = useRef(new Set<string>())
  const pillRef = useRef<HTMLDivElement>(null)
  const solid = scrolled || open

  // Gerçek lensing yalnız Chromium md+ (spec: 2026-07-07-liquid-glass-navbar-design.md);
  // diğer motorlar aşağıdaki katmanlı frost'u alır (blur-first, lens-enhancement).
  const lensCapable = useLensCapable()
  const lens = useLiquidLens(pillRef, lensCapable)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // Aktif bölüm takibi: viewport ortasındaki dar bantla kesişen anchor hedefi kazanır;
  // hiçbiri kesişmiyorsa (hero, footer) vurgu hapı görünmez.
  useEffect(() => {
    const targets = NAV_LINKS.map((l) => document.querySelector<HTMLElement>(l.href)).filter(
      (t): t is HTMLElement => t !== null,
    )
    if (!targets.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = `#${e.target.id}`
          if (e.isIntersecting) visibleIds.current.add(id)
          else visibleIds.current.delete(id)
        }
        setActive(NAV_LINKS.map((l) => l.href).find((h) => visibleIds.current.has(h)) ?? null)
      },
      { rootMargin: "-40% 0px -55% 0px" },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  // Apple "regular" varyantı portu: blur iki scroll durumu arasında SABİT (backdrop'u video
  // üstünde yeniden filtreletmemek için — araştırma bulgusu); durumlar yalnız background
  // alfası + gölge + kenarlıkla ayrışır. Lens aktifken kırılma zinciri + düşük alfa: kırılma
  // görünür kalır, brightness lüminans ayarını üstlenir. Rim = 4-kenar inset speküler.
  const frost = lens
    ? `url(#${LENS_FILTER_ID}) blur(2px) saturate(165%) brightness(1.05)`
    : "blur(14px) saturate(170%)"
  const glass: React.CSSProperties = {
    backdropFilter: frost,
    WebkitBackdropFilter: frost,
    background: solid
      ? lens
        ? "rgba(255,255,255,0.60)"
        : "rgba(255,255,255,0.75)"
      : lens
        ? "rgba(255,255,255,0.28)"
        : "rgba(255,255,255,0.35)",
    boxShadow: solid
      ? "inset 0 1px 1px rgba(255,255,255,0.60), inset 0 -1px 1px rgba(255,255,255,0.25), inset 1px 0 1px rgba(255,255,255,0.18), inset -1px 0 1px rgba(255,255,255,0.18), 0 8px 30px rgba(4,44,83,0.12)"
      : "inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -1px 1px rgba(255,255,255,0.30), inset 1px 0 1px rgba(255,255,255,0.20), inset -1px 0 1px rgba(255,255,255,0.20), 0 4px 20px rgba(4,44,83,0.08)",
  }

  const liquidTarget = hovered ?? active

  return (
    <header className="fixed inset-x-3 top-3 z-50 md:inset-x-0 md:mx-auto md:w-fit">
      <div
        ref={pillRef}
        style={glass}
        // liquid-glass: reduced-transparency/contrast kemerleri (globals.css); translateZ(0)
        // hap'a kendi kompozit katmanını verir (video üstü backdrop perf — araştırma bulgusu).
        className={cn(
          "liquid-glass relative overflow-hidden rounded-full border transition-all duration-300 [transform:translateZ(0)]",
          solid ? "border-white/50" : "border-white/25",
        )}
      >
        {/* Cam sheeni: 135° speküler süpürme (Apple highlight katmanının statik portu) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.38),rgba(255,255,255,0.06)_30%,transparent_58%)]"
        />
        {/* Alt specular çizgi — kaydırınca belirir */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-300",
            solid ? "opacity-100" : "opacity-0",
          )}
        />
        <nav aria-label="Ana menü" className="relative z-10 flex h-12 items-center gap-1 pl-4 pr-2 md:gap-2">
          <Link href="/" aria-label="YIKAT ana sayfa" className="flex items-center pr-1">
            <Image src="/images/yikat-logo-blue.png" alt="" width={28} height={28} priority className="size-7" />
          </Link>

          <div className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onPointerEnter={() => setHovered(l.href)}
                // Klavye paritesi: Tab odağı da vurgu hapını taşısın (fare hover'ıyla aynı sinyal).
                onFocus={() => setHovered(l.href)}
                onBlur={() => setHovered(null)}
                // Jel basış (Apple .interactive() portu): hafif esneme; reduced-motion'da kapalı.
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm font-medium transition-[color,transform] duration-150 active:scale-[0.96] motion-reduce:transform-none",
                  liquidTarget === l.href ? "text-foreground" : solid ? "text-muted-foreground" : "text-foreground/80",
                )}
              >
                {liquidTarget === l.href && (
                  <motion.span
                    layoutId="nav-liquid-pill"
                    transition={{ type: "spring", duration: 0.45, bounce: 0 }}
                    className="absolute inset-0 rounded-full bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_6px_rgba(4,44,83,0.08)]"
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
          </div>

          <a
            href={siteConfig.phoneHref}
            aria-label={`Ara: ${siteConfig.phone}`}
            onClick={() => track("nav_call_click")}
            className={cn(
              "hidden rounded-full p-2 transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.94] motion-reduce:transform-none md:block",
              solid ? "text-muted-foreground" : "text-foreground/80",
            )}
          >
            <Phone className="size-4" />
          </a>
          <Button
            asChild
            size="sm"
            className="hidden rounded-full transition-transform duration-150 active:scale-[0.96] motion-reduce:transform-none md:inline-flex"
          >
            <a
              href={siteConfig.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("nav_directions_click")}
            >
              <MapPin className="size-4" /> Yol Tarifi
            </a>
          </Button>

          <button
            className="ml-auto p-2 transition-transform duration-150 active:scale-[0.94] motion-reduce:transform-none md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menü"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>

      {/* Mobil menü: hapın altına kopuk cam kart */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              background: "rgba(255,255,255,0.85)",
              boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.65), 0 12px 40px rgba(4,44,83,0.14)",
            }}
            className="liquid-glass mt-2 overflow-hidden rounded-2xl border border-white/50 md:hidden"
          >
            <nav aria-label="Mobil menü" className="flex flex-col gap-1 px-3 py-3">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Button asChild size="sm" className="flex-1 rounded-full">
                  <a
                    href={siteConfig.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setOpen(false)
                      track("nav_directions_click_mobile")
                    }}
                  >
                    <MapPin className="size-4" /> Yol Tarifi
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                  <a
                    href={siteConfig.phoneHref}
                    onClick={() => {
                      setOpen(false)
                      track("nav_call_click_mobile")
                    }}
                  >
                    <Phone className="size-4" /> Ara
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lens filtresi: yalnız Chromium md+ üretilir; harita hap boyutuyla birebir. */}
      {lens && <LensFilter lens={lens} />}
    </header>
  )
}
