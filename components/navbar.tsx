"use client"

import { useEffect, useState } from "react"
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        solid ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-300",
          solid ? "opacity-100" : "opacity-0",
        )}
      />
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="YIKAT ana sayfa" className="flex items-center gap-2">
          <Image src="/images/yikat-logo-blue.png" alt="" width={28} height={28} priority className="size-7" />
          <span className="text-lg font-semibold tracking-tight text-foreground">YIKAT</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                solid ? "text-muted-foreground" : "text-foreground/80",
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={siteConfig.phoneHref}
            aria-label={`Ara: ${siteConfig.phone}`}
            onClick={() => track("nav_call_click")}
            className={cn(
              "transition-colors hover:text-foreground",
              solid ? "text-muted-foreground" : "text-foreground/80",
            )}
          >
            <Phone className="size-4" />
          </a>
          <Button asChild size="sm" className="rounded-full">
            <a
              href={siteConfig.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("nav_directions_click")}
            >
              <MapPin className="size-4" /> Yol Tarifi
            </a>
          </Button>
        </div>

        <button
          className="-m-2 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menü"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b bg-background md:hidden"
          >
            <nav aria-label="Mobil menü" className="flex flex-col gap-1 px-4 py-3">
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
