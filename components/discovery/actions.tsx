"use client"

import type { ComponentProps } from "react"
import { usePathname } from "next/navigation"
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"
import { useDirectionsUrl } from "@/hooks/use-directions-url"

// Only a fixed referrer class is sent, never the referring URL, query or message.
export function referrerChannel(referrer: string) {
  try {
    const host = new URL(referrer).hostname
    if (/(^|\.)(chatgpt\.com|chat\.openai\.com)$/.test(host)) return "chatgpt"
    if (/(^|\.)(perplexity\.ai|claude\.ai|copilot\.microsoft\.com|gemini\.google\.com)$/.test(host)) return "other_ai"
    if (/(^|\.)google\.(com(\.[a-z]{2})?|[a-z]{2}|co\.[a-z]{2}|cat)$/.test(host)) return "google"
    if (/(^|\.)bing\.com$/.test(host)) return "bing"
    if (/(^|\.)yikat\.tech$/.test(host)) return "internal"
    return "other"
  } catch { return "direct_or_unknown" }
}

export function DiscoveryLink({ action, children, onClick, href, ...props }: ComponentProps<"a"> & { href: string; action: "call" | "whatsapp" | "directions" | "maps" | "service"; children: React.ReactNode }) {
  const pathname = usePathname()
  return <a {...props} href={href} onClick={(event) => {
    onClick?.(event)
    if (!event.defaultPrevented) track("discovery_contact_click", { action, page: pathname, referrer: referrerChannel(document.referrer) })
  }}>{children}</a>
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
