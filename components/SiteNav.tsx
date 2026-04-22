"use client"

import Image from "next/image"

const WHATSAPP_URL =
  "https://wa.me/908503033193?text=Merhaba%2C%20sipari%C5%9F%20vermek%20istiyorum."

const links = [
  { label: "Hizmetler",    href: "#hizmetler" },
  { label: "Nasıl Çalışır", href: "#nasil" },
  { label: "Fiyatlar",     href: "#fiyatlar" },
  { label: "SSS",          href: "#sss" },
] as const

export function SiteNav() {
  return (
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
        </div>
      </div>
    </header>
  )
}
