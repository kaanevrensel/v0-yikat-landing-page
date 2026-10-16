"use client"

import type { ComponentProps } from "react"
import { usePathname } from "next/navigation"
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { useDirectionsUrl } from "@/hooks/use-directions-url"

export function DiscoveryLink({ action, children, href, ...props }: ComponentProps<"a"> & { href: string; action: "call" | "whatsapp" | "directions" | "maps" | "service"; children: React.ReactNode }) {
  // ContactMeasurement owns event emission across all pages. Keep this marker
  // descriptive only, so service/maps navigation never becomes contact intent.
  return <a {...props} href={href} data-discovery-action={action}>{children}</a>
}

export function PhotoEnquiryLink({ children = "Fotoğrafını gönder", className }: { children?: React.ReactNode; className?: string }) {
  const pathname = usePathname()
  // Public page context helps the shop understand the enquiry. No query string,
  // visitor identifier or message is collected by our analytics.
  const message = `Merhaba, ayakkabı temizliği için bilgi almak istiyorum. Fotoğraflarını paylaşacağım.\n${siteConfig.url}${pathname}`
  return <DiscoveryLink action="whatsapp" className={className} href={`${siteConfig.whatsappHref}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true"/>{children}</DiscoveryLink>
}

export function ShopActions() {
  const directions = useDirectionsUrl()
  return <div className="discovery-actions">
    <PhotoEnquiryLink className="button primary"/>
    <DiscoveryLink action="directions" className="button secondary" href={directions} target="_blank" rel="noopener noreferrer"><MapPin size={18} aria-hidden="true"/> Yol tarifi al</DiscoveryLink>
    <DiscoveryLink action="call" className="discovery-call" href={siteConfig.phoneHref}><Phone size={17} aria-hidden="true"/> {siteConfig.phone}<ArrowUpRight size={16} aria-hidden="true"/></DiscoveryLink>
  </div>
}
