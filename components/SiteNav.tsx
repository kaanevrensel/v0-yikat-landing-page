"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const WHATSAPP_URL =
  "https://wa.me/908503033193?text=Merhaba%2C%20sipari%C5%9F%20vermek%20istiyorum."

const links = [
  { label: "Hizmetler",    href: "#hizmetler" },
  { label: "Nasıl Çalışır", href: "#nasil" },
  { label: "Fiyatlar",     href: "#fiyatlar" },
  { label: "SSS",          href: "#sss" },
] as const

export function SiteNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <header
        role="banner"
        className="fixed inset-x-0 top-0 z-50 h-14 border-b border-[#E5E7EB] bg-[#FAFAF7] md:h-16"
      >
        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-6 lg:px-[80px]">
          <a href="#basla" aria-label="YIKAT ana sayfa" className="flex items-center">
            <Image
              src="/images/yikat-logo-blue.png"
              alt="YIKAT"
              width={80}
              height={32}
              className="h-6 w-auto md:h-7"
              priority
            />
          </a>

          <nav aria-label="Ana gezinti" className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[#0F172A] transition-colors hover:text-[#2798ff]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-full bg-[#2798ff] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1a7de8] md:h-10 md:px-5"
            >
              Sipariş Ver
            </a>
            <button
              type="button"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-9 items-center justify-center rounded-md text-[#0F172A] transition-colors hover:bg-[#F5F5F2] md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-14 z-40 border-b border-[#E5E7EB] bg-[#FAFAF7] md:hidden"
          >
            <nav aria-label="Mobil gezinti" className="mx-auto max-w-[1400px] px-6 py-4">
              <ul className="flex flex-col gap-2" role="list">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2 py-3 text-base font-medium text-[#0F172A] hover:bg-[#F5F5F2]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
