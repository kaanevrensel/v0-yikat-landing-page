"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion, useScroll } from "framer-motion"
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
  const [isScrolled, setIsScrolled] = useState(false)
  // Suppress the 150ms crossfade on initial render so anchor-link mid-page
  // loads (e.g. /landing#hizmetler) don't flash a transition between the
  // transparent and glass states. Cleared on the first real scroll event.
  const [noTransition, setNoTransition] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // Initial sync: if the page already starts scrolled (anchor-link load,
  // browser scroll restoration), set the glass state immediately without
  // animation. The MV listener below handles every subsequent crossing.
  useEffect(() => {
    if (scrollY.get() > 0) setIsScrolled(true)
    // Release the no-transition guard on the next frame so the very first
    // scroll-driven crossfade still animates normally.
    const id = requestAnimationFrame(() => setNoTransition(false))
    return () => cancelAnimationFrame(id)
  }, [scrollY])

  // Threshold (not ramp): toggle a boolean only when scroll crosses 0.
  // Early-return guard avoids per-frame React re-renders.
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => {
      const next = v > 0
      setIsScrolled((prev) => (prev === next ? prev : next))
    })
    return () => unsubscribe()
  }, [scrollY])

  // Suppress the CSS transition when reduced-motion is requested OR on the
  // initial render (anchor-link guard). Otherwise: 150ms ease-out crossfade
  // on background-color, border-color, box-shadow only — blur stays constant.
  // Normalize boolean | null from useReducedMotion() to boolean.
  const suppressTransition = noTransition || prefersReducedMotion === true

  return (
    <>
      <motion.header
        role="banner"
        data-no-transition={suppressTransition ? "" : undefined}
        className="fixed inset-x-0 top-0 z-50 h-14 md:h-16"
        style={{
          backdropFilter: "blur(18px) saturate(180%)",
          WebkitBackdropFilter: "blur(18px) saturate(180%)",
          backgroundColor: isScrolled
            ? "rgba(250, 250, 247, 0.70)"
            : "rgba(250, 250, 247, 0)",
          borderBottom: isScrolled
            ? "1px solid rgba(15, 23, 42, 0.06)"
            : "1px solid rgba(15, 23, 42, 0)",
          boxShadow: isScrolled
            ? "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 12px rgba(15, 23, 42, 0.04)"
            : "inset 0 1px 0 rgba(255, 255, 255, 0), 0 1px 12px rgba(15, 23, 42, 0)",
          transitionProperty: suppressTransition
            ? "none"
            : "background-color, border-color, box-shadow",
          transitionDuration: suppressTransition ? "0ms" : "150ms",
          transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
        }}
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
                className="-mx-2 rounded-md px-2 py-0.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[rgba(39,152,255,0.06)] hover:text-[#2798ff]"
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
              className="inline-flex h-9 items-center rounded-full bg-[#2798ff] px-4 text-sm font-medium text-white transition-[background-color,transform] duration-100 ease-out hover:bg-[#1a7de8] active:scale-[0.97] md:h-10 md:px-5"
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
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ opacity: 0, rotate: open ? -30 : 30 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
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
