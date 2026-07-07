"use client"

// Footer server component kaldığı için analytics'li tek link bu minik client bileşene çıkarıldı.
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"

export function FooterDirectionsLink() {
  return (
    <a
      href={siteConfig.directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("footer_directions_click")}
      className="hover:text-white"
    >
      Yol tarifi al →
    </a>
  )
}
