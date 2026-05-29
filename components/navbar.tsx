"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { AppDownloadButton } from "@/components/app-download-button"

const navLinks = [
  { label: "Hizmetler", href: "/#hizmetler" },
  { label: "Nasıl Çalışır", href: "/#nasil-calisir" },
  { label: "Bölgeler", href: "/#bolgeler" },
  { label: "Partner Ol", href: "/partnerlik" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" aria-label="YIKAT ana sayfa" className="shrink-0">
          <Image
            src="/images/yikat-logo-blue.png"
            alt="YIKAT"
            width={240}
            height={96}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <AppDownloadButton
            label="App İndir"
            size="sm"
            showArrow={false}
            event="nav_app_download_click"
            className="px-5 text-sm"
          />
        </div>

        {/* Mobile: sticky App İndir + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <AppDownloadButton
            label="App İndir"
            size="sm"
            showArrow={false}
            event="nav_app_download_click_mobile"
            className="px-4 text-sm"
          />
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menüyü aç/kapat"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg py-2.5 text-sm text-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
