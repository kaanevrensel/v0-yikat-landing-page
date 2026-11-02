import type { Metadata } from "next"
import { siteConfig } from "@/lib/site"

/** Publication date of the guides that carry no `published` date (the first discovery release). */
export const CONTENT_DATE = "2026-10-10"
/** "10 Ekim 2026" for an ISO date; fixed to UTC so server and browser agree. */
export const formatContentDate = (iso: string) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso))
export const BUSINESS_ID = `${siteConfig.url}/#business`
export const WEBSITE_ID = `${siteConfig.url}/#website`

export type CareSource = { title: string; url: string }
/** Contextual links inside a guide section. Photo and service links are calls to action; guide links are plain reading links. */
export type CareSectionLink =
  | { type: "photo"; label: string }
  | { type: "service"; href: string; label: string }
  | { type: "guide"; slug: string; label: string }
export type CareSection = {
  id: string
  title: string
  paragraphs?: string[]
  links?: CareSectionLink[]
  steps?: string[]
  table?: { headings: string[]; rows: string[][]; caption: string }
  sourceIds?: string[]
}

/** /rehber topic sections (content plan, 2 November 2026). Each label is one H2 on the hub. */
export type ShoeGuideTopic = "Malzemeye göre temizlik" | "Leke ve sararma" | "Yıkama ve kurutma" | "Koku, tabanlık ve bağcık" | "Marka bakımı" | "Bakım, saklama ve fiyat"
export type TextileGuideTopic = "Leke çıkarma" | "Yiyecek ve içecek lekeleri" | "Çamaşır yıkama" | "Ev tekstili" | "Giysi bakımı" | "Etiket, ütü ve kuru temizleme"
export type GuideTopic = ShoeGuideTopic | TextileGuideTopic

type CareGuideContent = {
  slug: string
  title: string
  description: string
  answer: string
  sections: CareSection[]
  faqs: { q: string; a: string }[]
  related: string[]
  sourceIds: string[]
  /** ISO date of the last substantive edit, when later than the publication date. */
  updated?: string
  published?: string
}
/** A shoe guide may point to a shoe service page; textile guides are informational only (no textile service is offered). */
export type CareGuide = CareGuideContent & (
  | { category: "Ayakkabı"; topic: ShoeGuideTopic; service?: { href: string; label: string } }
  | { category: "Tekstil"; topic: TextileGuideTopic; service?: never }
)

/** Which guides a converted release contains; written by the content converter next to the guide index. */
/**
 * What the current release changed against the previously live site (written by the converter).
 * date: the release date (new guides are published on it, rewrites updated on it).
 * hubUpdated: /rehber lastmod, which moves only when the hub's list of guides changes.
 * keptLive: guides whose text (and dates) are as they were live; only links may differ.
 */
export type GuideRelease = { date: string; hubUpdated: string; added: string[]; rewritten: string[]; keptLive: string[] }

/** Published date as rendered and in Article JSON-LD. */
export const guidePublished = (guide: Pick<CareGuide, "published">) => guide.published ?? CONTENT_DATE
/** Last substantive edit: byline, Article dateModified, Open Graph modified time and sitemap lastmod. */
export const guideModified = (guide: Pick<CareGuide, "published" | "updated">) => guide.updated ?? guidePublished(guide)

export { careSources } from "./care-sources"

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
