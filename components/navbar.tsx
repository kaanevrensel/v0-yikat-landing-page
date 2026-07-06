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
  const solid = scrolled || open

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

  const glass: React.CSSProperties = solid
    ? {
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        background: "rgba(255,255,255,0.75)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.65), inset 0 -1px 0 0 rgba(255,255,255,0.15), 0 8px 30px rgba(4,44,83,0.12)",
      }
    : {
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)",
        background: "rgba(255,255,255,0.35)",
        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.5), 0 4px 20px rgba(4,44,83,0.08)",
      }

  const liquidTarget = hovered ?? active

  return (
    <header className="fixed inset-x-3 top-3 z-50 md:inset-x-0 md:mx-auto md:w-fit">
      <div
        style={glass}
        className={cn(
          "relative overflow-hidden rounded-full border transition-all duration-300",
          solid ? "border-white/50" : "border-white/25",
        )}
      >
        {/* Cam sheeni: üst yarıda ince ışıma (liquid glass speküler yüzeyi) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-full bg-gradient-to-b from-white/25 to-transparent"
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
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
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
              "hidden rounded-full p-2 transition-colors hover:text-foreground md:block",
              solid ? "text-muted-foreground" : "text-foreground/80",
            )}
          >
            <Phone className="size-4" />
          </a>
          <Button asChild size="sm" className="hidden rounded-full md:inline-flex">
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
            className="ml-auto p-2 md:hidden"
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
            className="mt-2 overflow-hidden rounded-2xl border border-white/50 md:hidden"
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
    </header>
  )
}
