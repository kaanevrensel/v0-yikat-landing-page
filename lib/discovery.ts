import type { Metadata } from "next"
import { siteConfig } from "@/lib/site"

export const CONTENT_DATE = "2026-10-10"
// Latest edit that touched every discovery page (shop identity and verified social links). Sitemap lastmod only.
export const CONTENT_UPDATED = "2026-10-15"
/** "10 Ekim 2026" for an ISO date; fixed to UTC so server and browser agree. */
export const formatContentDate = (iso: string) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso))
export const BUSINESS_ID = `${siteConfig.url}/#business`
export const WEBSITE_ID = `${siteConfig.url}/#website`

export type CareSource = { title: string; url: string }
export type CareSection = {
  id: string
  title: string
  paragraphs?: string[]
  steps?: string[]
  table?: { headings: string[]; rows: string[][]; caption: string }
  sourceIds?: string[]
}
export type CareGuide = {
  slug: string
  title: string
  description: string
  category: "Ayakkabı" | "Tekstil"
  answer: string
  sections: CareSection[]
  faqs: { q: string; a: string }[]
  related: string[]
  service?: { href: string; label: string }
  sourceIds: string[]
  /** ISO date of the last substantive edit, when later than CONTENT_DATE. */
  updated?: string
  published?: string
}

export const careSources: Record<string, CareSource> = {
  nikeMesh: { title: "Nike: How to Clean Mesh Shoes", url: "https://www.nike.com/a/how-to-clean-flyknit-mesh" },
  nikeLaces: { title: "Nike: How to Clean Shoelaces", url: "https://www.nike.com/a/how-to-clean-shoelaces" },
  nikeRunning: { title: "Nike: How to Clean Running Shoes", url: "https://www.nike.com/a/how-to-clean-nike-running-shoes" },
  nikeMud: { title: "Nike: How to Clean Muddy Shoes", url: "https://www.nike.com/a/how-to-clean-muddy-shoes" },
  nikeStorage: { title: "Nike: How to Store Shoes", url: "https://www.nike.com/a/how-to-store-shoes" },
  nikeMachine: { title: "Nike — Can You Put Sneakers in the Washer?", url: "https://www.nike.com/a/can-you-put-shoes-in-the-washer" },
  nikeClean: { title: "Nike — How to Clean Your Shoes in 6 Easy Steps", url: "https://www.nike.com/a/how-to-clean-shoes" },
  adidasLeather: { title: "adidas — How to Clean Shoes (Superstar örneği)", url: "https://www.adidas.com/us/blog/how-to-clean-shoes" },
  nikeSuede: { title: "Nike — How to Clean Suede Shoes", url: "https://www.nike.com/a/how-to-clean-suede-shoes" },
  clarks: { title: "Clarks — Shoe Care Products", url: "https://www.clarks.com/en-gb/shoe-care-products" },
  clarksCare: { title: "Clarks — Shoe Care Guide", url: "https://clarks.com.au/pages/shoe-care-guide" },
  tefalShirt: { title: "Tefal — How to Iron Shirts", url: "https://blog.tefal.co.uk/2015/09/16/ironing-tip-how-to-iron-shirts/" },
  ginetexCurrent: { title: "GINETEX — Current Care Symbols", url: "https://www.ginetex.net/gb/labelling/care-symbols.asp" },
  nikeOdor: { title: "Nike — How to Remove Odor from Shoes", url: "https://www.nike.com/a/how-to-remove-shoe-smell" },
  nikeDry: { title: "Nike — The 2 Best Ways to Dry Your Shoes", url: "https://www.nike.com/gb/a/best-way-dry-shoes" },
  ginetex: { title: "GINETEX — Care Labelling Symbols", url: "https://www.ginetex.net/userfiles/files/gin_bro_gb_rz_brochure_web.pdf" },
  woolmark: { title: "Woolmark — Wool Washing & Wool Care", url: "https://www.woolmark.com/care/" },
  ikeaDuvet: { title: "IKEA — Guide: Washing Duvets and Bed Covers", url: "https://www.ikea.com/ch/en/product-guides/washing-duvets-pubc3fe6c90/" },
}

export function discoveryMetadata(title: string, description: string, path: string, article = false, updated = CONTENT_DATE, published = CONTENT_DATE): Metadata {
  const url = `${siteConfig.url}${path}`
  return {
    title: `${title} | Yıkat`, description, alternates: { canonical: url },
    openGraph: { title: `${title} | Yıkat`, description, url, type: article ? "article" : "website", locale: "tr_TR", siteName: "Yıkat", images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Yıkat — Bakırköy ayakkabı temizliği ve bakım rehberi" }], ...(article ? { publishedTime: published, modifiedTime: updated } : {}) },
    twitter: { card: "summary_large_image", title: `${title} | Yıkat`, description, images: ["/images/og.jpg"] },
  }
}

export function breadcrumbJson(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ name: "Ana sayfa", path: "" }, ...items].map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${siteConfig.url}${item.path}` })) }
}

export const shopFacts = [
  { label: "Adres", value: siteConfig.address.full },
  { label: "Çalışma saatleri", value: siteConfig.hours.label },
  { label: "Telefon", value: siteConfig.phone },
  { label: "Ziyaret", value: "Ayakkabını doğrudan dükkâna getirebilirsin." },
  { label: "Ücret ve teslim", value: "Ayakkabının türü ve durumu değerlendirilerek netleştirilir." },
]
