import { siteConfig } from "./site"

export const CONTACT_EVENT = "contact_intent"
export const CONTACT_SCHEMA = 1

// Only published route names are sent. An arbitrary 404 path could contain PII.
export function contactPagePaths(guideSlugs: string[]) {
  return [
    "/", "/urun", "/partnerler", "/ayakkabi-temizleme", "/bakirkoy-ayakkabi-temizleme",
    "/rehber", "/sneaker-yikama", "/suet-nubuk-temizleme", "/deri-ayakkabi-bakimi",
    "/kvkk", "/kullanim-kosullari", "/odeme-ve-guvenli-alisveris", "/kvkk-basvuru-formu",
    "/acik-riza-metni", "/kart-saklama-metni", "/mesafeli-satis-sozlesmesi",
    "/gizlilik-politikasi", "/hesap-silme", "/teslimat-ve-iade", "/iletisim",
    ...guideSlugs.map(slug => `/rehber/${slug}`),
  ]
}

// This is a referrer class, not proof of an organic search or a customer's source.
export function referrerChannel(referrer: string) {
  try {
    const url = new URL(referrer)
    if (!["http:", "https:"].includes(url.protocol)) return "direct_or_unknown"
    const host = url.hostname
    if (/(^|\.)(chatgpt\.com|chat\.openai\.com)$/.test(host)) return "chatgpt"
    if (/(^|\.)(perplexity\.ai|claude\.ai|copilot\.microsoft\.com|gemini\.google\.com)$/.test(host)) return "other_ai"
    if (/(^|\.)google\.(com(\.[a-z]{2})?|[a-z]{2}|co\.[a-z]{2}|cat)$/.test(host)) return "google"
    if (/(^|\.)bing\.com$/.test(host)) return "bing"
    if (/(^|\.)yikat\.tech$/.test(host)) return "internal"
    return "other"
  } catch { return "direct_or_unknown" }
}

export function contactAction(href: string): "whatsapp" | "call" | "directions" | null {
  if (href === siteConfig.phoneHref) return "call"
  try {
    const url = new URL(href)
    if (url.username || url.password || url.hash) return null
    const whatsapp = new URL(siteConfig.whatsappHref)
    if (url.origin === whatsapp.origin && url.pathname === whatsapp.pathname) return "whatsapp"
    if ([siteConfig.directionsUrl, siteConfig.appleDirectionsUrl].some(value => new URL(value).href === url.href)) return "directions"
  } catch { /* Invalid and relative service-navigation links are not contacts. */ }
  return null
}

export function contactProperties(href: string, pathname: string, referrer: string, publicPaths: readonly string[]) {
  const action = contactAction(href)
  if (!action) return null
  return {
    schema: CONTACT_SCHEMA,
    action,
    page: publicPaths.includes(pathname) ? pathname : "other",
    referrer: referrerChannel(referrer),
  }
}
