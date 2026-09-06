"use client"

// Footer server component kaldığı için analytics'li linkler bu minik client bileşenlere çıkarıldı.
import Link from "next/link"
import { useDirectionsUrl } from "@/hooks/use-directions-url"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"

export function FooterDirectionsLink() {
  // Diğer yüzeylerle tutarlı: iOS'ta Apple Haritalar.
  const directionsUrl = useDirectionsUrl()
  return (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("footer_directions_click")}
      className="inline-flex min-h-11 items-center hover:underline"
    >
      Yol tarifi al →
    </a>
  )
}

export function FooterWhatsAppLink() {
  return (
    <a
      href={siteConfig.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("footer_whatsapp_click")}
      className="inline-flex min-h-11 items-center hover:underline"
    >
      WhatsApp'tan yaz
    </a>
  )
}

// Hizmet sayfası linkleri — footer'da her sayfadan erişilir (iç bağlantı + keşif).
export function FooterServiceLinks({ services }: { services: { slug: string; nav: string }[] }) {
  return (
    <>
      {services.map((s) => (
        <Link key={s.slug} href={`/${s.slug}`} className="inline-flex min-h-11 items-center hover:underline" onClick={() => track("footer_service_click")}>
          {s.nav}
        </Link>
      ))}
    </>
  )
}
